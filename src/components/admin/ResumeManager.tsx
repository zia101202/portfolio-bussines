import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Upload, Download, Trash2, FileText } from 'lucide-react';

export function ResumeManager() {
  const { user } = useAuth();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [hasResume, setHasResume] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkExistingResume();
    }
  }, [user]);

  const checkExistingResume = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.storage
        .from('portfolios')
        .list(`${user.id}`, {
          search: 'resume.pdf'
        });

      if (error) {
        console.error('Error checking resume:', error);
        return;
      }

      setHasResume(data && data.length > 0);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: "Error",
          description: "Please select a PDF file.",
          variant: "destructive",
        });
        return;
      }
      setResumeFile(file);
    }
  };

  const handleUpload = async () => {
    if (!user || !resumeFile) return;

    setLoading(true);
    try {
      const fileName = `${user.id}/resume.pdf`;

      const { error: uploadError } = await supabase.storage
        .from('portfolios')
        .upload(fileName, resumeFile, { upsert: true });

      if (uploadError) throw uploadError;

      toast({
        title: "Success",
        description: "Resume uploaded successfully!",
      });
      setResumeFile(null);
      setHasResume(true);
      
      // Reset file input
      const fileInput = document.getElementById('resume') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
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

  const handleDownload = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.storage
        .from('portfolios')
        .download(`${user.id}/resume.pdf`);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!user) return;

    try {
      const { error } = await supabase.storage
        .from('portfolios')
        .remove([`${user.id}/resume.pdf`]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Resume deleted successfully!",
      });
      setHasResume(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Resume Upload
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resume">Select Resume (PDF only)</Label>
            <Input
              id="resume"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
            />
          </div>
          
          {resumeFile && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm">Selected: {resumeFile.name}</p>
              <p className="text-xs text-muted-foreground">
                Size: {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}
          
          <Button 
            onClick={handleUpload} 
            disabled={!resumeFile || loading}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            {loading ? 'Uploading...' : hasResume ? 'Update Resume' : 'Upload Resume'}
          </Button>
        </CardContent>
      </Card>

      {hasResume && (
        <Card>
          <CardHeader>
            <CardTitle>Current Resume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Upload your resume as a PDF file</p>
          <p>• The resume will be available for download on your portfolio</p>
          <p>• You can update or delete your resume at any time</p>
          <p>• Maximum file size: 10MB</p>
        </CardContent>
      </Card>
    </div>
  );
}