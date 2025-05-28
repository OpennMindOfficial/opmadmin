
// src/app/actions/factsActions.ts
'use server';

import {
  fetchFacts,
  createFact,
  type FactRecord,
  type FetchFactsResponse,
} from '@/services/baserowService';
import { revalidatePath } from 'next/cache';
import { logActivityAction } from './activityLogActions';

interface GetFactsResult {
  success: boolean;
  facts?: FactRecord[];
  totalPages?: number;
  totalFacts?: number;
  error?: string;
}

export async function getFactsAction(page: number, limit: number): Promise<GetFactsResult> {
  try {
    const response: FetchFactsResponse = await fetchFacts(page, limit);
    const totalFacts = response.count;
    const totalPages = Math.ceil(totalFacts / limit);
    return { success: true, facts: response.results, totalPages, totalFacts };
  } catch (error: any) {
    console.error('Error in getFactsAction:', error);
    return { success: false, error: error.message || 'Failed to fetch facts.' };
  }
}

interface AddFactResult {
  success: boolean;
  fact?: FactRecord;
  error?: string;
}

export async function addFactAction(data: {
  Category?: string;
  Fact?: string;
  Image?: string;
  Source?: string;
  userNameForLog?: string;
}): Promise<AddFactResult> {
  try {
    const factPayload = {
        Category: data.Category,
        Fact: data.Fact,
        Image: data.Image,
        Source: data.Source,
    };
    const newFact = await createFact(factPayload);
    if (!newFact) {
      throw new Error('Failed to create fact in Baserow.');
    }

    // Log activity
    await logActivityAction({
      Name: data.userNameForLog || newFact.Category || "User",
      Did: 'added new fact',
      Task: `Category: ${newFact.Category || 'N/A'} - Fact: ${(newFact.Fact || '').substring(0, 30)}...`,
    });

    revalidatePath('/actions/add-facts');
    return { success: true, fact: newFact };
  } catch (error: any) {
    console.error('Error in addFactAction:', error);
    return { success: false, error: error.message || 'An unexpected error occurred while adding the fact.' };
  }
}

