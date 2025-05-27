
// src/app/actions/managementActions.ts
'use server';

import {
  fetchAllSubjects,
  createNewSubject,
  fetchAllBugReports,
  fetchAboutUsData,
  updateAboutUsData,
  fetchPerformanceTableData, // New import
  type AddSubjectBaserowRecord,
  type BugReportBaserowRecord,
  type AboutUsBaserowRecord,
  type PerformanceUserMainDataRecord, // New import
  type PerformanceSubjectDataRecord, // New import
} from '@/services/baserowService';
import { revalidatePath } from 'next/cache';

// --- Add Subject Actions ---
interface GetSubjectsResult {
  success: boolean;
  subjects?: AddSubjectBaserowRecord[];
  error?: string;
}
export async function getSubjectsAction(): Promise<GetSubjectsResult> {
  try {
    const subjects = await fetchAllSubjects();
    return { success: true, subjects };
  } catch (error: any) {
    console.error('Error in getSubjectsAction:', error);
    return { success: false, error: error.message || 'Failed to fetch subjects.' };
  }
}

interface CreateSubjectResult {
  success: boolean;
  subject?: AddSubjectBaserowRecord;
  error?: string;
}
export async function createSubjectAction(data: {
  Subject: string;
  Topics?: string;
  Chapters?: string;
  'Topics divided'?: string;
}): Promise<CreateSubjectResult> {
  try {
    const newSubject = await createNewSubject(data);
    if (!newSubject) {
      throw new Error('Failed to create subject in Baserow or received incomplete data.');
    }
    revalidatePath('/actions/add-subject');
    return { success: true, subject: newSubject };
  } catch (error: any) {
    console.error('Error in createSubjectAction:', error);
    return { success: false, error: error.message || 'An unexpected error occurred while adding the subject.' };
  }
}

// --- View Reported Bugs Actions ---
interface GetBugReportsResult {
  success: boolean;
  reports?: BugReportBaserowRecord[];
  error?: string;
}
export async function getBugReportsAction(): Promise<GetBugReportsResult> {
  try {
    const reports = await fetchAllBugReports();
    return { success: true, reports };
  } catch (error: any) {
    console.error('Error in getBugReportsAction:', error);
    return { success: false, error: error.message || 'Failed to fetch bug reports.' };
  }
}

// --- Edit About Us Actions ---
interface GetAboutUsResult {
  success: boolean;
  content?: AboutUsBaserowRecord;
  error?: string;
}
export async function getAboutUsContentAction(rowId: number = 1): Promise<GetAboutUsResult> {
  try {
    const content = await fetchAboutUsData(rowId);
    if (!content) {
        return { success: false, error: `About Us content not found for row ID ${rowId}.` };
    }
    return { success: true, content };
  } catch (error: any) {
    console.error('Error in getAboutUsContentAction:', error);
    return { success: false, error: error.message || 'Failed to fetch About Us content.' };
  }
}

interface UpdateAboutUsResult {
  success: boolean;
  content?: AboutUsBaserowRecord;
  error?: string;
}
export async function updateAboutUsContentAction(
  data: { Mission: string; Story: string },
  rowId: number = 1 // Assuming a single row for About Us content or a configurable one
): Promise<UpdateAboutUsResult> {
  try {
    const updatedContent = await updateAboutUsData(rowId, data);
    if (!updatedContent) {
      throw new Error('Failed to update About Us content in Baserow or received incomplete data.');
    }
    revalidatePath('/actions/edit-about-us');
    return { success: true, content: updatedContent };
  } catch (error: any) {
    console.error('Error in updateAboutUsContentAction:', error);
    return { success: false, error: error.message || 'An unexpected error occurred while updating About Us content.' };
  }
}

// --- Performance Tracking Actions ---
interface GetPerformanceDataResult {
  success: boolean;
  data?: Array<PerformanceUserMainDataRecord | PerformanceSubjectDataRecord>;
  error?: string;
}

export async function getPerformanceDataAction(tableId: string): Promise<GetPerformanceDataResult> {
  try {
    const data = await fetchPerformanceTableData(tableId);
    return { success: true, data };
  } catch (error: any) {
    console.error(`Error in getPerformanceDataAction for table ${tableId}:`, error);
    return { success: false, error: error.message || `Failed to fetch performance data for table ${tableId}.` };
  }
}
    
