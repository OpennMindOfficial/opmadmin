
// src/components/dialogs/add-edit-note-dialog.tsx
"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { addSubjectNoteAction, editSubjectNoteAction } from '@/app/actions/notesActions';
import type { SubjectNoteRecord } from '@/services/baserowService';
import { Loader2, Save, PlusCircle, XCircle } from 'lucide-react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const noteSchema = z.object({
  subject: z.string().min(1, "Subject is required."),
  chapter: z.string().min(1, "Chapter is required."),
  notes: z.string().min(1, "Notes are required."),
});
type NoteFormData = z.infer<typeof noteSchema>;

interface AddEditNoteDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  noteToEdit?: SubjectNoteRecord | null;
  onNoteAdded?: (newNote: SubjectNoteRecord) => void;
  onNoteUpdated?: (updatedNote: SubjectNoteRecord) => void;
}

export function AddEditNoteDialog({
  isOpen,
  onOpenChange,
  noteToEdit,
  onNoteAdded,
  onNoteUpdated,
}: AddEditNoteDialogProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const isEditMode = !!noteToEdit;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      subject: '',
      chapter: '',
      notes: '',
    }
  });

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && noteToEdit) {
        reset({
          subject: noteToEdit.Subject || '',
          chapter: noteToEdit.Chapter || '',
          notes: noteToEdit.Notes || '',
        });
      } else {
        reset({ subject: '', chapter: '', notes: '' });
      }
    }
  }, [isOpen, isEditMode, noteToEdit, reset]);

  const onSubmit: SubmitHandler<NoteFormData> = async (data) => {
    setIsSaving(true);
    try {
      if (isEditMode && noteToEdit) {
        const result = await editSubjectNoteAction(noteToEdit.id, {
          Subject: data.subject,
          Chapter: data.chapter,
          Notes: data.notes,
        });
        if (result.success && result.note) {
          toast({ title: "Note Updated", description: "Your note has been successfully updated." });
          onNoteUpdated?.(result.note);
          onOpenChange(false);
        } else {
          toast({ title: "Error", description: result.error || "Failed to update note.", variant: "destructive" });
        }
      } else {
        const result = await addSubjectNoteAction({
          subject: data.subject,
          chapter: data.chapter,
          notes: data.notes,
        });
        if (result.success && result.note) {
          toast({ title: "Note Added", description: "New note has been successfully added." });
          onNoteAdded?.(result.note);
          onOpenChange(false);
        } else {
          toast({ title: "Error", description: result.error || "Failed to add note.", variant: "destructive" });
        }
      }
    } catch (error) {
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg md:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Subject Note" : "Add New Subject Note"}</DialogTitle>
          <DialogDescription>
            {isEditMode ? "Update the details of your subject note." : "Fill in the details to add a new subject note."}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" {...register('subject')} disabled={isSaving} />
            {errors.subject && <p className="text-sm text-destructive mt-1">{errors.subject.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="chapter">Chapter</Label>
            <Input id="chapter" {...register('chapter')} disabled={isSaving} />
            {errors.chapter && <p className="text-sm text-destructive mt-1">{errors.chapter.message}</p>}
          </div>
          
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" {...register('notes')} rows={6} disabled={isSaving} />
            {errors.notes && <p className="text-sm text-destructive mt-1">{errors.notes.message}</p>}
          </div>
          
          <DialogFooter className="gap-2 sm:justify-between">
            <DialogClose asChild>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                    <XCircle className="mr-2 h-4 w-4" /> Close
                </Button>
            </DialogClose>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (isEditMode ? <Save className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />)}
              {isSaving ? "Saving..." : (isEditMode ? "Save Changes" : "Add Note")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
