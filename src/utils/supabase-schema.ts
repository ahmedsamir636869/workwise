export const LIQUID_GLASS_TABLE_SQL = `-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/fgcbzsfcfwzxjoitftmd/sql/new

CREATE TABLE IF NOT EXISTS public.liquid_glass_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Default Configuration',
  preset_key TEXT NOT NULL DEFAULT 'visionos',
  navbar JSONB NOT NULL,
  global JSONB NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.liquid_glass_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active configuration
DROP POLICY IF EXISTS "Allow public read liquid_glass_settings" ON public.liquid_glass_settings;
CREATE POLICY "Allow public read liquid_glass_settings"
  ON public.liquid_glass_settings FOR SELECT
  USING (true);

-- Allow public insert/update for this CMS
DROP POLICY IF EXISTS "Allow public insert liquid_glass_settings" ON public.liquid_glass_settings;
CREATE POLICY "Allow public insert liquid_glass_settings"
  ON public.liquid_glass_settings FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update liquid_glass_settings" ON public.liquid_glass_settings;
CREATE POLICY "Allow public update liquid_glass_settings"
  ON public.liquid_glass_settings FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Insert initial default record if empty
INSERT INTO public.liquid_glass_settings (name, preset_key, navbar, global, is_active)
SELECT 
  'Apple VisionOS (Default)',
  'visionos',
  '{"blur": 22, "frost": 0.1, "saturation": 210, "tintColor": "#ffffff", "tintOpacity": 0.12, "sheenEnabled": true, "ridgeSpecular": true, "doubleRim": true, "bounceIntensity": 0.25, "sheenIntensity": 0.45, "borderDarkColor": "#000000", "borderDarkOpacity": 0.14, "borderLightColor": "#ffffff", "displacementScale": 38, "refractionDistance": 42, "surfaceProfile": "squircle", "bezelWidth": 26, "specularAngle": -60, "specularOpacity": 0.5, "specularHardness": 14, "specularSaturation": 4, "chromaticAberration": true, "dispersionSpread": 3.5, "innerShadowBlur": 16, "innerShadowSpread": 4, "borderLightOpacity": 0.5}'::jsonb,
  '{"bezelRatio": 0.6, "dockBlur": 12, "dockFrost": 0.15, "thickness": 0.85, "refractionDistance": 45, "surfaceProfile": "squircle", "buttonBlur": 14, "contrastBoost": 104, "brightnessBoost": 105, "refractiveIndex": 1.52, "saturationBoost": 2.3, "chromaticAberration": true, "dispersionSpread": 3.5, "lightAngle": -60, "lightElevation": 55, "specularRoughness": 0.2, "specularSaturation": 5}'::jsonb,
  true
WHERE NOT EXISTS (SELECT 1 FROM public.liquid_glass_settings);
`;
