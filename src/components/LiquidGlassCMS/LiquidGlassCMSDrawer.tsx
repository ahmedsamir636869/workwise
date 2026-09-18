"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  X,
  RotateCcw,
  Cloud,
  Sliders,
  Maximize2,
  Database,
  Layers,
  Copy,
  CheckCheck,
  Eye,
  Sun,
  Palette,
  Compass,
  Zap,
  Split,
  AlertCircle,
} from "lucide-react";
import { useLiquidGlass } from "@/context/LiquidGlassContext";
import { PRESET_OPTIONS } from "@/utils/liquid-glass-presets";
import { PresetKey, GlassSurfaceProfile } from "@/types/liquid-glass";
import { LIQUID_GLASS_TABLE_SQL } from "@/utils/supabase-schema";

export default function LiquidGlassCMSDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"optics" | "lighting" | "material" | "database">("optics");
  const [copiedSql, setCopiedSql] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

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

  return (
    <>
      {/* Floating CMS Launcher Pill (Always visible in bottom-right) */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 select-none">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white backdrop-blur-xl border border-white/20 shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Open Liquid Glass CMS"
        >
          {/* Pulsing indicator */}
          <span className="relative flex h-2.5 w-2.5">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${syncStatus === "synced"
                  ? "bg-emerald-400"
                  : syncStatus === "saving"
                    ? "bg-amber-400"
                    : "bg-blue-400"
                }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${syncStatus === "synced"
                  ? "bg-emerald-500"
                  : syncStatus === "saving"
                    ? "bg-amber-500"
                    : "bg-blue-500"
                }`}
            />
          </span>

          <Sparkles className="w-4 h-4 text-blue-400 group-hover:rotate-12 transition-transform duration-300" />
          <span className="text-xs font-semibold tracking-wide">Liquid Glass CMS</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
            Live
          </span>
        </button>
      </div>

      {/* Slide-out / Modal Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full sm:w-[520px] h-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600/10 dark:bg-blue-500/20 text-[#0958A7] dark:text-blue-400 flex items-center justify-center">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Apple Liquid Glass Studio
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold uppercase tracking-wider">
                      CMS v2
                    </span>
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                    <Cloud className="w-3.5 h-3.5" />
                    <span>Supabase:</span>
                    <span
                      className={`font-semibold ${syncStatus === "synced"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : syncStatus === "saving"
                            ? "text-amber-600"
                            : "text-blue-600 dark:text-blue-400"
                        }`}
                    >
                      {syncStatus === "synced"
                        ? "Connected (fgcbzsfcfwzxjoitftmd)"
                        : syncStatus === "saving"
                          ? "Saving..."
                          : syncStatus === "local-only"
                            ? "Local Storage Cache"
                            : "Ready"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Link
                  href="/admin/liquid-glass"
                  className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  title="Open Fullscreen Studio"
                >
                  <Maximize2 className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  aria-label="Close CMS"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Presets Quick Strip */}
            <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/30">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center justify-between">
                <span>Apple Curated Presets</span>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-normal">
                  {PRESET_OPTIONS.length} Presets Available
                </span>
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {PRESET_OPTIONS.map((preset) => {
                  const isActive = activePreset === preset.key;
                  return (
                    <button
                      key={preset.key}
                      onClick={() => applyPreset(preset.key)}
                      className={`px-2 py-1.5 rounded-lg text-left transition-all text-[11px] font-medium flex items-center gap-1.5 cursor-pointer border ${isActive
                          ? "bg-blue-50 dark:bg-blue-900/40 border-[#0958A7] text-[#0958A7] dark:text-blue-300 shadow-sm font-semibold"
                          : "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600"
                        }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: preset.accentColor }}
                      />
                      <span className="truncate">{preset.name.replace("Apple ", "")}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Mini Refraction Tester Strip */}
            <div className="px-5 py-2.5 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-pink-600/10 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-36 h-8 rounded-full overflow-hidden flex items-center justify-center border border-white/50 shadow-sm">
                  {/* Background high-contrast pattern beneath glass */}
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-600 flex items-center justify-center">
                    <span className="text-[10px] font-black tracking-widest text-white/90 uppercase">
                      REFRACTION
                    </span>
                  </div>
                  {/* Live Glass Lens Pill */}
                  <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{
                      backdropFilter: `blur(${config.navbar.blur / 3}px) saturate(${config.navbar.saturation}%)`,
                      boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.6), inset 0 1px 2px rgba(255,255,255,0.9)`,
                      backgroundColor: `color-mix(in srgb, ${config.navbar.tintColor} ${Math.round(config.navbar.tintOpacity * 100)}%, transparent)`,
                    }}
                  >
                    <span className="text-[9px] font-bold text-white drop-shadow-sm">
                      d={config.navbar.refractionDistance ?? 42}px
                    </span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-300">
                  <span className="font-semibold text-slate-900 dark:text-white">Live Lens:</span> Snell IOR {config.global.refractiveIndex.toFixed(2)}n • Scale {config.navbar.displacementScale}
                </div>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono font-medium">
                Active
              </span>
            </div>

            {/* Navigation Tabs (4 Segmented Tabs) */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 px-5 pt-2">
              <button
                onClick={() => setActiveTab("optics")}
                className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === "optics"
                    ? "border-[#0958A7] text-[#0958A7] dark:text-blue-400"
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
              >
                <Zap className="w-3.5 h-3.5" />
                Optics & Physics
              </button>
              <button
                onClick={() => setActiveTab("lighting")}
                className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === "lighting"
                    ? "border-[#0958A7] text-[#0958A7] dark:text-blue-400"
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
              >
                <Sun className="w-3.5 h-3.5" />
                Lighting & Specular
              </button>
              <button
                onClick={() => setActiveTab("material")}
                className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === "material"
                    ? "border-[#0958A7] text-[#0958A7] dark:text-blue-400"
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
              >
                <Palette className="w-3.5 h-3.5" />
                Material Body
              </button>
              <button
                onClick={() => setActiveTab("database")}
                className={`pb-2 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === "database"
                    ? "border-[#0958A7] text-[#0958A7] dark:text-blue-400"
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
              >
                <Database className="w-3.5 h-3.5" />
                Cloud Sync
              </button>
            </div>

            {/* Tab Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* TAB 1: OPTICS & PHYSICS CONTROLS */}
              {activeTab === "optics" && (
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50/60 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30 flex items-start gap-2.5">
                    <Zap className="w-4 h-4 text-[#0958A7] dark:text-blue-400 mt-0.5 shrink-0" />
                    <div className="text-xs">
                      <div className="font-semibold text-[#0958A7] dark:text-blue-300">
                        Snell's Law Optical Refraction Engine
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Calculates lateral light deflection: Δ = (h + d) • tan(θ₁ - θ₂).
                      </div>
                    </div>
                  </div>

                  {/* 1. Refraction Distance (The primary controller requested!) */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        Refraction Distance (Focal Depth)
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                          Primary
                        </span>
                      </span>
                      <span className="text-blue-600 dark:text-blue-400 font-mono font-bold">
                        {config.navbar.refractionDistance ?? 42} px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="120"
                      step="1"
                      value={config.navbar.refractionDistance ?? 42}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        updateNavbar({ refractionDistance: val });
                        updateGlobal({ refractionDistance: val });
                      }}
                      className="w-full accent-[#0958A7]"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Near / Tight (5px)</span>
                      <span>Balanced (40px)</span>
                      <span>Deep Lens (120px)</span>
                    </div>
                  </div>

                  {/* 2. Displacement Scale */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        Displacement Scale (Refraction Deviation)
                      </span>
                      <span className="text-blue-600 font-semibold font-mono">
                        {config.navbar.displacementScale} scale
                      </span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="85"
                      step="1"
                      value={config.navbar.displacementScale}
                      onChange={(e) =>
                        updateNavbar({ displacementScale: Number(e.target.value) })
                      }
                      className="w-full accent-[#0958A7]"
                    />
                  </div>

                  {/* 3. Surface Curvature Profile */}
                  <div>
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1.5">
                      Lens Curvature Surface Profile
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {(["squircle", "circle", "lip", "concave"] as GlassSurfaceProfile[]).map((prof) => {
                        const isCur = (config.navbar.surfaceProfile || "squircle") === prof;
                        return (
                          <button
                            key={prof}
                            onClick={() => {
                              updateNavbar({ surfaceProfile: prof });
                              updateGlobal({ surfaceProfile: prof });
                            }}
                            className={`py-1.5 px-2 rounded-lg text-xs font-semibold capitalize transition-all border ${isCur
                                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                                : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                              }`}
                          >
                            {prof === "squircle" ? "Squircle (Apple)" : prof}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 4. Index of Refraction (IOR) */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        Index of Refraction (IOR / n)
                      </span>
                      <span className="text-blue-600 font-semibold font-mono">
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
                      className="w-full accent-[#0958A7]"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Water (1.33)</span>
                      <span>Glass (1.52)</span>
                      <span>Flint (1.65)</span>
                      <span>Diamond (2.42)</span>
                    </div>
                  </div>

                  {/* 5. Bezel Width & Glass Thickness */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          Bezel Width
                        </span>
                        <span className="text-blue-600 font-semibold font-mono">
                          {config.navbar.bezelWidth ?? 26}px
                        </span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="50"
                        step="1"
                        value={config.navbar.bezelWidth ?? 26}
                        onChange={(e) =>
                          updateNavbar({ bezelWidth: Number(e.target.value) })
                        }
                        className="w-full accent-[#0958A7]"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          Glass Thickness
                        </span>
                        <span className="text-blue-600 font-semibold font-mono">
                          {config.global.thickness.toFixed(2)}x
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.2"
                        max="2.2"
                        step="0.05"
                        value={config.global.thickness}
                        onChange={(e) =>
                          updateGlobal({ thickness: Number(e.target.value) })
                        }
                        className="w-full accent-[#0958A7]"
                      />
                    </div>
                  </div>

                  {/* 6. Chromatic Aberration / Prism Split */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          <Split className="w-3.5 h-3.5 text-blue-500" />
                          Chromatic Aberration (RGB Dispersion)
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Separates Red, Green, and Blue rays along curved borders
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={config.navbar.chromaticAberration ?? true}
                        onChange={(e) => {
                          updateNavbar({ chromaticAberration: e.target.checked });
                          updateGlobal({ chromaticAberration: e.target.checked });
                        }}
                        className="w-4 h-4 accent-[#0958A7] rounded cursor-pointer"
                      />
                    </div>

                    {(config.navbar.chromaticAberration ?? true) && (
                      <div className="pl-5 pt-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium text-slate-600 dark:text-slate-400">
                            Prismatic RGB Fringe Spread
                          </span>
                          <span className="text-blue-600 font-semibold font-mono">
                            {config.navbar.dispersionSpread ?? 3.5}px
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0.5"
                          max="12"
                          step="0.5"
                          value={config.navbar.dispersionSpread ?? 3.5}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            updateNavbar({ dispersionSpread: val });
                            updateGlobal({ dispersionSpread: val });
                          }}
                          className="w-full accent-[#0958A7]"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: LIGHTING & SPECULAR CONTROLS */}
              {activeTab === "lighting" && (
                <div className="space-y-4">
                  <div className="p-3 bg-amber-50/60 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-900/30 flex items-start gap-2.5">
                    <Sun className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                    <div className="text-xs">
                      <div className="font-semibold text-amber-900 dark:text-amber-300">
                        Directional Lighting & Double-Rim Specular
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Models primary sun light angle, surface hardness, and ground ambient bounce.
                      </div>
                    </div>
                  </div>

                  {/* Specular Light Angle */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                        <Compass className="w-3.5 h-3.5 text-slate-400" />
                        Light Angle Direction
                      </span>
                      <span className="text-amber-600 font-semibold font-mono">
                        {config.navbar.specularAngle ?? -60}°
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-180"
                      max="180"
                      step="5"
                      value={config.navbar.specularAngle ?? -60}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        updateNavbar({ specularAngle: val });
                        updateGlobal({ lightAngle: val });
                      }}
                      className="w-full accent-amber-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Left (-180°)</span>
                      <span>Top-Left (-60°)</span>
                      <span>Top (0°)</span>
                      <span>Right (180°)</span>
                    </div>
                  </div>

                  {/* Specular Intensity & Glossiness Hardness */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          Highlight Opacity
                        </span>
                        <span className="text-amber-600 font-semibold font-mono">
                          {Math.round((config.navbar.specularOpacity ?? 0.5) * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.05"
                        max="1.0"
                        step="0.05"
                        value={config.navbar.specularOpacity ?? 0.5}
                        onChange={(e) =>
                          updateNavbar({ specularOpacity: Number(e.target.value) })
                        }
                        className="w-full accent-amber-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          Glossiness Power
                        </span>
                        <span className="text-amber-600 font-semibold font-mono">
                          {config.navbar.specularHardness ?? 14}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="4"
                        max="32"
                        step="2"
                        value={config.navbar.specularHardness ?? 14}
                        onChange={(e) =>
                          updateNavbar({ specularHardness: Number(e.target.value) })
                        }
                        className="w-full accent-amber-500"
                      />
                    </div>
                  </div>

                  {/* Specular Saturation */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        Apple Specular Color Saturation Boost
                      </span>
                      <span className="text-amber-600 font-semibold font-mono">
                        {config.navbar.specularSaturation ?? 4}x
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="1"
                      value={config.navbar.specularSaturation ?? 4}
                      onChange={(e) =>
                        updateNavbar({ specularSaturation: Number(e.target.value) })
                      }
                      className="w-full accent-amber-500"
                    />
                  </div>

                  {/* Double-Rim Bounce & Top Ridge */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          Top Edge Specular Catch-Light Ridge
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Prismatic catchlight along top squircle rim
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={config.navbar.ridgeSpecular}
                        onChange={(e) => updateNavbar({ ridgeSpecular: e.target.checked })}
                        className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          Bottom Ambient Bounce Rim (Double-Rim)
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Natural secondary bounce reflection from the ground
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={config.navbar.doubleRim ?? true}
                        onChange={(e) => updateNavbar({ doubleRim: e.target.checked })}
                        className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                      />
                    </div>

                    {(config.navbar.doubleRim ?? true) && (
                      <div className="pl-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium text-slate-600 dark:text-slate-400">
                            Bounce Rim Opacity
                          </span>
                          <span className="text-amber-600 font-semibold font-mono">
                            {Math.round((config.navbar.bounceIntensity ?? 0.25) * 100)}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0.05"
                          max="0.6"
                          step="0.05"
                          value={config.navbar.bounceIntensity ?? 0.25}
                          onChange={(e) =>
                            updateNavbar({ bounceIntensity: Number(e.target.value) })
                          }
                          className="w-full accent-amber-500"
                        />
                      </div>
                    )}

                    {/* Cursor Sheen */}
                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          Cursor Radial Sheen Tracking
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Highlights dynamically follow pointer coordinates
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={config.navbar.sheenEnabled}
                        onChange={(e) => updateNavbar({ sheenEnabled: e.target.checked })}
                        className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                      />
                    </div>

                    {config.navbar.sheenEnabled && (
                      <div className="pl-4">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium text-slate-600 dark:text-slate-400">
                            Pointer Sheen Intensity
                          </span>
                          <span className="text-amber-600 font-semibold font-mono">
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
                          className="w-full accent-amber-500"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: MATERIAL & COLOR CONTROLS */}
              {activeTab === "material" && (
                <div className="space-y-4">
                  <div className="p-3 bg-emerald-50/60 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-900/30 flex items-start gap-2.5">
                    <Palette className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                    <div className="text-xs">
                      <div className="font-semibold text-emerald-900 dark:text-emerald-300">
                        Glass Material, Diffusion & Tint
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Controls backdrop diffusion blur, color saturation, and ambient inner bevel shadows.
                      </div>
                    </div>
                  </div>

                  {/* Blur Radius */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        Backdrop Blur Radius
                      </span>
                      <span className="text-emerald-600 font-semibold font-mono">
                        {config.navbar.blur}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="4"
                      max="48"
                      step="1"
                      value={config.navbar.blur}
                      onChange={(e) => updateNavbar({ blur: Number(e.target.value) })}
                      className="w-full accent-emerald-600"
                    />
                  </div>

                  {/* Saturation Boost */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        Backdrop Saturation Boost
                      </span>
                      <span className="text-emerald-600 font-semibold font-mono">
                        {config.navbar.saturation}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="350"
                      step="5"
                      value={config.navbar.saturation}
                      onChange={(e) => updateNavbar({ saturation: Number(e.target.value) })}
                      className="w-full accent-emerald-600"
                    />
                  </div>

                  {/* Glass Tint Color & Opacity */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                        Glass Tint Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={config.navbar.tintColor}
                          onChange={(e) => updateNavbar({ tintColor: e.target.value })}
                          className="w-8 h-8 rounded-lg border border-slate-300 cursor-pointer"
                        />
                        <span className="text-xs font-mono text-slate-600 dark:text-slate-400">
                          {config.navbar.tintColor}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          Tint Opacity
                        </span>
                        <span className="text-emerald-600 font-semibold font-mono">
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
                        className="w-full accent-emerald-600"
                      />
                    </div>
                  </div>

                  {/* Contrast and Brightness Boost */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          Contrast Boost
                        </span>
                        <span className="text-emerald-600 font-semibold font-mono">
                          {config.global.contrastBoost}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="90"
                        max="125"
                        step="1"
                        value={config.global.contrastBoost}
                        onChange={(e) =>
                          updateGlobal({ contrastBoost: Number(e.target.value) })
                        }
                        className="w-full accent-emerald-600"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          Brightness Boost
                        </span>
                        <span className="text-emerald-600 font-semibold font-mono">
                          {config.global.brightnessBoost}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="90"
                        max="125"
                        step="1"
                        value={config.global.brightnessBoost}
                        onChange={(e) =>
                          updateGlobal({ brightnessBoost: Number(e.target.value) })
                        }
                        className="w-full accent-emerald-600"
                      />
                    </div>
                  </div>

                  {/* Inner Bevel Shadow */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        Inner Bevel Shadow Blur
                      </span>
                      <span className="text-emerald-600 font-semibold font-mono">
                        {config.navbar.innerShadowBlur ?? 16}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="4"
                      max="36"
                      step="1"
                      value={config.navbar.innerShadowBlur ?? 16}
                      onChange={(e) =>
                        updateNavbar({ innerShadowBlur: Number(e.target.value) })
                      }
                      className="w-full accent-emerald-600"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: DATABASE & CLOUD SYNC */}
              {activeTab === "database" && (
                <div className="space-y-4">
                  <div className="p-3.5 bg-slate-900 text-white rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                        <Database className="w-4 h-4" />
                        Supabase Project: fgcbzsfcfwzxjoitftmd
                      </div>
                      <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700/50">
                        {syncStatus}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      Liquid Glass settings are synchronized live to Supabase table{" "}
                      <code className="text-amber-300">liquid_glass_settings</code>.
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div className="text-xs text-amber-800 dark:text-amber-300">
                        <div className="font-semibold">Notice:</div>
                        {errorMessage}
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        SQL Schema Setup
                      </span>
                      <button
                        onClick={handleCopySql}
                        className="flex items-center gap-1 text-xs text-[#0958A7] dark:text-blue-400 hover:underline cursor-pointer font-medium"
                      >
                        {copiedSql ? (
                          <>
                            <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
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
                    <pre className="p-3 rounded-lg bg-slate-900 text-slate-200 text-[10px] font-mono overflow-x-auto max-h-[160px] border border-slate-800 leading-normal">
                      {LIQUID_GLASS_TABLE_SQL}
                    </pre>
                  </div>

                  <a
                    href="https://supabase.com/dashboard/project/fgcbzsfcfwzxjoitftmd/sql/new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    Open Supabase SQL Editor
                  </a>
                </div>
              )}
            </div>

            {/* Footer with Actions */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex flex-col gap-2">
              {saveMessage && (
                <div
                  className={`text-xs text-center py-1.5 px-2 rounded-lg font-medium ${saveMessage.includes("Error")
                      ? "bg-rose-50 text-rose-600 border border-rose-200"
                      : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}
                >
                  {saveMessage}
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  onClick={resetDefaults}
                  className="px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Reset to factory settings"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>

                <button
                  onClick={handleSave}
                  disabled={syncStatus === "saving"}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#0958A7] hover:bg-[#074787] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer disabled:opacity-60"
                >
                  <Cloud className="w-4 h-4" />
                  {syncStatus === "saving" ? "Saving..." : "Save to Supabase"}
                </button>
              </div>

              <Link
                href="/admin/liquid-glass"
                className="text-center text-[11px] text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 py-1 transition-colors"
              >
                Switch to Fullscreen Studio →
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
