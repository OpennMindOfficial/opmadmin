
// src/services/baserowService.ts
'use server';

import { formatISO } from 'date-fns';

const BASEROW_API_URL = 'https://api.baserow.io';
const BASEROW_API_KEY = '1GWSYGr6hU9Gv7W3SBk7vNlvmUzWa8Io'; 

// Table ID for team/user login and general user data
const BASEROW_TEAM_TABLE_ID = '551777'; 

// Table ID for CEO specific login
const BASEROW_CEO_TABLE_ID = '552544';

// Table ID for Subject Notes
const BASEROW_SUBJECT_NOTES_TABLE_ID = '552726'; 

// Table IDs for Management Pages
const BASEROW_ADD_SUBJECT_TABLE_ID = '548576';
const BASEROW_BUG_REPORTS_TABLE_ID = '542797';
const BASEROW_ABOUT_US_TABLE_ID = '542795';
const BASEROW_FACTS_TABLE_ID = '542791';
const BASEROW_QUESTIONS_TABLE_ID = '552908';
const BASEROW_NCERT_SOURCES_TABLE_ID = '552910';
const BASEROW_API_STATUS_TABLE_ID = '542782';
const BASEROW_API_TEST_CONFIG_TABLE_ID = '542783';
const BASEROW_ACCOUNT_CHANGES_TABLE_ID = '542794'; 
const BASEROW_NOTIFICATIONS_TABLE_ID = '542798';
const BASEROW_WEBSITE_TRAFFIC_TABLE_ID = '542800';
const BASEROW_AI_USAGE_TABLE_ID = '553904';
const BASEROW_TASKS_TABLE_ID = '552540';
const BASEROW_ACTIVITY_LOG_TABLE_ID = '554167';


// Table IDs for Secure Page Access
const BASEROW_PAGE_PASSWORD_TABLE_ID = '552919';
const BASEROW_ACCESS_LOG_TABLE_ID = '552920';

// Table IDs for Performance Tracking
const BASEROW_PERFORMANCE_USER_MAIN_TABLE_ID = '546405';
const BASEROW_PERFORMANCE_SUBJECT_TABLE_ID = '546409';


// --- Base Record Types ---
interface BaseRecord {
  id: number; // Baserow's internal row ID
  order: string;
  created_on: string; 
  updated_on: string; 
  [key: string]: any;
}

// --- Specific Record Interfaces ---
export interface UserRecord extends BaseRecord {
  Name?: string; 
  Email: string;
  Password?: string; 
  'First signin'?: string; 
  'Last active'?: string; 
  'First time'?: 'YES' | 'NO';
  Role?: string; 
  DOB?: string; 
  Class?: string; 
  AuthMethod?: string; 
  FirebaseUID?: string; 
  Board?: string; 
}

export interface CeoUserRecord extends BaseRecord {
  Name?: string;
  Email: string;
  Password?: string;
  'Last active'?: string;
}

export interface SubjectNoteRecord extends BaseRecord {
  ID?: number | string; // User-defined ID
  Subject?: string;
  Chapter?: string;
  Notes?: string;
}

export interface AddSubjectBaserowRecord extends BaseRecord {
  Subject: string;
  Topics?: string;
  Chapters?: string;
  'Topics divided'?: string; 
}

export interface BugReportBaserowRecord extends BaseRecord {
  Name: string;
  Email: string;
  Report: string;
  Date: string; 
}

export interface AboutUsBaserowRecord extends BaseRecord {
  Mission: string;
  Story: string;
}

export interface FactRecord extends BaseRecord {
  Category?: string;
  Fact?: string;
  Image?: string; // URL
  Source?: string;
  Shares?: number;
  Downloads?: number;
}

export interface QuestionRecord extends BaseRecord {
  Subject?: string;
  ChapterID?: string;
  Type?: string;
  Questions?: string; // Comma-separated
  Solutions?: string; // Comma-separated
}

export interface NcertSourceRecord extends BaseRecord {
  Subject?: string;
  Chapter?: string;
  Book?: string;
  Audio?: string; // URL to mp3 file
}

export interface ApiStatusBaserowRecord extends BaseRecord {
  ID?: number | string; // User-defined ID
  'Used In'?: string;
  'API Key'?: string;
  Active?: boolean | string; 
  By?: string;
}

export interface ApiTestConfigRecord extends BaseRecord {
  ID?: string | number; // User-defined ID
  Type?: string;
  Data?: string; // Comma-separated API keys
  'Use case'?: string;
  Active?: boolean | string;
}

export interface PagePasswordRecord extends BaseRecord {
    Password?: string; 
    Identifier?: string; 
}

export interface AccessLogRecord extends BaseRecord {
    Name?: string;
    Email?: string;
    'Date/Time'?: string; 
    Result?: 'Success' | 'Failure';
    Reason?: string; 
}

export interface AccountChangeLogEntryBaserowRecord extends BaseRecord {
  Name?: string;
  Email?: string;
  'Change(s)'?: string; 
  'Date/Time'?: string;
  'Success/Failure'?: string; 
}

