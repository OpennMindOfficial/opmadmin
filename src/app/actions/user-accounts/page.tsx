
// src/app/actions/user-accounts/page.tsx
"use client";

import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Users as PageIcon, Loader2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { verifyPagePasswordAction, logAccessAttemptAction, fetchProtectedUsersDataAction } from '@/app/actions/secureDataActions';
import type { UserRecord } from '@/services/baserowService';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

// Table IDs
const USER_DATA_TABLE_ID_DISPLAY = '542785'; // For display only

const userAccountFields = ['Name', 'Email', 'Class', 'Board', 'DOB', 'Password', 'FirebaseUID'];

export default function UserAccountsPage() {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(true);
  const [password, setPassword] = useState('');
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);

  const [userData, setUserData] = useState<UserRecord[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);

  const [isCeo, setIsCeo] = useState(false);

  const PAGE_LOCKOUT_KEY = 'userAccountLockout';

  useEffect(() => {
    const ceoStatus = localStorage.getItem('isCeoLoggedIn') === 'true';
    setIsCeo(ceoStatus);

    const storedLockout = localStorage.getItem(PAGE_LOCKOUT_KEY);
    if (storedLockout) {
      const lockoutEndTime = parseInt(storedLockout, 10);
      if (Date.now() < lockoutEndTime) {
        setIsLocked(true);
        setLockoutTime(lockoutEndTime);
        setShowAuthDialog(true);
      } else {
        localStorage.removeItem(PAGE_LOCKOUT_KEY);
      }
    } else {
         setShowAuthDialog(true);
    }
  }, []);
  
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (isLocked && lockoutTime) {
      setAuthError(`Account access locked. Try again in ${Math.ceil((lockoutTime - Date.now()) / 60000)} minutes.`);
      const updateTimer = () => {
        const timeLeft = Math.max(0, lockoutTime - Date.now());
        if (timeLeft === 0) {
          setIsLocked(false);
          setLockoutTime(null);
          localStorage.removeItem(PAGE_LOCKOUT_KEY);
          setAttempts(0);
          setAuthError(null);
        } else {
         setAuthError(`Account access locked. Try again in ${Math.ceil(timeLeft / 60000)} minutes.`);
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
    
    const currentUserEmail = localStorage.getItem('currentUserEmail') || 'N/A';
    const currentUserName = localStorage.getItem('currentUserFullName') || 'N/A';
    const logBase = { Name: currentUserName, Email: currentUserEmail, 'Date/Time': new Date().toISOString() };

    try {
      const result = await verifyPagePasswordAction(password);

      if (result.success) {
        await logAccessAttemptAction({ ...logBase, Result: 'Success', Reason: 'NULL' });
        setIsAuthenticated(true);
        setShowAuthDialog(false);
        setAttempts(0);
        fetchUserData();
      } else {
        await logAccessAttemptAction({ ...logBase, Result: 'Failure', Reason: result.error || 'Incorrect Password' });
        setAuthError(result.error || "Incorrect password.");
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        if (newAttempts >= 2) {
          const oneHourLockout = Date.now() + 60 * 60 * 1000;
          localStorage.setItem(PAGE_LOCKOUT_KEY, oneHourLockout.toString());
          setIsLocked(true);
          setLockoutTime(oneHourLockout);
          const lockoutReason = "Account Locked (Max Attempts Reached)";
          setAuthError(lockoutReason); // This will be updated by the useEffect timer
          await logAccessAttemptAction({ ...logBase, Result: 'Failure', Reason: lockoutReason });
        }
      }
    } catch (e: any) { 
      setAuthError(e.message);
      await logAccessAttemptAction({ ...logBase, Result: 'Failure', Reason: e.message || 'Exception during verification' });
    } finally { 
      setIsLoadingAuth(false); 
    }
  };

  const fetchUserData = async () => {
    setIsLoadingData(true); setDataError(null);
    try {
      const result = await fetchProtectedUsersDataAction();
      if (result.success && result.data) setUserData(result.data);
      else { setDataError(result.error || "Failed to load user data."); }
    } catch (e: any) { setDataError(e.message);
    } finally { setIsLoadingData(false); }
  };


  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <NewTopNav />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center">
          <Dialog open={showAuthDialog} onOpenChange={(open) => { if (!open && !isAuthenticated) setShowAuthDialog(true); else setShowAuthDialog(open);}}>
            <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2"><ShieldCheck /> Secure Data Access</DialogTitle>
                <DialogDescription>Enter the password to view User Account Data. Table ID: {USER_DATA_TABLE_ID_DISPLAY}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {isLocked && authError && (
                  <div className="text-sm text-destructive p-2 bg-destructive/10 border border-destructive/30 rounded-md text-center">
                     <AlertTriangle className="text-destructive mb-1 h-5 w-5 inline-block mr-1" />
                     {authError}
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
              Individual user account details. Data is read-only for team members. Editable by CEO. (Table ID: {USER_DATA_TABLE_ID_DISPLAY})
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
                                  {field === 'Password' ? '••••••••' : (user[field] !== undefined && user[field] !== null ? String(user[field]) : 'N/A')}
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
