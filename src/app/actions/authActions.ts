
// src/app/actions/authActions.ts
'use server';

import bcrypt from 'bcryptjs';
import { 
  getUserByEmail, 
  updateUser, 
  getAllUsers, 
  type UserRecord,
  getCeoByEmail,
  updateCeoRecord,
  type CeoUserRecord,
  getUserById,
} from '@/services/baserowService';
import { format } from 'date-fns';

interface LoginResult {
  success: boolean;
  error?: string;
  firstTimeLogin?: boolean; 
  userId?: number; // Baserow row ID
  userEmail?: string;
  userName?: string;
  userRole?: string; 
  isCeo?: boolean; 
  authMethod?: string;
}

export async function verifyLogin(email: string, plainPassword_providedByUser: string): Promise<LoginResult> {
  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return { success: false, error: 'Invalid email or password.' };
    }

    if (!user.Password) {
      console.error(`User ${email} found but has no password set in Baserow table.`);
      return { success: false, error: 'Authentication error. Please contact support.' };
    }
    
    const passwordMatches = await bcrypt.compare(plainPassword_providedByUser, user.Password);

    if (!passwordMatches) {
      return { success: false, error: 'Invalid email or password.' };
    }

    const isFirstTime = user['First time'] === 'YES';
    const nowISO = new Date().toISOString();
    const userName = user.Name || '';
    const userRole = user.Role || 'Member'; 

    if (!isFirstTime) {
      await updateUser(user.id, { 'Last active': nowISO });
    }
    // For first-time login, 'Last active' will be updated after password change or on subsequent logins.
    return { 
        success: true, 
        firstTimeLogin: isFirstTime, 
        userId: user.id,
        userEmail: user.Email, 
        userName, 
        userRole, 
        isCeo: false,
        authMethod: user.AuthMethod || 'email'
    };
  } catch (error: any) {
    console.error('Team login verification error:', error);
    return { success: false, error: error.message || 'An unexpected error occurred during login.' };
  }
}

export async function verifyCeoLogin(email: string, plainPassword_providedByUser: string): Promise<LoginResult> {
  try {
    const ceo = await getCeoByEmail(email);

    if (!ceo) {
      return { success: false, error: 'Invalid CEO email or password.' };
    }

    if (!ceo.Password) {
      console.error(`CEO ${email} found but has no password set in Baserow CEO table.`);
      return { success: false, error: 'CEO authentication error. Please contact support.' };
    }

    const passwordMatches = await bcrypt.compare(plainPassword_providedByUser, ceo.Password);

    if (!passwordMatches) {
      return { success: false, error: 'Invalid CEO email or password.' };
    }

    const nowISO = new Date().toISOString();
    await updateCeoRecord(ceo.id, { 'Last active': nowISO });
    const userName = ceo.Name || 'CEO';

    return { 
        success: true,
        userId: ceo.id, 
        userEmail: ceo.Email, 
        userName, 
        isCeo: true,
        authMethod: 'email' // Assuming CEO always uses email/password
    };
  } catch (error: any) {
    console.error('CEO login verification error:', error);
    return { success: false, error: error.message || 'An unexpected error occurred during CEO login.' };
  }
}


interface ChangePasswordResult {
  success: boolean;
  error?: string;
}

