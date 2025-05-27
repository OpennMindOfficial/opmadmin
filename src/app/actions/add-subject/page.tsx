
// src/app/actions/add-subject/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { MetricsOverview } from '@/components/dashboard/metrics-overview';
import { Button } from '@/components/ui/button';
import { PlusCircle as PageIcon, PlusCircle, Edit2, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from '@/hooks/use-toast';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getSubjectsAction, createSubjectAction } from '@/app/actions/managementActions'; // Assuming actions are here
import type { AddSubjectBaserowRecord } from '@/services/baserowService';

const subjectSchema = z.object({
  Subject: z.string().min(1, "Subject name is required."),
  Topics: z.string().optional(),
  Chapters: z.string().optional(),
  'Topics divided': z.string().optional(), // Baserow field name might need quotes if it has spaces
});
type SubjectFormData = z.infer<typeof subjectSchema>;

export default function AddSubjectPage() {
  const { toast } = useToast();
  const [subjects, setSubjects] = useState<AddSubjectBaserowRecord[]>([]);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorLoadingSubjects, setErrorLoadingSubjects] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
  });

  const fetchSubjects = async () => {
    setIsLoadingSubjects(true);
    setErrorLoadingSubjects(null);
    try {
      const result = await getSubjectsAction();
      if (result.success && result.subjects) {
        setSubjects(result.subjects);
      } else {
        setErrorLoadingSubjects(result.error || "Failed to load subjects.");
        toast({ variant: "destructive", title: "Error", description: result.error });
      }
    } catch (err: any) {
      setErrorLoadingSubjects(err.message || "An unexpected error occurred.");
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setIsLoadingSubjects(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const onSubmit: SubmitHandler<SubjectFormData> = async (data) => {
    setIsSubmitting(true);
    try {
      // Ensure 'Topics divided' key is correct if it has a space
      const payload = {
        Subject: data.Subject,
        Topics: data.Topics,
        Chapters: data.Chapters,
        'Topics divided': data['Topics divided'],
      };
      const result = await createSubjectAction(payload);
      if (result.success && result.subject) {
        toast({ title: "Subject Added", description: `${result.subject.Subject} has been successfully added.` });
        reset();
        fetchSubjects(); // Refresh the list
      } else {
        toast({ variant: "destructive", title: "Error", description: result.error || "Failed to add subject." });
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Submission Error", description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <NewTopNav />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <section className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <PageIcon className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">Add Subject</h1>
            </div>
            <p className="text-lg text-muted-foreground ml-13">
              Introduce new subject areas, their topics, chapters, and how topics are divided.
            </p>
          </div>
        </section>

        <section className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>New Subject Form</CardTitle>
              <CardDescription>Fill in the details to add a new subject to the platform.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="Subject">Subject Name <span className="text-destructive">*</span></Label>
                  <Input id="Subject" {...register('Subject')} disabled={isSubmitting} />
                  {errors.Subject && <p className="text-sm text-destructive mt-1">{errors.Subject.message}</p>}
                </div>
                <div>
                  <Label htmlFor="Topics">Topics (comma-separated or detailed)</Label>
                  <Textarea id="Topics" {...register('Topics')} disabled={isSubmitting} placeholder="e.g., Algebra, Geometry, Calculus OR Introduction to AI, Machine Learning Basics..."/>
                </div>
                <div>
                  <Label htmlFor="Chapters">Chapters (comma-separated or detailed)</Label>
                  <Textarea id="Chapters" {...register('Chapters')} disabled={isSubmitting} placeholder="e.g., Chapter 1: Equations, Chapter 2: Shapes..."/>
                </div>
                <div>
                  <Label htmlFor="Topics divided">Topics Divided (description or structure)</Label>
                  <Textarea id="Topics divided" {...register('Topics divided')} disabled={isSubmitting} placeholder="e.g., Each topic into sub-topics and examples."/>
                </div>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                  Add Subject
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Existing Subjects</h2>
           {isLoadingSubjects ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2">Loading subjects...</p>
            </div>
          ) : errorLoadingSubjects ? (
            <div className="flex flex-col items-center justify-center py-10 text-destructive">
              <AlertTriangle className="h-8 w-8 mb-2" />
              <p className="font-semibold">Error loading subjects</p>
              <p className="text-sm">{errorLoadingSubjects}</p>
              <Button onClick={fetchSubjects} variant="outline" className="mt-4">Try Again</Button>
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Topics</TableHead>
                      <TableHead>Chapters</TableHead>
                      <TableHead>Topics Divided</TableHead>
                      {/* <TableHead className="text-right">Actions</TableHead> */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subjects.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-10">
                          No subjects added yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      subjects.map((subject) => (
                        <TableRow key={subject.id}>
                          <TableCell className="font-medium">{subject.Subject}</TableCell>
                          <TableCell className="text-sm text-muted-foreground truncate max-w-xs">{subject.Topics || 'N/A'}</TableCell>
                          <TableCell className="text-sm text-muted-foreground truncate max-w-xs">{subject.Chapters || 'N/A'}</TableCell>
                          <TableCell className="text-sm text-muted-foreground truncate max-w-xs">{subject['Topics divided'] || 'N/A'}</TableCell>
                          {/* <TableCell className="text-right space-x-1">
                            <Button variant="ghost" size="icon" title="Edit Subject" disabled><Edit2 className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" title="Delete Subject" disabled><Trash2 className="h-4 w-4 text-destructive" /></Button>
                          </TableCell> */}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </section>
        
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Key Metrics</h2>
          <MetricsOverview />
        </section>
      </main>
    </div>
  );
}

    