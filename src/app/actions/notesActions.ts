
// src/app/actions/notesActions.ts
'use server';

import { 
  fetchSubjectNotes, 
  createSubjectNote, 
  deleteSubjectNote, // Import deleteSubjectNote
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

interface DeleteNoteResult {
  success: boolean;
  error?: string;
}

export async function deleteSubjectNoteAction(id: number): Promise<DeleteNoteResult> {
  try {
    const success = await deleteSubjectNote(id);
    if (!success) {
      return { success: false, error: 'Failed to delete note from Baserow.' };
    }
    return { success: true };
  } catch (error: any) {
    console.error('Error in deleteSubjectNoteAction:', error);
    return { success: false, error: error.message || 'An unexpected error occurred while deleting the note.' };
  }
}


interface EditNoteResult {
  success: boolean;
  note?: SubjectNoteRecord; // This will be the NEWLY created note
  error?: string;
}

export async function editSubjectNoteAction(
  originalNoteId: number,
  newData: { subject: string; chapter: string; notes: string }
): Promise<EditNoteResult> {
  try {
    // 1. Create the new note with the updated data
    const creationResult = await addSubjectNoteAction({
      subject: newData.subject,
      chapter: newData.chapter,
      notes: newData.notes,
    });

    if (!creationResult.success || !creationResult.note) {
      return { success: false, error: creationResult.error || 'Failed to create the new version of the note.' };
    }

    // 2. If creation was successful, delete the old note
    const deletionResult = await deleteSubjectNoteAction(originalNoteId);

    if (!deletionResult.success) {
      // Log the error, but proceed with the success of creation.
      console.error(`Failed to delete original note ${originalNoteId} after creating new version: ${deletionResult.error}`);
      // Return the newly created note anyway, as the primary operation (update as creation) succeeded.
      // Add a specific error message to the result if deletion failed.
      return { 
        success: true, 
        note: creationResult.note, 
        error: `Note content updated and new record created, but failed to delete the old version (ID: ${originalNoteId}). Error: ${deletionResult.error}` 
      };
    }

    return { success: true, note: creationResult.note }; // Return the newly created note
  } catch (error: any) {
    console.error('Error in editSubjectNoteAction (delete and recreate):', error);
    return { success: false, error: error.message || 'An unexpected error occurred while updating the note.' };
  }
}
