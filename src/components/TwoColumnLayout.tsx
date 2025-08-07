import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Mail, Phone, Globe, Linkedin, Github, Download, Star } from 'lucide-react';

interface Profile {
  full_name?: string;
  title?: string;
  bio?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  avatar_url?: string;
}

interface Skill {
  id: string;
  name: string;
  level?: number;
  category?: string;
}

interface Experience {
  id: string;
  position: string;
  company: string;
  location?: string;
  start_date: string;
  end_date?: string;
  is_current?: boolean;
  description?: string;
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  field_of_study?: string;
  start_date: string;
  end_date?: string;
  is_current?: boolean;
  description?: string;
}

interface Project {
  id: string;
  title: string;
  description?: string;
  technologies?: string[];
  project_url?: string;
  github_url?: string;
  image_url?: string;
  featured?: boolean;
}

interface TwoColumnLayoutProps {
  profile: Profile | null;
  skills: Skill[];
  experiences: Experience[];
  education: Education[];
  projects: Project[];
  onDownloadResume: () => void;
}

export function TwoColumnLayout({
  profile,
  skills,
  experiences,
  education,
  projects,
  onDownloadResume,
}: TwoColumnLayoutProps) {
  const getInitials = (name?: string) => {
    if (!name) return 'UN';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card className="bg-card/80 backdrop-blur-sm border shadow-xl">
              <CardContent className="p-6 text-center">
                <Avatar className="w-32 h-32 mx-auto mb-4 ring-4 ring-primary/20">
                  <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} />
                  <AvatarFallback className="text-2xl bg-gradient-primary text-primary-foreground">
                    {getInitials(profile?.full_name)}
                  </AvatarFallback>
                </Avatar>
                
                <h1 className="text-2xl font-bold mb-2">{profile?.full_name || 'Your Name'}</h1>
                <p className="text-lg text-primary font-medium mb-4">{profile?.title || 'Your Title'}</p>
                
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                  {profile?.bio || 'Add your professional bio to showcase your expertise and personality.'}
                </p>

                <Button 
                  onClick={onDownloadResume}
                  className="w-full mb-4 bg-gradient-primary hover:opacity-90"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Resume
                </Button>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="bg-card/80 backdrop-blur-sm border shadow-xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-primary">Contact</h3>
                <div className="space-y-3">
                  {profile?.location && (
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile?.email && (
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{profile.email}</span>
                    </div>
                  )}
                  {profile?.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                  {profile?.website && (
                    <div className="flex items-center gap-3 text-sm">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        Website
                      </a>
                    </div>
                  )}
                  {profile?.linkedin && (
                    <div className="flex items-center gap-3 text-sm">
                      <Linkedin className="w-4 h-4 text-muted-foreground" />
                      <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        LinkedIn
                      </a>
                    </div>
                  )}
                  {profile?.github && (
                    <div className="flex items-center gap-3 text-sm">
                      <Github className="w-4 h-4 text-muted-foreground" />
                      <a href={profile.github} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        GitHub
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="bg-card/80 backdrop-blur-sm border shadow-xl">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-primary">Skills</h3>
                <div className="space-y-4">
                  {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                    <div key={category}>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">{category}</h4>
                      <div className="space-y-2">
                        {categorySkills.map((skill) => (
                          <div key={skill.id} className="flex items-center justify-between">
                            <span className="text-sm">{skill.name}</span>
                            {skill.level && (
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < skill.level! ? 'fill-primary text-primary' : 'text-muted-foreground'
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Experience */}
            <Card className="bg-card/80 backdrop-blur-sm border shadow-xl">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-primary">Professional Experience</h2>
                <div className="space-y-6">
                  {experiences.map((exp, index) => (
                    <div key={exp.id} className="relative">
                      {index < experiences.length - 1 && (
                        <div className="absolute left-6 top-8 w-px h-full bg-border" />
                      )}
                      <div className="flex gap-4">
                        <div className="w-3 h-3 bg-primary rounded-full mt-2 relative z-10" />
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                            <h3 className="text-lg font-semibold">{exp.position}</h3>
                            <Badge variant="outline" className="text-xs w-fit">
                              {formatDate(exp.start_date)} - {exp.is_current ? 'Present' : exp.end_date ? formatDate(exp.end_date) : 'Present'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-primary font-medium mb-2">
                            <span>{exp.company}</span>
                            {exp.location && (
                              <>
                                <span>•</span>
                                <span className="text-muted-foreground">{exp.location}</span>
                              </>
                            )}
                          </div>
                          {exp.description && (
                            <p className="text-muted-foreground text-sm leading-relaxed">
                              {exp.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card className="bg-card/80 backdrop-blur-sm border shadow-xl">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-primary">Education</h2>
                <div className="space-y-6">
                  {education.map((edu) => (
                    <div key={edu.id} className="flex gap-4">
                      <div className="w-3 h-3 bg-primary rounded-full mt-2" />
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                          <h3 className="text-lg font-semibold">{edu.degree}</h3>
                          <Badge variant="outline" className="text-xs w-fit">
                            {formatDate(edu.start_date)} - {edu.is_current ? 'Present' : edu.end_date ? formatDate(edu.end_date) : 'Present'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-primary font-medium mb-2">
                          <span>{edu.institution}</span>
                          {edu.field_of_study && (
                            <>
                              <span>•</span>
                              <span className="text-muted-foreground">{edu.field_of_study}</span>
                            </>
                          )}
                        </div>
                        {edu.description && (
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {edu.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Projects */}
            <Card className="bg-card/80 backdrop-blur-sm border shadow-xl">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-primary">Featured Projects</h2>
                <div className="grid gap-6">
                  {projects.map((project) => (
                    <div key={project.id} className="border border-border rounded-lg p-4 hover:shadow-lg transition-shadow">
                      <div className="flex flex-col sm:flex-row gap-4">
                        {project.image_url && (
                          <img
                            src={project.image_url}
                            alt={project.title}
                            className="w-full sm:w-24 h-24 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
                          {project.description && (
                            <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
                              {project.description}
                            </p>
                          )}
                          {project.technologies && project.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {project.technologies.map((tech, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <div className="flex gap-2">
                            {project.project_url && (
                              <Button size="sm" variant="outline" asChild>
                                <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                                  <Globe className="w-3 h-3 mr-1" />
                                  Live Demo
                                </a>
                              </Button>
                            )}
                            {project.github_url && (
                              <Button size="sm" variant="outline" asChild>
                                <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                                  <Github className="w-3 h-3 mr-1" />
                                  Code
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}