export interface PerformanceUserMainDataRecord extends BaseRecord {
  Name?: string;
  Email?: string;
  'Total Study Hours'?: number;
  'Goal Completion'?: string;
  'Active days streak'?: number;
  'Lessons Completed'?: number;
  'Avg Study Session'?: string;
  'Completion Rate'?: string;
  'Notes Taken'?: number;
  'Retention Rate'?: string;
  'Daily Study'?: string;
}

export interface PerformanceSubjectDataRecord extends BaseRecord {
  Name?: string;
  Email?: string;
  Subjects?: string;
  Hours?: string;
  'Goal Progress'?: string;
  'Last Active'?: string; 
}

export interface ProUserSpecificRecord extends UserRecord { 
    DatePurchased?: string;
    DateExpiring?: string;
    Cost?: number;
    'Monthly/Yearly'?: 'Monthly' | 'Yearly';
}

export interface NotificationBaserowRecord extends BaseRecord {
  Title?: string;
  Desc?: string; // Description of the notification
  PageToTakeTo?: string; // URL
  ShownTo?: string; // e.g., "All Users", "Group:Admins", "User:email@example.com"
  ShownFrom?: string; // ISO Date string or YYYY-MM-DD
  ShownTill?: string; // ISO Date string or YYYY-MM-DD
  Views?: number;
  Clicks?: number;
}

export interface WebsiteTrafficBaserowRecord extends BaseRecord {
  Visits?: number;
  Date?: string; 
  'Avg active time'?: string; 
  'Number of users'?: number;
  'Logged in users'?: number;
}

export interface AiUsageBaserowRecord extends BaseRecord {
  'Number of Messages sent'?: number;
  Date?: string;
  'Number of users'?: number;
  'Most asked subject'?: string;
  'Tokens used'?: number;
}

export interface TaskRecord extends BaseRecord {
  Task?: string;
  Info?: string;
  'assigned to'?: string; 
  Due?: string;
  Completed?: string; 
  Date_of_completion?: string; 
  Date_assigned?: string; 
}

export interface ActivityLogBaserowRecord extends BaseRecord {
  Name: string;
  Did: string; // e.g., "completed task", "added a new subject"
  Task: string; // e.g., "Finalize Q3 Report", "Quantum Physics 101" (could be entity name)
  'Date/Time': string; // ISO 8601 string
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
    cache: 'no-store', 
  };

  if (body && (method === 'POST' || method === 'PATCH')) {
    options.body = JSON.stringify(body);
  }
  
  console.log(`[BaserowService] Request: ${method} ${url}`, body && (method === 'POST' || method === 'PATCH') ? `Body: ${JSON.stringify(body)}` : '(No Body or GET/DELETE request)');


  try {
    const response = await fetch(url, options);
    
    const responseStatusText = `${response.status} ${response.statusText}`;
    console.log(`[BaserowService] Response Status for ${method} ${url}: ${responseStatusText}`);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
         console.error('[BaserowService] API Error Data:', JSON.stringify(errorData, null, 2));
      } catch (e) {
        errorData = { detail: `Failed to parse error JSON. Status: ${responseStatusText}` };
        console.error('[BaserowService] Failed to parse error JSON from Baserow.');
      }
      const errorMessage = errorData?.detail || (typeof errorData?.error === 'string' ? errorData.error : errorData?.error?.detail) || `Baserow API request failed: ${responseStatusText}`;
      console.error('[BaserowService] Full API Error:', { status: response.status, statusText: response.statusText, errorDetail: errorMessage, url, method, requestBody: body ? JSON.stringify(body) : 'No Body' });
      
      const error = new Error(errorMessage) as any;
      error.url = url; 
      error.baserowError = errorData; 
      throw error;
    }

    if (method === 'DELETE' || response.status === 204) { 
      console.log(`[BaserowService] Response: ${responseStatusText} (No Content for ${method} ${url})`);
      return null; 
    }
    
    const responseData = await response.json();
    const responsePreview = JSON.stringify(responseData);
    console.log(`[BaserowService] Response Data for ${method} ${url}:`, responsePreview.substring(0, 500) + (responsePreview.length > 500 ? '...' : '')); 
    return responseData;

  } catch (error: any) {
    console.error(`[BaserowService] CRITICAL Error in makeBaserowRequest to ${url} with method ${method}:`, error.message, error.stack);
    throw error; 
  }
}

// User Functions (Table BASEROW_TEAM_TABLE_ID)
export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  const endpoint = `/api/database/rows/table/${BASEROW_TEAM_TABLE_ID}/?user_field_names=true&filter__Email__equal=${encodeURIComponent(email)}`;
  console.log(`--- Service: getUserByEmail (Table ID: ${BASEROW_TEAM_TABLE_ID}) for email: ${email} ---`);
  try {
    const data = await makeBaserowRequest(endpoint, 'GET');
    if (data && data.results && data.results.length > 0) {
      console.log(`[BaserowService] User found for email ${email}:`, data.results[0]);
      return data.results[0] as UserRecord;
    }
    console.log(`[BaserowService] No user found for email ${email} in table ${BASEROW_TEAM_TABLE_ID}.`);
    return null;
  } catch (error) {
    console.error(`[BaserowService] Failed to fetch user by email ${email} from table ${BASEROW_TEAM_TABLE_ID}:`, error);
    throw error; 
  }
}

