
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
import { logActivityAction } from './activityLogActions';

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
  // Assuming user's name/email might be passed for logging if available from client
  userNameForLog?: string; 
}): Promise<AddNoteResult> {
  console.log('--- addSubjectNoteAction: INITIATED ---');
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

    // Log activity
    await logActivityAction({
      Name: data.userNameForLog || createdNote.Subject || "User",
      Did: 'added new note for subject',
      Task: `${createdNote.Subject} - ${createdNote.Chapter}`,
    });

    revalidatePath('/actions/create-subject-notes');
    console.log('addSubjectNoteAction successful, path revalidated.');
    console.log('--- addSubjectNoteAction: COMPLETED (Success) ---');
    return { success: true, note: createdNote };
  } catch (error: any) {
    console.error('Error in addSubjectNoteAction:', error);
    console.log('--- addSubjectNoteAction: COMPLETED (Error) ---');
    return { success: false, error: error.message || 'An unexpected error occurred while adding the note.' };
  }
}

interface DeleteNoteResult {
  success: boolean;
  error?: string;
}

export async function deleteSubjectNoteAction(id: number, noteSubject?: string, noteChapter?: string, userNameForLog?: string): Promise<DeleteNoteResult> {
  console.log('--- deleteSubjectNoteAction: INITIATED ---');
  console.log('Called for id:', id);
  try {
    const success = await deleteSubjectNote(id);
    if (!success) {
      console.error(`Failed to delete note ${id} from Baserow.`);
      return { success: false, error: 'Failed to delete note from Baserow.' };
    }

    // Log activity
    if (noteSubject && noteChapter) {
        await logActivityAction({
            Name: userNameForLog || noteSubject || "User",
            Did: 'deleted note for subject',
            Task: `${noteSubject} - ${noteChapter}`,
        });
    }
    
    revalidatePath('/actions/create-subject-notes');
    console.log(`deleteSubjectNoteAction successful for id ${id}, path revalidated.`);
    console.log('--- deleteSubjectNoteAction: COMPLETED (Success) ---');
    return { success: true };
  } catch (error: any) {
    console.error(`Error in deleteSubjectNoteAction for id ${id}:`, error);
    console.log('--- deleteSubjectNoteAction: COMPLETED (Error) ---');
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
  newData: { subject: string; chapter: string; notes: string },
  userNameForLog?: string
): Promise<EditNoteResult> {
  console.log('--- editSubjectNoteAction: INITIATED ---');
  console.log(`Attempting to edit note with Baserow internal ID: ${noteId}`);
  console.log('Data received for update (from client form):', JSON.stringify(newData, null, 2));

  const payloadToUpdate: Partial<Omit<SubjectNoteRecord, 'id' | 'order' | 'created_on' | 'updated_on'>> = {
    Subject: newData.subject,
    Chapter: newData.chapter,
    Notes: newData.notes,
  };

  console.log('Payload being sent to updateSubjectNote service:', JSON.stringify(payloadToUpdate, null, 2));

  try {
    const updatedNoteFromService = await updateSubjectNote(noteId, payloadToUpdate);
    console.log('Response from updateSubjectNote service (Baserow PATCH response):', JSON.stringify(updatedNoteFromService, null, 2));

    if (updatedNoteFromService && typeof updatedNoteFromService.id === 'number') {
      console.log(`editSubjectNoteAction: Update for noteId ${noteId} considered successful based on service response.`);
      
      const dataMatched = 
          updatedNoteFromService.Subject === payloadToUpdate.Subject &&
          updatedNoteFromService.Chapter === payloadToUpdate.Chapter &&
          updatedNoteFromService.Notes === payloadToUpdate.Notes;

      if (!dataMatched) {
          console.warn(`POTENTIAL DATA MISMATCH for noteId ${noteId}: Baserow's response data does not exactly match the sent payload. The update might have occurred but Baserow's response differs. Sent: ${JSON.stringify(payloadToUpdate)}, Received: ${JSON.stringify(updatedNoteFromService)}`);
      } else {
          console.log(`Data verification successful for noteId ${noteId}.`);
      }

      // Log activity
      await logActivityAction({
        Name: userNameForLog || updatedNoteFromService.Subject || "User",
        Did: 'edited note for subject',
        Task: `${updatedNoteFromService.Subject} - ${updatedNoteFromService.Chapter}`,
      });

      revalidatePath('/actions/create-subject-notes');
      console.log(`editSubjectNoteAction: Path /actions/create-subject-notes revalidated for noteId ${noteId}.`);
      console.log('--- editSubjectNoteAction: COMPLETED (Success) ---');
      return { success: true, note: updatedNoteFromService };
    } else {
      console.error(`editSubjectNoteAction: Update failed for noteId ${noteId}. updateSubjectNote service returned null, an invalid object, or Baserow error. Response was: ${JSON.stringify(updatedNoteFromService)}`);
      console.log('--- editSubjectNoteAction: COMPLETED (Failure) ---');
      return { success: false, error: 'Failed to update note in Baserow. The service did not return valid updated data or an error occurred.' };
    }
  } catch (error: any) {
    console.error(`editSubjectNoteAction: CRITICAL ERROR during update for noteId ${noteId}:`, error.message, error.stack);
    console.log('--- editSubjectNoteAction: COMPLETED (Critical Error) ---');
    return { success: false, error: error.message || 'An unexpected critical error occurred while updating the note.' };
  }
}

