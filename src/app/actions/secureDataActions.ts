
// src/app/actions/secureDataActions.ts
'use server';

import bcrypt from 'bcryptjs';
import { 
    fetchFirstPagePassword, 
    createAccessLogEntry,
    fetchUserAccountData,
    fetchProUsersData,
    type PagePasswordRecord,
    type AccessLogRecord as BaserowAccessLogRecord, // Alias to avoid naming conflict
    type UserRecord,
    type ProUserSpecificRecord
} from '@/services/baserowService';

interface VerifyPasswordResult {
  success: boolean;
  error?: string;
}

export async function verifyPagePasswordAction(enteredPassword: string): Promise<VerifyPasswordResult> {
  try {
    const storedPasswordRecord = await fetchFirstPagePassword(); // Fetches first row's password
    if (!storedPasswordRecord || !storedPasswordRecord.Password) {
      console.error('[SecureDataActions] Page password not found in Baserow table 552919.');
      return { success: false, error: 'Configuration error. Please contact support.' };
    }

    const passwordMatches = await bcrypt.compare(enteredPassword, storedPasswordRecord.Password);

    if (!passwordMatches) {
      return { success: false, error: 'Incorrect password.' };
    }
    return { success: true };
  } catch (error: any) {
    console.error('[SecureDataActions] Error verifying page password:', error);
    return { success: false, error: error.message || 'An unexpected error occurred during password verification.' };
  }
}

// Use the aliased type for the parameter
interface LogAccessAttemptResult {
  success: boolean;
  logEntry?: BaserowAccessLogRecord;
  error?: string;
}

export async function logAccessAttemptAction(logData: {
  Name?: string;
  Email?: string;
  'Date/Time'?: string;
  Result?: 'Success' | 'Failure';
  Reason?: string;
}): Promise<LogAccessAttemptResult> {
  try {
    const newLogEntry = await createAccessLogEntry(logData);
    if (!newLogEntry) {
      console.error('[SecureDataActions] Failed to create access log entry in Baserow table 552920.');
      return { success: false, error: 'Failed to log access attempt.' };
    }
    return { success: true, logEntry: newLogEntry };
  } catch (error: any) {
    console.error('[SecureDataActions] Error logging access attempt:', error);
    return { success: false, error: error.message || 'An unexpected error occurred while logging access attempt.' };
  }
}


interface FetchProtectedDataResult<T> {
    success: boolean;
    data?: T[];
    error?: string;
}

export async function fetchProtectedUsersDataAction(): Promise<FetchProtectedDataResult<UserRecord>> {
    try {
        const users = await fetchUserAccountData();
        return { success: true, data: users };
    } catch (error: any) {
        console.error('[SecureDataActions] Error fetching protected user data:', error);
        return { success: false, error: error.message || 'Failed to fetch user data.' };
    }
}

export async function fetchProtectedProUsersDataAction(): Promise<FetchProtectedDataResult<ProUserSpecificRecord>> {
    try {
        const proUsers = await fetchProUsersData();
        return { success: true, data: proUsers };
    } catch (error: any) {
        console.error('[SecureDataActions] Error fetching protected pro user data:', error);
        return { success: false, error: error.message || 'Failed to fetch pro user data.' };
    }
}
