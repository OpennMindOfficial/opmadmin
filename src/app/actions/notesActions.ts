
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
  console.log('addSubjectNoteAction called with data:', data);
  try {
    const newNotePayload = {
      Subject: data.subject,
      Chapter: data.chapter,
      Notes: data.notes,
    };
    console.log('addSubjectNoteAction - Payload to Baserow:', newNotePayload);

    const createdNote = await createSubjectNote(newNotePayload);
    console.log('addSubjectNoteAction - Baserow createSubjectNote response:', createdNote);

    if (!createdNote || typeof createdNote.id !== 'number' || typeof createdNote.order !== 'string') {
      console.error('Failed to create note in Baserow or received incomplete/invalid data from createSubjectNote. Response:', createdNote);
      return { success: false, error: 'Failed to create note in Baserow or received incomplete/invalid data.' };
    }

    revalidatePath('/actions/create-subject-notes');
    console.log('addSubjectNoteAction successful, path revalidated.');
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
  console.log('deleteSubjectNoteAction called for id:', id);
  try {
    const success = await deleteSubjectNote(id);
    if (!success) {
      console.error(`Failed to delete note ${id} from Baserow.`);
      return { success: false, error: 'Failed to delete note from Baserow.' };
    }
    revalidatePath('/actions/create-subject-notes');
    console.log(`deleteSubjectNoteAction successful for id ${id}, path revalidated.`);
    return { success: true };
  } catch (error: any) {
    console.error(`Error in deleteSubjectNoteAction for id ${id}:`, error);
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
  console.log('--- Starting editSubjectNoteAction ---');
  console.log('Received noteId for edit:', noteId);
  console.log('Received newData for edit:', JSON.stringify(newData, null, 2));

  try {
    // Ensure all fields are explicitly mapped to the payload with correct casing for Baserow
    const payloadToUpdate = {
      Subject: newData.subject,
      Chapter: newData.chapter,
      Notes: newData.notes,
    };

    console.log('Payload constructed for Baserow update:', JSON.stringify(payloadToUpdate, null, 2));

    const updatedNote = await updateSubjectNote(noteId, payloadToUpdate);
    console.log('Response from updateSubjectNote service:', JSON.stringify(updatedNote, null, 2));

    if (!updatedNote) {
      console.error(`Failed to update note ${noteId}. updateSubjectNote service returned null or undefined.`);
      return { success: false, error: 'Failed to update note. Baserow service did not return updated data.' };
    }

    // Verify the returned object has an 'id' property, which is expected for a valid row object.
    if (typeof updatedNote.id !== 'number') {
        console.error(`Baserow update response for note ${noteId} was invalid (e.g., missing ID or not a row object). Response:`, JSON.stringify(updatedNote, null, 2));
        return { success: false, error: 'Baserow update response was invalid.' };
    }

    revalidatePath('/actions/create-subject-notes');
    console.log(`editSubjectNoteAction successful for noteId ${noteId}. Path /actions/create-subject-notes revalidated.`);
    console.log('--- Ending editSubjectNoteAction (Success) ---');
    return { success: true, note: updatedNote };
  } catch (error: any) {
    console.error(`Critical error in editSubjectNoteAction for note ${noteId}:`, error.message, error.stack);
    console.log('--- Ending editSubjectNoteAction (Error) ---');
    return { success: false, error: error.message || 'An unexpected error occurred while updating the note.' };
  }
}
