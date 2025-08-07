-- Add theme and layout preferences to profiles table
ALTER TABLE public.profiles 
ADD COLUMN theme_preset TEXT DEFAULT 'professional',
ADD COLUMN resume_layout TEXT DEFAULT 'single-column',
ADD COLUMN custom_colors JSONB DEFAULT '{}';

-- Create a table for theme presets
CREATE TABLE public.theme_presets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  colors JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert predefined stunning theme presets
INSERT INTO public.theme_presets (id, name, colors) VALUES
('professional', 'Professional Blue', '{
  "primary": "216 100% 50%",
  "primary-foreground": "0 0% 100%",
  "secondary": "216 50% 95%", 
  "accent": "216 60% 90%",
  "gradient-primary": "linear-gradient(135deg, hsl(216 100% 50%), hsl(216 100% 60%))"
}'),
('elegant', 'Elegant Purple', '{
  "primary": "262 80% 50%",
  "primary-foreground": "0 0% 100%",
  "secondary": "262 30% 95%",
  "accent": "262 40% 90%", 
  "gradient-primary": "linear-gradient(135deg, hsl(262 80% 50%), hsl(262 80% 60%))"
}'),
('modern', 'Modern Green', '{
  "primary": "142 70% 45%",
  "primary-foreground": "0 0% 100%",
  "secondary": "142 30% 95%",
  "accent": "142 40% 90%",
  "gradient-primary": "linear-gradient(135deg, hsl(142 70% 45%), hsl(142 70% 55%))"
}'),
('creative', 'Creative Orange', '{
  "primary": "25 95% 53%",
  "primary-foreground": "0 0% 100%",
  "secondary": "25 40% 95%",
  "accent": "25 50% 90%",
  "gradient-primary": "linear-gradient(135deg, hsl(25 95% 53%), hsl(25 95% 63%))"
}'),
('minimal', 'Minimal Gray', '{
  "primary": "0 0% 20%",
  "primary-foreground": "0 0% 100%",
  "secondary": "0 0% 95%",
  "accent": "0 0% 90%",
  "gradient-primary": "linear-gradient(135deg, hsl(0 0% 20%), hsl(0 0% 30%))"
}'),
('vibrant', 'Vibrant Pink', '{
  "primary": "326 78% 56%",
  "primary-foreground": "0 0% 100%",
  "secondary": "326 30% 95%",
  "accent": "326 40% 90%",
  "gradient-primary": "linear-gradient(135deg, hsl(326 78% 56%), hsl(326 78% 66%))"
}');

-- Enable RLS for theme presets (read-only for everyone)
ALTER TABLE public.theme_presets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Theme presets are viewable by everyone" 
ON public.theme_presets 
FOR SELECT 
USING (true);