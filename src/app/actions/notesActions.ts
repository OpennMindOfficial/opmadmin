
// src/app/actions/notesActions.ts
'use server';

import {
  fetchSubjectNotes,
  createSubjectNote,
  deleteSubjectNote,
  updateSubjectNote, // Ensure this service function is robust
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
  noteId: number, // This MUST be Baserow's internal row ID
  newData: { subject: string; chapter: string; notes: string }
): Promise<EditNoteResult> {
  console.log('--- editSubjectNoteAction: INITIATED ---');
  console.log(`Attempting to edit note with Baserow internal ID: ${noteId}`);
  console.log('Data received for update (from client form):', JSON.stringify(newData, null, 2));

  // Construct the payload with exact field names expected by Baserow
  // Ensure these (Subject, Chapter, Notes) are the EXACT case-sensitive field names in your Baserow table.
  const payloadToUpdate: Partial<Omit<SubjectNoteRecord, 'id' | 'order' | 'ID'>> = {
    Subject: newData.subject,
    Chapter: newData.chapter,
    Notes: newData.notes,
  };

  console.log('Payload being sent to updateSubjectNote service:', JSON.stringify(payloadToUpdate, null, 2));

  try {
    const updatedNoteFromService = await updateSubjectNote(noteId, payloadToUpdate);

    // Log the raw response from the service layer
    console.log('Response from updateSubjectNote service (Baserow PATCH response):', JSON.stringify(updatedNoteFromService, null, 2));

    // Check if the update was successful based on the service's response
    // A successful PATCH to Baserow should return the updated row object.
    if (updatedNoteFromService && typeof updatedNoteFromService.id === 'number') {
      console.log(`editSubjectNoteAction: Update for noteId ${noteId} appears successful based on service response.`);
      
      // Optional: Verify if returned data matches sent data (for deeper debugging if needed)
      const dataMatched = 
          updatedNoteFromService.Subject === payloadToUpdate.Subject &&
          updatedNoteFromService.Chapter === payloadToUpdate.Chapter &&
          updatedNoteFromService.Notes === payloadToUpdate.Notes;

      if (!dataMatched) {
          console.warn(`POTENTIAL DATA MISMATCH or Baserow quirk for noteId ${noteId}: Baserow's response data does not exactly match the sent payload. The update might have occurred but Baserow's response differs, or a specific field wasn't updated as expected. Sent: ${JSON.stringify(payloadToUpdate)}, Received: ${JSON.stringify(updatedNoteFromService)}`);
          // Depending on strictness, you could treat this as an error or proceed.
          // For now, we proceed if we got a valid row object back.
      }

      revalidatePath('/actions/create-subject-notes');
      console.log(`editSubjectNoteAction: Path /actions/create-subject-notes revalidated for noteId ${noteId}.`);
      console.log('--- editSubjectNoteAction: COMPLETED (Success) ---');
      return { success: true, note: updatedNoteFromService };
    } else {
      // This case means updateSubjectNote returned null or an invalid object,
      // indicating the PATCH likely failed at the API level or didn't return the expected row data.
      console.error(`editSubjectNoteAction: Update failed for noteId ${noteId}. updateSubjectNote service returned null or an invalid object. Response was: ${JSON.stringify(updatedNoteFromService)}`);
      console.log('--- editSubjectNoteAction: COMPLETED (Failure) ---');
      return { success: false, error: 'Failed to update note in Baserow. The service did not return valid updated data.' };
    }
  } catch (error: any) {
    console.error(`editSubjectNoteAction: CRITICAL ERROR during update for noteId ${noteId}:`, error.message, error.stack);
    console.log('--- editSubjectNoteAction: COMPLETED (Critical Error) ---');
    return { success: false, error: error.message || 'An unexpected critical error occurred while updating the note.' };
  }
}