export async function getUserById(rowId: number): Promise<UserRecord | null> {
  const endpoint = `/api/database/rows/table/${BASEROW_TEAM_TABLE_ID}/${rowId}/?user_field_names=true`;
   console.log(`--- Service: getUserById (Table ID: ${BASEROW_TEAM_TABLE_ID}, Row ID: ${rowId}) ---`);
   try {
    const data = await makeBaserowRequest(endpoint, 'GET');
    return data as UserRecord;
  } catch (error) {
    console.error(`[BaserowService] Failed to fetch user by ID ${rowId} from table ${BASEROW_TEAM_TABLE_ID}:`, error);
    throw error;
  }
}

export async function updateUser(rowId: number, updates: Partial<UserRecord>): Promise<UserRecord | null> {
  const endpoint = `/api/database/rows/table/${BASEROW_TEAM_TABLE_ID}/${rowId}/?user_field_names=true`;
  const fieldsToUpdate: { [key: string]: any } = {};
  for (const key in updates) {
    if (key !== 'id' && key !== 'order' && Object.prototype.hasOwnProperty.call(updates, key)) {
      fieldsToUpdate[key] = (updates as any)[key];
    }
  }
  console.log(`--- Service: updateUser (Table ID: ${BASEROW_TEAM_TABLE_ID}, Row ID: ${rowId}) ---`);
  console.log(`[BaserowService] Attempting to PATCH URL: ${BASEROW_API_URL}${endpoint}`);
  console.log(`[BaserowService] With payload:`, JSON.stringify(fieldsToUpdate, null, 2));

  try {
    const updatedUser = await makeBaserowRequest(endpoint, 'PATCH', fieldsToUpdate);
    console.log(`[BaserowService] Baserow PATCH response for user ${rowId}:`, updatedUser ? JSON.stringify(updatedUser, null, 2) : "null/undefined");
    return updatedUser;
  } catch (error) {
    console.error(`[BaserowService] Failed to update user ${rowId} in table ${BASEROW_TEAM_TABLE_ID}:`, error);
    throw error; 
  }
}

export async function getAllUsers(): Promise<UserRecord[]> {
  const endpoint = `/api/database/rows/table/${BASEROW_TEAM_TABLE_ID}/?user_field_names=true&size=200`; 
  console.log(`--- Service: getAllUsers (Table ID: ${BASEROW_TEAM_TABLE_ID}) ---`);
  try {
    const data = await makeBaserowRequest(endpoint, 'GET');
    return (data?.results || []) as UserRecord[];
  } catch (error) {
    console.error(`[BaserowService] Failed to fetch all users from table ${BASEROW_TEAM_TABLE_ID}:`, error);
    throw error;
  }
}

// CEO User Functions (Table BASEROW_CEO_TABLE_ID)
export async function getCeoByEmail(email: string): Promise<CeoUserRecord | null> {
  const endpoint = `/api/database/rows/table/${BASEROW_CEO_TABLE_ID}/?user_field_names=true&filter__Email__equal=${encodeURIComponent(email)}`;
  console.log(`--- Service: getCeoByEmail (Table ID: ${BASEROW_CEO_TABLE_ID}) for email: ${email} ---`);
  try {
    const data = await makeBaserowRequest(endpoint, 'GET');
    if (data && data.results && data.results.length > 0) {
      return data.results[0] as CeoUserRecord;
    }
    return null;
  } catch (error) {
    console.error(`[BaserowService] Failed to fetch CEO by email ${email} from CEO table ${BASEROW_CEO_TABLE_ID}:`, error);
    throw error;
  }
}

export async function updateCeoRecord(rowId: number, updates: Partial<CeoUserRecord>): Promise<CeoUserRecord | null> {
  const endpoint = `/api/database/rows/table/${BASEROW_CEO_TABLE_ID}/${rowId}/?user_field_names=true`;
  console.log(`--- Service: updateCeoRecord (Table ID: ${BASEROW_CEO_TABLE_ID}, Row ID: ${rowId}) ---`);
  const fieldsToUpdate: { [key: string]: any } = {};
  for (const key in updates) {
    if (key !== 'id' && key !== 'order' && Object.prototype.hasOwnProperty.call(updates, key)) {
      fieldsToUpdate[key] = (updates as any)[key];
    }
  }
  console.log(`[BaserowService] Attempting to PATCH CEO record with payload:`, JSON.stringify(fieldsToUpdate, null, 2));
  try {
    return await makeBaserowRequest(endpoint, 'PATCH', fieldsToUpdate);
  } catch (error) {
    console.error(`[BaserowService] Failed to update CEO record ${rowId} in CEO table ${BASEROW_CEO_TABLE_ID}:`, error);
    throw error;
  }
}

// Subject Notes Functions (Table BASEROW_SUBJECT_NOTES_TABLE_ID)
export async function fetchSubjectNotes(): Promise<SubjectNoteRecord[]> {
  const endpoint = `/api/database/rows/table/${BASEROW_SUBJECT_NOTES_TABLE_ID}/?user_field_names=true&size=200`; 
  console.log(`--- Service: fetchSubjectNotes (Table ID: ${BASEROW_SUBJECT_NOTES_TABLE_ID}) ---`);
  try {
    const data = await makeBaserowRequest(endpoint, 'GET');
    return (data?.results || []) as SubjectNoteRecord[];
  } catch (error) {
    console.error(`[BaserowService] Failed to fetch subject notes from table ${BASEROW_SUBJECT_NOTES_TABLE_ID}:`, error);
    throw error;
  }
}

