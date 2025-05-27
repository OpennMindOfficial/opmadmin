
// src/app/account-settings/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Eye,
  EyeOff,
  Loader2,
  LogOut,
  Trash2,
  UserCog, 
  UserCircle,
  CalendarDays,
  History,
  Save
} from "lucide-react";
import { motion } from 'framer-motion';
import { format, parseISO, isValid } from 'date-fns';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import { 
    fetchAccountDetails, 
    updateUserProfile, 
    changePasswordWithVerification,
    type AccountDetails 
} from '@/app/actions/authActions';

const titleSectionVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut", delay: 0.1 } },
};

const classes = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"];

const formatDateForDisplay = (dateString?: string) => {
  if (!dateString) return 'N/A';
  try {
    const date = parseISO(dateString);
    if (isValid(date)) {
      return format(date, "MMMM dd, yyyy 'at' hh:mm a");
    }
    return 'Invalid Date';
  } catch (e) {
    return 'Invalid Date Format';
  }
};


export default function AccountSettingsPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState(""); // Store as yyyy-MM-dd for input[type=date]
  const [selectedClass, setSelectedClass] = useState<string | undefined>(undefined);
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const [baserowUserRowId, setBaserowUserRowId] = useState<number | null>(null);
  const [initialEmail, setInitialEmail] = useState("");
  const [authMethod, setAuthMethod] = useState<string | null>(null);
  const [accountDetails, setAccountDetails] = useState<AccountDetails | null>(null);


  const { toast } = useToast();
  const router = useRouter();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    setIsLoadingData(true);
    const storedUserIdStr = localStorage.getItem('userId');
    const storedUserEmail = localStorage.getItem('currentUserEmail'); // Using consistent key
    const storedAuthMethod = localStorage.getItem('authMethod');
    
    console.log('[SettingsPage] Fetched from localStorage - authMethod:', storedAuthMethod);
    setAuthMethod(storedAuthMethod);

    const userId = storedUserIdStr ? parseInt(storedUserIdStr, 10) : null;

    if (!userId && !storedUserEmail) {
      toast({ variant: "destructive", title: "Authentication Error", description: "You are not logged in. Redirecting..." });
      setIsLoadingData(false);
      router.push('/');
      return;
    }

    const loadUserDetails = async () => {
      try {
        const result = await fetchAccountDetails(userId, storedUserEmail);
        if (result.success && result.details) {
          const details = result.details;
          setAccountDetails(details); // Store all details
          setFirstName(details.firstName || "");
          setLastName(details.lastName || "");
          setEmail(details.Email || "");
          setInitialEmail(details.Email || "");
          setAuthMethod(details.AuthMethod || 'email');
          localStorage.setItem('authMethod', details.AuthMethod || 'email'); // Sync localStorage
          setDob(details.DOB && isValid(parseISO(details.DOB)) ? format(parseISO(details.DOB), 'yyyy-MM-dd') : "");
          setSelectedClass(details.Class || undefined);
          setBaserowUserRowId(details.id || null); 
        } else {
          throw new Error(result.error || "Failed to load user details.");
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Failed to load details",
          description: error.message,
        });
        router.push('/'); // Redirect if details can't be loaded
      } finally {
        setIsLoadingData(false);
      }
    };
    loadUserDetails();
  }, [toast, router]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!baserowUserRowId) {
      toast({ variant: "destructive", title: "Error", description: "User identifier missing. Cannot update profile." });
      return;
    }
    setIsSavingProfile(true);
    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      const payload: { name?: string; email?: string; dob?: string } = {};
      
      if (fullName) payload.name = fullName;
      
      // Only include email in payload if authMethod is 'email' and email has changed
      if (authMethod === 'email' && email.trim() && email.trim().toLowerCase() !== initialEmail.toLowerCase()) {
        payload.email = email.trim();
      }
      
      if (dob) payload.dob = dob; // DOB is stored as 'yyyy-MM-dd' from input type=date

      // Class update is disabled in UI, so not sending 'selectedClass'
      
      if (Object.keys(payload).length === 0) {
        toast({title: "No Changes", description: "No profile information was changed."});
        setIsSavingProfile(false);
        return;
      }

      const result = await updateUserProfile(baserowUserRowId, payload);

      if (result.success && result.updatedUser) {
        toast({ title: "Profile Updated", description: "Your profile has been successfully updated." });
        if (payload.email && payload.email.toLowerCase() !== initialEmail.toLowerCase()) {
          localStorage.setItem('currentUserEmail', payload.email); // Update consistent key
          setInitialEmail(payload.email); 
        }
        if (payload.name) {
            localStorage.setItem('currentUserFullName', payload.name);
        }
         // Re-fetch details to update local state accurately, including derived fields like firstName/lastName
        const freshDetails = await fetchAccountDetails(baserowUserRowId, null);
        if (freshDetails.success && freshDetails.details) {
            setAccountDetails(freshDetails.details);
            setFirstName(freshDetails.details.firstName || "");
            setLastName(freshDetails.details.lastName || "");
            // DOB and Class are directly from state, email is handled above
        }

      } else {
        throw new Error(result.error || "Failed to update profile.");
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Update Failed", description: error.message });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authMethod !== 'email') { 
        toast({ variant: "destructive", title: "Action Not Allowed", description: "Password can only be changed for email/password accounts." });
        return;
    }
    if (!baserowUserRowId) {
      toast({ variant: "destructive", title: "Error", description: "User identifier missing. Cannot change password." });
      return;
    }
    if (!currentPassword || !newPassword) {
      toast({ variant: "destructive", title: "Error", description: "Both current and new passwords are required." });
      return;
    }
     if (newPassword.length < 6) { // Match example's length, was 8
        toast({ variant: "destructive", title: "Error", description: "New password must be at least 6 characters."});
        return;
    }

    setIsSavingPassword(true);
    try {
      const result = await changePasswordWithVerification(baserowUserRowId, currentPassword, newPassword);
      if (!result.success) {
        throw new Error(result.error || `Failed to change password.`);
      }
      toast({ title: "Password Changed", description: "Your password has been successfully updated." });
      setCurrentPassword("");
      setNewPassword("");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Password Change Failed", description: error.message });
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated'); // Consider removing this if not used elsewhere
    localStorage.removeItem('currentUserFullName');
    localStorage.removeItem('userId');
    localStorage.removeItem('currentUserEmail');
    localStorage.removeItem('authMethod'); 
    localStorage.removeItem('isCeoLoggedIn');
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
    router.push('/');
  };

  const handleDeleteAccount = () => {
    // In a real app, call an API to delete account data
    toast({ title: "Feature Coming Soon", description: "Account deletion will be available soon." });
    setIsDeleteConfirmOpen(false);
  };

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <NewTopNav />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </main>
      </div>
    );
  }
  
  if (!accountDetails) {
     return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <NewTopNav />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-muted-foreground text-center">Could not load account details. Please try logging in again.</p>
        </main>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <NewTopNav onLogout={handleLogout} />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-10 space-y-6 bg-muted/20 dark:bg-muted/10">
        <motion.div
          className="max-w-3xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={titleSectionVariants}
        >
          <div className="flex items-center space-x-3 mb-6">
            <UserCog className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Account Settings</h1>
          </div>

          <motion.div variants={cardVariants}>
            <Card className="bg-card border border-border/30 rounded-xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Profile Information</CardTitle>
                <CardDescription>Update your personal details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="first-name" className="block text-sm font-medium mb-1.5">First name</Label>
                      <Input
                        type="text"
                        id="first-name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="bg-background dark:bg-muted/30 rounded-lg shadow-sm"
                        disabled={isSavingProfile}
                      />
                    </div>
                    <div>
                      <Label htmlFor="last-name" className="block text-sm font-medium mb-1.5">Last name</Label>
                      <Input
                        type="text"
                        id="last-name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="bg-background dark:bg-muted/30 rounded-lg shadow-sm"
                        disabled={isSavingProfile}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="email" className="block text-sm font-medium mb-1.5">Contact email</Label>
                      <Input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-background dark:bg-muted/30 rounded-lg shadow-sm"
                        disabled={isSavingProfile || authMethod !== 'email'}
                      />
                      {authMethod !== 'email' && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Email is managed by your {authMethod?.includes('google') ? 'Google' : 'external'} account and cannot be changed here.
                        </p>
                      )}
                    </div>
                     <div>
                      <Label htmlFor="dob" className="block text-sm font-medium mb-1.5">Date of Birth</Label>
                      <Input
                        type="date"
                        id="dob"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="bg-background dark:bg-muted/30 rounded-lg shadow-sm"
                        disabled={isSavingProfile}
                        max={format(new Date(), 'yyyy-MM-dd')} // Prevent future dates
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                          <Label htmlFor="class-select" className="block text-sm font-medium mb-1.5">Class</Label>
                          <Select 
                              value={selectedClass} 
                              onValueChange={setSelectedClass}
                              disabled={true} // Class selection is disabled as per example
                          >
                              <SelectTrigger id="class-select" className="bg-background dark:bg-muted/30 rounded-lg">
                                  <SelectValue placeholder="Select class" />
                              </SelectTrigger>
                              <SelectContent>
                                  {classes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                              </SelectContent>
                          </Select>
                           <p className="text-xs text-muted-foreground mt-1">
                              Class changes are currently disabled.
                           </p>
                      </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSavingProfile}>
                      {isSavingProfile ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                      Save Profile
                    </Button>
                  </div>
                </form>
              </CardContent>
                <CardHeader className="pt-4 border-t border-border/30">
                    <CardTitle className="text-lg font-medium">Account Activity</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary/80"/><strong>First Sign-in:</strong> {formatDateForDisplay(accountDetails['First signin'])}</p>
                    <p className="flex items-center gap-2"><History className="h-4 w-4 text-primary/80"/><strong>Last Active:</strong> {formatDateForDisplay(accountDetails['Last active'])}</p>
                </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants} className="mt-8">
            <div className={cn(authMethod !== 'email' ? "opacity-60 pointer-events-none" : "")}>
              <Card className="bg-card border border-border/30 rounded-xl shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Security</CardTitle>
                  <CardDescription>
                    {authMethod !== 'email' 
                      ? "Password is managed by your external account." 
                      : "Change your password."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="current-password" className="block text-sm font-medium mb-1.5">Current password</Label>
                          <div className="relative">
                            <Input
                              type={showCurrentPassword ? "text" : "password"}
                              id="current-password"
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              placeholder="Enter current password"
                              className="bg-background dark:bg-muted/30 rounded-lg shadow-sm pr-10"
                              disabled={isSavingPassword || authMethod !== 'email'}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute inset-y-0 right-0 h-full w-10 text-muted-foreground hover:text-foreground"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                              aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                              disabled={isSavingPassword || authMethod !== 'email'}
                            >
                              {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="new-password" className="block text-sm font-medium mb-1.5">New password</Label>
                          <div className="relative">
                            <Input
                              type={showNewPassword ? "text" : "password"}
                              id="new-password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="Enter new password"
                              className="bg-background dark:bg-muted/30 rounded-lg shadow-sm pr-10"
                              disabled={isSavingPassword || authMethod !== 'email'}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute inset-y-0 right-0 h-full w-10 text-muted-foreground hover:text-foreground"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              aria-label={showNewPassword ? "Hide password" : "Show password"}
                              disabled={isSavingPassword || authMethod !== 'email'}
                            >
                              {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">Minimum 6 characters.</p>
                        </div>
                      </div>
                     <div className="flex justify-end pt-2">
                        <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSavingPassword || authMethod !== 'email'}>
                          {isSavingPassword && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                          Change Password
                        </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </motion.div>

           <motion.div variants={cardVariants} className="mt-8">
            <Card className="bg-card border border-border/30 rounded-xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Session Management</CardTitle>
              </CardHeader>
              <CardContent>
                 <Button onClick={handleLogout} variant="outline" className="w-full sm:w-auto">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={cardVariants} className="mt-8 mb-8">
            <Card className="bg-card border-destructive/50 rounded-xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-destructive">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent>
                  <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                      <DialogTrigger asChild>
                           <Button variant="destructive" className="w-full sm:w-auto">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Account
                          </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                              <DialogTitle>Are you absolutely sure?</DialogTitle>
                              <DialogDescription>
                                  This action cannot be undone. This will permanently delete your OpennMind account data.
                                  {authMethod?.includes('google') && " This will not affect your Google account."}
                              </DialogDescription>
                          </DialogHeader>
                          <DialogFooter className="mt-4">
                              <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>Cancel</Button>
                              <Button variant="destructive" onClick={handleDeleteAccount}>Yes, delete my account</Button>
                          </DialogFooter>
                      </DialogContent>
                  </Dialog>
                <p className="text-xs text-muted-foreground mt-2">
                  Permanently remove your account and all associated data. This action is irreversible.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
