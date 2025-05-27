
// src/services/baserowService.ts
'use server';

const BASEROW_API_URL = 'https://api.baserow.io';
// IMPORTANT: In a real application, store API Key and Table ID in environment variables.
const BASEROW_API_KEY = '1GWSYGr6hU9Gv7W3SBk7vNlvmUzWa8Io'; // As provided by user
const BASEROW_TABLE_ID = '551777'; // As provided by user

export interface UserRecord {
  id: number;
  order: string;
  Name?: string;
  Email: string;
  Password?: string; // This will be the bcrypt hash
  'First signin'?: string; // Date string YYYY-MM-DDTHH:mm:ss.sssZ
  'Last active'?: string; // Date string YYYY-MM-DDTHH:mm:ss.sssZ
  'First time'?: 'YES' | 'NO';
  Role?: string; // New field
  [key: string]: any; // For other fields
}

async function makeBaserowRequest(
  endpoint: string,
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET',
  body?: any
) {
  const url = `${BASEROW_API_URL}${endpoint}`;
  const headers: HeadersInit = {
    'Authorization': `Token ${BASEROW_API_KEY}`,
    'Content-Type': 'application/json',
  };

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Baserow API Error:', { status: response.status, errorData, url, method, body });
      throw new Error(errorData.detail || `Baserow API request failed: ${response.statusText}`);
    }
    if (method === 'GET' || method === 'PATCH' || method === 'POST') {
      if (response.status === 204) return null; // Handle No Content response for PATCH
      return await response.json();
    }
    return null; // For DELETE or other methods not returning JSON body
  } catch (error) {
    console.error('Error in makeBaserowRequest:', error);
    throw error;
  }
}

export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  const endpoint = `/api/database/rows/table/${BASEROW_TABLE_ID}/?user_field_names=true&filter__Email__equal=${encodeURIComponent(email)}`;
  try {
    const data = await makeBaserowRequest(endpoint, 'GET');
    if (data && data.results && data.results.length > 0) {
      return data.results[0] as UserRecord;
    }
    return null;
  } catch (error) {
    console.error(`Failed to fetch user by email ${email}:`, error);
    return null;
  }
}

export async function updateUser(rowId: number, updates: Partial<UserRecord>): Promise<UserRecord | null> {
  const endpoint = `/api/database/rows/table/${BASEROW_TABLE_ID}/${rowId}/?user_field_names=true`;
  const fieldsToUpdate: { [key: string]: any } = {};
  for (const key in updates) {
    if (key !== 'id' && key !== 'order' && Object.prototype.hasOwnProperty.call(updates, key)) {
      fieldsToUpdate[key] = (updates as any)[key];
    }
  }

  try {
    return await makeBaserowRequest(endpoint, 'PATCH', fieldsToUpdate);
  } catch (error) {
    console.error(`Failed to update user ${rowId}:`, error);
    return null;
  }
}

export async function getAllUsers(): Promise<UserRecord[]> {
  const endpoint = `/api/database/rows/table/${BASEROW_TABLE_ID}/?user_field_names=true&size=200`; // Adjust size as needed
  try {
    const data = await makeBaserowRequest(endpoint, 'GET');
    return (data?.results || []) as UserRecord[];
  } catch (error) {
    console.error('Failed to fetch all users:', error);
    return [];
  }
}