export async function createSubjectNote(noteData: { Subject?: string; Chapter?: string; Notes?: string; ID?: number | string; }): Promise<SubjectNoteRecord | null> {
  const endpoint = `/api/database/rows/table/${BASEROW_SUBJECT_NOTES_TABLE_ID}/?user_field_names=true`;
  console.log(`--- Service: createSubjectNote (Table ID: ${BASEROW_SUBJECT_NOTES_TABLE_ID}) ---`);
  console.log(`[BaserowService] Attempting to POST to URL: ${BASEROW_API_URL}${endpoint}`);
  console.log(`[BaserowService] With payload:`, JSON.stringify(noteData, null, 2));
  try {
    const result = await makeBaserowRequest(endpoint, 'POST', noteData);
    console.log(`[BaserowService] Baserow POST response for table ${BASEROW_SUBJECT_NOTES_TABLE_ID}:`, result ? JSON.stringify(result, null, 2) : "null/undefined");
    return result;
  } catch (error) {
    console.error(`[BaserowService] Failed to create subject note in table ${BASEROW_SUBJECT_NOTES_TABLE_ID} (service level):`, error);
    throw error;
  }
}

export async function updateSubjectNote(
  rowId: number, 
  updates: Partial<Omit<SubjectNoteRecord, 'id' | 'order' | 'created_on' | 'updated_on'>> 
): Promise<SubjectNoteRecord | null> {
  const endpoint = `/api/database/rows/table/${BASEROW_SUBJECT_NOTES_TABLE_ID}/${rowId}/?user_field_names=true`;
  console.log(`--- Service: updateSubjectNote (Table ID: ${BASEROW_SUBJECT_NOTES_TABLE_ID}, Row ID: ${rowId}) ---`);
  console.log(`[BaserowService] Attempting to PATCH URL: ${BASEROW_API_URL}${endpoint}`);
  console.log(`[BaserowService] With payload for updateSubjectNote:`, JSON.stringify(updates, null, 2));
  try {
    const result = await makeBaserowRequest(endpoint, 'PATCH', updates);
    console.log(`[BaserowService] Baserow PATCH response for row ${rowId} in table ${BASEROW_SUBJECT_NOTES_TABLE_ID}:`, result ? JSON.stringify(result, null, 2) : "null/undefined");
    return result; 
  } catch (error) {
    console.error(`[BaserowService] Failed to update subject note ${rowId} in table ${BASEROW_SUBJECT_NOTES_TABLE_ID} (service level):`, error);
    throw error; 
  }
}

export async function deleteSubjectNote(rowId: number): Promise<boolean> {
  const endpoint = `/api/database/rows/table/${BASEROW_SUBJECT_NOTES_TABLE_ID}/${rowId}/`;
  console.log(`--- Service: deleteSubjectNote (Table ID: ${BASEROW_SUBJECT_NOTES_TABLE_ID}, Row ID: ${rowId}) ---`);
  try {
    await makeBaserowRequest(endpoint, 'DELETE');
    console.log(`[BaserowService] Successfully deleted row ${rowId} from table ${BASEROW_SUBJECT_NOTES_TABLE_ID}.`);
    return true; 
  } catch (error) {
    console.error(`[BaserowService] Failed to delete subject note ${rowId} from table ${BASEROW_SUBJECT_NOTES_TABLE_ID}:`, error);
    throw error;
  }
}

// --- Service Functions for Management Pages ---

// Add Subject Service Functions (Table BASEROW_ADD_SUBJECT_TABLE_ID)
export async function fetchAllSubjects(): Promise<AddSubjectBaserowRecord[]> {
  const endpoint = `/api/database/rows/table/${BASEROW_ADD_SUBJECT_TABLE_ID}/?user_field_names=true&size=200`;
  try {
    const data = await makeBaserowRequest(endpoint);
    return (data?.results || []) as AddSubjectBaserowRecord[];
  } catch (error) {
    console.error(`[BaserowService] Failed to fetch subjects from table ${BASEROW_ADD_SUBJECT_TABLE_ID}:`, error);
    throw error;
  }
}

export async function createNewSubject(subjectData: Omit<AddSubjectBaserowRecord, 'id' | 'order' | 'created_on' | 'updated_on'>): Promise<AddSubjectBaserowRecord | null> {
  const endpoint = `/api/database/rows/table/${BASEROW_ADD_SUBJECT_TABLE_ID}/?user_field_names=true`;
  try {
    return await makeBaserowRequest(endpoint, 'POST', subjectData);
  } catch (error) {
    console.error(`[BaserowService] Failed to create subject in table ${BASEROW_ADD_SUBJECT_TABLE_ID}:`, error);
    throw error;
  }
}

// View Reported Bugs Service Functions (Table BASEROW_BUG_REPORTS_TABLE_ID)
export async function fetchAllBugReports(): Promise<BugReportBaserowRecord[]> {
  const endpoint = `/api/database/rows/table/${BASEROW_BUG_REPORTS_TABLE_ID}/?user_field_names=true&size=200`;
  try {
    const data = await makeBaserowRequest(endpoint);
    return (data?.results || []) as BugReportBaserowRecord[];
  } catch (error) {
    console.error(`[BaserowService] Failed to fetch bug reports from table ${BASEROW_BUG_REPORTS_TABLE_ID}:`, error);
    throw error;
  }
}

