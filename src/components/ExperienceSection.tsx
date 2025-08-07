import { Calendar, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface Experience {
  id: string;
  company: string;
  position: string;
  description?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  location?: string;
}

interface ExperienceSectionProps {
  experiences: Experience[];
}

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  if (experiences.length === 0) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Experience</h2>
          <p className="text-muted-foreground">No experience added yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4" style={{ 
      backgroundColor: 'var(--experience-bg, var(--gradient-section))',
      color: 'var(--experience-text, inherit)'
    }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-[var(--gradient-primary)] bg-clip-text text-transparent mb-4">
            Professional Experience
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            My career journey and key achievements in various roles
          </p>
        </div>
        
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-[var(--gradient-primary)] rounded-full hidden md:block"></div>
          
          <div className="space-y-12">
            {experiences.map((experience, index) => (
              <div key={experience.id} className="relative">
                {/* Timeline dot */}
                <div className="absolute left-6 w-5 h-5 bg-primary rounded-full border-4 border-background hidden md:block [box-shadow:var(--shadow-card)]"></div>
                
                <Card className="md:ml-20 bg-card/80 backdrop-blur-sm border-primary/20 [box-shadow:var(--shadow-card)] hover:[box-shadow:var(--shadow-large)] transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-foreground">{experience.position}</h3>
                        <p className="text-xl text-primary font-semibold">{experience.company}</p>
                        {experience.location && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{experience.location}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm font-medium bg-primary/10 text-primary px-4 py-2 rounded-full">
                        <Calendar className="w-4 h-4" />
                        {formatDate(experience.start_date)} - {experience.is_current ? 'Present' : experience.end_date ? formatDate(experience.end_date) : 'Present'}
                      </div>
                    </div>
                  </CardHeader>
                  {experience.description && (
                    <CardContent>
                      <div className="prose prose-gray max-w-none">
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                          {experience.description}
                        </p>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}