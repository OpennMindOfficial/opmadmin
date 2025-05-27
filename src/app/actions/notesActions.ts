
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
      // This basic validation can be enhanced with Zod if needed
      // return { success: false, error: 'Subject, Chapter, and Notes cannot be empty.' };
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

// This action now expects all fields to be potentially provided for an update.
export async function editSubjectNoteAction(
  id: number,
  data: { subject?: string; chapter?: string; notes?: string }
): Promise<EditNoteResult> {
  try {
    // Construct the payload ensuring that if a field is provided (even as an empty string),
    // it's included. Baserow typically interprets sending a field with an empty string
    // as clearing that field. If a field is 'undefined', it's not sent.
    const payload: Partial<Omit<SubjectNoteRecord, 'id' | 'order'>> = {};
    
    if (data.subject !== undefined) {
      payload.Subject = data.subject;
    }
    if (data.chapter !== undefined) {
      payload.Chapter = data.chapter;
    }
    if (data.notes !== undefined) {
      payload.Notes = data.notes;
    }

    if (Object.keys(payload).length === 0) {
        // Optionally, handle the case where no actual data is being sent to update.
        // For now, we'll let it proceed, Baserow should handle an empty PATCH gracefully.
    }

    const updatedNote = await updateSubjectNote(id, payload);
    
    if (!updatedNote) {
      return { success: false, error: 'Failed to update note in Baserow. The record might not have been found or no changes were made.' };
    }
    return { success: true, note: updatedNote };
  } catch (error: any) {
    console.error('Error in editSubjectNoteAction:', error);
    return { success: false, error: error.message || 'An unexpected error occurred while updating the note.' };
  }
}
