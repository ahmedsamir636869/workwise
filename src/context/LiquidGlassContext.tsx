"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  LiquidGlassConfig,
  NavbarGlassSettings,
  GlobalGlassSettings,
  PresetKey,
} from "@/types/liquid-glass";
import { DEFAULT_CONFIG, PRESET_OPTIONS } from "@/utils/liquid-glass-presets";
import { createClient } from "@/utils/supabase/client";

interface LiquidGlassContextType {
  config: LiquidGlassConfig;
  activePreset: string;
  syncStatus: "connecting" | "synced" | "saving" | "local-only" | "error";
  lastSavedAt: string | null;
  errorMessage: string | null;
  updateNavbar: (partial: Partial<NavbarGlassSettings>) => void;
  updateGlobal: (partial: Partial<GlobalGlassSettings>) => void;
  applyPreset: (key: PresetKey) => void;
  saveToSupabase: () => Promise<{ success: boolean; error?: string }>;
  resetDefaults: () => void;
}

const LiquidGlassContext = createContext<LiquidGlassContextType | null>(null);

const STORAGE_KEY = "workwise_liquid_glass_config";

export function LiquidGlassProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<LiquidGlassConfig>(DEFAULT_CONFIG);
  const [syncStatus, setSyncStatus] = useState<"connecting" | "synced" | "saving" | "local-only" | "error">("connecting");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Apply CSS custom properties dynamically to :root
  const applyCssVariables = useCallback((cfg: LiquidGlassConfig) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;

    root.style.setProperty("--c-glass", cfg.navbar.tintColor);
    root.style.setProperty("--c-light", cfg.navbar.borderLightColor);
    root.style.setProperty("--c-dark", cfg.navbar.borderDarkColor);
    root.style.setProperty("--glass-frost", String(cfg.global.dockFrost));
    root.style.setProperty("--glass-saturation", String(cfg.global.saturationBoost));
    root.style.setProperty("--saturation", `${cfg.navbar.saturation}%`);
    root.style.setProperty("--glass-ior", String(cfg.global.refractiveIndex));
    root.style.setProperty("--nav-blur", `${cfg.navbar.blur}px`);
    root.style.setProperty("--nav-tint-opacity", String(cfg.navbar.tintOpacity));
    root.style.setProperty("--nav-sheen-opacity", String(cfg.navbar.sheenIntensity));
    root.style.setProperty("--nav-disp-scale", String(cfg.navbar.displacementScale));
    root.style.setProperty("--dock-blur", `${cfg.global.dockBlur}px`);
    root.style.setProperty("--button-blur", `${cfg.global.buttonBlur}px`);
    root.style.setProperty("--global-contrast", `${cfg.global.contrastBoost}%`);
    root.style.setProperty("--global-brightness", `${cfg.global.brightnessBoost}%`);
  }, []);

  // Sync to localStorage and CSS variables
  const setAndApplyConfig = useCallback((newConfig: LiquidGlassConfig) => {
    setConfig(newConfig);
    applyCssVariables(newConfig);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    } catch {
      // ignore quota errors
    }
  }, [applyCssVariables]);

  // Initial load: check localStorage, then fetch from Supabase
  useEffect(() => {
    // 1. Instant local restore
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        setConfig((prev) => {
          const merged = {
            ...prev,
            ...parsed,
            navbar: { ...prev.navbar, ...(parsed.navbar || {}) },
            global: { ...prev.global, ...(parsed.global || {}) },
          };
          applyCssVariables(merged);
          return merged;
        });
      } else {
        applyCssVariables(DEFAULT_CONFIG);
      }
    } catch (e) {
      console.warn("Could not load cached liquid glass config", e);
    }

    // 2. Query Supabase
    async function loadFromSupabase() {
      try {
        setSyncStatus("connecting");
        const supabase = createClient();
        const { data, error } = await supabase
          .from("liquid_glass_settings")
          .select("*")
          .eq("is_active", true)
          .order("updated_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          // Table doesn't exist yet or connection error
          console.warn("Supabase liquid_glass_settings not available yet:", error.message);
          setSyncStatus("local-only");
          setErrorMessage(error.message);
          return;
        }

        if (data && data.navbar && data.global) {
          const remoteConfig: LiquidGlassConfig = {
            id: data.id,
            name: data.name || "Supabase Cloud Config",
            presetKey: data.preset_key || "custom",
            navbar: { ...DEFAULT_CONFIG.navbar, ...data.navbar },
            global: { ...DEFAULT_CONFIG.global, ...data.global },
            updated_at: data.updated_at,
          };
          setAndApplyConfig(remoteConfig);
          setLastSavedAt(data.updated_at || new Date().toISOString());
          setSyncStatus("synced");
          setErrorMessage(null);
        } else {
          setSyncStatus("synced");
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        console.warn("Supabase initial sync error:", message);
        setSyncStatus("local-only");
        setErrorMessage(message);
      }
    }

    loadFromSupabase();
  }, [applyCssVariables, setAndApplyConfig]);

  const updateNavbar = (partial: Partial<NavbarGlassSettings>) => {
    setAndApplyConfig({
      ...config,
      presetKey: "custom",
      navbar: { ...config.navbar, ...partial },
    });
  };

  const updateGlobal = (partial: Partial<GlobalGlassSettings>) => {
    setAndApplyConfig({
      ...config,
      presetKey: "custom",
      global: { ...config.global, ...partial },
    });
  };

  const applyPreset = (key: PresetKey) => {
    const found = PRESET_OPTIONS.find((p) => p.key === key);
    if (found) {
      setAndApplyConfig({
        ...found.config,
        id: config.id, // preserve existing DB row id if any
      });
    }
  };

  const resetDefaults = () => {
    setAndApplyConfig(DEFAULT_CONFIG);
  };

  const saveToSupabase = async (): Promise<{ success: boolean; error?: string }> => {
    setSyncStatus("saving");
    setErrorMessage(null);

    try {
      const supabase = createClient();
      const payload = {
        name: config.name || "Liquid Glass Custom Setup",
        preset_key: config.presetKey || "custom",
        navbar: config.navbar,
        global: config.global,
        is_active: true,
        updated_at: new Date().toISOString(),
      };

      let resultError: string | null = null;

      if (config.id) {
        const { error } = await supabase
          .from("liquid_glass_settings")
          .update(payload)
          .eq("id", config.id);
        if (error) resultError = error.message;
      } else {
        const { data, error } = await supabase
          .from("liquid_glass_settings")
          .insert([payload])
          .select()
          .single();
        if (error) {
          resultError = error.message;
        } else if (data) {
          setConfig((prev) => ({ ...prev, id: data.id }));
        }
      }

      if (resultError) {
        setSyncStatus("error");
        setErrorMessage(resultError);
        return { success: false, error: resultError };
      }

      const now = new Date().toISOString();
      setLastSavedAt(now);
      setSyncStatus("synced");
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setSyncStatus("error");
      setErrorMessage(message);
      return { success: false, error: message };
    }
  };

  return (
    <LiquidGlassContext.Provider
      value={{
        config,
        activePreset: config.presetKey || "visionos",
        syncStatus,
        lastSavedAt,
        errorMessage,
        updateNavbar,
        updateGlobal,
        applyPreset,
        saveToSupabase,
        resetDefaults,
      }}
    >
      {children}
    </LiquidGlassContext.Provider>
  );
}

export function useLiquidGlass() {
  const context = useContext(LiquidGlassContext);
  if (!context) {
    throw new Error("useLiquidGlass must be used within a LiquidGlassProvider");
  }
  return context;
}
