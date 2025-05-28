
// src/app/actions/ncertActions.ts
'use server';

import {
  fetchAllNcertSources,
  createNcertSource,
  type NcertSourceRecord,
} from '@/services/baserowService';
import { revalidatePath } from 'next/cache';
import { logActivityAction } from './activityLogActions';

interface GetNcertSourcesResult {
  success: boolean;
  sources?: NcertSourceRecord[];
  error?: string;
}

export async function getNcertSourcesAction(): Promise<GetNcertSourcesResult> {
  try {
    const sources = await fetchAllNcertSources();
    return { success: true, sources };
  } catch (error: any) {
    console.error('Error in getNcertSourcesAction:', error);
    return { success: false, error: error.message || 'Failed to fetch NCERT sources.' };
  }
}

interface AddNcertSourceResult {
  success: boolean;
  source?: NcertSourceRecord;
  error?: string;
}

export async function addNcertSourceAction(data: {
  Subject?: string;
  Chapter?: string;
  Book?: string;
  Audio?: string;
  userNameForLog?: string;
}): Promise<AddNcertSourceResult> {
  try {
    const ncertPayload = {
        Subject: data.Subject,
        Chapter: data.Chapter,
        Book: data.Book,
        Audio: data.Audio,
    };
    const newSource = await createNcertSource(ncertPayload);
    if (!newSource) {
      throw new Error('Failed to create NCERT source in Baserow.');
    }

    // Log activity
    await logActivityAction({
      Name: data.userNameForLog || newSource.Subject || "User",
      Did: 'added NCERT source',
      Task: `Subject: ${newSource.Subject}, Chapter: ${newSource.Chapter}`,
    });

    revalidatePath('/actions/ncert-sources');
    return { success: true, source: newSource };
  } catch (error: any) {
    console.error('Error in addNcertSourceAction:', error);
    return { success: false, error: error.message || 'An unexpected error occurred while adding the NCERT source.' };
  }
}

