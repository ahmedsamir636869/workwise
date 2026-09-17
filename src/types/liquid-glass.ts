export interface NavbarGlassSettings {
  blur: number; // in px (e.g. 20)
  saturation: number; // in % (e.g. 200)
  frost: number; // 0..1 (e.g. 0.10)
  tintColor: string; // hex color (e.g. "#ffffff")
  tintOpacity: number; // 0..1 (e.g. 0.10)
  borderLightColor: string; // hex color (e.g. "#ffffff")
  borderLightOpacity: number; // 0..1 (e.g. 0.40)
  borderDarkColor: string; // hex color (e.g. "#000000")
  borderDarkOpacity: number; // 0..1 (e.g. 0.16)
  sheenEnabled: boolean; // dynamic cursor specular sheen
  sheenIntensity: number; // 0..1 (e.g. 0.45)
  ridgeSpecular: boolean; // top edge catch-light
  displacementScale: number; // scale in SVG filter (e.g. 30)
}

export interface GlobalGlassSettings {
  refractiveIndex: number; // glass IOR (1.0 .. 2.5, e.g. 1.5)
  thickness: number; // glass thickness (0.1 .. 2.0, e.g. 0.8)
  bezelRatio: number; // 0.1 .. 0.9 (e.g. 0.6)
  saturationBoost: number; // e.g. 2.2
  contrastBoost: number; // in % (e.g. 104)
  brightnessBoost: number; // in % (e.g. 105)
  chromaticAberration: boolean; // toggle dispersion
  dockBlur: number; // in px (e.g. 10)
  dockFrost: number; // 0..1 (e.g. 0.15)
  buttonBlur: number; // in px (e.g. 14)
}

export interface LiquidGlassConfig {
  id?: string;
  name: string;
  presetKey?: string;
  navbar: NavbarGlassSettings;
  global: GlobalGlassSettings;
  updated_at?: string;
}

export type PresetKey =
  | "visionos"
  | "pure-crystal"
  | "frosted-ice"
  | "cyber-neon"
  | "midnight-obsidian"
  | "workwise-signature";

export interface PresetOption {
  key: PresetKey;
  name: string;
  description: string;
  accentColor: string;
  config: LiquidGlassConfig;
}
