
// src/app/actions/questionActions.ts
'use server';

import {
  fetchAllQuestions,
  createQuestionEntry,
  type QuestionRecord,
} from '@/services/baserowService';
import { revalidatePath } from 'next/cache';
import { logActivityAction } from './activityLogActions';

interface GetQuestionsResult {
  success: boolean;
  questions?: QuestionRecord[];
  error?: string;
}

export async function getQuestionsAction(): Promise<GetQuestionsResult> {
  try {
    const questions = await fetchAllQuestions();
    return { success: true, questions };
  } catch (error: any) {
    console.error('Error in getQuestionsAction:', error);
    return { success: false, error: error.message || 'Failed to fetch questions.' };
  }
}

interface AddQuestionResult {
  success: boolean;
  question?: QuestionRecord;
  error?: string;
}

// This action handles both individual and bulk additions based on the shape of data
export async function addQuestionAction(data: {
  Subject: string;
  ChapterID: string;
  Type: string;
  Questions: string; // Comma-separated string
  Solutions: string; // Comma-separated string
  userNameForLog?: string;
}): Promise<AddQuestionResult> {
  try {
    // Prepare payload for Baserow
    const payload: Omit<QuestionRecord, 'id' | 'order'> = {
      Subject: data.Subject,
      ChapterID: data.ChapterID,
      Type: data.Type,
      Questions: data.Questions,
      Solutions: data.Solutions,
    };

    const newQuestionEntry = await createQuestionEntry(payload);
    if (!newQuestionEntry) {
      throw new Error('Failed to create question entry in Baserow.');
    }

    // Log activity
    await logActivityAction({
      Name: data.userNameForLog || newQuestionEntry.Subject || "User",
      Did: 'added questions to QB',
      Task: `Subject: ${newQuestionEntry.Subject}, Chapter: ${newQuestionEntry.ChapterID}`,
    });

    revalidatePath('/actions/add-questions');
    return { success: true, question: newQuestionEntry };
  } catch (error: any) {
    console.error('Error in addQuestionAction:', error);
    return { success: false, error: error.message || 'An unexpected error occurred while adding the question(s).' };
  }
}

