import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ExternalLink, Github } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description?: string;
  technologies?: string[];
  project_url?: string;
  github_url?: string;
  image_url?: string;
  featured: boolean;
}

interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  if (projects.length === 0) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Projects</h2>
          <p className="text-muted-foreground">No projects added yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4" style={{ 
      backgroundColor: 'var(--projects-bg, var(--gradient-section))',
      color: 'var(--projects-text, inherit)'
    }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-[var(--gradient-primary)] bg-clip-text text-transparent mb-4">
            Featured Projects
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A showcase of my best work and recent projects that demonstrate my skills and expertise
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Card key={project.id} className="group overflow-hidden bg-card/80 backdrop-blur-sm border-primary/20 [box-shadow:var(--shadow-card)] hover:[box-shadow:var(--shadow-large)] transition-all duration-300">
              {project.image_url && (
                <div className="aspect-video bg-muted/50 overflow-hidden">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  {project.featured && (
                    <Badge className="bg-[var(--gradient-primary)] text-primary-foreground border-0 shrink-0">
                      Featured
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {project.description && (
                  <p className="text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                )}
                
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="text-xs border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 transition-colors"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="flex gap-3 pt-2">
                  {project.project_url && (
                    <Button variant="outline" size="sm" asChild className="flex-1 border-primary/30 hover:bg-primary hover:text-primary-foreground transition-colors">
                      <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Live Demo
                      </a>
                    </Button>
                  )}
                  {project.github_url && (
                    <Button variant="outline" size="sm" asChild className="flex-1 border-primary/30 hover:bg-primary hover:text-primary-foreground transition-colors">
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4 mr-2" />
                        Source
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}