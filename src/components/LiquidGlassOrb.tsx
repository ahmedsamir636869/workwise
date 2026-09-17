"use client";

import React, { useEffect, useRef, useState } from "react";

// ============================================================================
// Physics-Based Liquid Glass System (Kube.io / Apple Liquid Glass technique)
//
// Uses Snell's Law refraction + convex squircle surface functions to generate
// authentic displacement maps, then combines with feColorMatrix saturation
// and specular highlight overlays for realistic glass rendering.
// ============================================================================

/** Convex squircle surface function: y = ⁴√(1 - (1-x)⁴)
 *  Apple's preferred shape — smoother flat→curve transition than a circle.
 */
function convexSquircle(x: number): number {
  const t = 1 - x;
  return Math.pow(1 - Math.pow(t, 4), 0.25);
}

/** Numerical derivative of the surface function */
function surfaceDerivative(x: number, f: (x: number) => number): number {
  const delta = 0.001;
  const clamped = Math.max(delta, Math.min(1 - delta, x));
  return (f(clamped + delta) - f(clamped - delta)) / (2 * delta);
}

/** Calculate displacement at a given distance from the border using Snell's Law.
 *  refractiveIndex: glass IOR (1.5 for standard glass)
 *  thickness: glass thickness multiplier
 *  distFromBorder: normalized 0..1 (0 = edge, 1 = center flat)
 */
function calculateDisplacement(
  distFromBorder: number,
  refractiveIndex: number,
  thickness: number,
  surfaceFn: (x: number) => number
): number {
  if (distFromBorder <= 0 || distFromBorder >= 1) return 0;

  const derivative = surfaceDerivative(distFromBorder, surfaceFn);
  
  // The normal is (-derivative, 1) rotated -90deg from the tangent
  const normalLength = Math.sqrt(derivative * derivative + 1);
  const nx = -derivative / normalLength;
  // ny = 1 / normalLength; // not needed for our 2D calculation

  // Angle of incidence (angle between incoming ray [0,-1] and normal)
  // For rays coming straight down: cos(θ₁) = |ny| = 1/normalLength
  const cosIncident = 1 / normalLength;
  const sinIncident = Math.sqrt(1 - cosIncident * cosIncident);

  // Snell's Law: n₁·sin(θ₁) = n₂·sin(θ₂)
  // n₁ = 1 (air), n₂ = refractiveIndex
  const sinRefracted = sinIncident / refractiveIndex;

  // Total internal reflection check
  if (sinRefracted >= 1) return 0;

  const cosRefracted = Math.sqrt(1 - sinRefracted * sinRefracted);

  // Calculate the refracted direction
  const height = surfaceFn(distFromBorder) * thickness;

  // The displacement is how far the ray moves horizontally after passing through the glass
  const tanRefracted = sinRefracted / cosRefracted;
  const horizontalDisplacement = height * tanRefracted;

  // Subtract the original horizontal component (since rays are vertical, there is none)
  // The sign indicates direction: negative = toward center (convex focuses light inward)
  return -horizontalDisplacement * (derivative > 0 ? 1 : -1);
}

/** Pre-calculate displacement curve for 127 samples (to match SVG 8-bit encoding) */
function preCalcDisplacements(
  refractiveIndex: number,
  thickness: number,
  surfaceFn: (x: number) => number
): number[] {
  const samples = 127;
  const displacements: number[] = [];
  let maxAbs = 0;

  for (let i = 0; i <= samples; i++) {
    const t = i / samples; // 0 = border, 1 = center
    const d = calculateDisplacement(t, refractiveIndex, thickness, surfaceFn);
    displacements.push(d);
    maxAbs = Math.max(maxAbs, Math.abs(d));
  }

  // Normalize to [-1, 1]
  if (maxAbs > 0) {
    for (let i = 0; i < displacements.length; i++) {
      displacements[i] /= maxAbs;
    }
  }

  return displacements;
}

/** Generate a displacement map image as a data URL using Canvas.
 *  Encodes: R = 128 + dx*127, G = 128 + dy*127 (SVG feDisplacementMap convention)
 */
