
// src/components/dialogs/view-note-dialog.tsx
"use client";

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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Copy, Edit2, Save, XCircle, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import type { SubjectNoteRecord } from "@/services/baserowService";
import { editSubjectNoteAction } from "@/app/actions/notesActions";

interface ViewNoteDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  note: SubjectNoteRecord | null;
  onNoteUpdated?: (updatedNote: SubjectNoteRecord) => void;
}

export function ViewNoteDialog({ isOpen, onOpenChange, note, onNoteUpdated }: ViewNoteDialogProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedNotes, setEditedNotes] = useState(note?.Notes || "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (note) {
      setEditedNotes(note.Notes || "");
    }
    // Reset editing state when dialog opens for a new note or closes
    if (!isOpen) {
        setIsEditing(false);
    }
  }, [note, isOpen]);

  const handleCopy = () => {
    if (note?.Notes) {
      navigator.clipboard.writeText(note.Notes)
        .then(() => {
          toast({ title: "Copied!", description: "Note content copied to clipboard." });
        })
        .catch(err => {
          toast({ title: "Error", description: "Failed to copy text.", variant: "destructive" });
          console.error('Failed to copy text: ', err);
        });
    }
  };

  const handleSaveEdit = async () => {
    if (!note) return;
    setIsSaving(true);
    try {
      // Send all fields, even if only Notes was edited in this dialog
      const result = await editSubjectNoteAction(note.id, { 
        Subject: note.Subject, 
        Chapter: note.Chapter,
        Notes: editedNotes 
      });
      if (result.success && result.note) {
        toast({ title: "Note Updated", description: "Your note has been successfully updated." });
        onNoteUpdated?.(result.note); // This will trigger a re-fetch in SubjectNotesTable
        setIsEditing(false); // Exit editing mode
        // No need to call onOpenChange(false) here as the dialog should remain open for viewing updated note
      } else {
        toast({ title: "Error", description: result.error || "Failed to update note.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDialogClose = () => {
    setIsEditing(false); // Reset editing state when dialog closes
    onOpenChange(false);
  };


  if (!note) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-lg md:max-w-xl lg:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? `Editing Note for: ${note.Subject} - ${note.Chapter}` : `${note.Subject || 'N/A'} - ${note.Chapter || 'N/A'}`}
          </DialogTitle>
          {!isEditing && (
            <DialogDescription>
              Full content of your note.
            </DialogDescription>
          )}
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] my-4 pr-3">
          {isEditing ? (
            <Textarea
              value={editedNotes}
              onChange={(e) => setEditedNotes(e.target.value)}
              className="min-h-[200px] text-sm"
              disabled={isSaving}
              placeholder="Enter your notes here..."
            />
          ) : (
            <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
              {note.Notes || "No content available."}
            </p>
          )}
        </ScrollArea>
        
        <DialogFooter className="gap-2 sm:justify-between">
          <DialogClose asChild>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              <XCircle className="mr-2 h-4 w-4" /> Close
            </Button>
          </DialogClose>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>Cancel</Button>
                <Button onClick={handleSaveEdit} disabled={isSaving}>
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={handleCopy} disabled={!note.Notes}>
                  <Copy className="mr-2 h-4 w-4" /> Copy
                </Button>
                <Button onClick={() => setIsEditing(true)}>
                  <Edit2 className="mr-2 h-4 w-4" /> Edit
                </Button>
              </>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
