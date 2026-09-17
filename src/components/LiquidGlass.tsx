"use client";

import React, { useId } from "react";

/**
 * Utility to convert hex color to rgba string
 */
function hexToRgba(hex: string, alpha: number): string {
  let c = hex.replace("#", "");
  if (c.length === 3) {
    c = c
      .split("")
      .map((x) => x + x)
      .join("");
  }
  const num = parseInt(c, 16);
  if (isNaN(num)) return `rgba(255, 255, 255, ${alpha})`;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

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
}

/**
 * LiquidGlass Component (liquid-glass.pro architecture)
 *
 * Implements Apple-inspired liquid glassmorphism with:
 * - SVG feTurbulence + feDisplacementMap light distortion
 * - CSS backdrop-filter frost blur
 * - Inset specular shadow and color tinting
 */
export function LiquidGlass({
  width = 300,
  height = 200,
  borderRadius = 28,
  innerShadowColor = "#ffffff",
  innerShadowBlur = 17,
  innerShadowSpread = 6,
  glassTintColor = "rgba(255, 255, 255, 0.18)",
  glassTintOpacity = 18,
  frostBlurRadius = 5,
  noiseFrequency = 0.011,
  noiseStrength = 39,
  children,
  className = "",
  style,
  ...restProps
}: LiquidGlassProps) {
  const rawId = useId();
  const filterId = `glass-distortion-${rawId.replace(/[:]/g, "")}`;

  const widthStyle = typeof width === "number" ? `${width}px` : width;
  const heightStyle = typeof height === "number" ? `${height}px` : height;
  const radiusStyle =
    typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius;

  const resolvedBg = glassTintColor.startsWith("rgba")
    ? glassTintColor
    : glassTintColor.startsWith("#")
    ? hexToRgba(glassTintColor, (glassTintOpacity ?? 18) / 100)
    : glassTintColor;

  return (
    <div
      className={`liquid-glass relative isolate flex items-center justify-center select-none overflow-hidden ${className}`}
      style={{
        width: widthStyle,
        height: heightStyle,
        borderRadius: radiusStyle,
        boxShadow: "0px 6px 24px rgba(0, 0, 0, 0.12)",
        ...style,
      }}
      {...restProps}
    >
      {/* SVG Distortion Filter */}
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
          <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={`${noiseFrequency} ${noiseFrequency}`}
              numOctaves="2"
              seed="92"
              result="noise"
            />
            <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
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

      {/* Backdrop Filter & Turbulence Distortion Layer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: radiusStyle,
          zIndex: -1,
          backdropFilter: `blur(${frostBlurRadius}px)`,
          WebkitBackdropFilter: `blur(${frostBlurRadius}px)`,
          filter: `url(#${filterId})`,
          WebkitFilter: `url(#${filterId})`,
        }}
      />

      {/* Tint & Inner Bevel Shadow Layer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: radiusStyle,
          zIndex: 0,
          backgroundColor: resolvedBg,
          boxShadow: `inset 0 0 ${innerShadowBlur}px ${innerShadowSpread}px ${innerShadowColor}`,
        }}
      />

      {/* Interactive / Presentation Content */}
      <div className="relative z-10 w-full h-full flex items-center justify-center pointer-events-auto">
        {children}
      </div>
    </div>
  );
}

export const LiquidGlassContainer = LiquidGlass;

/**
 * LiquidGlassButton Component
 */
export interface LiquidGlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
}

export function LiquidGlassButton({
  width = 180,
  height = 50,
  borderRadius = 25,
  innerShadowColor = "#ffffff",
  innerShadowBlur = 17,
  innerShadowSpread = 6,
  glassTintColor = "rgba(255, 255, 255, 0.18)",
  glassTintOpacity = 18,
  frostBlurRadius = 5,
  noiseFrequency = 0.011,
  noiseStrength = 39,
  children,
  className = "",
  style,
  ...restProps
}: LiquidGlassButtonProps) {
  const rawId = useId();
  const filterId = `glass-btn-distortion-${rawId.replace(/[:]/g, "")}`;

  const widthStyle = typeof width === "number" ? `${width}px` : width;
  const heightStyle = typeof height === "number" ? `${height}px` : height;
  const radiusStyle =
    typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius;

  return (
    <button
      className={`liquid-glass relative isolate flex items-center justify-center select-none cursor-pointer transition-transform active:scale-95 hover:scale-[1.02] border-0 bg-transparent p-0 ${className}`}
      style={{
        width: widthStyle,
        height: heightStyle,
        borderRadius: radiusStyle,
        boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.15)",
        ...style,
      }}
      {...restProps}
    >
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
          <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={`${noiseFrequency} ${noiseFrequency}`}
              numOctaves="2"
              seed="92"
              result="noise"
            />
            <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
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

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: radiusStyle,
          zIndex: -1,
          backdropFilter: `blur(${frostBlurRadius}px)`,
          WebkitBackdropFilter: `blur(${frostBlurRadius}px)`,
          filter: `url(#${filterId})`,
          WebkitFilter: `url(#${filterId})`,
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: radiusStyle,
          zIndex: 0,
          backgroundColor: glassTintColor,
          boxShadow: `inset 0 0 ${innerShadowBlur}px ${innerShadowSpread}px ${innerShadowColor}`,
        }}
      />

      <span className="relative z-10">{children}</span>
    </button>
  );
}

/**
 * Global SVG Filter component for root layout
 */
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
        <filter id={id} x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={`${noiseFrequency} ${noiseFrequency}`}
            numOctaves="2"
            seed="92"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
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

/**
 * Pill capsule representation using liquid-glass architecture
 */
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
      innerShadowColor="#ffffff"
      innerShadowBlur={17}
      innerShadowSpread={6}
      glassTintColor="rgba(255, 255, 255, 0.18)"
      glassTintOpacity={18}
      frostBlurRadius={5}
      noiseFrequency={0.011}
      noiseStrength={39}
      className={className}
      style={style}
    >
      {children}
    </LiquidGlass>
  );
}

/**
 * Circular glass orb representation
 */
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
      innerShadowColor="#ffffff"
      innerShadowBlur={12}
      innerShadowSpread={4}
      glassTintColor="rgba(255, 255, 255, 0.20)"
      glassTintOpacity={20}
      frostBlurRadius={5}
      noiseFrequency={0.011}
      noiseStrength={39}
      onClick={onClick}
      aria-label={ariaLabel}
      className={`cursor-pointer hover:scale-105 active:scale-95 transition-transform ${className}`}
    >
      {children}
    </LiquidGlass>
  );
}

export default LiquidGlass;
