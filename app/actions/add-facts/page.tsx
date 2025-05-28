
// src/app/actions/add-facts/page.tsx
"use client";

import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ListPlus as PageIcon, PlusCircle, Loader2, AlertTriangle, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { getFactsAction, addFactAction } from '@/app/actions/factsActions'; 
import type { FactRecord } from '@/services/baserowService';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';

const factSchema = z.object({
  Category: z.string().min(1, "Category is required."),
  Fact: z.string().min(1, "Fact is required."),
  Image: z.string().url("Must be a valid URL for the image.").optional().or(z.literal('')),
  Source: z.string().optional(),
});
type FactFormData = z.infer<typeof factSchema>;

const FACTS_PER_PAGE = 20;

export default function AddFactsPage() {
  const { toast } = useToast();
  const [facts, setFacts] = useState<FactRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { register, handleSubmit: handleFormSubmit, reset, formState: { errors } } = useForm<FactFormData>({
    resolver: zodResolver(factSchema),
  });

  const fetchFacts = async (page: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getFactsAction(page, FACTS_PER_PAGE);
      if (result.success && result.facts) {
        setFacts(result.facts);
        setTotalPages(result.totalPages || 1);
      } else {
        setError(result.error || "Failed to load facts.");
        toast({ variant: "destructive", title: "Error", description: result.error || "Failed to load facts." });
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFacts(currentPage);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]); 

  const onSubmit: SubmitHandler<FactFormData> = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await addFactAction(data);
      if (result.success && result.fact) {
        toast({ title: "Fact Added", description: "New fact has been successfully added." });
        reset();
        if (currentPage === 1) {
            fetchFacts(1); 
        } else {
            fetchFacts(currentPage);
        }
      } else {
        toast({ variant: "destructive", title: "Error", description: result.error || "Failed to add fact." });
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Submission Error", description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <NewTopNav />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 md:space-y-10">
        <section className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ scale: [1, 1.05, 1], y: [0, -2, 0] }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
              >
                <PageIcon className="h-8 w-8 md:h-10 md:w-10 text-primary" />
              </motion.div>
              <h1 className="text-2xl md:text-4xl font-bold tracking-tight">Add Facts</h1>
            </div>
            <p className="text-md md:text-lg text-muted-foreground md:ml-13">
              Contribute interesting facts with categories, sources, and images. (Table ID: 542791)
            </p>
          </div>
        </section>

        <section className="space-y-6">
           <Card>
            <CardHeader>
              <CardTitle className="text-xl">Add New Fact</CardTitle>
              <CardDescription>Fill in the details to add a new fact to the platform.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFormSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="Category">Category <span className="text-destructive">*</span></Label>
                  <Input id="Category" {...register('Category')} disabled={isSubmitting} />
                  {errors.Category && <p className="text-sm text-destructive mt-1">{errors.Category.message}</p>}
                </div>
                <div>
                  <Label htmlFor="Fact">Fact <span className="text-destructive">*</span></Label>
                  <Textarea id="Fact" {...register('Fact')} rows={3} disabled={isSubmitting} />
                  {errors.Fact && <p className="text-sm text-destructive mt-1">{errors.Fact.message}</p>}
                </div>
                <div>
                  <Label htmlFor="Image">Image URL</Label>
                  <Input id="Image" {...register('Image')} placeholder="https://example.com/image.png" disabled={isSubmitting} />
                  {errors.Image && <p className="text-sm text-destructive mt-1">{errors.Image.message}</p>}
                </div>
                <div>
                  <Label htmlFor="Source">Source</Label>
                  <Input id="Source" {...register('Source')} placeholder="e.g., Book Name, Website URL" disabled={isSubmitting} />
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                  Add Fact
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl md:text-2xl font-semibold">Existing Facts</h2>
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-2">Loading facts...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-10 text-destructive">
              <AlertTriangle className="h-8 w-8 mb-2" />
              <p className="font-semibold">Error loading facts</p>
              <p className="text-sm">{error}</p>
              <Button onClick={() => fetchFacts(currentPage)} variant="outline" className="mt-4">Try Again</Button>
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead className="w-2/5">Fact</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead className="text-right">Shares</TableHead>
                        <TableHead className="text-right">Downloads</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {facts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                            No facts found for this page.
                          </TableCell>
                        </TableRow>
                      ) : (
                        facts.map((fact) => (
                          <TableRow key={fact.id}>
                            <TableCell className="font-medium">{fact.Category}</TableCell>
                            <TableCell className="text-sm text-muted-foreground whitespace-pre-wrap break-words">
                              {fact.Fact && fact.Fact.length > 100 ? fact.Fact.substring(0, 100) + "..." : fact.Fact}
                            </TableCell>
                            <TableCell>
                              {fact.Image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={fact.Image} alt="Fact image" data-ai-hint="fact relevant" className="h-10 w-auto object-contain rounded" />
                              ) : (
                                <span className="text-xs text-muted-foreground">N/A</span>
                              )}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">{fact.Source || 'N/A'}</TableCell>
                            <TableCell className="text-right">{fact.Shares ?? 0}</TableCell>
                            <TableCell className="text-right">{fact.Downloads ?? 0}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
               {totalPages > 1 && (
                <CardFooter className="flex flex-col sm:flex-row items-center justify-between border-t pt-4 mt-4 gap-4 sm:gap-0">
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1 || isLoading}
                      aria-label="Go to first page"
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1 || isLoading}
                      aria-label="Go to previous page"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages || isLoading}
                      aria-label="Go to next page"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                     <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages || isLoading}
                      aria-label="Go to last page"
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              )}
            </Card>
          )}
        </section>
      </main>
    </div>
  );
}
    