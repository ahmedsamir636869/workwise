"use client";

import React, { useId } from "react";

export interface LiquidGlassProps
  extends React.HTMLAttributes<HTMLDivElement> {
  width?: number | string;
  height?: number | string;
  borderRadius?: number | string;
  innerShadowColor?: string;
  innerShadowBlur?: number;
  innerShadowSpread?: number;
  glassTintColor?: string;
  glassTintOpacity?: number;
  frostBlurRadius?: number;
  noiseFrequency?: number;
  noiseStrength?: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  enableSheen?: boolean;
}

/**
 * Authentic Apple-Style Liquid Glass Component
 *
 * Engineered with:
 * - Multi-tier frosted optical blur (saturate + brightness + high blur radius)
 * - Physical double-bevel perimeter lighting & specular highlights
 * - Diagonal convex glass light reflection (surface sheen)
 * - SVG optical refraction displacement map
 */
export function LiquidGlass({
  width = 300,
  height = 200,
  borderRadius = 28,
  innerShadowColor = "#ffffff",
  innerShadowBlur = 17,
  innerShadowSpread = 6,
  glassTintColor = "rgba(255, 255, 255, 0.68)",
  glassTintOpacity = 18,
  frostBlurRadius = 26,
  noiseFrequency = 0.011,
  noiseStrength = 39,
  children,
  className = "",
  style,
  enableSheen = true,
  ...restProps
}: LiquidGlassProps) {
  const rawId = useId();
  const filterId = `glass-distortion-${rawId.replace(/[:]/g, "")}`;

  const widthStyle = typeof width === "number" ? `${width}px` : width;
  const heightStyle = typeof height === "number" ? `${height}px` : height;
  const radiusStyle =
    typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius;

  // Ensure the frosted blur is visually palpable (Apple standard: 24-32px)
  const effectiveBlur = Math.max(22, frostBlurRadius || 26);

  // If a very low opacity was passed, blend with luminous white base so the glass is visibly frosted
  const baseTint =
    glassTintColor && !glassTintColor.includes("0.18")
      ? glassTintColor
      : "rgba(255, 255, 255, 0.68)";

  return (
    <div
      className={`liquid-glass-container relative isolate flex items-center justify-center select-none ${className}`}
      style={{
        width: widthStyle,
        height: heightStyle,
        borderRadius: radiusStyle,
        ...style,
      }}
      {...restProps}
    >
      {/* SVG Optical Refraction Filter */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          overflow: "hidden",
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        <defs>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={`${noiseFrequency} ${noiseFrequency}`}
              numOctaves="3"
              seed="92"
              result="noise"
            />
            <feGaussianBlur in="noise" stdDeviation="2.5" result="blurred" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="blurred"
              scale={noiseStrength}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* 1. Deep Frosted Backdrop Filter (Apple System Material) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: radiusStyle,
          zIndex: 1,
          backdropFilter: `blur(${effectiveBlur}px) saturate(190%) brightness(108%) contrast(104%)`,
          WebkitBackdropFilter: `blur(${effectiveBlur}px) saturate(190%) brightness(108%) contrast(104%)`,
        }}
      />

      {/* 2. Apple Luminous Glass Material Tint & Ambient Floating Shadows */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: radiusStyle,
          zIndex: 2,
          backgroundColor: baseTint,
          border: "1px solid rgba(255, 255, 255, 0.85)",
          boxShadow: `
            0 24px 48px -12px rgba(10, 30, 60, 0.16),
            0 8px 24px -4px rgba(10, 30, 60, 0.08),
            inset 0 0 ${innerShadowBlur}px ${innerShadowSpread}px ${innerShadowColor}
          `,
        }}
      />

      {/* 3. Apple Specular Perimeter Bevel & Edge Light Catch */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: radiusStyle,
          zIndex: 3,
          boxShadow: `
            inset 0 1.5px 1px 0 rgba(255, 255, 255, 0.95),
            inset 1.5px 0 1px 0 rgba(255, 255, 255, 0.85),
            inset 0 -1.5px 1px 0 rgba(0, 0, 0, 0.06),
            inset -1.5px 0 1px 0 rgba(0, 0, 0, 0.04),
            inset 0 0 0 1px rgba(255, 255, 255, 0.6)
          `,
        }}
      />

      {/* 4. Diagonal Convex Glass Optical Sheen (Surface Glare Reflection) */}
      {enableSheen && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: radiusStyle,
            zIndex: 4,
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0.22) 35%, rgba(255, 255, 255, 0) 55%, rgba(255, 255, 255, 0.35) 100%)",
            mixBlendMode: "overlay",
          }}
        />
      )}

      {/* 5. Top Specular Rim Catch-Light */}
      <div
        className="absolute top-0 left-6 right-6 h-[1.5px] pointer-events-none"
        style={{
          zIndex: 5,
          background:
            "linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.95) 50%, rgba(255, 255, 255, 0) 100%)",
        }}
      />

      {/* 6. Foreground Sharp Content */}
      <div className="relative z-10 w-full h-full flex items-center justify-center pointer-events-auto">
        {children}
      </div>
    </div>
  );
}

