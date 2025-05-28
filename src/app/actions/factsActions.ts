
// src/app/actions/factsActions.ts
'use server';

import {
  fetchFacts,
  createFact,
  type FactRecord,
  type FetchFactsResponse,
} from '@/services/baserowService';
import { revalidatePath } from 'next/cache';

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
}): Promise<AddFactResult> {
  try {
    const newFact = await createFact(data);
    if (!newFact) {
      throw new Error('Failed to create fact in Baserow.');
    }
    revalidatePath('/actions/add-facts');
    return { success: true, fact: newFact };
  } catch (error: any) {
    console.error('Error in addFactAction:', error);
    return { success: false, error: error.message || 'An unexpected error occurred while adding the fact.' };
  }
}
