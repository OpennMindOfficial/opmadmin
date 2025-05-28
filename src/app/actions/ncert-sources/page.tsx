
// src/app/actions/ncert-sources/page.tsx
"use client";

import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Library as PageIcon, PlusCircle, Loader2, AlertTriangle, ExternalLink } from 'lucide-react';
import { getNcertSourcesAction, addNcertSourceAction } from '@/app/actions/ncertActions'; 
import type { NcertSourceRecord } from '@/services/baserowService';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const ncertSourceSchema = z.object({
  Subject: z.string().min(1, "Subject is required."),
  Chapter: z.string().min(1, "Chapter is required."),
  Book: z.string().min(1, "Book name/identifier is required."),
  Audio: z.string().url("Must be a valid URL for the audio file (e.g., .mp3).").optional().or(z.literal('')),
});
type NcertSourceFormData = z.infer<typeof ncertSourceSchema>;


export default function NcertSourcesPage() {
  const { toast } = useToast();
  const [sources, setSources] = useState<NcertSourceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit: handleFormSubmit, reset, formState: { errors } } = useForm<NcertSourceFormData>({
    resolver: zodResolver(ncertSourceSchema),
  });

  const fetchSources = async () => {
    setIsLoading(true); setError(null);
    try {
      const result = await getNcertSourcesAction();
      if (result.success && result.sources) {
        setSources(result.sources.sort((a,b) => b.id - a.id)); // Sort by newest
      } else { 
        setError(result.error || "Failed to load NCERT sources."); 
        toast({ variant: "destructive", title: "Error", description: result.error || "Failed to load sources." });
      }
    } catch (err: any) { 
      setError(err.message || "An unexpected error occurred."); 
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally { 
      setIsLoading(false); 
    }
  };

  useEffect(() => { fetchSources(); }, []);

  const onSubmit: SubmitHandler<NcertSourceFormData> = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await addNcertSourceAction(data);
      if (result.success) {
        toast({ title: "NCERT Source Added", description: "New source added successfully." });
        reset();
        fetchSources();
      } else { 
        toast({ variant: "destructive", title: "Error", description: result.error || "Failed to add source." }); 
      }
    } catch (e: any) { 
      toast({ variant: "destructive", title: "Error", description: e.message });
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
              <h1 className="text-4xl font-bold tracking-tight">NCERT Sources</h1>
            </div>
            <p className="text-lg text-muted-foreground ml-13">
              Manage and reference NCERT educational materials, including audio resources. (Table ID: 552910)
            </p>
          </div>
        </section>

        <section className="space-y-6">
           <Card>
            <CardHeader>
              <CardTitle>Add NCERT Source</CardTitle>
              <CardDescription>Form for adding NCERT sources (Subject, Chapter, Book, Audio URL).</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFormSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="Subject">Subject <span className="text-destructive">*</span></Label>
                  <Input id="Subject" {...register('Subject')} disabled={isSubmitting} />
                  {errors.Subject && <p className="text-sm text-destructive mt-1">{errors.Subject.message}</p>}
                </div>
                <div>
                  <Label htmlFor="Chapter">Chapter <span className="text-destructive">*</span></Label>
                  <Input id="Chapter" {...register('Chapter')} disabled={isSubmitting} />
                  {errors.Chapter && <p className="text-sm text-destructive mt-1">{errors.Chapter.message}</p>}
                </div>
                 <div>
                  <Label htmlFor="Book">Book Name/Identifier <span className="text-destructive">*</span></Label>
                  <Input id="Book" {...register('Book')} disabled={isSubmitting} />
                  {errors.Book && <p className="text-sm text-destructive mt-1">{errors.Book.message}</p>}
                </div>
                <div>
                  <Label htmlFor="Audio">Audio File URL (.mp3)</Label>
                  <Input id="Audio" type="url" {...register('Audio')} placeholder="https://example.com/audio.mp3" disabled={isSubmitting}/>
                  {errors.Audio && <p className="text-sm text-destructive mt-1">{errors.Audio.message}</p>}
                </div>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                  Add Source
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Existing NCERT Sources (Latest 20)</h2>
           {isLoading ? (
            <div className="flex items-center justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /><p className="ml-2">Loading sources...</p></div>
          ) : error ? (
            <div className="text-destructive text-center py-10"><AlertTriangle className="h-8 w-8 mx-auto mb-2" /><p>{error}</p></div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead>Chapter</TableHead>
                        <TableHead>Book</TableHead>
                        <TableHead>Audio</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sources.slice(0,20).length === 0 ? (
                        <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-10">No NCERT sources added yet.</TableCell></TableRow>
                        ) : (
                        sources.slice(0,20).map((source) => (
                            <TableRow key={source.id}>
                            <TableCell>{source.Subject}</TableCell>
                            <TableCell>{source.Chapter}</TableCell>
                            <TableCell>{source.Book}</TableCell>
                            <TableCell>
                                {source.Audio ? (
                                <a href={source.Audio} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center text-sm">
                                    Listen <ExternalLink className="ml-1 h-3 w-3" />
                                </a>
                                ) : (
                                <span className="text-sm text-muted-foreground">N/A</span>
                                )}
                            </TableCell>
                            </TableRow>
                        ))
                        )}
                    </TableBody>
                    </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </section>
      </main>
    </div>
  );
}