export async function changePassword(userId: number, newPassword_plaintext: string): Promise<ChangePasswordResult> {
  try {
    // User ID is now the Baserow row ID
    const user = await getUserById(userId); 
    if (!user) {
      return { success: false, error: 'User not found.' };
    }

    const hashedNewPassword = await bcrypt.hash(newPassword_plaintext, 10);
    const nowISO = new Date().toISOString();

    const updatedUser = await updateUser(user.id, {
      Password: hashedNewPassword,
      'First time': 'NO',
      'First signin': nowISO,
      'Last active': nowISO, 
    });

    if (!updatedUser) { 
        return { success: false, error: 'Failed to update password. Please try again.' };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Password change error:', error);
    return { success: false, error: error.message || 'An unexpected error occurred while changing password.' };
  }
}

// Server action to change password using current password for verification
interface ChangePasswordWithVerificationResult {
  success: boolean;
  error?: string;
}
export async function changePasswordWithVerification(
  userId: number,
  currentPassword_plaintext: string,
  newPassword_plaintext: string
): Promise<ChangePasswordWithVerificationResult> {
  try {
    const user = await getUserById(userId);
    if (!user) {
      return { success: false, error: 'User not found.' };
    }
    if (!user.Password) {
      return { success: false, error: 'User password not set. Contact support.' };
    }

    const currentPasswordMatches = await bcrypt.compare(currentPassword_plaintext, user.Password);
    if (!currentPasswordMatches) {
      return { success: false, error: 'Current password does not match.' };
    }

    if (newPassword_plaintext.length < 8) {
      return { success: false, error: 'New password must be at least 8 characters.' };
    }

    const hashedNewPassword = await bcrypt.hash(newPassword_plaintext, 10);
    const nowISO = new Date().toISOString();

    const updatedUser = await updateUser(user.id, {
      Password: hashedNewPassword,
      'Last active': nowISO,
      // 'First time' should already be 'NO' if they are changing password this way
    });

    if (!updatedUser) {
      return { success: false, error: 'Failed to update password. Please try again.' };
    }
    return { success: true };
  } catch (error: any) {
    console.error('Password change with verification error:', error);
    return { success: false, error: error.message || 'An unexpected error occurred.' };
  }
}


export async function updateUserLastActive(userId: number): Promise<{ success: boolean; error?: string, userName?: string, userRole?: string }> {
  try {
    const user = await getUserById(userId);
    if (!user) {
      console.warn(`updateUserLastActive: User not found for ID ${userId}.`);
      return { success: false, error: 'User not found for last active update.' };
    }

    const nowISO = new Date().toISOString();
    const updatedUser = await updateUser(user.id, { 'Last active': nowISO });
    
    if (!updatedUser) {
         return { success: false, error: 'Failed to update last active time.' };
    }

    return { success: true, userName: user.Name || '', userRole: user.Role || 'Member' };
  } catch (error: any) {
    console.error(`Error updating last active time for user ID ${userId}:`, error);
    return { success: false, error: 'An unexpected error occurred while updating last active time.' };
  }
}

export interface AccountDetails extends Omit<UserRecord, 'Password' | 'order' | 'id'> {
  id?: number; // Keep id for client-side reference
  firstName?: string;
  lastName?: string;
}

interface FetchAccountDetailsResult {
  success: boolean;
  error?: string;
  details?: AccountDetails;
}

export async function fetchAccountDetails(userId: number | null, userEmail?: string | null ): Promise<FetchAccountDetailsResult> {
  try {
    let user: UserRecord | null = null;
    if (userId) {
      user = await getUserById(userId);
    } else if (userEmail) {
      user = await getUserByEmail(userEmail);
    }

    if (!user) {
      return { success: false, error: 'User not found.' };
    }
    const { Password, order, id, Name, ...otherDetails } = user;
    
    let firstName = '';
    let lastName = '';
    if (Name) {
      const nameParts = Name.split(' ');
      firstName = nameParts[0];
      lastName = nameParts.slice(1).join(' ');
    }

    return { 
        success: true, 
        details: { 
            ...otherDetails, 
            id, // include the original Baserow row ID
            firstName, 
            lastName,
            Email: user.Email, // ensure email is present
            AuthMethod: user.AuthMethod || 'email',
            DOB: user.DOB,
            Class: user.Class,
        } 
    };
  } catch (error: any) {
    console.error(`Error fetching account details:`, error);
    return { success: false, error: 'Failed to fetch account details.' };
  }
}

interface UpdateProfilePayload {
    name?: string;
    email?: string;
    dob?: string;
    selectedClass?: string; // Baserow field name is 'Class'
    authMethod?: string; // Not directly updated, but used for logic
}

interface UpdateProfileResult {
  success: boolean;
  error?: string;
  updatedUser?: UserRecord;
}

export async function updateUserProfile(userId: number, payload: UpdateProfilePayload): Promise<UpdateProfileResult> {
  console.log(`[AuthActions] updateUserProfile called for userId: ${userId} with payload:`, payload);
  try {
    const userToUpdate = await getUserById(userId);
    if (!userToUpdate) {
      return { success: false, error: 'User not found.' };
    }

    const updates: Partial<UserRecord> = {};
    if (payload.name) updates.Name = payload.name;
    if (payload.dob) updates.DOB = payload.dob;
    // if (payload.selectedClass) updates.Class = payload.selectedClass; // Class update disabled in example

    // Handle email update only if authMethod is 'email' and email has changed
    if (payload.email && userToUpdate.AuthMethod === 'email' && payload.email.toLowerCase() !== userToUpdate.Email.toLowerCase()) {
        // Check if new email already exists
        const existingUserWithNewEmail = await getUserByEmail(payload.email);
        if (existingUserWithNewEmail && existingUserWithNewEmail.id !== userId) {
            return { success: false, error: 'This email is already associated with another account.' };
        }
        updates.Email = payload.email;
    }
    
    if (Object.keys(updates).length === 0) {
      return { success: true, updatedUser: userToUpdate, error: "No changes to update." }; // No actual DB call needed
    }

    const updatedUser = await updateUser(userId, updates);
    
    if (!updatedUser) {
        return { success: false, error: 'Failed to update profile.' };
    }
    
    return { success: true, updatedUser };
  } catch (error: any) {
    console.error(`Error updating profile for userId ${userId}:`, error);
    if (error.message.includes("already associated")) { // Specific error from Baserow check
        return { success: false, error: error.message };
    }
    return { success: false, error: 'An unexpected error occurred while updating profile.' };
  }
}


export interface TeamMemberInfo {
  id: number;
  name: string;
  role: string;
  email: string; 
}

interface FetchTeamInfoResult {
  success: boolean;
  error?: string;
  teamMembers?: TeamMemberInfo[];
}

export async function fetchTeamInfo(): Promise<FetchTeamInfoResult> {
  try {
    const users = await getAllUsers();
    const teamMembers: TeamMemberInfo[] = users.map(user => ({
      id: user.id,
      name: user.Name || 'N/A',
      role: user.Role || 'Member',
      email: user.Email,
    }));
    return { success: true, teamMembers };
  } catch (error: any) {
    console.error('Error fetching team info:', error);
    return { success: false, error: 'Failed to fetch team information.' };
  }
}