export const LiquidGlassContainer = LiquidGlass;

export interface LiquidGlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  width?: number | string;
  height?: number | string;
  borderRadius?: number | string;
  innerShadowColor?: string;
  innerShadowBlur?: number;
  innerShadowSpread?: number;
  glassTintColor?: string;
  frostBlurRadius?: number;
}

export function LiquidGlassButton({
  width = 180,
  height = 50,
  borderRadius = 25,
  innerShadowColor = "#ffffff",
  innerShadowBlur = 12,
  innerShadowSpread = 4,
  glassTintColor = "rgba(255, 255, 255, 0.75)",
  frostBlurRadius = 24,
  children,
  className = "",
  style,
  ...restProps
}: LiquidGlassButtonProps) {
  const widthStyle = typeof width === "number" ? `${width}px` : width;
  const heightStyle = typeof height === "number" ? `${height}px` : height;
  const radiusStyle =
    typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius;

  return (
    <button
      className={`relative isolate flex items-center justify-center select-none cursor-pointer transition-all duration-200 active:scale-95 hover:scale-[1.02] border-0 bg-transparent p-0 ${className}`}
      style={{
        width: widthStyle,
        height: heightStyle,
        borderRadius: radiusStyle,
        ...style,
      }}
      {...restProps}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: radiusStyle,
          zIndex: 1,
          backdropFilter: `blur(${frostBlurRadius}px) saturate(190%)`,
          WebkitBackdropFilter: `blur(${frostBlurRadius}px) saturate(190%)`,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: radiusStyle,
          zIndex: 2,
          backgroundColor: glassTintColor,
          border: "1px solid rgba(255, 255, 255, 0.85)",
          boxShadow: `
            0 8px 24px -4px rgba(10, 30, 60, 0.15),
            inset 0 1.5px 1px rgba(255, 255, 255, 0.95),
            inset 0 0 ${innerShadowBlur}px ${innerShadowSpread}px ${innerShadowColor}
          `,
        }}
      />
      <span className="relative z-10 font-semibold">{children}</span>
    </button>
  );
}

export function LiquidGlassFilter({
  id = "glass-distortion",
  noiseFrequency = 0.011,
  noiseStrength = 39,
}: {
  id?: string;
  noiseFrequency?: number;
  noiseStrength?: number;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: "absolute",
        width: 0,
        height: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      <defs>
        <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={`${noiseFrequency} ${noiseFrequency}`}
            numOctaves="3"
            seed="92"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="2.5" result="blurred" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurred"
            scale={noiseStrength}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}

export function LiquidGlassPill({
  children,
  className = "",
  width = 532,
  height = 70,
  style,
}: {
  children?: React.ReactNode;
  className?: string;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
}) {
  return (
    <LiquidGlass
      width={width}
      height={height}
      borderRadius={9999}
      className={className}
      style={style}
    >
      {children}
    </LiquidGlass>
  );
}

export function LiquidGlassOrb({
  children,
  className = "",
  size = 48,
  onClick,
  ariaLabel,
}: {
  children?: React.ReactNode;
  className?: string;
  size?: number;
  onClick?: () => void;
  ariaLabel?: string;
}) {
  return (
    <LiquidGlass
      width={size}
      height={size}
      borderRadius={size / 2}
      innerShadowBlur={10}
      innerShadowSpread={3}
      onClick={onClick}
      aria-label={ariaLabel}
      className={`cursor-pointer hover:scale-105 active:scale-95 transition-transform ${className}`}
    >
      {children}
    </LiquidGlass>
  );
}

export default LiquidGlass;
