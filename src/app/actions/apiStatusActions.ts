
// src/app/actions/apiStatusActions.ts
'use server';

import {
  fetchAllApiStatuses,
  createApiStatusEntry,
  type ApiStatusBaserowRecord,
} from '@/services/baserowService';
import { revalidatePath } from 'next/cache';

interface GetApiStatusesResult {
  success: boolean;
  statuses?: ApiStatusBaserowRecord[];
  error?: string;
}

export async function getApiStatusesAction(): Promise<GetApiStatusesResult> {
  try {
    const statuses = await fetchAllApiStatuses();
    return { success: true, statuses };
  } catch (error: any) {
    console.error('Error in getApiStatusesAction:', error);
    return { success: false, error: error.message || 'Failed to fetch API statuses.' };
  }
}

interface AddApiStatusResult {
  success: boolean;
  statusEntry?: ApiStatusBaserowRecord;
  error?: string;
}

// The data type should match what the form will provide.
// For now, allowing partial data from the ApiStatusBaserowRecord type.
// The Baserow field names 'Used In' and 'API Key' require string keys.
export async function addApiStatusAction(data: {
  'ID'?: number | string;
  'Used In'?: string;
  'API Key'?: string;
  'Active'?: boolean;
  'By'?: string;
}): Promise<AddApiStatusResult> {
  try {
    // The createApiStatusEntry service function expects an object
    // that directly maps to Baserow field names.
    const payload = {
      'ID': data.ID,
      'Used In': data['Used In'],
      'API Key': data['API Key'],
      'Active': data.Active, // Pass directly, service can handle default if needed
      'By': data.By,
    };
    const newStatusEntry = await createApiStatusEntry(payload);
    if (!newStatusEntry) {
      throw new Error('Failed to create API status entry in Baserow.');
    }
    revalidatePath('/actions/api-status'); // Revalidate the page showing API statuses
    return { success: true, statusEntry: newStatusEntry };
  } catch (error: any) {
    console.error('Error in addApiStatusAction:', error);
    return { success: false, error: error.message || 'An unexpected error occurred while adding the API status.' };
  }
}
