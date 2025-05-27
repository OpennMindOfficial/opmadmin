
// src/components/auth/ChangePasswordDialog.tsx
"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePassword } from '@/app/actions/authActions';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw } from 'lucide-react';

interface ChangePasswordDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onPasswordChangedSuccess: () => void;
  userEmail: string;
}

export function ChangePasswordDialog({ 
  isOpen, 
  onOpenChange, 
  onPasswordChangedSuccess,
  userEmail 
}: ChangePasswordDialogProps) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setError('');
    if (!newPassword.trim()) {
      setError('Please enter a new password.');
      return;
    }
    if (!confirmPassword.trim()) {
      setError('Please confirm your new password.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await changePassword(userEmail, newPassword);
      if (result.success) {
        toast({
          title: "Password Changed",
          description: "Your password has been successfully updated.",
          variant: "default", // Or "success" if you have such variant
        });
        onPasswordChangedSuccess();
        onOpenChange(false); 
      } else {
        setError(result.error || 'Failed to change password.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setNewPassword('');
      setConfirmPassword('');
      setError('');
      setIsLoading(false);
    }
  }, [isOpen]);


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Your Password</DialogTitle>
          <DialogDescription>
            This is your first sign-in. Please set a new password for your account.
            This password can be changed only once through this initial setup. For future changes, please contact support.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-password" className="text-right">
              New Password
            </Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="col-span-3"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="confirm-password" className="text-right">
              Confirm Password
            </Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="col-span-3"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>
          {error && (
            <p className="col-span-4 text-center text-sm text-destructive bg-destructive/10 p-2 rounded-md border border-destructive/30">{error}</p>
          )}
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Changing...
              </>
            ) : (
              'Set New Password'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
