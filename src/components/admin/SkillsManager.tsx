import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Plus, Trash2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

export function SkillsManager() {
  const { user } = useAuth();
  const [skills, setSkills] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    level: 50,
    category: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSkills();
    }
  }, [user]);

  const fetchSkills = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('user_id', user.id)
        .order('category', { ascending: true });

      if (error) throw error;
      setSkills(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.name.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('skills')
        .insert({
          user_id: user.id,
          name: formData.name,
          level: formData.level,
          category: formData.category || 'Other',
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Skill added successfully!",
      });
      setFormData({ name: '', level: 50, category: '' });
      fetchSkills();
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

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Skill deleted successfully!",
      });
      fetchSkills();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const categories = ['Frontend', 'Backend', 'Database', 'DevOps', 'Mobile', 'Design', 'Other'];

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
        <h3 className="text-lg font-semibold">Add New Skill</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="skill-name">Skill Name</Label>
            <Input
              id="skill-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., React, Python, etc."
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="skill-category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="skill-level">Proficiency Level: {formData.level}%</Label>
            <Slider
              id="skill-level"
              min={1}
              max={100}
              step={1}
              value={[formData.level]}
              onValueChange={(value) => setFormData({ ...formData, level: value[0] })}
              className="mt-2"
            />
          </div>
        </div>
        
        <Button type="submit" disabled={loading}>
          <Plus className="w-4 h-4 mr-2" />
          {loading ? 'Adding...' : 'Add Skill'}
        </Button>
      </form>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Current Skills</h3>
        {skills.length === 0 ? (
          <p className="text-muted-foreground">No skills added yet.</p>
        ) : (
          <div className="grid gap-4">
            {skills.map((skill) => (
              <div key={skill.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3 flex-1">
                  <span className="font-medium">{skill.name}</span>
                  <Badge variant="outline">{skill.category}</Badge>
                  <span className="text-sm text-muted-foreground">{skill.level}%</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(skill.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}