
// src/app/actions/authActions.ts
'use server';

import bcrypt from 'bcryptjs';
import { getUserByEmail, updateUser } from '@/services/baserowService';

interface LoginResult {
  success: boolean;
  error?: string;
  firstTimeLogin?: boolean;
  userEmail?: string; // Pass email for password change context
}

export async function verifyLogin(email: string, plainPassword_providedByUser: string): Promise<LoginResult> {
  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return { success: false, error: 'Invalid email or password.' };
    }

    if (!user.Password) {
      console.error(`User ${email} found but has no password set in Baserow.`);
      return { success: false, error: 'Authentication error. Please contact support.' };
    }
    
    const passwordMatches = await bcrypt.compare(plainPassword_providedByUser, user.Password);

    if (!passwordMatches) {
      return { success: false, error: 'Invalid email or password.' };
    }

    const isFirstTime = user['First time'] === 'YES';
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    if (!isFirstTime) {
      // Update 'Last active' for returning user
      await updateUser(user.id, { 'Last active': today });
      return { success: true, firstTimeLogin: false };
    } else {
      // It's a first-time login, don't update 'Last active' yet.
      // 'First signin' will be updated after password change.
      return { success: true, firstTimeLogin: true, userEmail: user.Email };
    }
  } catch (error: any) {
    console.error('Login verification error:', error);
    return { success: false, error: error.message || 'An unexpected error occurred during login.' };
  }
}

interface ChangePasswordResult {
  success: boolean;
  error?: string;
}

export async function changePassword(email: string, newPassword_plaintext: string): Promise<ChangePasswordResult> {
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return { success: false, error: 'User not found.' };
    }

    const hashedNewPassword = await bcrypt.hash(newPassword_plaintext, 10);
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const updatedUser = await updateUser(user.id, {
      Password: hashedNewPassword,
      'First time': 'NO',
      'First signin': today,
      // Optionally update 'Last active' here as well, or upon next login
      'Last active': today, 
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
