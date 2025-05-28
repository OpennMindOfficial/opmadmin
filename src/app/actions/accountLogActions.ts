
// src/app/actions/accountLogActions.ts
'use server';

import {
  fetchAccountChangesLog,
  type AccountChangeLogEntryBaserowRecord,
} from '@/services/baserowService';
import { revalidatePath } from 'next/cache';

export interface AccountChangeLogEntry {
  id: number;
  userName?: string;
  userEmail?: string;
  action?: string; // Mapped from "Change(s)"
  details?: string; // Potentially also from "Change(s)" or a separate field if available
  timestamp?: string; // Mapped from "Date/Time"
  status?: string; // Mapped from "Success/Failure"
}

interface GetAccountChangesLogResult {
  success: boolean;
  logs?: AccountChangeLogEntry[];
  error?: string;
}

export async function getAccountChangesLogAction(): Promise<GetAccountChangesLogResult> {
  try {
    const baserowLogs = await fetchAccountChangesLog();
    const logs: AccountChangeLogEntry[] = baserowLogs.map(log => ({
      id: log.id,
      userName: log.Name,
      userEmail: log.Email,
      // Assuming "Change(s)" field might contain structured data like "Action: Details"
      // or just a general description. For now, putting it directly into 'action'.
      action: log['Change(s)'], 
      details: '', // Could be derived if "Change(s)" is structured, or if another field exists
      timestamp: log['Date/Time'],
      status: log['Success/Failure'],
    }));
    // No revalidatePath needed for a GET action usually, unless it's part of a mutation flow later
    return { success: true, logs };
  } catch (error: any) {
    console.error('Error in getAccountChangesLogAction:', error);
    return { success: false, error: error.message || 'Failed to fetch account change logs.' };
  }
}
