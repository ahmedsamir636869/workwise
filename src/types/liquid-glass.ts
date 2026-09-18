export type GlassSurfaceProfile = "squircle" | "circle" | "lip" | "concave";

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
  doubleRim: boolean; // bottom ambient bounce reflection
  bounceIntensity: number; // 0..1 (e.g. 0.25)
  displacementScale: number; // scale in SVG filter (e.g. 35)
  refractionDistance: number; // optical focal / separation distance (px, e.g. 40)
  surfaceProfile: GlassSurfaceProfile; // Apple squircle vs circle vs lip vs concave
  bezelWidth: number; // bezel border falloff in px (e.g. 26)
  specularAngle: number; // light source angle in degrees (-180..180, e.g. -60)
  specularOpacity: number; // 0..1 highlight intensity (e.g. 0.5)
  specularHardness: number; // 2..32 glossiness power (e.g. 14)
  specularSaturation: number; // 1..10 highlight color saturation multiplier (e.g. 4)
  chromaticAberration: boolean; // toggle RGB dispersion splitting
  dispersionSpread: number; // 0..15 chromatic RGB fringe spread (e.g. 3.5)
  innerShadowBlur: number; // 0..40 inner bevel shadow (e.g. 16)
  innerShadowSpread: number; // 0..20 inner bevel spread (e.g. 4)

  // Liquid Glass Multi-Glass Header Specific Properties
  glassBgTop?: string;
  glassBgBottom?: string;
  glassBorder?: string;
  glassHighlight?: string;
  glassShadow?: string;
  glassBlur?: number;
  glassSat?: number;
  glassBrightness?: number;
  glassTint?: string;
  innerDark?: string;
}

export interface GlobalGlassSettings {
  refractiveIndex: number; // glass IOR (1.0 .. 2.5, e.g. 1.52)
  refractionDistance: number; // global optical ray travel distance (e.g. 45)
  thickness: number; // glass thickness (0.1 .. 2.5, e.g. 0.85)
  bezelRatio: number; // 0.1 .. 0.9 (e.g. 0.6)
  surfaceProfile: GlassSurfaceProfile; // global surface profile
  saturationBoost: number; // e.g. 2.2
  contrastBoost: number; // in % (e.g. 104)
  brightnessBoost: number; // in % (e.g. 105)
  chromaticAberration: boolean; // toggle dispersion
  dispersionSpread: number; // 0..15 chromatic split in px (e.g. 3.5)
  dockBlur: number; // in px (e.g. 10)
  dockFrost: number; // 0..1 (e.g. 0.15)
  buttonBlur: number; // in px (e.g. 14)
  lightAngle: number; // light direction in degrees (-180..180, e.g. -60)
  lightElevation: number; // light elevation 15..85 (e.g. 55)
  specularRoughness: number; // 0.05..0.8 surface roughness (e.g. 0.2)
  specularSaturation: number; // 1..10 specular saturation boost (e.g. 5)
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
  | "clear"
  | "crystal"
  | "frost"
  | "smoke"
  | "prism"
  | "lens"
  | "visionos"
  | "macos-sequoia"
  | "ios-fluid"
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

