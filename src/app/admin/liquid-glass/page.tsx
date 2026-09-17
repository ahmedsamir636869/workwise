"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  Cloud,
  RotateCcw,
  Sliders,
  Database,
  Layers,
  Copy,
  CheckCheck,
  Play,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Search,
  ExternalLink,
} from "lucide-react";
import { useLiquidGlass } from "@/context/LiquidGlassContext";
import { PRESET_OPTIONS } from "@/utils/liquid-glass-presets";
import { LIQUID_GLASS_TABLE_SQL } from "@/utils/supabase-schema";

export default function LiquidGlassStudioPage() {
  const {
    config,
    activePreset,
    syncStatus,
    updateNavbar,
    updateGlobal,
    applyPreset,
    saveToSupabase,
    resetDefaults,
    errorMessage,
  } = useLiquidGlass();

  const [copiedSql, setCopiedSql] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Home");
  const [workbenchBg, setWorkbenchBg] = useState<"vibrant" | "dark" | "geometric">("vibrant");
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isNavHovered, setIsNavHovered] = useState(false);

  const handleSave = async () => {
    setSaveMessage("Saving to Supabase...");
    const res = await saveToSupabase();
    if (res.success) {
      setSaveMessage("Saved to Supabase successfully!");
      setTimeout(() => setSaveMessage(null), 3500);
    } else {
      setSaveMessage(res.error ? `Error: ${res.error}` : "Failed to save to Supabase");
      setTimeout(() => setSaveMessage(null), 5000);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(LIQUID_GLASS_TABLE_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleNavMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Site
          </Link>
          <div className="h-5 w-px bg-slate-800" />
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
              Liquid Glass CMS Studio
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Next.js 16 + Supabase
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Supabase Status Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs">
            <Cloud className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-slate-400">Project:</span>
            <span className="font-mono text-slate-200">fgcbzsfcfwzxjoitftmd</span>
            <span
              className={`w-2 h-2 rounded-full ${
                syncStatus === "synced"
                  ? "bg-emerald-500"
                  : syncStatus === "saving"
                  ? "bg-amber-500 animate-pulse"
                  : "bg-blue-500"
              }`}
            />
          </div>

          <button
            onClick={resetDefaults}
            className="px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>

          <button
            onClick={handleSave}
            disabled={syncStatus === "saving"}
            className="px-4 py-1.5 rounded-lg bg-[#0958A7] hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-950 transition-all active:scale-95 cursor-pointer disabled:opacity-60"
          >
            <Cloud className="w-4 h-4" />
            {syncStatus === "saving" ? "Saving..." : "Save to Supabase"}
          </button>
        </div>
      </header>

      {/* Save Notification Toast */}
      {saveMessage && (
        <div className="bg-blue-600 text-white text-xs font-medium py-2 px-4 text-center shadow-lg animate-in slide-in-from-top duration-200">
          {saveMessage}
        </div>
      )}

      {/* Main Studio Split Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* LEFT COLUMN: Controls & Settings (5 cols) */}
        <div className="lg:col-span-5 border-r border-slate-800 bg-slate-900/40 overflow-y-auto p-6 space-y-8 max-h-[calc(100vh-64px)]">
          {/* Section 1: Presets Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                1. Curated Glass Presets
              </h2>
              <span className="text-[11px] text-slate-500">Instant One-Click Styling</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {PRESET_OPTIONS.map((preset) => {
                const isSelected = activePreset === preset.key;
                return (
                  <button
                    key={preset.key}
                    onClick={() => applyPreset(preset.key)}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? "bg-blue-950/40 border-blue-500 text-white shadow-md shadow-blue-950/50 ring-1 ring-blue-500/50"
                        : "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: preset.accentColor }}
                      />
                      <span className="font-semibold text-xs text-white truncate">
                        {preset.name}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                      {preset.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Navbar Glass Controls */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-blue-400" />
                2. Navigation Bar Glass Optics
              </h2>
              <span className="text-[11px] font-mono text-blue-400">
                {config.navbar.blur}px blur
              </span>
            </div>

            {/* Refraction Displacement Scale */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-200">
                  Refraction Displacement Scale
                </span>
                <span className="text-blue-400 font-mono font-semibold">
                  {config.navbar.displacementScale} scale
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                step="1"
                value={config.navbar.displacementScale}
                onChange={(e) =>
                  updateNavbar({ displacementScale: Number(e.target.value) })
                }
                className="w-full accent-blue-500"
              />
              <p className="text-[10px] text-slate-400">
                Physics-based ray deviation calculated via Snell's Law in the SVG displacement map.
              </p>
            </div>

            {/* Blur & Saturation */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-300">Backdrop Blur</span>
                  <span className="text-blue-400 font-mono">{config.navbar.blur}px</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="48"
                  value={config.navbar.blur}
                  onChange={(e) => updateNavbar({ blur: Number(e.target.value) })}
                  className="w-full accent-blue-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-300">Saturation</span>
                  <span className="text-blue-400 font-mono">{config.navbar.saturation}%</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="350"
                  step="5"
                  value={config.navbar.saturation}
                  onChange={(e) => updateNavbar({ saturation: Number(e.target.value) })}
                  className="w-full accent-blue-500"
                />
              </div>
            </div>

            {/* Tint Color & Opacity */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1.5">
                    Glass Tint
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.navbar.tintColor}
                      onChange={(e) => updateNavbar({ tintColor: e.target.value })}
                      className="w-9 h-9 rounded-lg border border-slate-700 cursor-pointer bg-transparent"
                    />
                    <span className="text-xs font-mono text-slate-300">
                      {config.navbar.tintColor}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-medium text-slate-300">Tint Opacity</span>
                    <span className="text-blue-400 font-mono font-semibold">
                      {Math.round(config.navbar.tintOpacity * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.02"
                    max="0.45"
                    step="0.01"
                    value={config.navbar.tintOpacity}
                    onChange={(e) =>
                      updateNavbar({ tintOpacity: Number(e.target.value) })
                    }
                    className="w-full accent-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Dynamic Cursor Sheen & Ridge catch-light */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-200">
                    Cursor Radial Sheen Tracking
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Calculates light vector toward cursor (GLSL iMouse equivalent)
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.navbar.sheenEnabled}
                  onChange={(e) => updateNavbar({ sheenEnabled: e.target.checked })}
                  className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
                />
              </div>

              {config.navbar.sheenEnabled && (
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-400">Sheen Intensity</span>
                    <span className="text-blue-400 font-mono">
                      {Math.round(config.navbar.sheenIntensity * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={config.navbar.sheenIntensity}
                    onChange={(e) =>
                      updateNavbar({ sheenIntensity: Number(e.target.value) })
                    }
                    className="w-full accent-blue-500"
                  />
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <div>
                  <div className="text-xs font-semibold text-slate-200">
                    Top Edge Specular Ridge
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Prismatic highlight along the top squircle rim
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config.navbar.ridgeSpecular}
                  onChange={(e) => updateNavbar({ ridgeSpecular: e.target.checked })}
                  className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Global Physics & Website Components */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              3. Global Physics & Component Optics
            </h2>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-200">Index of Refraction (IOR)</span>
                  <span className="text-indigo-400 font-mono font-semibold">
                    {config.global.refractiveIndex.toFixed(2)} n
                  </span>
                </div>
                <input
                  type="range"
                  min="1.1"
                  max="2.4"
                  step="0.02"
                  value={config.global.refractiveIndex}
                  onChange={(e) =>
                    updateGlobal({ refractiveIndex: Number(e.target.value) })
                  }
                  className="w-full accent-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-200">Glass Thickness Multiplier</span>
                  <span className="text-indigo-400 font-mono font-semibold">
                    {config.global.thickness.toFixed(2)}x
                  </span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1.8"
                  step="0.05"
                  value={config.global.thickness}
                  onChange={(e) => updateGlobal({ thickness: Number(e.target.value) })}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-200">Bezel Curve Ratio</span>
                  <span className="text-indigo-400 font-mono font-semibold">
                    {Math.round(config.global.bezelRatio * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="0.85"
                  step="0.05"
                  value={config.global.bezelRatio}
                  onChange={(e) => updateGlobal({ bezelRatio: Number(e.target.value) })}
                  className="w-full accent-indigo-500"
                />
              </div>
            </div>

            {/* Buttons and Orbs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-300">Action Button Blur</span>
                  <span className="text-indigo-400 font-mono">{config.global.buttonBlur}px</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="32"
                  value={config.global.buttonBlur}
                  onChange={(e) => updateGlobal({ buttonBlur: Number(e.target.value) })}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-300">Dock Frost</span>
                  <span className="text-indigo-400 font-mono">
                    {Math.round(config.global.dockFrost * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.4"
                  step="0.02"
                  value={config.global.dockFrost}
                  onChange={(e) => updateGlobal({ dockFrost: Number(e.target.value) })}
                  className="w-full accent-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Supabase SQL Setup Helper */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                4. Supabase Database Schema
              </h2>
              <button
                onClick={handleCopySql}
                className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 cursor-pointer font-medium"
              >
                {copiedSql ? (
                  <>
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy SQL
                  </>
                )}
              </button>
            </div>

            <pre className="p-3 rounded-xl bg-slate-950 text-slate-300 text-[10px] font-mono overflow-x-auto max-h-[140px] border border-slate-800 leading-normal">
              {LIQUID_GLASS_TABLE_SQL}
            </pre>

            <a
              href="https://supabase.com/dashboard/project/fgcbzsfcfwzxjoitftmd/sql/new"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              Open Supabase SQL Editor
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Interactive Workbench Preview (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950 flex flex-col max-h-[calc(100vh-64px)] overflow-y-auto">
          {/* Workbench Controls Toolbar */}
          <div className="p-4 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-300">Background Stage:</span>
              <div className="flex items-center bg-slate-800 rounded-lg p-0.5 text-xs">
                <button
                  onClick={() => setWorkbenchBg("vibrant")}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    workbenchBg === "vibrant"
                      ? "bg-blue-600 text-white font-medium"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Vibrant Mesh
                </button>
                <button
                  onClick={() => setWorkbenchBg("dark")}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    workbenchBg === "dark"
                      ? "bg-blue-600 text-white font-medium"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Dark Navy
                </button>
                <button
                  onClick={() => setWorkbenchBg("geometric")}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    workbenchBg === "geometric"
                      ? "bg-blue-600 text-white font-medium"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Typography
                </button>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live GPU Canvas Refraction Active
            </div>
          </div>

          {/* Interactive Playground Canvas */}
          <div
            className={`flex-1 p-8 relative flex flex-col items-center justify-start gap-12 min-h-[750px] overflow-hidden transition-colors duration-500 ${
              workbenchBg === "vibrant"
                ? "bg-gradient-to-br from-[#003884] via-[#0958A7] to-[#1e1b4b]"
                : workbenchBg === "dark"
                ? "bg-slate-950"
                : "bg-slate-900"
            }`}
          >
            {/* Background decorative artwork for testing refraction */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
              <div className="absolute -top-12 -left-12 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl" />
              <div className="absolute top-1/3 -right-20 w-80 h-80 bg-fuchsia-500/25 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />

              {workbenchBg === "geometric" && (
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <span className="text-[160px] font-black text-white leading-none tracking-tighter">
                    WORK WISE
                  </span>
                </div>
              )}
            </div>

            {/* PREVIEW 1: Real-time Navigation Capsule */}
            <div className="w-full max-w-[560px] z-10 flex flex-col items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 bg-black/20 px-2.5 py-1 rounded-full backdrop-blur-sm">
                1. Dynamic Liquid Glass Navbar Capsule
              </span>

              <nav
                onMouseMove={handleNavMouseMove}
                onMouseEnter={() => setIsNavHovered(true)}
                onMouseLeave={() => setIsNavHovered(false)}
                style={
                  {
                    "--mouse-x": `${mousePos.x}%`,
                    "--mouse-y": `${mousePos.y}%`,
                    "--nav-glow-opacity": config.navbar.sheenEnabled
                      ? (isNavHovered ? Math.min(1, config.navbar.sheenIntensity * 1.8) : config.navbar.sheenIntensity)
                      : 0,
                    "--nav-ridge-opacity": config.navbar.ridgeSpecular ? "1" : "0",
                  } as React.CSSProperties
                }
                className="liquid-glass-nav w-full h-[66px] px-3 flex items-center justify-between select-none shadow-2xl transition-all"
              >
                <div className="relative z-10 flex items-center justify-between w-full px-2">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab("Home");
                    }}
                    className={`flex items-center justify-center w-[75px] h-[44px] rounded-[40px] text-xs font-semibold transition-all ${
                      activeTab === "Home"
                        ? "liquid-glass-tab-active text-[#0958A7]"
                        : "text-white/80 hover:text-white"
                    }`}
                  >
                    Home
                  </a>

                  {["Jobs", "How it Works", "About Us", "Contact"].map((tab) => (
                    <a
                      key={tab}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveTab(tab);
                      }}
                      className={`text-xs transition-all ${
                        activeTab === tab
                          ? "liquid-glass-tab-active text-[#0958A7] font-semibold px-3 py-1.5"
                          : "text-white/80 hover:text-white font-medium"
                      }`}
                    >
                      {tab}
                    </a>
                  ))}
                </div>
              </nav>
            </div>

            {/* PREVIEW 2: Circular 3D Dome Glass Orbs (Icons & Toggles) */}
            <div className="w-full max-w-[560px] z-10 flex flex-col items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 bg-black/20 px-2.5 py-1 rounded-full backdrop-blur-sm">
                2. Circular 3D Dome Orbs (Carousel & Buttons)
              </span>

              <div className="flex items-center gap-4">
                <button className="liquid-glass-icon w-12 h-12 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-transform cursor-pointer">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="liquid-glass-icon w-12 h-12 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-transform cursor-pointer">
                  <Briefcase className="w-5 h-5" />
                </button>
                <button className="liquid-glass-icon w-12 h-12 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-transform cursor-pointer">
                  <Search className="w-5 h-5" />
                </button>
                <button className="liquid-glass-icon w-12 h-12 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-transform cursor-pointer">
                  <Sun className="w-5 h-5" />
                </button>
                <button className="liquid-glass-icon w-12 h-12 flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-transform cursor-pointer">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* PREVIEW 3: Video Play Button Lens */}
            <div className="z-10 flex flex-col items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 bg-black/20 px-2.5 py-1 rounded-full backdrop-blur-sm">
                3. Video Hero Play Lens
              </span>

              <div className="liquid-glass-play w-24 h-24 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-105 active:scale-95 transition-transform cursor-pointer">
                <Play className="w-8 h-8 fill-white ml-1" />
              </div>
            </div>

            {/* PREVIEW 4: Floating Liquid Glass Action Dock */}
            <div className="z-10 flex flex-col items-center gap-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 bg-black/20 px-2.5 py-1 rounded-full backdrop-blur-sm">
                4. Floating Action Dock
              </span>

              <div className="dock">
                <div className="dock-item text-white flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="dock-item text-white flex items-center justify-center">
                  <Search className="w-5 h-5" />
                </div>
                <div className="dock-item text-white flex items-center justify-center">
                  <Sun className="w-5 h-5" />
                </div>
                <div className="dock-item text-white flex items-center justify-center">
                  <Moon className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
