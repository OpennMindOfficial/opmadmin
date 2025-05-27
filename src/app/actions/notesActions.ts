
// src/app/actions/notesActions.ts
'use server';

import { 
  fetchSubjectNotes, 
  createSubjectNote, 
  deleteSubjectNote,
  updateSubjectNote, 
  type SubjectNoteRecord 
} from '@/services/baserowService';
import { revalidatePath } from 'next/cache';

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
    const newNotePayload = {
      Subject: data.subject,
      Chapter: data.chapter,
      Notes: data.notes,
    };

    const createdNote = await createSubjectNote(newNotePayload);

    if (!createdNote || typeof createdNote.id !== 'number' || typeof createdNote.order !== 'string') {
      console.error('Failed to create note in Baserow or received incomplete/invalid data. Response:', createdNote);
      return { success: false, error: 'Failed to create note in Baserow or received incomplete/invalid data.' };
    }
    
    // Revalidate path after adding a note
    revalidatePath('/actions/create-subject-notes');

    return { success: true, note: createdNote };
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
    // Revalidate path after deleting a note
    revalidatePath('/actions/create-subject-notes');
    return { success: true };
  } catch (error: any) {
    console.error('Error in deleteSubjectNoteAction:', error);
    return { success: false, error: error.message || 'An unexpected error occurred while deleting the note.' };
  }
}


interface EditNoteResult {
  success: boolean;
  note?: SubjectNoteRecord;
  error?: string;
}

export async function editSubjectNoteAction(
  noteId: number,
  newData: { subject: string; chapter: string; notes: string }
): Promise<EditNoteResult> {
  try {
    const payloadToUpdate = {
      Subject: newData.subject,
      Chapter: newData.chapter,
      Notes: newData.notes,
    };

    const updatedNote = await updateSubjectNote(noteId, payloadToUpdate);

    if (!updatedNote) {
      console.error(`Failed to update note ${noteId} in Baserow or received no data back. Baserow response:`, updatedNote);
      return { success: false, error: 'Failed to update note. Baserow did not return updated data.' };
    }
    
    if (typeof updatedNote.id !== 'number') {
        console.error(`Baserow update response for note ${noteId} did not include a valid note ID. Response:`, updatedNote);
        return { success: false, error: 'Baserow update response was invalid (missing ID).' };
    }

    // If update was successful, revalidate the path where notes are displayed
    revalidatePath('/actions/create-subject-notes'); 

    return { success: true, note: updatedNote };
  } catch (error: any) {
    console.error(`Error in editSubjectNoteAction for note ${noteId}:`, error);
    return { success: false, error: error.message || 'An unexpected error occurred while updating the note.' };
  }
}