function generateDisplacementMap(
  size: number,
  bezelRatio: number,
  refractiveIndex: number,
  thickness: number,
  surfaceFn: (x: number) => number
): string {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;

  // Pre-calculate the displacement curve
  const displacements = preCalcDisplacements(refractiveIndex, thickness, surfaceFn);

  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2;
  const bezelWidth = radius * bezelRatio;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const idx = (y * size + x) * 4;

      if (dist >= radius) {
        // Outside the circle — no displacement (neutral: 128,128)
        data[idx] = 128;
        data[idx + 1] = 128;
        data[idx + 2] = 128;
        data[idx + 3] = 255;
        continue;
      }

      // Distance from the border (0 at border, 1 at center)
      const distFromBorder = (radius - dist) / bezelWidth;

      if (distFromBorder >= 1) {
        // Inside flat center — no displacement
        data[idx] = 128;
        data[idx + 1] = 128;
        data[idx + 2] = 128;
        data[idx + 3] = 255;
        continue;
      }

      // Look up the pre-calculated displacement magnitude
      const sampleIdx = Math.min(
        displacements.length - 1,
        Math.round(distFromBorder * (displacements.length - 1))
      );
      const magnitude = displacements[sampleIdx];

      // Direction: always points toward center (for convex = inward displacement)
      const angle = Math.atan2(dy, dx);
      const dispX = magnitude * Math.cos(angle);
      const dispY = magnitude * Math.sin(angle);

      // Encode: 128 + value * 127  (maps [-1,1] to [1,255])
      data[idx] = Math.round(128 + dispX * 127);
      data[idx + 1] = Math.round(128 + dispY * 127);
      data[idx + 2] = 128;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL("image/png");
}

/** Generate a specular highlight map as a data URL.
 *  Creates a rim light effect based on surface normals + light direction.
 */
function generateSpecularMap(
  size: number,
  bezelRatio: number,
  lightAngle: number = -Math.PI / 3,
  surfaceFn: (x: number) => number
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
  const bezelWidth = radius * bezelRatio;

  // Light direction
  const lx = Math.cos(lightAngle);
  const ly = Math.sin(lightAngle);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const idx = (y * size + x) * 4;

      if (dist >= radius || dist === 0) {
        data[idx] = 0;
        data[idx + 1] = 0;
        data[idx + 2] = 0;
        data[idx + 3] = 0;
        continue;
      }

      const distFromBorder = (radius - dist) / bezelWidth;

      if (distFromBorder >= 1) {
        data[idx] = 0;
        data[idx + 1] = 0;
        data[idx + 2] = 0;
        data[idx + 3] = 0;
        continue;
      }

      // Surface normal direction (outward from center)
      const nx = dx / dist;
      const ny = dy / dist;

      // Surface derivative for height
      const derivative = surfaceDerivative(distFromBorder, surfaceFn);
      const slopeStrength = Math.abs(derivative);

      // Dot product with light direction (how much the surface faces the light)
      const dot = nx * lx + ny * ly;
      
      // Specular: higher power for sharper highlights
      const specular = Math.pow(Math.max(0, dot), 2.5) * slopeStrength;
      
      // Rim light: stronger at edges
      const rimFactor = 1 - distFromBorder;
      const rim = rimFactor * 0.4;

      const intensity = Math.min(1, specular + rim);
      const value = Math.round(intensity * 255);

      data[idx] = value;
      data[idx + 1] = value;
      data[idx + 2] = value;
      data[idx + 3] = Math.round(intensity * 200);
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL("image/png");
}

/**
 * Universal SVG Displacement Filter Component
 * 
 * Generates physics-based displacement maps at runtime using:
 * - Snell's Law refraction
 * - Convex squircle surface function (Apple's preferred shape)
 * - Specular highlight overlay
 * 
 * Filter pipeline (from Kube.io):
 * 1. feGaussianBlur (subtle pre-blur, 0.2)
 * 2. feDisplacementMap (physics-based map)
 * 3. feColorMatrix saturate=6 (Apple's saturation boost)
 * 4. feBlend specular overlay
 */
