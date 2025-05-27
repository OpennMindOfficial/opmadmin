
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
  newData: { subject: string; chapter: string; notes: string } // This comes directly from the form
): Promise<EditNoteResult> {
  console.log('--- Starting editSubjectNoteAction ---');
  console.log('Received noteId for edit:', noteId);
  console.log('Received newData for edit (from client form):', JSON.stringify(newData, null, 2));

  try {
    // Ensure all fields are explicitly mapped to the payload with correct casing for Baserow
    // This is the data that will be sent in the PATCH request body
    const payloadForBaserow = {
      Subject: newData.subject, // Ensure this matches Baserow field name "Subject"
      Chapter: newData.chapter, // Ensure this matches Baserow field name "Chapter"
      Notes: newData.notes,     // Ensure this matches Baserow field name "Notes"
    };

    console.log('Payload constructed for Baserow update:', JSON.stringify(payloadForBaserow, null, 2));

    const updatedNoteFromService = await updateSubjectNote(noteId, payloadForBaserow);
    console.log('Response from updateSubjectNote service:', JSON.stringify(updatedNoteFromService, null, 2));

    if (!updatedNoteFromService) {
      console.error(`Failed to update note ${noteId}. updateSubjectNote service returned null or undefined.`);
      return { success: false, error: 'Failed to update note. Baserow service did not return updated data.' };
    }

    // Crucial: Verify the returned object from Baserow has an 'id'.
    // Baserow should return the updated row object.
    if (typeof updatedNoteFromService.id !== 'number') {
        console.error(`Baserow update response for note ${noteId} was invalid (e.g., missing ID or not a row object). Response:`, JSON.stringify(updatedNoteFromService, null, 2));
        return { success: false, error: 'Baserow update response was invalid. Data might not have been saved.' };
    }

    // Optional: Compare returned data with sent data to see if it actually changed.
    // This is for deeper debugging if Baserow returns 200 OK with old data.
    const dataChanged = updatedNoteFromService.Notes === newData.notes &&
                        updatedNoteFromService.Subject === newData.subject &&
                        updatedNoteFromService.Chapter === newData.chapter;

    if (!dataChanged) {
      console.warn(`Potential data mismatch or no actual change for note ${noteId}. Sent: ${JSON.stringify(payloadForBaserow)}, Received: ${JSON.stringify(updatedNoteFromService)}. This could mean Baserow acknowledged the update but didn't change the data, or returned old data.`);
      // If Baserow returns the *old* data but with a success status code,
      // this log will fire. We still proceed with revalidation as Baserow didn't error.
      // The client UI will show a success toast based on result.success, but if the data isn't truly updated
      // in Baserow, the re-fetch will show old data.
    }


    revalidatePath('/actions/create-subject-notes');
    console.log(`editSubjectNoteAction successful for noteId ${noteId}. Path /actions/create-subject-notes revalidated.`);
    console.log('--- Ending editSubjectNoteAction (Success) ---');
    return { success: true, note: updatedNoteFromService };

  } catch (error: any) {
    console.error(`Critical error in editSubjectNoteAction for note ${noteId}:`, error.message, error.stack);
    console.log('--- Ending editSubjectNoteAction (Error) ---');
    return { success: false, error: error.message || 'An unexpected error occurred while updating the note.' };
  }
}

