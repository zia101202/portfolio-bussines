import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Palette, Wand2 } from 'lucide-react';

interface ThemePreset {
  id: string;
  name: string;
  colors: any;
}

interface ThemeManagerProps {
  profile: any;
  onUpdate: () => void;
}

export function ThemeManager({ profile, onUpdate }: ThemeManagerProps) {
  const { user } = useAuth();
  const [themePresets, setThemePresets] = useState<ThemePreset[]>([]);
  const [selectedTheme, setSelectedTheme] = useState('professional');
  const [selectedLayout, setSelectedLayout] = useState('single-column');
  const [loading, setLoading] = useState(false);
  const [sectionColors, setSectionColors] = useState({
    experience: { background: '', text: '' },
    skills: { background: '', text: '' },
    projects: { background: '', text: '' },
    hero: { background: '', text: '' }
  });

  useEffect(() => {
    fetchThemePresets();
    if (profile) {
      setSelectedTheme(profile.theme_preset || 'professional');
      setSelectedLayout(profile.resume_layout || 'single-column');
      setSectionColors({
        experience: { background: '', text: '' },
        skills: { background: '', text: '' },
        projects: { background: '', text: '' },
        hero: { background: '', text: '' },
        ...(profile.custom_colors || {})
      });
    }
  }, [profile]);

  const fetchThemePresets = async () => {
    try {
      const { data, error } = await supabase
        .from('theme_presets')
        .select('*')
        .order('id');

      if (error) throw error;
      setThemePresets(data || []);
    } catch (error: any) {
      console.error('Error fetching theme presets:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          theme_preset: selectedTheme,
          resume_layout: selectedLayout,
          custom_colors: sectionColors,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      // Apply theme dynamically
      await applyTheme(selectedTheme);
      applySectionColors();

      toast({
        title: "Success",
        description: "Theme and layout preferences saved!",
      });
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyTheme = async (themeId: string) => {
    const theme = themePresets.find(t => t.id === themeId);
    if (!theme) return;

    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([property, value]) => {
      root.style.setProperty(`--${property}`, String(value));
    });
  };

  const applySectionColors = () => {
    const root = document.documentElement;
    Object.entries(sectionColors).forEach(([section, colors]) => {
      if (colors.background) {
        root.style.setProperty(`--${section}-bg`, colors.background);
      }
      if (colors.text) {
        root.style.setProperty(`--${section}-text`, colors.text);
      }
    });
  };

  const previewTheme = (themeId: string) => {
    applyTheme(themeId);
  };

  const updateSectionColor = (section: string, type: 'background' | 'text', color: string) => {
    setSectionColors(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [type]: color
      }
    }));
    
    // Apply immediately for preview
    const root = document.documentElement;
    root.style.setProperty(`--${section}-${type === 'background' ? 'bg' : 'text'}`, color);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Theme Selection
          </CardTitle>
          <CardDescription>
            Choose from stunning predefined themes to customize your portfolio's appearance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="background">Background Color</Label>
            <div className="flex gap-2 flex-wrap">
              {['hsl(0 0% 100%)', 'hsl(210 40% 98%)', 'hsl(220 14.3% 95.9%)', 'hsl(220 13% 91%)', 'hsl(217.2 32.6% 17.5%)', 'hsl(222.2 84% 4.9%)'].map((color) => (
                <div
                  key={color}
                  className={`w-8 h-8 rounded-full border-2 cursor-pointer transition-all ${
                    selectedTheme === 'custom' ? 'border-primary' : 'border-border hover:border-muted-foreground'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    const root = document.documentElement;
                    root.style.setProperty('--background', color);
                  }}
                />
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="theme">Select Theme</Label>
            <Select
              value={selectedTheme}
              onValueChange={(value) => {
                setSelectedTheme(value);
                previewTheme(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a theme" />
              </SelectTrigger>
              <SelectContent>
                {themePresets.map((theme) => (
                  <SelectItem key={theme.id} value={theme.id}>
                    {theme.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {themePresets.map((theme) => (
              <div
                key={theme.id}
                className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedTheme === theme.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-muted-foreground'
                }`}
                onClick={() => {
                  setSelectedTheme(theme.id);
                  previewTheme(theme.id);
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: `hsl(${theme.colors.primary})` }}
                  />
                  <span className="text-sm font-medium">{theme.name}</span>
                </div>
                <div className="flex gap-1">
                  <div
                    className="w-3 h-8 rounded"
                    style={{ backgroundColor: `hsl(${theme.colors.primary})` }}
                  />
                  <div
                    className="w-3 h-8 rounded"
                    style={{ backgroundColor: `hsl(${theme.colors.secondary})` }}
                  />
                  <div
                    className="w-3 h-8 rounded"
                    style={{ backgroundColor: `hsl(${theme.colors.accent})` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5" />
            Resume Layout
          </CardTitle>
          <CardDescription>
            Choose how your portfolio content is displayed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="layout">Layout Style</Label>
            <Select value={selectedLayout} onValueChange={setSelectedLayout}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a layout" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single-column">Single Column</SelectItem>
                <SelectItem value="two-column">Two Column</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedLayout === 'single-column'
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-muted-foreground'
              }`}
              onClick={() => setSelectedLayout('single-column')}
            >
              <div className="text-sm font-medium mb-2">Single Column</div>
              <div className="space-y-1">
                <div className="h-2 bg-muted rounded w-full" />
                <div className="h-2 bg-muted rounded w-3/4" />
                <div className="h-2 bg-muted rounded w-full" />
                <div className="h-2 bg-muted rounded w-2/3" />
              </div>
            </div>

            <div
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedLayout === 'two-column'
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-muted-foreground'
              }`}
              onClick={() => setSelectedLayout('two-column')}
            >
              <div className="text-sm font-medium mb-2">Two Column</div>
              <div className="flex gap-2">
                <div className="flex-1 space-y-1">
                  <div className="h-2 bg-muted rounded w-full" />
                  <div className="h-2 bg-muted rounded w-2/3" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="h-2 bg-muted rounded w-full" />
                  <div className="h-2 bg-muted rounded w-3/4" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Section Color Customization
          </CardTitle>
          <CardDescription>
            Customize background and text colors for specific portfolio sections
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="mb-4 p-2 bg-muted rounded text-xs">
            Debug: sectionColors = {JSON.stringify(sectionColors, null, 2)}
          </div>
          {Object.entries(sectionColors).map(([section, colors]) => (
            <div key={section} className="space-y-4 p-4 border rounded-lg">
              <h4 className="font-semibold text-lg capitalize">{section} Section</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Background Color</Label>
                  <div className="flex gap-2 flex-wrap">
                    {['hsl(0 0% 100%)', 'hsl(0 0% 0%)', 'hsl(0 50% 50%)', 'hsl(120 50% 50%)', 'hsl(240 50% 50%)', 'hsl(60 50% 50%)'].map((color) => (
                      <div
                        key={color}
                        className={`w-8 h-8 rounded-full border-2 cursor-pointer transition-all ${
                          colors.background === color ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-muted-foreground'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => updateSectionColor(section, 'background', color)}
                      />
                    ))}
                  </div>
                  <input
                    type="color"
                    value={colors.background || '#ffffff'}
                    onChange={(e) => updateSectionColor(section, 'background', e.target.value)}
                    className="w-16 h-8 rounded border cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Text Color</Label>
                  <div className="flex gap-2 flex-wrap">
                    {['hsl(0 0% 0%)', 'hsl(0 0% 100%)', 'hsl(0 50% 50%)', 'hsl(120 50% 50%)', 'hsl(240 50% 50%)', 'hsl(60 50% 50%)'].map((color) => (
                      <div
                        key={color}
                        className={`w-8 h-8 rounded-full border-2 cursor-pointer transition-all ${
                          colors.text === color ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-muted-foreground'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => updateSectionColor(section, 'text', color)}
                      />
                    ))}
                  </div>
                  <input
                    type="color"
                    value={colors.text || '#000000'}
                    onChange={(e) => updateSectionColor(section, 'text', e.target.value)}
                    className="w-16 h-8 rounded border cursor-pointer"
                  />
                </div>
              </div>

              {(colors.background || colors.text) && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      updateSectionColor(section, 'background', '');
                      updateSectionColor(section, 'text', '');
                    }}
                  >
                    Reset Colors
                  </Button>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={loading} className="w-full">
        {loading ? 'Saving...' : 'Save Theme & Layout'}
      </Button>
    </div>
  );
}