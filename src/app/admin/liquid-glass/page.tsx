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
  Zap,
  Split,
  Compass,
  Palette,
  Eye,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { useLiquidGlass } from "@/context/LiquidGlassContext";
import { PRESET_OPTIONS } from "@/utils/liquid-glass-presets";
import { GlassSurfaceProfile } from "@/types/liquid-glass";
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

  const [activeTab, setActiveTab] = useState("Home");
  const [controlTab, setControlTab] = useState<"optics" | "lighting" | "material" | "database">("optics");
  const [workbenchBg, setWorkbenchBg] = useState<"vibrant" | "dark" | "geometric" | "mesh">("vibrant");
  const [copiedSql, setCopiedSql] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isNavHovered, setIsNavHovered] = useState(false);
  const [switchActive, setSwitchActive] = useState(true);
  const [searchQuery, setSearchQuery] = useState("Senior Frontend Engineer");
  const [isDraggingGlass, setIsDraggingGlass] = useState(false);

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

  // Optical physics calculations for live telemetry display
  const ior = config.global.refractiveIndex;
  const dDist = config.navbar.refractionDistance ?? 42;
  const dispScale = config.navbar.displacementScale;
  const sinMax = 0.85; // incident angle representation
  const sinRef = Math.min(1, sinMax / ior);
  const theta1Deg = Math.round((Math.asin(sinMax) * 180) / Math.PI);
  const theta2Deg = Math.round((Math.asin(sinRef) * 180) / Math.PI);
  const estimatedShiftPx = Math.round((dDist * Math.tan((theta1Deg - theta2Deg) * Math.PI / 180) * (dispScale / 30)));

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
              Apple Liquid Glass Studio
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Snell's Law • VisionOS
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
              className={`w-2 h-2 rounded-full ${syncStatus === "synced"
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
        <div className="lg:col-span-5 border-r border-slate-800 bg-slate-900/50 overflow-y-auto p-6 space-y-6 max-h-[calc(100vh-64px)]">
          {/* Section 1: Presets Selection (All 8 Presets) */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                1. Apple Glass Presets
              </h2>
              <span className="text-[11px] text-blue-400 font-mono">
                {activePreset} active
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_OPTIONS.map((preset) => {
                const isSelected = activePreset === preset.key;
                return (
                  <button
                    key={preset.key}
                    onClick={() => applyPreset(preset.key)}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer relative overflow-hidden ${isSelected
                        ? "bg-blue-950/60 border-blue-500 text-white shadow-md shadow-blue-950/50 ring-1 ring-blue-500/50"
                        : "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850"
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

          {/* Section 2: Segmented Controls Tabs */}
          <div className="pt-2 border-t border-slate-800">
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
              <button
                onClick={() => setControlTab("optics")}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${controlTab === "optics"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                  }`}
              >
                <Zap className="w-3.5 h-3.5" />
                Optics
              </button>
              <button
                onClick={() => setControlTab("lighting")}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${controlTab === "lighting"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                  }`}
              >
                <Sun className="w-3.5 h-3.5" />
                Lighting
              </button>
              <button
                onClick={() => setControlTab("material")}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${controlTab === "material"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                  }`}
              >
                <Palette className="w-3.5 h-3.5" />
                Material
              </button>
              <button
                onClick={() => setControlTab("database")}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${controlTab === "database"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                  }`}
              >
                <Database className="w-3.5 h-3.5" />
                SQL
              </button>
            </div>
          </div>

          {/* TAB 1: OPTICS & PHYSICS */}
          {controlTab === "optics" && (
            <div className="space-y-4">
              {/* Refraction Distance (Focal Depth) */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-blue-900/40 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-blue-300 flex items-center gap-1.5">
                    Refraction Distance (Focal Depth)
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300">
                      Core Snell Parameter
                    </span>
                  </span>
                  <span className="text-blue-400 font-mono font-bold text-sm">
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
                  className="w-full accent-blue-500"
                />
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Controls the apparent separation distance from the glass surface to the background plane underneath. Higher values create deeper lens magnification along curved edges.
                </p>
              </div>

              {/* Displacement Scale */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-300">Displacement Scale</span>
                  <span className="text-blue-400 font-mono font-semibold">
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
                  className="w-full accent-blue-500"
                />
              </div>

              {/* Surface Profile */}
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">
                  Surface Curvature Profile
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
                        className={`py-2 px-2 rounded-lg text-xs font-semibold capitalize transition-all border ${isCur
                            ? "bg-blue-600 text-white border-blue-500 shadow-sm"
                            : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                          }`}
                      >
                        {prof === "squircle" ? "Squircle" : prof}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* IOR Index of Refraction */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-300">Index of Refraction (IOR)</span>
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
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Water (1.33)</span>
                  <span>Glass (1.52)</span>
                  <span>Flint (1.65)</span>
                  <span>Diamond (2.42)</span>
                </div>
              </div>

              {/* Bezel Width & Glass Thickness */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-300">Bezel Width</span>
                    <span className="text-blue-400 font-mono">
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
                    className="w-full accent-blue-500"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-300">Thickness</span>
                    <span className="text-indigo-400 font-mono">
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
                    className="w-full accent-indigo-500"
                  />
                </div>
              </div>

              {/* Chromatic Dispersion */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <Split className="w-3.5 h-3.5 text-blue-400" />
                      Chromatic Dispersion (RGB Split)
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Simulates light wavelength splitting into subtle rainbow edges
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.navbar.chromaticAberration ?? true}
                    onChange={(e) => {
                      updateNavbar({ chromaticAberration: e.target.checked });
                      updateGlobal({ chromaticAberration: e.target.checked });
                    }}
                    className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
                  />
                </div>

                {(config.navbar.chromaticAberration ?? true) && (
                  <div className="pt-2 border-t border-slate-800">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-400">RGB Fringe Spread</span>
                      <span className="text-blue-400 font-mono">
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
                      className="w-full accent-blue-500"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: LIGHTING & SPECULAR */}
          {controlTab === "lighting" && (
            <div className="space-y-4">
              {/* Light Angle */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-200 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-amber-400" />
                    Specular Light Angle
                  </span>
                  <span className="text-amber-400 font-mono font-semibold">
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
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>-180° Left</span>
                  <span>-60° Apple Sunlight</span>
                  <span>+180° Right</span>
                </div>
              </div>

              {/* Specular Highlight Intensity & Glossiness Hardness */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-300">Highlight Opacity</span>
                    <span className="text-amber-400 font-mono">
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

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-300">Glossiness Power</span>
                    <span className="text-amber-400 font-mono">
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
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-200">
                    Specular Highlight Color Saturation
                  </span>
                  <span className="text-amber-400 font-mono font-semibold">
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

              {/* Top Ridge Catch-light & Bottom Double-Rim */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-white">
                      Top Rim Prismatic Catch-Light
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Sharp razor catchlight tracking light along top squircle rim
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.navbar.ridgeSpecular}
                    onChange={(e) => updateNavbar({ ridgeSpecular: e.target.checked })}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <div>
                    <div className="text-xs font-semibold text-white">
                      Bottom Ambient Bounce (Double-Rim)
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Natural secondary ambient bounce light on lower squircle edge
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
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-400">Bounce Rim Intensity</span>
                      <span className="text-amber-400 font-mono">
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
              </div>

              {/* Cursor Sheen */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-white">
                      Cursor Dynamic Specular Tracking
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Light vector rotates to track user pointer position
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
                  <div className="pt-2 border-t border-slate-800">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-400">Sheen Intensity</span>
                      <span className="text-amber-400 font-mono">
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

          {/* TAB 3: MATERIAL & COLOR */}
          {controlTab === "material" && (
            <div className="space-y-4">
              {/* Blur & Saturation */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-300">Backdrop Blur</span>
                    <span className="text-emerald-400 font-mono">{config.navbar.blur}px</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="48"
                    value={config.navbar.blur}
                    onChange={(e) => updateNavbar({ blur: Number(e.target.value) })}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-300">Saturation</span>
                    <span className="text-emerald-400 font-mono">{config.navbar.saturation}%</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="350"
                    step="5"
                    value={config.navbar.saturation}
                    onChange={(e) => updateNavbar({ saturation: Number(e.target.value) })}
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>

              {/* Tint Color & Opacity */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1.5">
                      Glass Tint Color
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
                      <span className="text-emerald-400 font-mono font-semibold">
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
                      className="w-full accent-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Contrast and Brightness */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-300">Contrast</span>
                    <span className="text-emerald-400 font-mono">{config.global.contrastBoost}%</span>
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
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-300">Brightness</span>
                    <span className="text-emerald-400 font-mono">{config.global.brightnessBoost}%</span>
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
                    className="w-full accent-emerald-500"
                  />
                </div>
              </div>

              {/* Inner Bevel Shadow */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-300">Inner Bevel Shadow Blur</span>
                  <span className="text-emerald-400 font-mono">
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
                  className="w-full accent-emerald-500"
                />
              </div>
            </div>
          )}

          {/* TAB 4: SQL SCHEMA */}
          {controlTab === "database" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  Supabase Database Schema
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

              <pre className="p-3 rounded-xl bg-slate-950 text-slate-300 text-[10px] font-mono overflow-x-auto max-h-[220px] border border-slate-800 leading-normal">
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
          )}
        </div>

        {/* RIGHT COLUMN: Live Interactive Workbench Preview (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950 flex flex-col max-h-[calc(100vh-64px)] overflow-y-auto">
          {/* Workbench Controls Toolbar & Telemetry HUD */}
          <div className="p-4 border-b border-slate-800/80 bg-slate-900/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky top-0 z-30 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-300">Stage:</span>
              <div className="flex items-center bg-slate-800 rounded-lg p-0.5 text-xs">
                <button
                  onClick={() => setWorkbenchBg("vibrant")}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${workbenchBg === "vibrant"
                      ? "bg-blue-600 text-white font-medium"
                      : "text-slate-400 hover:text-white"
                    }`}
                >
                  Apple Vibrant
                </button>
                <button
                  onClick={() => setWorkbenchBg("geometric")}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${workbenchBg === "geometric"
                      ? "bg-blue-600 text-white font-medium"
                      : "text-slate-400 hover:text-white"
                    }`}
                >
                  Typography Grid
                </button>
                <button
                  onClick={() => setWorkbenchBg("dark")}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${workbenchBg === "dark"
                      ? "bg-blue-600 text-white font-medium"
                      : "text-slate-400 hover:text-white"
                    }`}
                >
                  Sequoia Dark
                </button>
              </div>
            </div>

            {/* Live Optical Telemetry Badges */}
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-300">
              <span className="px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 border border-blue-800">
                d={dDist}px
              </span>
              <span className="px-2 py-0.5 rounded bg-indigo-900/40 text-indigo-300 border border-indigo-800">
                IOR={ior.toFixed(2)}
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-300 border border-emerald-800">
                Δ≈{estimatedShiftPx}px
              </span>
            </div>
          </div>

          {/* Interactive Playground Canvas */}
          <div
            className={`flex-1 p-8 relative flex flex-col items-center justify-start gap-10 min-h-[800px] overflow-hidden transition-colors duration-500 ${workbenchBg === "vibrant"
                ? "bg-gradient-to-br from-[#003884] via-[#0958A7] to-[#1e1b4b]"
                : workbenchBg === "dark"
                  ? "bg-slate-950"
                  : "bg-slate-900"
              }`}
          >
            {/* Background artwork and typography to test optical refraction */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
              <div className="absolute -top-12 -left-12 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl" />
              <div className="absolute top-1/3 -right-20 w-80 h-80 bg-fuchsia-500/25 rounded-full blur-3xl" />
              <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" />

              {workbenchBg === "geometric" ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-15">
                  <span className="text-[140px] font-black text-white leading-none tracking-tighter">
                    APPLE GLASS
                  </span>
                  <span className="text-3xl font-mono text-blue-300 tracking-widest mt-2">
                    SNELL'S LAW REFRACTION TEST
                  </span>
                </div>
              ) : (
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px]" />
              )}
            </div>

            {/* PREVIEW 1: Real-time Navigation Capsule */}
            <div className="w-full max-w-[560px] z-10 flex flex-col items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/70 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                1. Liquid Glass Navbar Capsule (Squircle Bezel)
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
                className="liquid-glass-nav w-full h-[68px] px-3 flex items-center justify-between select-none shadow-2xl transition-all"
              >
                <div className="relative z-10 flex items-center justify-between w-full px-2">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab("Home");
                    }}
                    className={`flex items-center justify-center w-[75px] h-[46px] rounded-[40px] text-xs font-semibold transition-all ${activeTab === "Home"
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
                      className={`text-xs transition-all ${activeTab === tab
                          ? "liquid-glass-tab-active text-[#0958A7] font-semibold px-3.5 py-1.5"
                          : "text-white/80 hover:text-white font-medium"
                        }`}
                    >
                      {tab}
                    </a>
                  ))}
                </div>
              </nav>
            </div>

            {/* PREVIEW 2: Apple Music / Safari Liquid Glass Searchbox */}
            <div className="w-full max-w-[460px] z-10 flex flex-col items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/70 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                2. Apple Liquid Glass Searchbar Pill
              </span>

              <div className="liquid-glass-nav w-full h-[52px] px-4 flex items-center gap-3 shadow-xl">
                <Search className="w-4 h-4 text-white/70 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search jobs, skills, companies..."
                  className="bg-transparent border-none outline-none text-xs text-white placeholder-white/50 w-full font-medium"
                />
                <span className="text-[10px] font-mono bg-white/20 text-white/90 px-1.5 py-0.5 rounded">
                  ⌘K
                </span>
              </div>
            </div>

            {/* PREVIEW 3: Circular 3D Dome Glass Orbs (Icons & Toggles) */}
            <div className="w-full max-w-[560px] z-10 flex flex-col items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/70 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                3. Circular 3D Dome Orbs (Specular Highlights)
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

            {/* PREVIEW 4: Apple Switch Toggle & Video Play Button */}
            <div className="flex items-center gap-10 z-10">
              {/* Apple Switch */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/70 bg-black/30 px-2.5 py-1 rounded-full backdrop-blur-sm border border-white/10">
                  Lip Switch
                </span>
                <div
                  onClick={() => setSwitchActive(!switchActive)}
                  className={`w-20 h-10 rounded-full p-1 cursor-pointer transition-colors duration-300 flex items-center border border-white/30 ${switchActive ? "bg-emerald-500/80" : "bg-slate-700/80"
                    }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full liquid-glass-icon flex items-center justify-center text-white transition-transform duration-300 shadow-lg ${switchActive ? "translate-x-10" : "translate-x-0"
                      }`}
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-white/90" />
                  </div>
                </div>
              </div>

              {/* Video Hero Play Lens */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/70 bg-black/30 px-2.5 py-1 rounded-full backdrop-blur-sm border border-white/10">
                  Play Lens
                </span>
                <div className="liquid-glass-play w-20 h-20 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-105 active:scale-95 transition-transform cursor-pointer">
                  <Play className="w-7 h-7 fill-white ml-1" />
                </div>
              </div>
            </div>

            {/* PREVIEW 5: Floating Action Dock */}
            <div className="z-10 flex flex-col items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/70 bg-black/30 px-2.5 py-1 rounded-full backdrop-blur-sm border border-white/10">
                5. Floating Liquid Glass Dock
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

            {/* PREVIEW 6: Apple Liquid Glass Capsule (Lucas Romero macOS recreation) */}
            <div className="z-10 flex flex-col items-center gap-3 w-full max-w-[480px]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/70 bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                6. Apple Liquid Glass (Lucas Romero macOS recreation)
              </span>

              <div
                className={`liquid-glass w-full max-w-[380px] select-none ${isDraggingGlass ? "dragging" : ""}`}
                onMouseDown={() => setIsDraggingGlass(true)}
                onMouseUp={() => setIsDraggingGlass(false)}
                onMouseLeave={() => setIsDraggingGlass(false)}
                role="button"
                tabIndex={0}
              >
                Liquid Glass Effect
              </div>
              <span className="text-[11px] text-white/60 font-mono">
                filter: url(#glass-distortion) • backdrop-filter: blur(3px)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
