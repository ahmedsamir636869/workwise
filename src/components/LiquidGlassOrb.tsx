"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { useLiquidGlass } from "@/context/LiquidGlassContext";
import { GlassSurfaceProfile } from "@/types/liquid-glass";

// ============================================================================
// Apple Liquid Glass Physics & Optical Dispersion Engine (VisionOS / Sequoia)
//
// Features:
// 1. Snell's Law refraction with adjustable optical Refraction Distance (focal depth)
// 2. 2D Signed Distance Function (SDF) squircle & capsule displacement mapping
// 3. Apple continuous curvature profiles (Squircle, Spherical Dome, Lip, Concave)
// 4. Optical Chromatic Aberration / RGB Channel Dispersion splitting
// 5. Directional 3D Specular catchlights with top rim & bottom bounce reflection
// ============================================================================

/** Smootherstep curve for organic lip transition */
function smootherstep(x: number): number {
  const clamped = Math.max(0, Math.min(1, x));
  return clamped * clamped * clamped * (clamped * (clamped * 6 - 15) + 10);
}

/** Apple's preferred shape: y = ⁴√(1 - (1-x)⁴) - smooth flat→curve G2 transition */
function convexSquircle(x: number): number {
  const t = 1 - Math.max(0, Math.min(1, x));
  return Math.pow(Math.max(0, 1 - Math.pow(t, 4)), 0.25);
}

/** Spherical dome: y = √(1 - (1-x)²) */
function convexCircle(x: number): number {
  const t = 1 - Math.max(0, Math.min(1, x));
  return Math.sqrt(Math.max(0, 1 - t * t));
}

/** Concave bowl: light diverges outwards */
function concaveSurface(x: number): number {
  return 1 - convexSquircle(x);
}

/** Apple switch lip: convex rim with concave center dip */
function lipSurface(x: number): number {
  const s = smootherstep(x);
  return convexSquircle(x) * (1 - s) + concaveSurface(x) * s;
}

/** Surface profile selector */
function getSurfaceFunction(profile: GlassSurfaceProfile = "squircle"): (x: number) => number {
  switch (profile) {
    case "circle":
      return convexCircle;
    case "lip":
      return lipSurface;
    case "concave":
      return concaveSurface;
    case "squircle":
    default:
      return convexSquircle;
  }
}

/** Numerical derivative of the surface profile */
function surfaceDerivative(x: number, f: (x: number) => number): number {
  const delta = 0.001;
  const clamped = Math.max(delta, Math.min(1 - delta, x));
  return (f(clamped + delta) - f(clamped - delta)) / (2 * delta);
}

/**
 * Calculate physical displacement using Snell's Law & Refraction Distance.
 * 
 * @param distFromBorder - Normalized 0..1 (0 = outer edge, 1 = interior flat)
 * @param refractiveIndex - Glass IOR (e.g. 1.52)
 * @param thickness - Glass body depth multiplier
 * @param refractionDistance - Physical optical travel distance behind the glass (px)
 * @param surfaceFn - Selected cross-section surface profile
 */
export function calculateDisplacement(
  distFromBorder: number,
  refractiveIndex: number,
  thickness: number,
  refractionDistance: number,
  surfaceFn: (x: number) => number
): number {
  if (distFromBorder <= 0 || distFromBorder >= 1) return 0;

  const derivative = surfaceDerivative(distFromBorder, surfaceFn);

  // Normal vector: nx = -derivative / len, ny = 1 / len
  const normalLength = Math.sqrt(derivative * derivative + 1);
  const sinIncident = Math.min(0.999, Math.abs(derivative) / normalLength);
  const cosIncident = 1 / normalLength;

  // Snell's Law: n1 * sin(theta1) = n2 * sin(theta2)
  const sinRefracted = sinIncident / Math.max(1.01, refractiveIndex);
  if (sinRefracted >= 1) return 0; // Total internal reflection

  const cosRefracted = Math.sqrt(1 - sinRefracted * sinRefracted);

  // Angular deviation: theta_diff = (theta1 - theta2)
  const sinDiff = sinIncident * cosRefracted - cosIncident * sinRefracted;
  const cosDiff = cosIncident * cosRefracted + sinIncident * sinRefracted;
  const tanDiff = cosDiff > 0.001 ? sinDiff / cosDiff : 0;

  // Physical ray travel: glass body traversal + air gap (refractionDistance)
  const glassHeight = surfaceFn(distFromBorder) * thickness * 24;
  const totalOpticalDistance = glassHeight + refractionDistance;
  const displacement = totalOpticalDistance * tanDiff;

  // Inward focus for convex (derivative > 0)
  return -displacement * (derivative >= 0 ? 1 : -1);
}

