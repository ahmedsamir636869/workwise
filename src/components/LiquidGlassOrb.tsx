"use client";

import React from "react";

interface LiquidGlassPillProps {
  children?: React.ReactNode;
  className?: string;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
}

/**
 * Authentic Apple Liquid Glass Capsule (iOS 26 / VisionOS & Figma Buttons specification)
 * Features optical refraction, 3px inner grey bevel, top specular light ridge, and ambient depth.
 */
export function LiquidGlassPill({
  children,
  className = "",
  width = 532,
  height = 70,
  style,
}: LiquidGlassPillProps) {
  return (
    <div
      className={`liquid-glass-nav relative flex items-center select-none ${className}`}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        ...style,
      }}
    >
      {/* Diagonal Optical Glass Lens Reflection Streak */}
      <div
        className="absolute inset-0 pointer-events-none rounded-full z-[3] opacity-60"
        style={{
          background:
            "linear-gradient(115deg, transparent 20%, rgba(255, 255, 255, 0.45) 36%, rgba(255, 255, 255, 0.75) 40%, rgba(255, 255, 255, 0.25) 44%, transparent 58%)",
        }}
      />
      {/* Relative content sitting above glass reflections */}
      <div className="relative z-10 w-full h-full flex items-center">
        {children}
      </div>
    </div>
  );
}

interface LiquidGlassOrbProps {
  children?: React.ReactNode;
  className?: string;
  size?: number;
  onClick?: () => void;
  ariaLabel?: string;
}

/**
 * 3D Liquid Glass Circular Dome / Orb (e.g. 48px service icons, 40px theme buttons)
 */
export function LiquidGlassOrb({
  children,
  className = "",
  size = 48,
  onClick,
  ariaLabel,
}: LiquidGlassOrbProps) {
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      aria-label={ariaLabel}
      className={`liquid-glass-icon relative flex items-center justify-center shrink-0 select-none overflow-hidden ${
        onClick ? "cursor-pointer hover:scale-105 active:scale-95 transition-transform" : ""
      } ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      {/* Diagonal Glass Reflection Streak */}
      <div
        className="absolute inset-0 pointer-events-none rounded-full z-[3] opacity-65"
        style={{
          background:
            "linear-gradient(135deg, transparent 20%, rgba(255, 255, 255, 0.5) 38%, rgba(255, 255, 255, 0.85) 44%, transparent 56%)",
        }}
      />
      <div className="relative z-10 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

export default LiquidGlassPill;
