
// src/app/actions/notesActions.ts
'use server';

import { 
  fetchSubjectNotes, 
  createSubjectNote, 
  deleteSubjectNote, // Kept for potential future use, but not used by edit
  updateSubjectNote, // This will now be used by editSubjectNoteAction
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

// This action is no longer used by editSubjectNoteAction but kept for potential direct deletion features.
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
  note?: SubjectNoteRecord;
  error?: string;
}

// Reverted to direct update
export async function editSubjectNoteAction(
  noteId: number,
  newData: { subject: string; chapter: string; notes: string }
): Promise<EditNoteResult> {
  try {
    // Prepare the payload for Baserow. It expects field names as they are in Baserow.
    const payloadToUpdate = {
      Subject: newData.subject,
      Chapter: newData.chapter,
      Notes: newData.notes,
    };

    const updatedNote = await updateSubjectNote(noteId, payloadToUpdate);

    if (!updatedNote) {
      console.error(`Failed to update note ${noteId} in Baserow or received no data back. Baserow response:`, updatedNote);
      return { success: false, error: 'Failed to update note. The operation might have succeeded silently or returned no content.' };
    }
    
    // Baserow PATCH should return the updated row with an ID.
    // If updatedNote is null and the request was successful (204 No Content), this check will also fail.
    // However, a 200 OK with the updated row is expected.
    if (typeof updatedNote.id !== 'number') {
        console.error(`Baserow update response for note ${noteId} did not include a valid note ID. Response:`, updatedNote);
        return { success: false, error: 'Baserow update response was invalid.' };
    }

    return { success: true, note: updatedNote };
  } catch (error: any) {
    console.error(`Error in editSubjectNoteAction for note ${noteId}:`, error);
    return { success: false, error: error.message || 'An unexpected error occurred while updating the note.' };
  }
}
