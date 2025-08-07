import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useTheme(profile: any) {
  useEffect(() => {
    const applyTheme = async () => {
      if (!profile?.theme_preset) return;

      try {
        const { data: theme } = await supabase
          .from('theme_presets')
          .select('colors')
          .eq('id', profile.theme_preset)
          .single();

        if (theme?.colors) {
          const root = document.documentElement;
          Object.entries(theme.colors).forEach(([property, value]) => {
            root.style.setProperty(`--${property}`, String(value));
          });
        }

        // Apply custom section colors if they exist
        if (profile.custom_colors) {
          const root = document.documentElement;
          Object.entries(profile.custom_colors).forEach(([section, colors]: [string, any]) => {
            if (colors.background) {
              root.style.setProperty(`--${section}-bg`, colors.background);
            }
            if (colors.text) {
              root.style.setProperty(`--${section}-text`, colors.text);
            }
          });
        }
      } catch (error) {
        console.error('Error applying theme:', error);
      }
    };

    applyTheme();
  }, [profile?.theme_preset, profile?.custom_colors]);
}