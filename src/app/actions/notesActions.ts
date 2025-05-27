
// src/app/actions/notesActions.ts
'use server';

import { 
  fetchSubjectNotes, 
  createSubjectNote, 
  updateSubjectNote,
  type SubjectNoteRecord 
} from '@/services/baserowService';

interface GetNotesResult {
  success: boolean;
  notes?: SubjectNoteRecord[];
  error?: string;
}

export async function getSubjectNotesAction(): Promise<GetNotesResult> {
  try {
    const notes = await fetchSubjectNotes();
    return { success: true, notes };
  } catch (error: any) {
    console.error('Error in getSubjectNotesAction:', error);
    return { success: false, error: error.message || 'Failed to fetch subject notes.' };
  }
}

interface AddNoteResult {
  success: boolean;
  note?: SubjectNoteRecord;
  error?: string;
}

export async function addSubjectNoteAction(data: {
  subject: string;
  chapter: string;
  notes: string;
}): Promise<AddNoteResult> {
  try {
    if (!data.subject || !data.chapter || !data.notes) {
      return { success: false, error: 'Subject, Chapter, and Notes cannot be empty.' };
    }
    const newNote = await createSubjectNote({
      Subject: data.subject,
      Chapter: data.chapter,
      Notes: data.notes,
    });
    if (!newNote) {
      return { success: false, error: 'Failed to create note in Baserow.' };
    }
    return { success: true, note: newNote };
  } catch (error: any) {
    console.error('Error in addSubjectNoteAction:', error);
    return { success: false, error: error.message || 'An unexpected error occurred while adding the note.' };
  }
}

interface EditNoteResult {
  success: boolean;
  note?: SubjectNoteRecord;
  error?: string;
}

export async function editSubjectNoteAction(
  id: number,
  data: { subject?: string; chapter?: string; notes?: string }
): Promise<EditNoteResult> {
  try {
    const updatedNote = await updateSubjectNote(id, {
      ...(data.subject && { Subject: data.subject }),
      ...(data.chapter && { Chapter: data.chapter }),
      ...(data.notes && { Notes: data.notes }),
    });
    if (!updatedNote) {
      return { success: false, error: 'Failed to update note in Baserow.' };
    }
    return { success: true, note: updatedNote };
  } catch (error: any) {
    console.error('Error in editSubjectNoteAction:', error);
    return { success: false, error: error.message || 'An unexpected error occurred while updating the note.' };
  }
}
