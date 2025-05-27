
// src/app/actions/add-questions/page.tsx
"use client";

import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileQuestion as PageIcon, PlusCircle, Upload, Loader2, AlertTriangle } from 'lucide-react';
// TODO: Implement Server Actions and Baserow Service for Questions
// import { getQuestionsAction, addQuestionAction, type QuestionRecord } from '@/app/actions/questionActions'; // Placeholder
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { useForm, Controller, useFieldArray, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Placeholder type
interface QuestionRecord {
  id: number;
  order: string;
  Subject?: string;
  ChapterID?: string;
  Type?: string;
  Questions?: string; // Stored as comma-separated
  Solutions?: string; // Stored as comma-separated
  [key: string]: any;
}

const questionAnswerPairSchema = z.object({
  question: z.string().min(1, "Question cannot be empty"),
  solution: z.string().min(1, "Solution cannot be empty"),
});

const individualQuestionSchema = z.object({
  Subject: z.string().min(1, "Subject is required."),
  ChapterID: z.string().min(1, "Chapter ID is required."),
  Type: z.string().min(1, "Question type is required."),
  qaPairs: z.array(questionAnswerPairSchema).min(1, "At least one question-answer pair is required."),
});
type IndividualQuestionFormData = z.infer<typeof individualQuestionSchema>;

const bulkAddSchema = z.object({
  SubjectBulk: z.string().min(1, "Subject is required."),
  ChapterIDBulk: z.string().min(1, "Chapter ID is required."),
  TypeBulk: z.string().min(1, "Question type is required."),
  QuestionsBulk: z.string().min(1, "Questions string is required."),
  SolutionsBulk: z.string().min(1, "Solutions string is required."),
}).refine(data => data.QuestionsBulk.split(',').length === data.SolutionsBulk.split(',').length, {
  message: "Number of questions and solutions must match in bulk add.",
  path: ["SolutionsBulk"], // Show error under solutions field
});
type BulkAddFormData = z.infer<typeof bulkAddSchema>;


export default function AddQuestionsPage() {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<QuestionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingIndividual, setIsSubmittingIndividual] = useState(false);
  const [isSubmittingBulk, setIsSubmittingBulk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const individualFormMethods = useForm<IndividualQuestionFormData>({
    resolver: zodResolver(individualQuestionSchema),
    defaultValues: {
      Subject: '', ChapterID: '', Type: '', qaPairs: [{ question: '', solution: '' }]
    }
  });
  const { fields, append, remove } = useFieldArray({
    control: individualFormMethods.control,
    name: "qaPairs"
  });

  const bulkFormMethods = useForm<BulkAddFormData>({
    resolver: zodResolver(bulkAddSchema),
    defaultValues: { SubjectBulk: '', ChapterIDBulk: '', TypeBulk: '', QuestionsBulk: '', SolutionsBulk: '' }
  });

  // --- MOCK DATA & FUNCTIONS ---
  const [mockQb, setMockQb] = useState<QuestionRecord[]>([]);
  const mockGetQuestionsAction = async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { success: true, questions: mockQb };
  };
  const mockAddQuestionAction = async (data: any, isBulk: boolean) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newId = mockQb.length > 0 ? Math.max(...mockQb.map(q => q.id)) + 1 : 1;
    let newEntry: QuestionRecord;
    if (isBulk) {
      newEntry = {
        id: newId, order: newId.toString(),
        Subject: data.SubjectBulk, ChapterID: data.ChapterIDBulk, Type: data.TypeBulk,
        Questions: data.QuestionsBulk, Solutions: data.SolutionsBulk,
      };
    } else {
      newEntry = {
        id: newId, order: newId.toString(),
        Subject: data.Subject, ChapterID: data.ChapterID, Type: data.Type,
        Questions: data.qaPairs.map((p:any) => p.question.replace(/,/g, ';')).join(','), // Replace commas in Q/A with semicolon
        Solutions: data.qaPairs.map((p:any) => p.solution.replace(/,/g, ';')).join(','),
      };
    }
    setMockQb(prev => [newEntry, ...prev].sort((a,b)=>b.id-a.id));
    return { success: true, question: newEntry };
  };
  // --- END MOCK ---

  const fetchQuestions = async () => {
    setIsLoading(true); setError(null);
    try {
      // const result = await getQuestionsAction();
      const result = await mockGetQuestionsAction();
      if (result.success && result.questions) setQuestions(result.questions);
      else { setError("Failed to load questions."); toast({ variant: "destructive", title: "Error", description: "Failed to load questions." });}
    } catch (err: any) { setError(err.message); toast({ variant: "destructive", title: "Error", description: err.message });
    } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchQuestions(); }, []);

  const onIndividualSubmit: SubmitHandler<IndividualQuestionFormData> = async (data) => {
    setIsSubmittingIndividual(true);
    try {
      // const result = await addQuestionAction(data, false); // isBulk = false
      const result = await mockAddQuestionAction(data, false);
      if (result.success) {
        toast({ title: "Questions Added", description: "New questions added successfully." });
        individualFormMethods.reset({ Subject: '', ChapterID: '', Type: '', qaPairs: [{ question: '', solution: '' }]});
        // Fields array needs to be reset explicitly to one item
        remove(); // remove all
        append({question: '', solution: ''}); // add one back

        fetchQuestions();
      } else { toast({ variant: "destructive", title: "Error", description: "Failed to add questions." }); }
    } catch (e: any) { toast({ variant: "destructive", title: "Error", description: e.message });
    } finally { setIsSubmittingIndividual(false); }
  };

  const onBulkSubmit: SubmitHandler<BulkAddFormData> = async (data) => {
    setIsSubmittingBulk(true);
    try {
      // const result = await addQuestionAction(data, true); // isBulk = true
      const result = await mockAddQuestionAction(data, true);
      if (result.success) {
        toast({ title: "Bulk Questions Added", description: "Bulk questions added successfully." });
        bulkFormMethods.reset();
        fetchQuestions();
      } else { toast({ variant: "destructive", title: "Error", description: "Failed to add bulk questions." }); }
    } catch (e: any) { toast({ variant: "destructive", title: "Error", description: e.message });
    } finally { setIsSubmittingBulk(false); }
  };


  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <NewTopNav />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <section className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <PageIcon className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">Add Questions to QB</h1>
            </div>
            <p className="text-lg text-muted-foreground ml-13">
              Expand the question bank by adding new questions and solutions. (Table ID: 552908)
            </p>
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Add Individual Questions</CardTitle>
              <CardDescription>Add one or more questions with their solutions for a specific subject/chapter/type.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={individualFormMethods.handleSubmit(onIndividualSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="Subject">Subject <span className="text-destructive">*</span></Label>
                  <Input id="Subject" {...individualFormMethods.register('Subject')} disabled={isSubmittingIndividual} />
                  {individualFormMethods.formState.errors.Subject && <p className="text-sm text-destructive mt-1">{individualFormMethods.formState.errors.Subject.message}</p>}
                </div>
                <div>
                  <Label htmlFor="ChapterID">Chapter ID <span className="text-destructive">*</span></Label>
                  <Input id="ChapterID" {...individualFormMethods.register('ChapterID')} disabled={isSubmittingIndividual} />
                  {individualFormMethods.formState.errors.ChapterID && <p className="text-sm text-destructive mt-1">{individualFormMethods.formState.errors.ChapterID.message}</p>}
                </div>
                <div>
                  <Label htmlFor="Type">Type <span className="text-destructive">*</span></Label>
                  <Input id="Type" {...individualFormMethods.register('Type')} disabled={isSubmittingIndividual} />
                  {individualFormMethods.formState.errors.Type && <p className="text-sm text-destructive mt-1">{individualFormMethods.formState.errors.Type.message}</p>}
                </div>

                <Label>Question & Answer Pairs <span className="text-destructive">*</span></Label>
                {fields.map((item, index) => (
                  <div key={item.id} className="space-y-2 border p-3 rounded-md bg-muted/30">
                    <Label htmlFor={`qaPairs.${index}.question`} className="font-medium">Question {index + 1}</Label>
                    <Textarea id={`qaPairs.${index}.question`} {...individualFormMethods.register(`qaPairs.${index}.question`)} rows={2} placeholder="Enter question text" disabled={isSubmittingIndividual} />
                    {individualFormMethods.formState.errors.qaPairs?.[index]?.question && <p className="text-sm text-destructive">{individualFormMethods.formState.errors.qaPairs[index]?.question?.message}</p>}

                    <Label htmlFor={`qaPairs.${index}.solution`} className="font-medium">Solution {index + 1}</Label>
                    <Textarea id={`qaPairs.${index}.solution`} {...individualFormMethods.register(`qaPairs.${index}.solution`)} rows={1} placeholder="Enter solution text" disabled={isSubmittingIndividual} />
                    {individualFormMethods.formState.errors.qaPairs?.[index]?.solution && <p className="text-sm text-destructive">{individualFormMethods.formState.errors.qaPairs[index]?.solution?.message}</p>}

                    {fields.length > 1 && <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)} disabled={isSubmittingIndividual}>Remove Pair</Button>}
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={() => append({ question: '', solution: '' })} disabled={isSubmittingIndividual}>Add Another Question/Answer</Button>
                {individualFormMethods.formState.errors.qaPairs && typeof individualFormMethods.formState.errors.qaPairs === 'object' && !Array.isArray(individualFormMethods.formState.errors.qaPairs) && <p className="text-sm text-destructive mt-1">{individualFormMethods.formState.errors.qaPairs.message}</p>}


                <Button type="submit" disabled={isSubmittingIndividual} className="w-full">
                  {isSubmittingIndividual ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                  Add Individual Questions
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bulk Add Questions</CardTitle>
              <CardDescription>Add multiple questions and solutions as comma-separated strings. Ensure the order of solutions matches questions.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={bulkFormMethods.handleSubmit(onBulkSubmit)} className="space-y-4">
                 <div>
                  <Label htmlFor="SubjectBulk">Subject <span className="text-destructive">*</span></Label>
                  <Input id="SubjectBulk" {...bulkFormMethods.register('SubjectBulk')} disabled={isSubmittingBulk} />
                  {bulkFormMethods.formState.errors.SubjectBulk && <p className="text-sm text-destructive mt-1">{bulkFormMethods.formState.errors.SubjectBulk.message}</p>}
                </div>
                <div>
                  <Label htmlFor="ChapterIDBulk">Chapter ID <span className="text-destructive">*</span></Label>
                  <Input id="ChapterIDBulk" {...bulkFormMethods.register('ChapterIDBulk')} disabled={isSubmittingBulk} />
                  {bulkFormMethods.formState.errors.ChapterIDBulk && <p className="text-sm text-destructive mt-1">{bulkFormMethods.formState.errors.ChapterIDBulk.message}</p>}
                </div>
                <div>
                  <Label htmlFor="TypeBulk">Type <span className="text-destructive">*</span></Label>
                  <Input id="TypeBulk" {...bulkFormMethods.register('TypeBulk')} disabled={isSubmittingBulk} />
                  {bulkFormMethods.formState.errors.TypeBulk && <p className="text-sm text-destructive mt-1">{bulkFormMethods.formState.errors.TypeBulk.message}</p>}
                </div>
                <div>
                  <Label htmlFor="QuestionsBulk">Questions (comma-separated) <span className="text-destructive">*</span></Label>
                  <Textarea id="QuestionsBulk" {...bulkFormMethods.register('QuestionsBulk')} rows={3} placeholder="e.g., What is 2+2?,Define photosynthesis" disabled={isSubmittingBulk} />
                  {bulkFormMethods.formState.errors.QuestionsBulk && <p className="text-sm text-destructive mt-1">{bulkFormMethods.formState.errors.QuestionsBulk.message}</p>}
                </div>
                 <div>
                  <Label htmlFor="SolutionsBulk">Solutions (comma-separated, in same order) <span className="text-destructive">*</span></Label>
                  <Textarea id="SolutionsBulk" {...bulkFormMethods.register('SolutionsBulk')} rows={3} placeholder="e.g., 4,Process by which plants make food" disabled={isSubmittingBulk} />
                  {bulkFormMethods.formState.errors.SolutionsBulk && <p className="text-sm text-destructive mt-1">{bulkFormMethods.formState.errors.SolutionsBulk.message}</p>}
                </div>
                <Button type="submit" disabled={isSubmittingBulk} className="w-full">
                  {isSubmittingBulk ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                  Add Bulk Questions
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Existing Questions (Preview)</h2>
            {isLoading ? (
                <div className="flex items-center justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /><p className="ml-2">Loading questions...</p></div>
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
                        <TableHead>Chapter ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Questions (Count)</TableHead>
                        <TableHead>Solutions (Count)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {questions.length === 0 ? (
                        <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-10">No questions added yet.</TableCell></TableRow>
                        ) : (
                        questions.map((q) => (
                            <TableRow key={q.id}>
                            <TableCell>{q.Subject}</TableCell>
                            <TableCell>{q.ChapterID}</TableCell>
                            <TableCell>{q.Type}</TableCell>
                            <TableCell>{q.Questions?.split(',').length || 0}</TableCell>
                            <TableCell>{q.Solutions?.split(',').length || 0}</TableCell>
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

    