"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  X,
  RotateCcw,
  Cloud,
  Check,
  AlertCircle,
  Sliders,
  Maximize2,
  Database,
  Layers,
  Copy,
  CheckCheck,
  Eye,
} from "lucide-react";
import { useLiquidGlass } from "@/context/LiquidGlassContext";
import { PRESET_OPTIONS } from "@/utils/liquid-glass-presets";
import { PresetKey } from "@/types/liquid-glass";
import { LIQUID_GLASS_TABLE_SQL } from "@/utils/supabase-schema";

export default function LiquidGlassCMSDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"navbar" | "global" | "database">("navbar");
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
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                syncStatus === "synced"
                  ? "bg-emerald-400"
                  : syncStatus === "saving"
                  ? "bg-amber-400"
                  : "bg-blue-400"
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                syncStatus === "synced"
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
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full sm:w-[480px] h-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in slide-in-from-right duration-300"
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
                    Liquid Glass Studio
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-medium">
                      CMS
                    </span>
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                    <Cloud className="w-3.5 h-3.5" />
                    <span>Supabase:</span>
                    <span
                      className={`font-semibold ${
                        syncStatus === "synced"
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
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 block">
                Quick Presets
              </label>
              <div className="grid grid-cols-3 gap-2">
                {PRESET_OPTIONS.map((preset) => {
                  const isActive = activePreset === preset.key;
                  return (
                    <button
                      key={preset.key}
                      onClick={() => applyPreset(preset.key)}
                      className={`px-2.5 py-1.5 rounded-lg text-left transition-all text-xs font-medium flex items-center gap-1.5 cursor-pointer border ${
                        isActive
                          ? "bg-blue-50 dark:bg-blue-900/40 border-[#0958A7] text-[#0958A7] dark:text-blue-300 shadow-sm"
                          : "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600"
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: preset.accentColor }}
                      />
                      <span className="truncate">{preset.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 px-5 pt-2">
              <button
                onClick={() => setActiveTab("navbar")}
                className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                  activeTab === "navbar"
                    ? "border-[#0958A7] text-[#0958A7] dark:text-blue-400"
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                Navbar Glass
              </button>
              <button
                onClick={() => setActiveTab("global")}
                className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                  activeTab === "global"
                    ? "border-[#0958A7] text-[#0958A7] dark:text-blue-400"
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                Website & Optics
              </button>
              <button
                onClick={() => setActiveTab("database")}
                className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                  activeTab === "database"
                    ? "border-[#0958A7] text-[#0958A7] dark:text-blue-400"
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                Supabase & SQL
              </button>
            </div>

            {/* Tab Content (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* TAB 1: NAVBAR CONTROLS */}
              {activeTab === "navbar" && (
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-[#0958A7] dark:text-blue-300">
                        Live Navbar Refraction
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        Changes apply directly to the top navbar in real time.
                      </div>
                    </div>
                    <Eye className="w-4 h-4 text-blue-500" />
                  </div>

                  {/* Refraction Displacement Scale */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        Refraction Displacement (Snell's Law)
                      </span>
                      <span className="text-blue-600 font-semibold">
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
                      className="w-full accent-[#0958A7]"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Subtle (5)</span>
                      <span>Heavy distortion (60)</span>
                    </div>
                  </div>

                  {/* Blur */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        Backdrop Blur
                      </span>
                      <span className="text-blue-600 font-semibold">{config.navbar.blur}px</span>
                    </div>
                    <input
                      type="range"
                      min="4"
                      max="48"
                      step="1"
                      value={config.navbar.blur}
                      onChange={(e) => updateNavbar({ blur: Number(e.target.value) })}
                      className="w-full accent-[#0958A7]"
                    />
                  </div>

                  {/* Saturation */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        Color Saturation Boost
                      </span>
                      <span className="text-blue-600 font-semibold">
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
                      className="w-full accent-[#0958A7]"
                    />
                  </div>

                  {/* Glass Tint Color & Opacity */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                        Glass Tint
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
                        <span className="text-blue-600 font-semibold">
                          {Math.round(config.navbar.tintOpacity * 100)}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.02"
                        max="0.4"
                        step="0.01"
                        value={config.navbar.tintOpacity}
                        onChange={(e) =>
                          updateNavbar({ tintOpacity: Number(e.target.value) })
                        }
                        className="w-full accent-[#0958A7]"
                      />
                    </div>
                  </div>

                  {/* Sheen specular tracking */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          Cursor Dynamic Specular Sheen
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Radial light reflection tracks pointer position
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={config.navbar.sheenEnabled}
                        onChange={(e) => updateNavbar({ sheenEnabled: e.target.checked })}
                        className="w-4 h-4 accent-[#0958A7] rounded cursor-pointer"
                      />
                    </div>

                    {config.navbar.sheenEnabled && (
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium text-slate-600 dark:text-slate-400">
                            Sheen Intensity
                          </span>
                          <span className="text-blue-600 font-semibold">
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
                          className="w-full accent-[#0958A7]"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          Top Edge Specular Ridge
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Prismatic catch-light on top bevel rim
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={config.navbar.ridgeSpecular}
                        onChange={(e) => updateNavbar({ ridgeSpecular: e.target.checked })}
                        className="w-4 h-4 accent-[#0958A7] rounded cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: GLOBAL & ALL WEBSITE OPTICS */}
              {activeTab === "global" && (
                <div className="space-y-4">
                  <div className="p-3 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                    <div className="text-xs font-semibold text-indigo-900 dark:text-indigo-300">
                      Physics Engine (Snell's Law & Apple Squircle)
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Controls how light bends through all liquid glass elements (Play buttons, carousel arrows, service icons, footer icons).
                    </div>
                  </div>

                  {/* Refractive Index */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        Index of Refraction (IOR)
                      </span>
                      <span className="text-indigo-600 font-semibold">
                        {config.global.refractiveIndex.toFixed(2)} n
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1.1"
                      max="2.2"
                      step="0.02"
                      value={config.global.refractiveIndex}
                      onChange={(e) =>
                        updateGlobal({ refractiveIndex: Number(e.target.value) })
                      }
                      className="w-full accent-indigo-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Water (1.33)</span>
                      <span>Glass (1.50)</span>
                      <span>Diamond (2.20)</span>
                    </div>
                  </div>

                  {/* Glass Thickness */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        Glass Thickness Multiplier
                      </span>
                      <span className="text-indigo-600 font-semibold">
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
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  {/* Bezel Ratio */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        Bezel Curvature Ratio
                      </span>
                      <span className="text-indigo-600 font-semibold">
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
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  {/* Button & Orb Blur */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        Buttons & Orb Glass Blur
                      </span>
                      <span className="text-indigo-600 font-semibold">
                        {config.global.buttonBlur}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="6"
                      max="32"
                      step="1"
                      value={config.global.buttonBlur}
                      onChange={(e) => updateGlobal({ buttonBlur: Number(e.target.value) })}
                      className="w-full accent-indigo-600"
                    />
                  </div>

                  {/* Dock Frost */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        Floating Dock Frost
                      </span>
                      <span className="text-indigo-600 font-semibold">
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
                      className="w-full accent-indigo-600"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: SUPABASE & SQL */}
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
                      Liquid Glass settings are loaded on startup and synchronized to Supabase
                      table <code className="text-amber-300">liquid_glass_settings</code>.
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div className="text-xs text-amber-800 dark:text-amber-300">
                        <div className="font-semibold">Notice:</div>
                        {errorMessage.includes("does not exist")
                          ? "Table 'liquid_glass_settings' is not created in Supabase yet. Run the SQL schema below in your Supabase dashboard to enable cloud sync."
                          : errorMessage}
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
                  className={`text-xs text-center py-1.5 px-2 rounded-lg font-medium ${
                    saveMessage.includes("Error")
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