// Edit About Us Service Functions (Table BASEROW_ABOUT_US_TABLE_ID)
export async function fetchAboutUsData(rowId: number = 1): Promise<AboutUsBaserowRecord | null> { 
  const endpoint = `/api/database/rows/table/${BASEROW_ABOUT_US_TABLE_ID}/${rowId}/?user_field_names=true`;
  try {
    const data = await makeBaserowRequest(endpoint);
    return data as AboutUsBaserowRecord;
  } catch (error) {
    console.error(`[BaserowService] Failed to fetch About Us data from table ${BASEROW_ABOUT_US_TABLE_ID}, row ${rowId}:`, error);
    throw error;
  }
}

export async function updateAboutUsData(rowId: number = 1, contentData: Pick<AboutUsBaserowRecord, 'Mission' | 'Story'>): Promise<AboutUsBaserowRecord | null> {
  const endpoint = `/api/database/rows/table/${BASEROW_ABOUT_US_TABLE_ID}/${rowId}/?user_field_names=true`;
  try {
    return await makeBaserowRequest(endpoint, 'PATCH', contentData);
  } catch (error) {
    console.error(`[BaserowService] Failed to update About Us data in table ${BASEROW_ABOUT_US_TABLE_ID}, row ${rowId}:`, error);
    throw error;
  }
}

// --- Facts Service Functions (Table BASEROW_FACTS_TABLE_ID) ---
export interface FetchFactsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: FactRecord[];
}
export async function fetchFacts(page: number = 1, limit: number = 20): Promise<FetchFactsResponse> {
  const endpoint = `/api/database/rows/table/${BASEROW_FACTS_TABLE_ID}/?user_field_names=true&size=${limit}&page=${page}`;
  console.log(`[BaserowService] Fetching facts from endpoint: ${endpoint}`);
  try {
    const data = await makeBaserowRequest(endpoint);
    return data as FetchFactsResponse;
  } catch (error) {
    console.error(`[BaserowService] Failed to fetch facts from table ${BASEROW_FACTS_TABLE_ID}:`, error);
    throw error;
  }
}

export async function createFact(factData: Omit<FactRecord, 'id' | 'order' | 'created_on' | 'updated_on' | 'Shares' | 'Downloads'>): Promise<FactRecord | null> {
  const endpoint = `/api/database/rows/table/${BASEROW_FACTS_TABLE_ID}/?user_field_names=true`;
  const payload = { ...factData, Shares: 0, Downloads: 0 }; 
  try {
    return await makeBaserowRequest(endpoint, 'POST', payload);
  } catch (error) {
    console.error(`[BaserowService] Failed to create fact in table ${BASEROW_FACTS_TABLE_ID}:`, error);
    throw error;
  }
}


// --- Questions Service Functions (Table BASEROW_QUESTIONS_TABLE_ID) ---
export async function fetchAllQuestions(): Promise<QuestionRecord[]> {
  const endpoint = `/api/database/rows/table/${BASEROW_QUESTIONS_TABLE_ID}/?user_field_names=true&size=200`;
  try {
    const data = await makeBaserowRequest(endpoint);
    return (data?.results || []) as QuestionRecord[];
  } catch (error) {
    console.error(`[BaserowService] Failed to fetch questions from table ${BASEROW_QUESTIONS_TABLE_ID}:`, error);
    throw error;
  }
}

export async function createQuestionEntry(questionData: Omit<QuestionRecord, 'id' | 'order' | 'created_on' | 'updated_on'>): Promise<QuestionRecord | null> {
  const endpoint = `/api/database/rows/table/${BASEROW_QUESTIONS_TABLE_ID}/?user_field_names=true`;
  try {
    return await makeBaserowRequest(endpoint, 'POST', questionData);
  } catch (error) {
    console.error(`[BaserowService] Failed to create question entry in table ${BASEROW_QUESTIONS_TABLE_ID}:`, error);
    throw error;
  }
}

// --- NCERT Sources Service Functions (Table BASEROW_NCERT_SOURCES_TABLE_ID) ---
export async function fetchAllNcertSources(): Promise<NcertSourceRecord[]> {
  const endpoint = `/api/database/rows/table/${BASEROW_NCERT_SOURCES_TABLE_ID}/?user_field_names=true&size=200`;
  try {
    const data = await makeBaserowRequest(endpoint);
    return (data?.results || []) as NcertSourceRecord[];
  } catch (error) {
    console.error(`[BaserowService] Failed to fetch NCERT sources from table ${BASEROW_NCERT_SOURCES_TABLE_ID}:`, error);
    throw error;
  }
}

export async function createNcertSource(sourceData: Omit<NcertSourceRecord, 'id' | 'order' | 'created_on' | 'updated_on'>): Promise<NcertSourceRecord | null> {
  const endpoint = `/api/database/rows/table/${BASEROW_NCERT_SOURCES_TABLE_ID}/?user_field_names=true`;
  try {
    return await makeBaserowRequest(endpoint, 'POST', sourceData);
  } catch (error) {
    console.error(`[BaserowService] Failed to create NCERT source in table ${BASEROW_NCERT_SOURCES_TABLE_ID}:`, error);
    throw error;
  }
}

