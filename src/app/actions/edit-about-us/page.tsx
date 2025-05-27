
// src/app/actions/edit-about-us/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { MetricsOverview } from '@/components/dashboard/metrics-overview';
import { Button } from '@/components/ui/button';
import { FileText as PageIcon, Save, Loader2, AlertTriangle } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getAboutUsContentAction, updateAboutUsContentAction } from '@/app/actions/managementActions';
import type { AboutUsBaserowRecord } from '@/services/baserowService';

const aboutUsSchema = z.object({
  Mission: z.string().min(1, "Mission statement is required."),
  Story: z.string().min(1, "Our Story content is required."),
});
type AboutUsFormData = z.infer<typeof aboutUsSchema>;

// Assuming a single row ID for "About Us" content, e.g., 1, or fetched dynamically
const ABOUT_US_ROW_ID = 1; 

export default function EditAboutUsPage() {
  const { toast } = useToast();
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorLoading, setErrorLoading] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<AboutUsFormData>({
    resolver: zodResolver(aboutUsSchema),
    defaultValues: { Mission: "", Story: "" },
  });

  const fetchContent = async () => {
    setIsLoadingContent(true);
    setErrorLoading(null);
    try {
      const result = await getAboutUsContentAction(ABOUT_US_ROW_ID);
      if (result.success && result.content) {
        setValue('Mission', result.content.Mission || "");
        setValue('Story', result.content.Story || "");
      } else {
        setErrorLoading(result.error || "Failed to load About Us content.");
        toast({ variant: "destructive", title: "Error Loading", description: result.error });
      }
    } catch (err: any) {
      setErrorLoading(err.message || "An unexpected error occurred while loading content.");
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setIsLoadingContent(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [setValue]);

  const onSubmit: SubmitHandler<AboutUsFormData> = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await updateAboutUsContentAction(data, ABOUT_US_ROW_ID);
      if (result.success && result.content) {
        toast({ title: "Content Updated", description: "The About Us page content has been successfully updated." });
        setValue('Mission', result.content.Mission || "");
        setValue('Story', result.content.Story || "");
      } else {
        toast({ variant: "destructive", title: "Update Failed", description: result.error || "Failed to update content." });
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Submission Error", description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingContent) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <NewTopNav />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
           <p className="ml-3 text-lg">Loading About Us content...</p>
        </main>
      </div>
    );
  }

  if (errorLoading) {
     return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <NewTopNav />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center justify-center text-destructive">
            <AlertTriangle className="h-12 w-12 mb-4" />
            <p className="text-xl font-semibold">Failed to load content</p>
            <p className="mb-4">{errorLoading}</p>
            <Button onClick={fetchContent} variant="outline">Try Again</Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <NewTopNav />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <section className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <PageIcon className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">Edit About Us</h1>
            </div>
            <p className="text-lg text-muted-foreground ml-13">
              Update the 'Mission' and 'Story' sections for the platform's About Us page.
            </p>
          </div>
        </section>

        <section className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About Us Content Editor</CardTitle>
              <CardDescription>Modify the mission statement and the company/platform story.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Label htmlFor="Mission">Our Mission <span className="text-destructive">*</span></Label>
                  <Textarea id="Mission" {...register('Mission')} rows={5} disabled={isSubmitting} placeholder="Define the core purpose and mission of OpennMind..." />
                  {errors.Mission && <p className="text-sm text-destructive mt-1">{errors.Mission.message}</p>}
                </div>
                <div>
                  <Label htmlFor="Story">Our Story <span className="text-destructive">*</span></Label>
                  <Textarea id="Story" {...register('Story')} rows={10} disabled={isSubmitting} placeholder="Share the journey, values, and vision behind OpennMind..." />
                  {errors.Story && <p className="text-sm text-destructive mt-1">{errors.Story.message}</p>}
                </div>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>
        
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Key Metrics</h2>
          <MetricsOverview />
        </section>
      </main>
    </div>
  );
}

    