/** Pre-calculate 128 displacement samples on a single radial slice */
function preCalcDisplacements(
  refractiveIndex: number,
  thickness: number,
  refractionDistance: number,
  surfaceFn: (x: number) => number
): { samples: number[]; maxDisplacement: number } {
  const steps = 127;
  const samples: number[] = [];
  let maxAbs = 0;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps; // 0 = border, 1 = center
    const d = calculateDisplacement(t, refractiveIndex, thickness, refractionDistance, surfaceFn);
    samples.push(d);
    maxAbs = Math.max(maxAbs, Math.abs(d));
  }

  // Normalize samples into [-1, 1] for 8-bit SVG encoding while preserving max scale
  const safeMax = Math.max(1, maxAbs);
  const normalized = samples.map((d) => d / safeMax);

  return { samples: normalized, maxDisplacement: safeMax };
}

/** 2D Signed Distance Function for a rounded rectangle (Apple Capsule) */
function sdRoundedBox(x: number, y: number, w: number, h: number, r: number): number {
  const halfW = w / 2 - r;
  const halfH = h / 2 - r;
  const dx = Math.abs(x) - halfW;
  const dy = Math.abs(y) - halfH;

  const outerX = Math.max(dx, 0);
  const outerY = Math.max(dy, 0);
  const outerDist = Math.sqrt(outerX * outerX + outerY * outerY);
  const innerDist = Math.min(Math.max(dx, dy), 0);

  return outerDist + innerDist - r;
}

/**
 * Generate a Capsule / Rounded-Rectangle Displacement Map using a unified optical lens geometry.
 * This guarantees:
 * 1. 100% full coverage across the entire header height and width.
 * 2. C1 mathematical continuity: zero deflection at the midline optical axis (y=cy)
 *    and smooth linear scaling outward with ZERO knife-edge creases, zero steps,
 *    and zero horizontal cutoffs / chromatic tears.
 */