// --- API Status Service Functions (Table BASEROW_API_STATUS_TABLE_ID) ---
export async function fetchAllApiStatuses(): Promise<ApiStatusBaserowRecord[]> {
  const endpoint = `/api/database/rows/table/${BASEROW_API_STATUS_TABLE_ID}/?user_field_names=true&size=200`;
  try {
    const data = await makeBaserowRequest(endpoint);
    return (data?.results || []) as ApiStatusBaserowRecord[];
  } catch (error) {
    console.error(`[BaserowService] Failed to fetch API statuses from table ${BASEROW_API_STATUS_TABLE_ID}:`, error);
    throw error;
  }
}

export async function createApiStatusEntry(apiStatusData: Partial<Omit<ApiStatusBaserowRecord, 'id' | 'order' | 'created_on' | 'updated_on'>>): Promise<ApiStatusBaserowRecord | null> {
  const endpoint = `/api/database/rows/table/${BASEROW_API_STATUS_TABLE_ID}/?user_field_names=true`;
  const payload = {
    'ID': apiStatusData.ID,
    'Used In': apiStatusData['Used In'],
    'API Key': apiStatusData['API Key'],
    'Active': apiStatusData.Active === undefined ? true : apiStatusData.Active, 
    'By': apiStatusData.By,
  };
  try {
    return await makeBaserowRequest(endpoint, 'POST', payload);
  } catch (error) {
    console.error(`[BaserowService] Failed to create API status entry in table ${BASEROW_API_STATUS_TABLE_ID}:`, error);
    throw error;
  }
}

// --- API Test Config Service Functions (Table BASEROW_API_TEST_CONFIG_TABLE_ID) ---
export async function fetchApiTestConfigs(): Promise<ApiTestConfigRecord[]> {
  const endpoint = `/api/database/rows/table/${BASEROW_API_TEST_CONFIG_TABLE_ID}/?user_field_names=true&size=200`;
  try {
    const data = await makeBaserowRequest(endpoint);
    return (data?.results || []) as ApiTestConfigRecord[];
  } catch (error) {
    console.error(`[BaserowService] Failed to fetch API test configs from table ${BASEROW_API_TEST_CONFIG_TABLE_ID}:`, error);
    throw error;
  }
}


// --- Service Functions for Secure Page Access (Tables BASEROW_PAGE_PASSWORD_TABLE_ID, BASEROW_ACCESS_LOG_TABLE_ID) ---
export async function fetchFirstPagePassword(identifier?: string): Promise<PagePasswordRecord | null> {
  let endpoint = `/api/database/rows/table/${BASEROW_PAGE_PASSWORD_TABLE_ID}/?user_field_names=true&size=1`;
  // If you want to filter by an identifier:
  // if (identifier) {
  //   endpoint += `&filter__Identifier__equal=${encodeURIComponent(identifier)}`;
  // }
  try {
    const data = await makeBaserowRequest(endpoint);
    if (data && data.results && data.results.length > 0) {
      return data.results[0] as PagePasswordRecord;
    }
    console.warn(`[BaserowService] No password record found in table ${BASEROW_PAGE_PASSWORD_TABLE_ID}. Endpoint: ${endpoint}`);
    return null;
  } catch (error) {
    console.error(`[BaserowService] Failed to fetch page password from table ${BASEROW_PAGE_PASSWORD_TABLE_ID}:`, error);
    throw error;
  }
}

export async function createAccessLogEntry(logData: Partial<Omit<AccessLogRecord, 'id' | 'order' | 'created_on' | 'updated_on'>>): Promise<AccessLogRecord | null> {
  const endpoint = `/api/database/rows/table/${BASEROW_ACCESS_LOG_TABLE_ID}/?user_field_names=true`;
  try {
    const payload = {
        Name: logData.Name || 'N/A',
        Email: logData.Email || 'N/A',
        'Date/Time': logData['Date/Time'] || new Date().toISOString(),
        Result: logData.Result || 'Failure',
        Reason: logData.Reason || 'Unknown',
    };
    return await makeBaserowRequest(endpoint, 'POST', payload);
  } catch (error) {
    console.error(`[BaserowService] Failed to create access log entry in table ${BASEROW_ACCESS_LOG_TABLE_ID}:`, error);
    throw error;
  }
}

// --- Account Changes Log Service Function (Table BASEROW_ACCOUNT_CHANGES_TABLE_ID) ---
export async function fetchAccountChangesLog(): Promise<AccountChangeLogEntryBaserowRecord[]> {
  const endpoint = `/api/database/rows/table/${BASEROW_ACCOUNT_CHANGES_TABLE_ID}/?user_field_names=true&size=200`; 
  try {
    const data = await makeBaserowRequest(endpoint);
    return (data?.results || []) as AccountChangeLogEntryBaserowRecord[];
  } catch (error) {
    console.error(`[BaserowService] Failed to fetch account changes log from table ${BASEROW_ACCOUNT_CHANGES_TABLE_ID}:`, error);
    throw error;
  }
}


