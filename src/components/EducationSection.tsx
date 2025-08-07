import { Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description?: string;
}

interface EducationSectionProps {
  education: Education[];
}

export function EducationSection({ education }: EducationSectionProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  if (education.length === 0) {
    return (
      <section className="py-16 px-4 bg-muted/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Education</h2>
          <p className="text-muted-foreground">No education added yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-card">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-[var(--gradient-primary)] bg-clip-text text-transparent mb-4">
            Education
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            My academic background and continuous learning journey
          </p>
        </div>
        
        <div className="grid gap-8">
          {education.map((edu) => (
            <Card key={edu.id} className="bg-[var(--gradient-section)] border-primary/20 [box-shadow:var(--shadow-card)] hover:[box-shadow:var(--shadow-large)] transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-primary-foreground"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-foreground">{edu.degree}</h3>
                        {edu.field_of_study && (
                          <p className="text-lg text-muted-foreground font-medium">{edu.field_of_study}</p>
                        )}
                        <p className="text-xl text-primary font-semibold">{edu.institution}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium bg-primary/10 text-primary px-4 py-2 rounded-full whitespace-nowrap">
                    <Calendar className="w-4 h-4" />
                    {formatDate(edu.start_date)} - {edu.is_current ? 'Present' : edu.end_date ? formatDate(edu.end_date) : 'Present'}
                  </div>
                </div>
              </CardHeader>
              {edu.description && (
                <CardContent>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {edu.description}
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}