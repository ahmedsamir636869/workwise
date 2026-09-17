"use client";

import React, { useId } from "react";
import { useLiquidGlass } from "@/context/LiquidGlassContext";
export { LiquidGlassFilter } from "./LiquidGlassOrb";

interface LiquidGlassProps {
  children?: React.ReactNode;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  innerShadowColor?: string;
  innerShadowBlur?: number;
  innerShadowSpread?: number;
  glassTintColor?: string;
  glassTintOpacity?: number;
  frostBlurRadius?: number;
  refractionDistance?: number;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

/**
 * LiquidGlass Component - iOS / VisionOS Apple-style Liquid Glass
 * Implements Snell's Law refraction, squircle bevel specular highlights, and backdrop blur
 */
export default function LiquidGlass({
  children,
  width = 300,
  height = 200,
  borderRadius = 28,
  innerShadowColor = "#ffffff",
  innerShadowBlur,
  innerShadowSpread,
  glassTintColor,
  glassTintOpacity,
  frostBlurRadius,
  refractionDistance,
  className = "",
  style,
  onClick,
}: LiquidGlassProps) {
  const { config } = useLiquidGlass();

  // Parse width & height
  const w = typeof width === "number" ? `${width}px` : width;
  const h = typeof height === "number" ? `${height}px` : height;
  const r = `${borderRadius}px`;

  // Resolved values with context fallback
  const blur = frostBlurRadius ?? config.navbar.blur;
  const tint = glassTintColor ?? config.navbar.tintColor;
  const opacity = glassTintOpacity !== undefined ? glassTintOpacity / 100 : config.navbar.tintOpacity;
  const sBlur = innerShadowBlur ?? config.navbar.innerShadowBlur;
  const sSpread = innerShadowSpread ?? config.navbar.innerShadowSpread;

  return (
    <div
      onClick={onClick}
      className={`relative isolation-isolate overflow-hidden select-none transition-all duration-300 ${className}`}
      style={{
        width: w,
        height: h,
        borderRadius: r,
        boxShadow: "0px 10px 32px rgba(0, 0, 0, 0.12), 0px 2px 8px rgba(0, 0, 0, 0.06)",
        ...style,
      }}
    >
      {/* Background Refraction & Frost Layer using Apple SVG filter */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          borderRadius: r,
          backdropFilter: `blur(${blur}px) saturate(${config.navbar.saturation}%)`,
          WebkitBackdropFilter: `blur(${blur}px) saturate(${config.navbar.saturation}%)`,
        }}
      />

      {/* Tint & Inner Specular Bevel Highlights */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          borderRadius: r,
          backgroundColor: tint.startsWith("rgba") ? tint : `color-mix(in srgb, ${tint} ${Math.round(opacity * 100)}%, transparent)`,
          boxShadow: `inset 0 0 ${sBlur}px ${sSpread}px ${innerShadowColor}, inset 0 1.5px 2px 0 rgba(255, 255, 255, 0.75), inset 0 -1px 2px 0 rgba(0, 0, 0, 0.1)`,
          border: "0.5px solid rgba(255, 255, 255, 0.5)",
        }}
      />

      {/* Directional Specular Sheen Line */}
      <div
        className="absolute inset-0 pointer-events-none z-[1] opacity-40"
        style={{
          borderRadius: r,
          background:
            "linear-gradient(125deg, transparent 32%, rgba(255, 255, 255, 0.45) 46%, rgba(255, 255, 255, 0.75) 49%, transparent 54%)",
        }}
      />

      {/* Content Layer */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