export function LiquidGlassFilter() {
  const [maps, setMaps] = useState<{
    displacement: string;
    specular: string;
  } | null>(null);

  useEffect(() => {
    // Generate maps on client mount
    const size = 256; // Good balance of quality vs performance
    const bezelRatio = 0.6; // 60% bezel (squircle-optimized)
    const refractiveIndex = 1.5; // Standard glass
    const thickness = 0.8; // Glass thickness

    const displacement = generateDisplacementMap(
      size,
      bezelRatio,
      refractiveIndex,
      thickness,
      convexSquircle
    );

    const specular = generateSpecularMap(
      size,
      bezelRatio,
      -Math.PI / 3, // Light from upper-left
      convexSquircle
    );

    setMaps({ displacement, specular });
  }, []);

  return (
    <svg
      className="glass-surface__filter pointer-events-none absolute inset-0 w-0 h-0 overflow-hidden"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Filter 1: Chromatic aberration filter (legacy, for dock/wrapper) */}
        <filter
          id="glass-filter-_r_b_"
          colorInterpolationFilters="sRGB"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
        >
          <feImage
            x="0"
            y="0"
            width="100%"
            height="100%"
            preserveAspectRatio="none"
            result="map"
            href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAApQAAAIdCAYAAACDcO0sAAAQAElEQVR4Aey9iZrcOo+k7bdnX3u23u7/Qj0OyUhCEEhRSmVVVhXOc2ACEQGQDLsy+ft8/c8//Pr167cC+G3xD//wD78t/t2/+3e/vf/vf1v8h//wH35b/Mf/+B9/W/yn//Sfflv85//8n3/7+C//5b/8tviv//W//rb4b//tv/22+O///b//9vE//sf/+G3xP//n//zt4x//8R9//6OL//W//tdvi//9v//3bx//5//8n98+/u///b+/Y/y///f/fsf4p3/6p98x/vmf//l3Fv/yL//yuxf/+q//+nsm/u3f/u33Z8TM2aTp3c/wzBdh0UPV0WvV8fdEtf99U+5/Xy2333db/Z8L5f7PjXL7M2Wr/zOn3P482mp/Vv1qf5Zt9X/WldvPgV/t58Sv9nPkV/s5i6v/eYy5/dz2VvsZP7Pq86Fi/ZwsH8qH+jNQfwbqz0D+Z0APyj/e/Mx/f//WW/r97v7R59J+ihknjnQ9PsOvYjN9UfOK+uxM+Zv1RCzTGZZpZ7ler/otpIlhXK2f7UDtXw6UA+XA+zrwox+UH/3boi/q2T3PaGdnRp32UES8V4+04hRZb4Y/g8U94qyPrnWemT2PNDYn00XMLazPO88p7oV4fPv3h5UA58RPdKP6fnHl2z0G2K02e+k5e+qN3qf53v4c/l94L99f5X9D+XUerz7D3f7L/D0925m/+L/gP60OfvH9V/v9F73O/L+iM/+7+q+xL74v/k/R/L0BWB/vWf/K++L/g/+E+n/+93/4H/D/b/+H+X+g+R9Y/h8AAAAASUVORK5CYII="
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="map"
            result="dispRed"
            scale="-20"
            xChannelSelector="R"
            yChannelSelector="G"
          />
          <feColorMatrix
            in="dispRed"
            type="matrix"
            values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
            result="red"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="map"
            result="dispGreen"
            scale="-24"
            xChannelSelector="R"
            yChannelSelector="G"
          />
          <feColorMatrix
            in="dispGreen"
            type="matrix"
            values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
            result="green"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="map"
            result="dispBlue"
            scale="-28"
            xChannelSelector="R"
            yChannelSelector="G"
          />
          <feColorMatrix
            in="dispBlue"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
            result="blue"
          />
          <feBlend in="red" in2="green" mode="screen" result="rg" />
          <feBlend in="rg" in2="blue" mode="screen" result="output" />
          <feGaussianBlur in="output" stdDeviation="0.8" />
        </filter>

        {/* Filter 2: Alias for glass-distortion */}
        <filter
          id="glass-distortion"
          colorInterpolationFilters="sRGB"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
        >
          <feImage
            x="0"
            y="0"
            width="100%"
            height="100%"
            preserveAspectRatio="none"
            result="map"
            href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAApQAAAIdCAYAAACDcO0sAAAQAElEQVR4Aey9iZrcOo+k7bdnX3u23u7/Qj0OyUhCEEhRSmVVVhXOc2ACEQGQDLsy+ft8/c8//Pr167cC+G3xD//wD78t/t2/+3e/vf/vf1v8h//wH35b/Mf/+B9/W/yn//Sfflv85//8n3/7+C//5b/8tviv//W//rb4b//tv/22+O///b//9vE//sf/+G3xP//n//zt4x//8R9//6OL//W//tdvi//9v//3bx//5//8n98+/u///b+/Y/y///f/fsf4p3/6p98x/vmf//l3Fv/yL//yuxf/+q//+nsm/u3f/u33Z8TM2aTp3c/wzBdh0UPV0WvV8fdEtf99U+5/Xy2333db/Z8L5f7PjXL7M2Wr/zOn3P482mp/Vv1qf5Zt9X/WldvPgV/t58Sv9nPkV/s5i6v/eYy5/dz2VvsZP7Pq86Fi/ZwsH8qH+jNQfwbqz0D+Z0APyj/e/Mx/f//WW/r97v7R59J+ihknjnQ9PsOvYjN9UfOK+uxM+Zv1RCzTGZZpZ7ler/otpIlhXK2f7UDtXw6UA+XA+zrwox+UH/3boi/q2T3PaGdnRp32UES8V4+04hRZb4Y/g8U94qyPrnWemT2PNDYn00XMLazPO88p7oV4fPv3h5UA58RPdKP6fnHl2z0G2K02e+k5e+qN3qf53v4c/l94L99f5X9D+XUerz7D3f7L/D0925m/+L/gP60OfvH9V/v9F73O/L+iM/+7+q+xL74v/k/R/L0BWB/vWf/K++L/g/+E+n/+93/4H/D/b/+H+X+g+R9Y/h8AAAAASUVORK5CYII="
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="map"
            result="dispRed"
            scale="-20"
            xChannelSelector="R"
            yChannelSelector="G"
          />
          <feColorMatrix
            in="dispRed"
            type="matrix"
            values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
            result="red"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="map"
            result="dispGreen"
            scale="-24"
            xChannelSelector="R"
            yChannelSelector="G"
          />
          <feColorMatrix
            in="dispGreen"
            type="matrix"
            values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
            result="green"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="map"
            result="dispBlue"
            scale="-28"
            xChannelSelector="R"
            yChannelSelector="G"
          />
          <feColorMatrix
            in="dispBlue"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
            result="blue"
          />
          <feBlend in="red" in2="green" mode="screen" result="rg" />
          <feBlend in="rg" in2="blue" mode="screen" result="output" />
          <feGaussianBlur in="output" stdDeviation="0.8" />
        </filter>

        {/* Filter 3: Physics-based Apple Liquid Glass (Kube.io technique)
            Pipeline: blur → displace → saturate → specular overlay */}
        {maps ? (
          <filter
            id="switcher"
            colorInterpolationFilters="sRGB"
            x="-5%"
            y="-5%"
            width="110%"
            height="110%"
          >
            {/* Step 1: Subtle pre-blur for smoother refraction */}
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="0.2"
              result="blurred_source"
            />

            {/* Step 2: Load physics-based displacement map */}
            <feImage
              href={maps.displacement}
              x="0"
              y="0"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              result="displacement_map"
            />

            {/* Step 3: Apply displacement (refraction) */}
            <feDisplacementMap
              in="blurred_source"
              in2="displacement_map"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
              scale="60"
            />

            {/* Step 4: Boost saturation (Apple's characteristic saturated look) */}
            <feColorMatrix
              in="displaced"
              type="saturate"
              values="6"
              result="displaced_saturated"
            />

            {/* Step 5: Load specular highlight map */}
            <feImage
              href={maps.specular}
              x="0"
              y="0"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              result="specular_layer"
            />

            {/* Step 6: Mask the saturated displaced with specular shape */}
            <feComposite
              in="displaced_saturated"
              in2="specular_layer"
              operator="in"
              result="specular_saturated"
            />

            {/* Step 7: Fade the specular for subtle overlay */}
            <feComponentTransfer in="specular_layer" result="specular_faded">
              <feFuncA type="linear" slope="0.2" />
            </feComponentTransfer>

            {/* Step 8: Blend saturated specular onto displaced */}
            <feBlend
              in="specular_saturated"
              in2="displaced"
              mode="normal"
              result="withSaturation"
            />

            {/* Step 9: Final blend with specular highlight overlay */}
            <feBlend
              in="specular_faded"
              in2="withSaturation"
              mode="normal"
            />
          </filter>
        ) : (
          /* Fallback filter before maps are generated */
          <filter id="switcher" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.2" result="blur" />
            <feColorMatrix in="blur" type="saturate" values="3" />
          </filter>
        )}

        {/* Filter 4: Simplified liquid glass for navbars (lighter weight) */}
        <filter
          id="liquid-glass-nav-filter"
          colorInterpolationFilters="sRGB"
          x="-5%"
          y="-5%"
          width="110%"
          height="110%"
        >
          {maps ? (
            <>
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation="0.15"
                result="blurred"
              />
              <feImage
                href={maps.displacement}
                x="0"
                y="0"
                width="100%"
                height="100%"
                preserveAspectRatio="none"
                result="dmap"
              />
              <feDisplacementMap
                in="blurred"
                in2="dmap"
                xChannelSelector="R"
                yChannelSelector="G"
                result="refracted"
                scale="30"
              />
              <feColorMatrix
                in="refracted"
                type="saturate"
                values="4"
                result="saturated"
              />
              <feImage
                href={maps.specular}
                x="0"
                y="0"
                width="100%"
                height="100%"
                preserveAspectRatio="none"
                result="spec"
              />
              <feComponentTransfer in="spec" result="spec_faded">
                <feFuncA type="linear" slope="0.15" />
              </feComponentTransfer>
              <feBlend
                in="spec_faded"
                in2="saturated"
                mode="screen"
              />
            </>
          ) : (
            <>
              <feGaussianBlur in="SourceGraphic" stdDeviation="0.15" />
              <feColorMatrix type="saturate" values="2" />
            </>
          )}
        </filter>
      </defs>
    </svg>
  );
}

