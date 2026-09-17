"use client";

import React, { useId } from "react";
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
  noiseFrequency?: number;
  noiseStrength?: number;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

/**
 * LiquidGlass Component - iOS / VisionOS Apple-style Liquid Glass
 * Implements SVG turbulence distortion + Snell's Law specular inner reflections + backdrop blur
 */
export default function LiquidGlass({
  children,
  width = 300,
  height = 200,
  borderRadius = 28,
  innerShadowColor = "#ffffff",
  innerShadowBlur = 17,
  innerShadowSpread = 6,
  glassTintColor = "rgba(255, 255, 255, 0.70)",
  glassTintOpacity = 70,
  frostBlurRadius = 24,
  noiseFrequency = 0.011,
  noiseStrength = 39,
  className = "",
  style,
  onClick,
}: LiquidGlassProps) {
  const filterId = useId().replace(/:/g, "_");
  const filterName = `glass-distortion-${filterId}`;

  // Parse width & height
  const w = typeof width === "number" ? `${width}px` : width;
  const h = typeof height === "number" ? `${height}px` : height;
  const r = `${borderRadius}px`;

  return (
    <div
      onClick={onClick}
      className={`relative isolation-isolate overflow-hidden select-none transition-all duration-300 ${className}`}
      style={{
        width: w,
        height: h,
        borderRadius: r,
        boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.12), 0px 2px 8px rgba(0, 0, 0, 0.06)",
        ...style,
      }}
    >
      {/* SVG Distortion Filter Definition for this instance */}
      <svg className="absolute w-0 h-0 pointer-events-none opacity-0" aria-hidden="true">
        <defs>
          <filter id={filterName} x="0%" y="0%" width="100%" height="100%">
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

      {/* Background Refraction & Frost Layer */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          borderRadius: r,
          backdropFilter: `blur(${frostBlurRadius}px) saturate(180%)`,
          WebkitBackdropFilter: `blur(${frostBlurRadius}px) saturate(180%)`,
          filter: `url(#${filterName})`,
          WebkitFilter: `url(#${filterName})`,
        }}
      />

      {/* Tint & Inner Specular Bevel Highlights */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          borderRadius: r,
          backgroundColor: glassTintColor.startsWith("rgba")
            ? glassTintColor
            : `rgba(255, 255, 255, ${glassTintOpacity / 100})`,
          boxShadow: `inset 0 0 ${innerShadowBlur}px ${innerShadowSpread}px ${innerShadowColor}, inset 0 1px 1px 0 rgba(255, 255, 255, 0.8), inset 0 -1px 2px 0 rgba(0, 0, 0, 0.08)`,
          border: "0.5px solid rgba(255, 255, 255, 0.6)",
        }}
      />

      {/* Diagonal Specular Sheen Line */}
      <div
        className="absolute inset-0 pointer-events-none z-[1] opacity-40"
        style={{
          borderRadius: r,
          background:
            "linear-gradient(125deg, transparent 30%, rgba(255, 255, 255, 0.6) 45%, rgba(255, 255, 255, 0.8) 48%, transparent 54%)",
        }}
      />

      {/* Content Layer */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
