
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
  console.log('--- addSubjectNoteAction ---');
  console.log('Received data for add:', JSON.stringify(data, null, 2));
  try {
    const newNotePayload = {
      Subject: data.subject,
      Chapter: data.chapter,
      Notes: data.notes,
    };
    console.log('Payload for Baserow create:', JSON.stringify(newNotePayload, null, 2));

    const createdNote = await createSubjectNote(newNotePayload);
    console.log('Response from createSubjectNote service:', JSON.stringify(createdNote, null, 2));

    if (!createdNote || typeof createdNote.id !== 'number' || typeof createdNote.order !== 'string') {
      console.error('Failed to create note in Baserow or received incomplete/invalid data. Response:', createdNote);
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
  console.log('--- deleteSubjectNoteAction ---');
  console.log('Called for id:', id);
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
  newData: { subject: string; chapter: string; notes: string } // This comes directly from the form
): Promise<EditNoteResult> {
  console.log('--- Starting editSubjectNoteAction ---');
  console.log('Received noteId for edit:', noteId);
  console.log('Received newData for edit (from client form):', JSON.stringify(newData, null, 2));

  try {
    const payloadForBaserow = {
      Subject: newData.subject,
      Chapter: newData.chapter,
      Notes: newData.notes,
    };

    console.log('Payload constructed for Baserow update:', JSON.stringify(payloadForBaserow, null, 2));

    const updatedNoteFromService = await updateSubjectNote(noteId, payloadForBaserow);
    console.log('Response from updateSubjectNote service:', JSON.stringify(updatedNoteFromService, null, 2));

    if (!updatedNoteFromService) {
      console.error(`Failed to update note ${noteId}. updateSubjectNote service returned null or undefined.`);
      return { success: false, error: 'Failed to update note. Baserow service did not return updated data.' };
    }

    if (typeof updatedNoteFromService.id !== 'number') {
        console.error(`Baserow update response for note ${noteId} was invalid (e.g., missing ID or not a row object). Response:`, JSON.stringify(updatedNoteFromService, null, 2));
        return { success: false, error: 'Baserow update response was invalid. Data might not have been saved.' };
    }
    
    // Check if the data returned matches what we tried to send (less strict, just for logging)
    const dataMatched = 
        updatedNoteFromService.Subject === payloadForBaserow.Subject &&
        updatedNoteFromService.Chapter === payloadForBaserow.Chapter &&
        updatedNoteFromService.Notes === payloadForBaserow.Notes;

    if (!dataMatched) {
        console.warn(`POTENTIAL DATA MISMATCH: Baserow update for note ${noteId} returned data that does not exactly match the sent payload. This is a warning.`);
        console.warn(`Sent Payload: ${JSON.stringify(payloadForBaserow)}`);
        console.warn(`Received Data: ${JSON.stringify(updatedNoteFromService)}`);
        // We are proceeding as if successful for the UI, but this indicates a potential issue.
    }

    revalidatePath('/actions/create-subject-notes');
    console.log(`editSubjectNoteAction successful for noteId ${noteId}. Path /actions/create-subject-notes revalidated.`);
    console.log('--- Ending editSubjectNoteAction (Success) ---');
    // Return the note data received from Baserow, even if it didn't match perfectly (as per user request to reduce strictness)
    return { success: true, note: updatedNoteFromService };

  } catch (error: any) {
    console.error(`Critical error in editSubjectNoteAction for note ${noteId}:`, error.message, error.stack);
    console.log('--- Ending editSubjectNoteAction (Error) ---');
    return { success: false, error: error.message || 'An unexpected error occurred while updating the note.' };
  }
}
