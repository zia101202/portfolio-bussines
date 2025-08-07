import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Mail, Phone, Globe, Github, Linkedin, Download } from 'lucide-react';

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

interface PortfolioHeroProps {
  profile?: Profile;
  onDownloadResume: () => void;
}

export function PortfolioHero({ profile, onDownloadResume }: PortfolioHeroProps) {
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20" style={{ 
      backgroundColor: 'var(--hero-bg, var(--gradient-hero))',
      color: 'var(--hero-text, inherit)'
    }}>
      <div className="max-w-6xl mx-auto">
        <div className="bg-card rounded-2xl [box-shadow:var(--shadow-elegant)] p-8 md:p-12">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 mb-12">
            <div className="flex-shrink-0">
              <Avatar className="w-40 h-40 border-4 border-primary/20 [box-shadow:var(--shadow-card)]">
                <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} className="object-cover" />
                <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                  {getInitials(profile?.full_name)}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-5xl md:text-7xl font-bold bg-[var(--gradient-primary)] bg-clip-text text-transparent mb-4">
                {profile?.full_name || 'Your Name'}
              </h1>
              
              <h2 className="text-2xl md:text-3xl text-primary font-semibold mb-6">
                {profile?.title || 'Your Professional Title'}
              </h2>
              
              <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-3xl">
                {profile?.bio || 'Your professional bio and overview of your expertise and experience. This is where you showcase your unique value proposition and what makes you stand out in your field.'}
              </p>
              
              {/* Contact Info */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-8">
                {profile?.location && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium">{profile.location}</span>
                  </div>
                )}
                {profile?.email && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium">{profile.email}</span>
                  </div>
                )}
                {profile?.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Phone className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-medium">{profile.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
            <Button onClick={onDownloadResume} size="lg" className="bg-[var(--gradient-primary)] hover:opacity-90 transition-opacity">
              <Download className="w-5 h-5 mr-2" />
              Download Resume
            </Button>
            
            {profile?.website && (
              <Button variant="outline" size="lg" asChild className="border-2 hover:bg-primary hover:text-primary-foreground transition-colors">
                <a href={profile.website} target="_blank" rel="noopener noreferrer">
                  <Globe className="w-5 h-5 mr-2" />
                  Visit Website
                </a>
              </Button>
            )}
          </div>
          
          {/* Social Links */}
          <div className="flex justify-center lg:justify-start gap-4">
            {profile?.linkedin && (
              <Button variant="ghost" size="sm" asChild className="hover:bg-primary/10 hover:text-primary">
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-5 h-5 mr-2" />
                  LinkedIn
                </a>
              </Button>
            )}
            {profile?.github && (
              <Button variant="ghost" size="sm" asChild className="hover:bg-primary/10 hover:text-primary">
                <a href={profile.github} target="_blank" rel="noopener noreferrer">
                  <Github className="w-5 h-5 mr-2" />
                  GitHub
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}