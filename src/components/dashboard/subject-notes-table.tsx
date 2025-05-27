
// src/components/dashboard/subject-notes-table.tsx
"use client";

import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { getSubjectNotesAction } from '@/app/actions/notesActions';
import type { SubjectNoteRecord } from '@/services/baserowService';
import { Maximize2, Edit2, Loader2, AlertTriangle } from 'lucide-react';
import { ViewNoteDialog } from '@/components/dialogs/view-note-dialog';
import { AddEditNoteDialog } from '@/components/dialogs/add-edit-note-dialog'; 

function truncateText(text: string | undefined, maxLength: number): string {
  if (!text) return "N/A";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export function SubjectNotesTable() {
  const [notes, setNotes] = useState<SubjectNoteRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [selectedNoteForView, setSelectedNoteForView] = useState<SubjectNoteRecord | null>(null);
  const [isViewNoteDialogOpen, setIsViewNoteDialogOpen] = useState(false);
  
  const [selectedNoteForEdit, setSelectedNoteForEdit] = useState<SubjectNoteRecord | null>(null);
  const [isAddEditNoteDialogOpen, setIsAddEditNoteDialogOpen] = useState(false);


  const fetchNotes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getSubjectNotesAction();
      if (result.success && result.notes) {
        setNotes(result.notes);
      } else {
        setError(result.error || 'Failed to load subject notes.');
        toast({ title: "Error", description: result.error || 'Failed to load subject notes.', variant: "destructive" });
      }
    } catch (err) {
      setError('An unexpected error occurred while fetching notes.');
      toast({ title: "Error", description: 'An unexpected error occurred.', variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenViewDialog = (note: SubjectNoteRecord) => {
    setSelectedNoteForView(note);
    setIsViewNoteDialogOpen(true);
  };
  
  const handleOpenEditDialog = (note: SubjectNoteRecord) => {
    setSelectedNoteForEdit(note);
    setIsAddEditNoteDialogOpen(true);
  };
  
  const handleNoteAddedOrUpdated = () => {
    fetchNotes(); // Re-fetch notes to update the table
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading notes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-destructive">
        <AlertTriangle className="h-8 w-8 mb-2" />
        <p className="font-semibold">Error loading notes</p>
        <p className="text-sm">{error}</p>
        <Button onClick={fetchNotes} variant="outline" className="mt-4">Try Again</Button>
      </div>
    );
  }

  return (
    <div className="bg-card p-0 rounded-xl shadow-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subject</TableHead>
            <TableHead>Chapter</TableHead>
            <TableHead className="w-2/5">Notes (Preview)</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground py-10">
                No subject notes found.
              </TableCell>
            </TableRow>
          ) : (
            notes.map((note) => (
              <TableRow key={note.id}>
                <TableCell className="font-medium">{note.Subject || 'N/A'}</TableCell>
                <TableCell>{note.Chapter || 'N/A'}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {truncateText(note.Notes, 100)}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleOpenViewDialog(note)} title="View/Enlarge Note">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleOpenEditDialog(note)} title="Edit Note">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      <ViewNoteDialog
        isOpen={isViewNoteDialogOpen}
        onOpenChange={setIsViewNoteDialogOpen}
        note={selectedNoteForView}
        onNoteUpdated={handleNoteAddedOrUpdated}
      />
      
      <AddEditNoteDialog
        isOpen={isAddEditNoteDialogOpen}
        onOpenChange={setIsAddEditNoteDialogOpen}
        noteToEdit={selectedNoteForEdit}
        onNoteAdded={handleNoteAddedOrUpdated}
        onNoteUpdated={handleNoteAddedOrUpdated}
      />
    </div>
  );
}