// --- Service Functions for Protected Data (User Accounts, Pro Users) ---
const BASEROW_USER_ACCOUNTS_DATA_TABLE_ID = '542785';
export async function fetchUserAccountData(): Promise<UserRecord[]> {
    const endpoint = `/api/database/rows/table/${BASEROW_USER_ACCOUNTS_DATA_TABLE_ID}/?user_field_names=true&size=200`;
    try {
        const data = await makeBaserowRequest(endpoint);
        return (data?.results || []) as UserRecord[];
    } catch (error) {
        console.error(`[BaserowService] Failed to fetch user account data from table ${BASEROW_USER_ACCOUNTS_DATA_TABLE_ID}:`, error);
        throw error;
    }
}

const BASEROW_PRO_USERS_DATA_TABLE_ID = '552928';

export async function fetchProUsersData(): Promise<ProUserSpecificRecord[]> {
    const endpoint = `/api/database/rows/table/${BASEROW_PRO_USERS_DATA_TABLE_ID}/?user_field_names=true&size=200`;
    try {
        const data = await makeBaserowRequest(endpoint);
        return (data?.results || []) as ProUserSpecificRecord[];
    } catch (error) {
        console.error(`[BaserowService] Failed to fetch pro users data from table ${BASEROW_PRO_USERS_DATA_TABLE_ID}:`, error);
        throw error;
    }
}

// --- Service Function for Performance Tracking Data (Tables BASEROW_PERFORMANCE_USER_MAIN_TABLE_ID, BASEROW_PERFORMANCE_SUBJECT_TABLE_ID) ---
export async function fetchPerformanceTableData(tableId: string): Promise<Array<PerformanceUserMainDataRecord | PerformanceSubjectDataRecord>> {
  const endpoint = `/api/database/rows/table/${tableId}/?user_field_names=true&size=200`;
  try {
    const data = await makeBaserowRequest(endpoint);
    return (data?.results || []) as Array<PerformanceUserMainDataRecord | PerformanceSubjectDataRecord>;
  } catch (error) {
    console.error(`[BaserowService] Failed to fetch performance data from table ${tableId}:`, error);
    throw error;
  }
}

// --- Notifications Service Functions (Table BASEROW_NOTIFICATIONS_TABLE_ID) ---
export async function fetchNotifications(): Promise<NotificationBaserowRecord[]> {
  const endpoint = `/api/database/rows/table/${BASEROW_NOTIFICATIONS_TABLE_ID}/?user_field_names=true&size=200`;
  try {
    const data = await makeBaserowRequest(endpoint);
    return (data?.results || []) as NotificationBaserowRecord[];
  } catch (error) {
    console.error(`[BaserowService] Failed to fetch notifications from table ${BASEROW_NOTIFICATIONS_TABLE_ID}:`, error);
    throw error;
  }
}

export async function createNotification(notificationData: Omit<NotificationBaserowRecord, 'id' | 'order' | 'created_on' | 'updated_on' | 'Views' | 'Clicks'>): Promise<NotificationBaserowRecord | null> {
  const endpoint = `/api/database/rows/table/${BASEROW_NOTIFICATIONS_TABLE_ID}/?user_field_names=true`;
  const payload = { ...notificationData, Views: 0, Clicks: 0 };
  try {
    return await makeBaserowRequest(endpoint, 'POST', payload);
  } catch (error) {
    console.error(`[BaserowService] Failed to create notification in table ${BASEROW_NOTIFICATIONS_TABLE_ID}:`, error);
    throw error;
  }
}

// --- Website Traffic Service Functions (Table BASEROW_WEBSITE_TRAFFIC_TABLE_ID) ---
export async function fetchWebsiteTrafficData(): Promise<WebsiteTrafficBaserowRecord[]> {
  const endpoint = `/api/database/rows/table/${BASEROW_WEBSITE_TRAFFIC_TABLE_ID}/?user_field_names=true&size=200&order_by=-Date`; 
  try {
    const data = await makeBaserowRequest(endpoint);
    return (data?.results || []) as WebsiteTrafficBaserowRecord[];
  } catch (error) {
    console.error(`[BaserowService] Failed to fetch website traffic data from table ${BASEROW_WEBSITE_TRAFFIC_TABLE_ID}:`, error);
    throw error;
  }
}

// --- AI Usage Service Functions (Table BASEROW_AI_USAGE_TABLE_ID) ---
export async function fetchAiUsageData(): Promise<AiUsageBaserowRecord[]> {
  const endpoint = `/api/database/rows/table/${BASEROW_AI_USAGE_TABLE_ID}/?user_field_names=true&size=200&order_by=-Date`;
  try {
    const data = await makeBaserowRequest(endpoint);
    return (data?.results || []) as AiUsageBaserowRecord[];
  } catch (error) {
    console.error(`[BaserowService] Failed to fetch AI usage data from table ${BASEROW_AI_USAGE_TABLE_ID}:`, error);
    throw error;
  }
}

