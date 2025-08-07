import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Skill {
  id: string;
  name: string;
  level: number;
  category?: string;
}

interface SkillsSectionProps {
  skills: Skill[];
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  if (skills.length === 0) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Skills</h2>
          <p className="text-muted-foreground">No skills added yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4" style={{ 
      backgroundColor: 'var(--skills-bg, var(--card))',
      color: 'var(--skills-text, inherit)'
    }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-[var(--gradient-primary)] bg-clip-text text-transparent mb-4">
            Skills & Expertise
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A comprehensive overview of my technical skills and proficiency levels
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category} className="bg-[var(--gradient-section)] rounded-2xl p-8 border border-primary/20 [box-shadow:var(--shadow-card)]">
              <h3 className="text-2xl font-bold text-primary mb-8 flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                </div>
                {category}
              </h3>
              <div className="space-y-6">
                {categorySkills.map((skill) => (
                  <div key={skill.id} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-foreground">{skill.name}</span>
                      <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="relative">
                      <Progress 
                        value={skill.level} 
                        className="h-3 bg-muted/50"
                      />
                      <div 
                        className="absolute top-0 left-0 h-3 bg-[var(--gradient-primary)] rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}