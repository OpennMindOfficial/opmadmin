
// src/app/actions/activityLogActions.ts
'use server';

import {
  fetchActivityLogs,
  createActivityLogEntry,
  type ActivityLogBaserowRecord,
} from '@/services/baserowService';
import { revalidatePath } from 'next/cache';
import { formatISO } from 'date-fns';

// Interface for data passed to logActivityAction
export interface ActivityLogData {
  Name: string;
  Did: string;
  Task: string;
}

interface LogActivityResult {
  success: boolean;
  logEntry?: ActivityLogBaserowRecord;
  error?: string;
}

export async function logActivityAction(data: ActivityLogData): Promise<LogActivityResult> {
  try {
    const payload: Omit<ActivityLogBaserowRecord, 'id' | 'order' | 'created_on' | 'updated_on'> = {
      Name: data.Name,
      Did: data.Did,
      Task: data.Task,
      'Date/Time': formatISO(new Date()), // Always use current server time for logging
    };
    const newLogEntry = await createActivityLogEntry(payload);
    if (!newLogEntry) {
      throw new Error('Failed to create activity log entry in Baserow.');
    }
    // Revalidate paths that display activity logs
    revalidatePath('/');
    revalidatePath('/activity');
    return { success: true, logEntry: newLogEntry };
  } catch (error: any) {
    console.error('Error in logActivityAction:', error);
    return { success: false, error: error.message || 'An unexpected error occurred while logging activity.' };
  }
}

// Interface for data returned by getActivityLogsAction
export interface ActivityLogClientEntry {
  id: number;
  name: string;
  action: string; // "Did" field
  subject: string; // "Task" field
  timestamp: string; // "Date/Time" field (ISO string)
}

interface GetActivityLogsResult {
  success: boolean;
  logs?: ActivityLogClientEntry[];
  error?: string;
}

export async function getActivityLogsAction(limit?: number): Promise<GetActivityLogsResult> {
  try {
    const baserowLogs = await fetchActivityLogs(limit);
    const logs: ActivityLogClientEntry[] = baserowLogs.map(log => ({
      id: log.id,
      name: log.Name,
      action: log.Did,
      subject: log.Task,
      timestamp: log['Date/Time'],
    }));
    return { success: true, logs };
  } catch (error: any) {
    console.error('Error in getActivityLogsAction:', error);
    return { success: false, error: error.message || 'Failed to fetch activity logs.' };
  }
}