// --- Tasks Service Functions (Table BASEROW_TASKS_TABLE_ID) ---
export async function fetchTaskById(taskId: number): Promise<TaskRecord | null> {
  const endpoint = `/api/database/rows/table/${BASEROW_TASKS_TABLE_ID}/${taskId}/?user_field_names=true`;
  console.log(`--- Service: fetchTaskById (Table ID: ${BASEROW_TASKS_TABLE_ID}, Task ID: ${taskId}) ---`);
  try {
    const data = await makeBaserowRequest(endpoint, 'GET');
    if (data) {
      console.log(`[BaserowService] Task fetched for ID ${taskId}:`, JSON.stringify(data, null, 2));
      return data as TaskRecord;
    }
    console.log(`[BaserowService] No task found for ID ${taskId} in table ${BASEROW_TASKS_TABLE_ID}.`);
    return null;
  } catch (error) {
    console.error(`[BaserowService] Failed to fetch task by ID ${taskId} from table ${BASEROW_TASKS_TABLE_ID}:`, error);
    throw error;
  }
}

export async function fetchTasksForUser(userEmail: string): Promise<TaskRecord[]> {
  const endpoint = `/api/database/rows/table/${BASEROW_TASKS_TABLE_ID}/?user_field_names=true&size=200`; 
  console.log(`--- Service: fetchTasksForUser (Table ID: ${BASEROW_TASKS_TABLE_ID}) for user: ${userEmail} ---`);
  try {
    const data = await makeBaserowRequest(endpoint);
    const allTasks = (data?.results || []) as TaskRecord[];
    
    if (allTasks.length > 0) {
      console.log('[BaserowService] Raw first task object from fetchTasksForUser:', JSON.stringify(allTasks[0], null, 2));
    }

    const userTasks = allTasks.filter(task => {
        const assignedToField = task['assigned to']; 
        if (assignedToField && typeof assignedToField === 'string') {
            return assignedToField.split(',').map(email => email.trim().toLowerCase()).includes(userEmail.toLowerCase());
        }
        return false;
    });
    console.log(`[BaserowService] Total tasks fetched: ${allTasks.length}, Tasks for ${userEmail}: ${userTasks.length}`);
    return userTasks;
  } catch (error) {
    console.error(`[BaserowService] Failed to fetch tasks from table ${BASEROW_TASKS_TABLE_ID}:`, error);
    throw error;
  }
}

export async function updateTask(taskId: number, updates: Partial<TaskRecord>): Promise<TaskRecord | null> {
  const endpoint = `/api/database/rows/table/${BASEROW_TASKS_TABLE_ID}/${taskId}/?user_field_names=true`;
  console.log(`--- Service: updateTask (Table ID: ${BASEROW_TASKS_TABLE_ID}, Row ID: ${taskId}) ---`);
  const fieldsToUpdate: { [key: string]: any } = {};
  for (const key in updates) {
    if (key !== 'id' && key !== 'order' && Object.prototype.hasOwnProperty.call(updates, key)) {
      // Use the exact key from the updates object, assuming it matches Baserow field names
      fieldsToUpdate[key] = (updates as any)[key];
    }
  }
  
  console.log(`[BaserowService] Attempting to PATCH task ${taskId} with payload:`, JSON.stringify(fieldsToUpdate, null, 2));
  try {
    return await makeBaserowRequest(endpoint, 'PATCH', fieldsToUpdate);
  } catch (error) {
    console.error(`[BaserowService] Failed to update task ${taskId} in table ${BASEROW_TASKS_TABLE_ID}:`, error);
    throw error;
  }
}

// --- Activity Log Service Functions (Table BASEROW_ACTIVITY_LOG_TABLE_ID) ---
export async function fetchActivityLogs(limit?: number): Promise<ActivityLogBaserowRecord[]> {
  let endpoint = `/api/database/rows/table/${BASEROW_ACTIVITY_LOG_TABLE_ID}/?user_field_names=true&order_by=-Date/Time`;
  if (limit) {
    endpoint += `&size=${limit}`;
  } else {
    endpoint += `&size=200`; // Default size if no limit specified
  }
  console.log(`--- Service: fetchActivityLogs (Table ID: ${BASEROW_ACTIVITY_LOG_TABLE_ID}) ---`);
  try {
    const data = await makeBaserowRequest(endpoint);
    return (data?.results || []) as ActivityLogBaserowRecord[];
  } catch (error) {
    console.error(`[BaserowService] Failed to fetch activity logs from table ${BASEROW_ACTIVITY_LOG_TABLE_ID}:`, error);
    throw error;
  }
}

export async function createActivityLogEntry(
  logData: Omit<ActivityLogBaserowRecord, 'id' | 'order' | 'created_on' | 'updated_on'>
): Promise<ActivityLogBaserowRecord | null> {
  const endpoint = `/api/database/rows/table/${BASEROW_ACTIVITY_LOG_TABLE_ID}/?user_field_names=true`;
  console.log(`--- Service: createActivityLogEntry (Table ID: ${BASEROW_ACTIVITY_LOG_TABLE_ID}) ---`);
  // Ensure 'Date/Time' is in ISO format if not already
  const payload = {
    ...logData,
    'Date/Time': logData['Date/Time'] ? formatISO(new Date(logData['Date/Time'])) : formatISO(new Date()),
  };
  try {
    return await makeBaserowRequest(endpoint, 'POST', payload);
  } catch (error) {
    console.error(`[BaserowService] Failed to create activity log entry in table ${BASEROW_ACTIVITY_LOG_TABLE_ID}:`, error);
    throw error;
  }
}

