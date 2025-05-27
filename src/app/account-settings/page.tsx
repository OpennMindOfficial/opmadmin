
// src/app/account-settings/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { fetchAccountDetails, updateUserName, type AccountDetails } from '@/app/actions/authActions';
import { UserCog, Mail, Lock, CalendarDays, History, Save, Loader2 } from 'lucide-react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';

const nameUpdateSchema = z.object({
  name: z.string().min(1, "Name cannot be empty.").max(100, "Name is too long."),
});
type NameUpdateFormData = z.infer<typeof nameUpdateSchema>;

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), "MMMM dd, yyyy 'at' hh:mm a");
  } catch (e) {
    return 'Invalid Date';
  }
};

export default function AccountSettingsPage() {
  const [accountDetails, setAccountDetails] = useState<AccountDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingName, setIsSavingName] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<NameUpdateFormData>({
    resolver: zodResolver(nameUpdateSchema),
  });

  useEffect(() => {
    const email = localStorage.getItem('currentUserEmail');
    if (email) {
      setCurrentUserEmail(email);
      fetchAccountDetails(email)
        .then(result => {
          if (result.success && result.details) {
            setAccountDetails(result.details);
            setValue('name', result.details.Name || '');
          } else {
            setError(result.error || 'Failed to load account details.');
            toast({ title: "Error", description: result.error || 'Failed to load account details.', variant: "destructive" });
          }
        })
        .catch(err => {
          setError('An unexpected error occurred.');
          toast({ title: "Error", description: 'An unexpected error occurred.', variant: "destructive" });
        })
        .finally(() => setIsLoading(false));
    } else {
      setError("User not authenticated. Please log in.");
      setIsLoading(false);
      // Potentially redirect to login page
    }
  }, [setValue, toast]);

  const onNameSubmit: SubmitHandler<NameUpdateFormData> = async (data) => {
    if (!currentUserEmail) {
      toast({ title: "Error", description: "User email not found.", variant: "destructive" });
      return;
    }
    setIsSavingName(true);
    try {
      const result = await updateUserName(currentUserEmail, data.name);
      if (result.success && result.updatedName) {
        setAccountDetails(prev => prev ? { ...prev, Name: result.updatedName } : null);
        localStorage.setItem('currentUserFullName', result.updatedName); // Update local storage too
        toast({ title: "Success", description: "Your name has been updated." });
      } else {
        toast({ title: "Error updating name", description: result.error || "Could not update your name.", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: "An unexpected error occurred while updating your name.", variant: "destructive" });
    } finally {
      setIsSavingName(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <NewTopNav />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  if (error && !accountDetails) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <NewTopNav />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-destructive text-center">{error}</p>
        </main>
      </div>
    );
  }
  
  if (!accountDetails) {
     return ( // Fallback in case accountDetails is null after loading and no explicit error shown before
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <NewTopNav />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-muted-foreground text-center">Could not load account details.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <NewTopNav />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <UserCog className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">Account Settings</h1>
            </div>
            <p className="text-lg text-muted-foreground ml-13">
              Manage your personal information and account preferences.
            </p>
          </div>
        </section>

        <Card className="max-w-2xl mx-auto shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>Update your personal details here. For email or password changes, please contact support.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit(onNameSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name" className="font-semibold">Full Name</Label>
                <Input
                  id="name"
                  {...register('name')}
                  className="mt-1"
                  disabled={isSavingName}
                />
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
              </div>
              <Button type="submit" disabled={isSavingName} className="w-full sm:w-auto">
                {isSavingName ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {isSavingName ? 'Saving...' : 'Save Name Changes'}
              </Button>
            </form>

            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="font-semibold flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground"/>Email Address</Label>
                <Input id="email" value={accountDetails.Email} disabled className="mt-1 bg-muted/50 cursor-not-allowed" />
                <p className="text-xs text-muted-foreground mt-1">Contact support to change your email address.</p>
              </div>

              <div>
                <Label htmlFor="password" className="font-semibold flex items-center gap-2"><Lock className="h-4 w-4 text-muted-foreground"/>Password</Label>
                <Input id="password" type="password" value="********" disabled className="mt-1 bg-muted/50 cursor-not-allowed" />
                <p className="text-xs text-muted-foreground mt-1">Contact support to change your password.</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start space-y-3 bg-muted/30 p-6 rounded-b-xl">
             <h3 className="text-md font-semibold text-foreground mb-1">Account Activity</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary/70"/><strong>First Sign-in:</strong> {formatDate(accountDetails['First signin'])}</p>
              <p className="flex items-center gap-2"><History className="h-4 w-4 text-primary/70"/><strong>Last Active:</strong> {formatDate(accountDetails['Last active'])}</p>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