function generateCapsuleDisplacementMap(
  canvasW: number,
  canvasH: number,
  cornerRadius: number,
  bezelWidthPx: number,
  samples: number[]
): string {
  const canvas = document.createElement("canvas");
  canvas.width = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.createImageData(canvasW, canvasH);
  const data = imageData.data;

  const cx = canvasW / 2;
  const cy = canvasH / 2;
  const r = cornerRadius;
  const halfW = canvasW / 2 - r;

  for (let y = 0; y < canvasH; y++) {
    for (let x = 0; x < canvasW; x++) {
      const px = x - cx;
      const py = y - cy;
      const idx = (y * canvasW + x) * 4;

      // Distance from (px, py) to central horizontal spine [-halfW, halfW] at y=0
      const clampedX = Math.max(-halfW, Math.min(halfW, px));
      const dx = px - clampedX;
      const dy = py;
      const rho = Math.sqrt(dx * dx + dy * dy);
      const u = rho / r; // 0 at center spine, 1 at outer rounded border

      if (u >= 1.0) {
        // Outside the capsule shape: neutral displacement
        data[idx] = 128;
        data[idx + 1] = 128;
        data[idx + 2] = 128;
        data[idx + 3] = 255;
        continue;
      }

      // Sample physical refraction from Snell's law samples (0 = border, 1 = center)
      const distFromBorder = 1 - u;
      const sampleIdx = Math.min(
        samples.length - 1,
        Math.round(distFromBorder * (samples.length - 1))
      );
      const rawMag = Math.abs(samples[sampleIdx]);

      // Continuous optical lens profile covering 100% of the capsule:
      // Maximum deflection near the outer rim, smoothly transitioning to zero at the crest
      const continuousLens = Math.sin(distFromBorder * Math.PI * 0.5);
      const magnitude = Math.max(rawMag, continuousLens * 0.85);

      // Inward displacement: light focuses inward towards the optical spine
      // Using -(dx/r) and -(dy/r) guarantees C1 mathematical continuity across the whole surface
      // with zero deflection at the midline (y=cy) and no knife-edge tears!
      const dispX = -(dx / r) * magnitude;
      const dispY = -(dy / r) * magnitude;

      // Encode into R and G (128 = 0, 0 = -1, 255 = +1)
      data[idx] = Math.max(0, Math.min(255, Math.round(128 + dispX * 127)));
      data[idx + 1] = Math.max(0, Math.min(255, Math.round(128 + dispY * 127)));
      data[idx + 2] = 128;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL("image/png");
}

/**
 * Generate a Circular Dome Displacement Map for Orbs, Play buttons, and round icons.
 */
function generateDomeDisplacementMap(
  size: number,
  bezelRatio: number,
  samples: number[]
): string {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;

  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const idx = (y * size + x) * 4;

      if (dist >= radius) {
        data[idx] = 128;
        data[idx + 1] = 128;
        data[idx + 2] = 128;
        data[idx + 3] = 255;
        continue;
      }

      // Continuous full spherical dome coverage from border (0) to center (1)
      const distFromBorder = Math.max(0, Math.min(1, (radius - dist) / radius));
      const sampleIdx = Math.min(
        samples.length - 1,
        Math.round(distFromBorder * (samples.length - 1))
      );
      const rawMag = Math.abs(samples[sampleIdx]);
      const continuousLens = Math.sin((1 - distFromBorder) * Math.PI * 0.5);
      const magnitude = Math.max(rawMag, continuousLens * 0.85);

      const angle = Math.atan2(dy, dx);
      // Inward displacement towards the dome center
      const dispX = -magnitude * Math.cos(angle);
      const dispY = -magnitude * Math.sin(angle);

      data[idx] = Math.max(0, Math.min(255, Math.round(128 + dispX * 127)));
      data[idx + 1] = Math.max(0, Math.min(255, Math.round(128 + dispY * 127)));
      data[idx + 2] = 128;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL("image/png");
}

/**
 * Generate a Specular Catch-light Map with Directional Sun Angle & Bottom Ambient Bounce
 */
function generateSpecularMap(
  sizeW: number,
  sizeH: number,
  cornerRadius: number,
  bezelWidthPx: number,
  lightAngleRad: number = -Math.PI / 3,
  hardness: number = 14,
  doubleRim: boolean = true,
  surfaceFn: (x: number) => number = convexSquircle
): string {
  const canvas = document.createElement("canvas");
  canvas.width = sizeW;
  canvas.height = sizeH;
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.createImageData(sizeW, sizeH);
  const data = imageData.data;

  const cx = sizeW / 2;
  const cy = sizeH / 2;
  const r = cornerRadius;
  const halfW = sizeW / 2 - r;

  const lx = Math.cos(lightAngleRad);
  const ly = Math.sin(lightAngleRad);
  const bx = -lx * 0.7;
  const by = -ly * 0.7;

  for (let y = 0; y < sizeH; y++) {
    for (let x = 0; x < sizeW; x++) {
      const px = x - cx;
      const py = y - cy;
      const idx = (y * sizeW + x) * 4;

      const clampedX = Math.max(-halfW, Math.min(halfW, px));
      const dx = px - clampedX;
      const dy = py;
      const rho = Math.sqrt(dx * dx + dy * dy);
      const u = rho / r;

      if (u >= 1.0) {
        data[idx] = 0;
        data[idx + 1] = 0;
        data[idx + 2] = 0;
        data[idx + 3] = 0;
        continue;
      }

      const distFromBorder = 1 - u;
      const derivative = surfaceDerivative(distFromBorder, surfaceFn);
      const slope = Math.min(2, Math.abs(derivative));

      // Continuous 3D normal vector tilted smoothly from the apex (nx=0, ny=0, nz=1) towards perimeter
      const tilt = slope > 0 ? Math.min(1, slope * 0.6) : u;
      const nx = (dx / r) * tilt;
      const ny = (dy / r) * tilt;

      // Primary Specular
      const dotLight = nx * lx + ny * ly;
      const specular = Math.pow(Math.max(0, dotLight), hardness / 2) * slope * 1.2;

      // Bottom / Ambient Bounce Rim Light
      const dotBounce = doubleRim ? Math.pow(Math.max(0, nx * bx + ny * by), hardness / 3) * 0.35 : 0;

      // Edge catchlight glow
      const rim = Math.pow(u, 2) * 0.25;

      const totalLight = Math.min(1, specular + dotBounce + rim);
      const val = Math.round(totalLight * 255);

      data[idx] = val;
      data[idx + 1] = val;
      data[idx + 2] = val;
      data[idx + 3] = Math.round(totalLight * 180);
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL("image/png");
}

// ============================================================================
// Universal Liquid Glass SVG Filter Element
// ============================================================================

export function LiquidGlassFilter() {
  const { config } = useLiquidGlass();
  const {
    refractiveIndex,
    thickness,
    bezelRatio,
    saturationBoost,
    chromaticAberration,
    dispersionSpread = 3.5,
    refractionDistance = 45,
    surfaceProfile = "squircle",
  } = config.global;

  const {
    displacementScale,
    ridgeSpecular,
    doubleRim = true,
    specularAngle = -60,
    specularHardness = 14,
    specularSaturation = 4,
    specularOpacity = 0.5,
    bezelWidth = 26,
    refractionDistance: navRefractionDist = 42,
    surfaceProfile: navSurfaceProfile = "squircle",
  } = config.navbar;

  const [maps, setMaps] = useState<{
    capsuleDmap: string;
    domeDmap: string;
    capsuleSpec: string;
    domeSpec: string;
    maxDisplacementNav: number;
    maxDisplacementOrb: number;
  } | null>(null);

  useEffect(() => {
    try {
      // 1. Pre-calculate 1D refraction physics for navbar
      const navSurfaceFn = getSurfaceFunction(navSurfaceProfile);
      const navPhysics = preCalcDisplacements(
        refractiveIndex,
        thickness,
        navRefractionDist,
        navSurfaceFn
      );

      // 2. Pre-calculate 1D refraction physics for orbs
      const orbSurfaceFn = getSurfaceFunction(surfaceProfile);
      const orbPhysics = preCalcDisplacements(
        refractiveIndex,
        thickness,
        refractionDistance,
        orbSurfaceFn
      );

      // 3. Generate 2D Capsule Map (532x70) for navbar to cover 100% of header height and width
      const capsuleDmap = generateCapsuleDisplacementMap(
        532,
        70,
        35, // rounded pill corners for 70px height
        bezelWidth,
        navPhysics.samples
      );

      // 4. Generate 2D Dome Map (256x256) for circular icons and buttons
      const domeDmap = generateDomeDisplacementMap(
        256,
        bezelRatio,
        orbPhysics.samples
      );

      // 5. Specular maps
      const lightRad = (specularAngle * Math.PI) / 180;
      const capsuleSpec = generateSpecularMap(
        532,
        70,
        35,
        bezelWidth,
        lightRad,
        specularHardness,
        doubleRim,
        navSurfaceFn
      );

      const domeSpec = generateSpecularMap(
        256,
        256,
        128,
        128 * bezelRatio,
        lightRad,
        specularHardness,
        doubleRim,
        orbSurfaceFn
      );

      setMaps({
        capsuleDmap,
        domeDmap,
        capsuleSpec,
        domeSpec,
        maxDisplacementNav: navPhysics.maxDisplacement,
        maxDisplacementOrb: orbPhysics.maxDisplacement,
      });
    } catch (e) {
      console.warn("Could not generate liquid glass maps", e);
    }
  }, [
    refractiveIndex,
    thickness,
    bezelRatio,
    bezelWidth,
    navRefractionDist,
    refractionDistance,
    navSurfaceProfile,
    surfaceProfile,
    specularAngle,
    specularHardness,
    doubleRim,
  ]);

  // Scaled pixel shifts directly proportional to displacementScale slider
  // Creates authentic, crystal-clear liquid glass refraction covering 100% of the header
  const navScale = Math.max(
    4,
    Math.round(displacementScale * 0.75)
  );
  const orbScale = Math.max(
    4,
    Math.round(displacementScale * 0.65)
  );

  const dispFactor = chromaticAberration ? Math.max(0.015, Math.min(0.06, dispersionSpread / 60)) : 0;
  const navScaleR = Math.round(navScale * (1 - dispFactor));
  const navScaleB = Math.round(navScale * (1 + dispFactor));

  return (
    <svg
      className="glass-surface__filter pointer-events-none fixed inset-0 w-full h-full overflow-hidden opacity-0"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* FILTER 1: Liquid Glass Navbar Capsule Filter */}
        {maps ? (
          <filter
            id="liquid-glass-nav-filter"
            colorInterpolationFilters="sRGB"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blurred" />

            <feImage
              href={maps.capsuleDmap}
              x="0%"
              y="0%"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              result="capsule_dmap"
            />

            {chromaticAberration ? (
              <>
                {/* Red Channel Displacement */}
                <feDisplacementMap
                  in="blurred"
                  in2="capsule_dmap"
                  xChannelSelector="R"
                  yChannelSelector="G"
                  scale={navScaleR}
                  result="dispR"
                />
                <feColorMatrix
                  in="dispR"
                  type="matrix"
                  values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
                  result="red"
                />

                {/* Green Channel Displacement */}
                <feDisplacementMap
                  in="blurred"
                  in2="capsule_dmap"
                  xChannelSelector="R"
                  yChannelSelector="G"
                  scale={navScale}
                  result="dispG"
                />
                <feColorMatrix
                  in="dispG"
                  type="matrix"
                  values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
                  result="green"
                />

                {/* Blue Channel Displacement */}
                <feDisplacementMap
                  in="blurred"
                  in2="capsule_dmap"
                  xChannelSelector="R"
                  yChannelSelector="G"
                  scale={navScaleB}
                  result="dispB"
                />
                <feColorMatrix
                  in="dispB"
                  type="matrix"
                  values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
                  result="blue"
                />

                <feBlend in="red" in2="green" mode="screen" result="rg" />
                <feBlend in="rg" in2="blue" mode="screen" result="refracted" />
              </>
            ) : (
              <feDisplacementMap
                in="blurred"
                in2="capsule_dmap"
                xChannelSelector="R"
                yChannelSelector="G"
                scale={navScale}
                result="refracted"
              />
            )}

            {/* Saturation boost for refracted backdrop */}
            <feColorMatrix
              in="refracted"
              type="saturate"
              values={String(saturationBoost * 1.6)}
              result="saturated"
            />

            {/* Subtle specular catch-light layer */}
            <feImage
              href={maps.capsuleSpec}
              x="0%"
              y="0%"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              result="spec_map"
            />

            <feComponentTransfer in="spec_map" result="spec_tuned">
              <feFuncA type="linear" slope={specularOpacity * (ridgeSpecular ? 0.35 : 0.2)} />
            </feComponentTransfer>

            <feBlend in="spec_tuned" in2="saturated" mode="screen" />
          </filter>
        ) : (
          <filter id="liquid-glass-nav-filter" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
            <feColorMatrix type="saturate" values="2" />
          </filter>
        )}

        {/* FILTER 2: General Switcher & Card Glass Filter */}
        {maps ? (
          <filter
            id="switcher"
            colorInterpolationFilters="sRGB"
            x="-10%"
            y="-10%"
            width="120%"
            height="120%"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.3" result="blurred_source" />

            <feImage
              href={maps.domeDmap}
              x="0"
              y="0"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              result="displacement_map"
            />

            <feDisplacementMap
              in="blurred_source"
              in2="displacement_map"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
              scale={orbScale}
            />

            <feColorMatrix
              in="displaced"
              type="saturate"
              values={String(saturationBoost * 2.2)}
              result="displaced_saturated"
            />

            <feImage
              href={maps.domeSpec}
              x="0"
              y="0"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              result="specular_layer"
            />

            <feComposite
              in="displaced_saturated"
              in2="specular_layer"
              operator="in"
              result="specular_saturated"
            />

            <feComponentTransfer in="specular_layer" result="specular_faded">
              <feFuncA type="linear" slope={specularOpacity * 0.7} />
            </feComponentTransfer>

            <feBlend in="specular_saturated" in2="displaced" mode="normal" result="withSaturation" />
            <feBlend in="specular_faded" in2="withSaturation" mode="normal" />
          </filter>
        ) : (
          <filter id="switcher" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.3" />
            <feColorMatrix type="saturate" values="2.5" />
          </filter>
        )}

        {/* FILTER 3: Chromatic Aberration Fallback Filter */}
        <filter
          id="glass-filter-_r_b_"
          colorInterpolationFilters="sRGB"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blur" />
          <feColorMatrix in="blur" type="saturate" values="2.2" />
        </filter>

        <filter id="glass-distortion" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.4" />
          <feColorMatrix type="saturate" values="2.5" />
        </filter>
      </defs>
    </svg>
  );
}

// ============================================================================
// Interactive Liquid Glass Components
// ============================================================================

interface LiquidGlassWrapperProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  role?: string;
  ariaLabel?: string;
}

export function LiquidGlassWrapper({
  children,
  className = "",
  style,
  onClick,
  role,
  ariaLabel,
}: LiquidGlassWrapperProps) {
  return (
    <div
      onClick={onClick}
      role={role || (onClick ? "button" : undefined)}
      aria-label={ariaLabel}
      className={`liquidGlass-wrapper relative ${className}`}
      style={style}
    >
      <div className="liquidGlass-effect" />
      <div className="liquidGlass-tint" />
      <div className="liquidGlass-shine" />
      <div className="liquidGlass-text relative z-10 w-full h-full flex items-center justify-center pointer-events-auto">
        {children}
      </div>
    </div>
  );
}

interface LiquidGlassPillProps {
  children?: React.ReactNode;
  className?: string;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export function LiquidGlassPill({
  children,
  className = "",
  width,
  height,
  style,
  onClick,
}: LiquidGlassPillProps) {
  return (
    <div
      onClick={onClick}
      className={`liquid-glass-nav relative flex items-center select-none w-full ${className}`}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        ...style,
      }}
    >
      <div className="relative z-10 w-full h-full flex items-center pointer-events-auto">
        {children}
      </div>
    </div>
  );
}

interface LiquidGlassOrbProps {
  children?: React.ReactNode;
  className?: string;
  size?: number;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  ariaLabel?: string;
  style?: React.CSSProperties;
}

export function LiquidGlassOrb({
  children,
  className = "",
  size = 48,
  onClick,
  ariaLabel,
  style,
}: LiquidGlassOrbProps) {
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      aria-label={ariaLabel}
      className={`liquid-glass-icon relative flex items-center justify-center shrink-0 select-none overflow-hidden ${onClick ? "cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-200" : ""
        } ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        ...style,
      }}
    >
      <div className="relative z-10 flex items-center justify-center pointer-events-auto">
        {children}
      </div>
    </div>
  );
}

interface LiquidGlassDockProps {
  items: Array<{
    id: string | number;
    icon?: React.ReactNode;
    label?: string;
    onClick?: () => void;
  }>;
  className?: string;
}

export function LiquidGlassDock({ items, className = "" }: LiquidGlassDockProps) {
  return (
    <div className={`dock ${className}`}>
      {items.map((item) => (
        <div
          key={item.id}
          onClick={item.onClick}
          className="dock-item flex items-center justify-center rounded-2xl p-2 transition-all hover:bg-white/30 cursor-pointer"
          title={item.label}
        >
          {item.icon}
        </div>
      ))}
    </div>
  );
}

export default LiquidGlassPill;
