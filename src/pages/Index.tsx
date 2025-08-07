import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { PortfolioHero } from '@/components/PortfolioHero';
import { SkillsSection } from '@/components/SkillsSection';
import { ExperienceSection } from '@/components/ExperienceSection';
import { EducationSection } from '@/components/EducationSection';
import { ProjectsSection } from '@/components/ProjectsSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { ContactSection } from '@/components/ContactSection';
import { TwoColumnLayout } from '@/components/TwoColumnLayout';
import { Link } from 'react-router-dom';
import { Settings, User, Menu, X, Home, Briefcase, GraduationCap, Code, MessageSquare, Mail } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/useTheme';

const Index = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [testimonials] = useState<any[]>([]); // Placeholder for now
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Apply user's selected theme
  useTheme(profile);

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const fetchPortfolioData = async () => {
    try {
      // Get the first user's profile (for demo purposes)
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);
      
      const targetProfile = profiles?.[0];
      const userId = targetProfile?.user_id;

      if (targetProfile) {
        setProfile(targetProfile);
        
        // Fetch related data
        const [skillsRes, experiencesRes, educationRes, projectsRes] = await Promise.all([
          supabase.from('skills').select('*').eq('user_id', userId),
          supabase.from('experiences').select('*').eq('user_id', userId).order('start_date', { ascending: false }),
          supabase.from('education').select('*').eq('user_id', userId).order('start_date', { ascending: false }),
          supabase.from('projects').select('*').eq('user_id', userId).order('created_at', { ascending: false })
        ]);

        setSkills(skillsRes.data || []);
        setExperiences(experiencesRes.data || []);
        setEducation(educationRes.data || []);
        setProjects(projectsRes.data || []);
      }
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadResume = async () => {
    if (!profile?.user_id) {
      toast({
        title: "No resume available",
        description: "No resume has been uploaded yet.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase.storage
        .from('portfolios')
        .download(`${profile.user_id}/resume.pdf`);

      if (error) {
        toast({
          title: "Error",
          description: "Resume not found or couldn't be downloaded.",
          variant: "destructive",
        });
        return;
      }

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${profile.full_name || 'Resume'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading resume:', error);
      toast({
        title: "Error",
        description: "Failed to download resume.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading portfolio...</p>
      </div>
    );
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const navItems = [
    { id: 'hero', label: 'Home', icon: Home },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'projects', label: 'Projects', icon: Code },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-primary/20 [box-shadow:var(--shadow-card)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--gradient-primary)] flex items-center justify-center text-primary-foreground font-bold text-lg">
                {profile?.full_name ? profile.full_name.split(' ').map(n => n[0]).join('') : 'P'}
              </div>
              <h1 className="text-xl font-bold bg-[var(--gradient-primary)] bg-clip-text text-transparent">
                {profile?.full_name || 'Portfolio'}
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => scrollToSection(item.id)}
                  className="hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              {!user ? (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/auth">
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/admin">
                    <Settings className="w-4 h-4 mr-2" />
                    Admin
                  </Link>
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <nav className="md:hidden py-4 border-t border-primary/20">
              <div className="grid grid-cols-2 gap-2">
                {navItems.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => scrollToSection(item.id)}
                    className="justify-start hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                ))}
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {profile?.resume_layout === 'two-column' ? (
          <TwoColumnLayout
            profile={profile}
            skills={skills}
            experiences={experiences}
            education={education}
            projects={projects}
            onDownloadResume={handleDownloadResume}
          />
        ) : (
          <>
            <section id="hero">
              <PortfolioHero profile={profile} onDownloadResume={handleDownloadResume} />
            </section>
            
            <section id="skills">
              <SkillsSection skills={skills} />
            </section>
            
            <section id="experience">
              <ExperienceSection experiences={experiences} />
            </section>
            
            <section id="education">
              <EducationSection education={education} />
            </section>
            
            <section id="projects">
              <ProjectsSection projects={projects} />
            </section>
            
            {testimonials.length > 0 && (
              <section id="testimonials">
                <TestimonialsSection testimonials={testimonials} />
              </section>
            )}
            
            <section id="contact">
              <ContactSection profile={profile} />
            </section>
          </>
        )}
      </main>
      
      {/* Enhanced Footer */}
      <footer className="bg-[var(--gradient-section)] py-12 px-4 border-t border-primary/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[var(--gradient-primary)] flex items-center justify-center text-primary-foreground font-bold">
                  {profile?.full_name ? profile.full_name.split(' ').map(n => n[0]).join('') : 'P'}
                </div>
                <span className="text-lg font-bold text-foreground">
                  {profile?.full_name || 'Portfolio'}
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                {profile?.title || 'Professional Portfolio'}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
              <div className="space-y-2 text-sm">
                {navItems.slice(0, 4).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="block text-muted-foreground hover:text-primary transition-colors cursor-pointer mx-auto md:mx-0"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-4">Connect</h4>
              <div className="text-sm text-muted-foreground space-y-2">
                {profile?.email && (
                  <div>Email: <span className="text-primary">{profile.email}</span></div>
                )}
                {profile?.location && (
                  <div>Location: {profile.location}</div>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-primary/20 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 {profile?.full_name || 'Portfolio'}. All rights reserved. Built with passion and precision.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
