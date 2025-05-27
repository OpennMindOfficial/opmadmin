
// src/app/actions/user-accounts/page.tsx
"use client";

import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'; // Removed DialogTrigger
import { Users as PageIcon, Loader2, AlertTriangle, ShieldCheck } from 'lucide-react';
// TODO: Implement Server Actions and Baserow Service for User Accounts
// import { verifyUserDataPagePasswordAction, logUserDataAccessAttemptAction, fetchProtectedUsersDataAction } from '@/app/actions/secureDataActions'; // Placeholder
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

// Placeholder types
interface UserAccountRecord {
  id: number; Name?: string; Email?: string; Class?: string; Board?: string; DOB?: string; Password?: string; FirebaseUID?: string;
  [key: string]: any;
}
interface AccessLogRecord { Name?: string; Email?: string; 'Date/Time'?: string; Result?: 'Success' | 'Failure'; Reason?: string; }

// Table IDs
const USER_DATA_TABLE_ID = '542785';
const PASSWORD_TABLE_ID = '552919'; // For page password
const ACCESS_LOG_TABLE_ID = '552920';

const userAccountFields = ['Name', 'Email', 'Class', 'Board', 'DOB', 'Password', 'FirebaseUID'];

export default function UserAccountsPage() {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false); // If true, shows data. Starts false.
  const [showAuthDialog, setShowAuthDialog] = useState(true); // Controls visibility of password dialog
  const [password, setPassword] = useState('');
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);

  const [userData, setUserData] = useState<UserAccountRecord[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);

  const [isCeo, setIsCeo] = useState(false); // Simplified for UI, real check needed

  // --- MOCK AUTH & DATA ---
  const mockVerifyPassword = async (pass: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return pass === "ceo123"; // Simplified mock password
  };
  const mockLogAttempt = async (log: AccessLogRecord) => { console.log("Mock Log:", log); await new Promise(resolve => setTimeout(resolve, 100)); };
  const mockFetchUsers = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, users: Array.from({length:5}, (_,i) => ({id:i, Name:`User ${i}`, Email:`user${i}@example.com`, Class:`10`, Board:`CBSE`, DOB:`2000-01-01`, Password:`hash${i}`, FirebaseUID:`fbuid${i}`}))};
  };
  // --- END MOCK ---

  useEffect(() => {
    const ceoStatus = localStorage.getItem('isCeoLoggedIn') === 'true';
    setIsCeo(ceoStatus);

    const storedLockout = localStorage.getItem('userAccountLockout');
    if (storedLockout) {
      const lockoutEndTime = parseInt(storedLockout, 10);
      if (Date.now() < lockoutEndTime) {
        setIsLocked(true);
        setLockoutTime(lockoutEndTime);
        setShowAuthDialog(true); // Ensure dialog is shown if locked
      } else {
        localStorage.removeItem('userAccountLockout');
      }
    } else {
         setShowAuthDialog(true); // If not locked and not authenticated, show dialog
    }
  }, []);
  
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (isLocked && lockoutTime) {
      const updateTimer = () => {
        const timeLeft = Math.max(0, lockoutTime - Date.now());
        if (timeLeft === 0) {
          setIsLocked(false);
          setLockoutTime(null);
          localStorage.removeItem('userAccountLockout');
          setAttempts(0); // Reset attempts
          setAuthError(null); // Clear lockout message
        } else {
         timerId = setTimeout(updateTimer, 1000);
        }
      };
      updateTimer();
    }
    return () => clearTimeout(timerId);
  }, [isLocked, lockoutTime]);


  const handlePasswordSubmit = async () => {
    if (isLocked) {
      toast({variant: "destructive", title: "Locked Out", description: `Too many failed attempts. Try again later.`});
      return;
    }
    setIsLoadingAuth(true); setAuthError(null);
    try {
      // const result = await verifyUserDataPagePasswordAction(password);
      const success = await mockVerifyPassword(password); // MOCK
      // const currentUserEmail = localStorage.getItem('currentUserEmail') || 'N/A';
      // const currentUserName = localStorage.getItem('currentUserFullName') || 'N/A';
      // await logUserDataAccessAttemptAction({ Name: currentUserName, Email: currentUserEmail, 'Date/Time': new Date().toISOString(), Result: success ? 'Success' : 'Failure', Reason: success ? 'NULL' : 'Incorrect Password' });
      await mockLogAttempt({ Name: "Test User", Email: "test@example.com", 'Date/Time': new Date().toISOString(), Result: success ? 'Success' : 'Failure', Reason: success ? 'NULL' : 'Incorrect Password' });


      if (success) { // result.success
        setIsAuthenticated(true);
        setShowAuthDialog(false); // Hide dialog on success
        setAttempts(0); // Reset attempts on success
        fetchUserData();
      } else {
        setAuthError("Incorrect password."); // result.error
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        if (newAttempts >= 2) {
          const oneHourLockout = Date.now() + 60 * 60 * 1000;
          localStorage.setItem('userAccountLockout', oneHourLockout.toString());
          setIsLocked(true);
          setLockoutTime(oneHourLockout);
          setAuthError("Too many failed attempts. Locked out for 1 hour.");
          // await logUserDataAccessAttemptAction({ Name: currentUserName, Email: currentUserEmail, 'Date/Time': new Date().toISOString(), Result: 'Failure', Reason: 'Account Locked' });
          await mockLogAttempt({ Name: "Test User", Email: "test@example.com", 'Date/Time': new Date().toISOString(), Result: 'Failure', Reason: 'Account Locked' });
        }
      }
    } catch (e: any) { setAuthError(e.message);
    } finally { setIsLoadingAuth(false); }
  };

  const fetchUserData = async () => {
    setIsLoadingData(true); setDataError(null);
    try {
      // const result = await fetchProtectedUsersDataAction();
      const result = await mockFetchUsers(); // MOCK
      if (result.success && result.users) setUserData(result.users);
      else { setDataError("Failed to load user data."); } // result.error
    } catch (e: any) { setDataError(e.message);
    } finally { setIsLoadingData(false); }
  };


  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <NewTopNav />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center">
          <Dialog open={showAuthDialog} onOpenChange={(open) => { if (!open && !isAuthenticated) setShowAuthDialog(true); /* Keep dialog open if not authenticated */ else setShowAuthDialog(open);}}>
            <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2"><ShieldCheck /> Secure Data Access</DialogTitle>
                <DialogDescription>Enter the password to view User Account Data. Table ID: {USER_DATA_TABLE_ID}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {isLocked && lockoutTime && (
                  <div className="text-sm text-destructive p-2 bg-destructive/10 border border-destructive/30 rounded-md text-center">
                     <AlertTriangle className="text-destructive mb-1 h-5 w-5 inline-block mr-1" />
                     Account access locked. Try again in {Math.ceil((lockoutTime - Date.now()) / 60000)} minutes.
                  </div>
                )}
                {!isLocked && (
                  <>
                    <div>
                      <Label htmlFor="pagePasswordUserAccounts">Password</Label>
                      <Input id="pagePasswordUserAccounts" type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoadingAuth} />
                    </div>
                    {authError && <p className="text-sm text-destructive text-center">{authError}</p>}
                  </>
                )}
              </div>
              <DialogFooter>
                {!isLocked && (
                  <Button onClick={handlePasswordSubmit} disabled={isLoadingAuth} className="w-full">
                    {isLoadingAuth ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Unlock Data"}
                  </Button>
                )}
              </DialogFooter>
                 <p className="text-xs text-muted-foreground text-center pt-2">Access attempts are logged. Max 2 failed attempts before 1-hour lockout.</p>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <NewTopNav />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <section className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <PageIcon className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">User's Account Data</h1>
            </div>
            <p className="text-lg text-muted-foreground ml-13">
              Individual user account details. Data is read-only for team members. Editable by CEO. (Table ID: {USER_DATA_TABLE_ID})
            </p>
          </div>
        </section>

        <section className="space-y-6">
           <Card>
            <CardHeader>
              <CardTitle>User Accounts</CardTitle>
              <CardDescription>Displaying user data. {isCeo ? "Editing enabled for CEO." : "Read-only access."}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoadingData ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /><p className="ml-2">Loading user data...</p></div>
              ) : dataError ? (
                <div className="text-destructive text-center py-20"><AlertTriangle className="h-8 w-8 mx-auto mb-2" /><p>{dataError}</p></div>
              ) : (
                 <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {userAccountFields.map(field => <TableHead key={field}>{field}</TableHead>)}
                          {isCeo && <TableHead>Actions</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userData.length === 0 ? (
                          <TableRow><TableCell colSpan={userAccountFields.length + (isCeo ? 1:0)} className="text-center text-muted-foreground py-10">No user data found.</TableCell></TableRow>
                        ) : (
                          userData.map((user) => (
                            <TableRow key={user.id}>
                              {userAccountFields.map(field => (
                                <TableCell key={field} className="text-sm text-muted-foreground whitespace-nowrap">
                                  {field === 'Password' ? '••••••••' : (user[field] !== undefined ? String(user[field]) : 'N/A')}
                                </TableCell>
                              ))}
                              {isCeo && <TableCell><Button variant="outline" size="sm" disabled>Edit (CEO)</Button></TableCell>}
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                 </div>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}

    