interface LiquidGlassWrapperProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  role?: string;
  ariaLabel?: string;
}

/**
 * 4-Layer Authentic Liquid Glass Wrapper
 * Implements: wrapper -> effect (chromatic distortion) -> tint (translucent) -> shine (specular rim) -> text/content
 */
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
      {/* Layer 0: Optical Refraction & Chromatic Dispersion */}
      <div className="liquidGlass-effect" />
      {/* Layer 1: Ambient Background Tint */}
      <div className="liquidGlass-tint" />
      {/* Layer 2: Specular Rim Lighting & Bevel Highlights */}
      <div className="liquidGlass-shine" />
      {/* Layer 3: Interactive Content */}
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

/**
 * Responsive Liquid Glass Capsule / Pill
 * Ideal for floating navbars, sticky bars, banner pills, and dynamic action capsules.
 */
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
      {/* Interactive Content Container */}
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

/**
 * 3D Liquid Glass Circular Dome / Orb
 * Used for interactive action icons, theme toggles, carousel buttons, and media triggers.
 */
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
      className={`liquid-glass-icon relative flex items-center justify-center shrink-0 select-none overflow-hidden ${
        onClick ? "cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-200" : ""
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

/**
 * Interactive Liquid Glass Floating Dock
 * Responsive dock with spring bounce physics on items.
 */
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
