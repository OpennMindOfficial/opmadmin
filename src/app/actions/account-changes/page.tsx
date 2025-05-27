
// src/app/actions/account-changes/page.tsx
"use client";

import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UserCog as PageIcon, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
// TODO: Implement Server Actions and Baserow Service for Account Changes Log
// import { getAccountChangesLogAction, type AccountChangeLogEntry } from '@/app/actions/accountLogActions'; // Placeholder
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { format, parseISO, isValid } from 'date-fns';

// Placeholder type
interface AccountChangeLogEntry {
  id: string; // or number
  UserEmail: string;
  UserName?: string;
  Action: string; // e.g., "Profile Update", "Password Change", "Email Changed"
  Timestamp: string; // ISO date string
  Details?: string; // e.g., "Changed name from X to Y"
  ChangedBy?: string; // Admin/System/User
}

const formatTimestamp = (timestamp?: string) => {
  if (!timestamp) return 'N/A';
  try {
    const date = parseISO(timestamp);
    return isValid(date) ? format(date, "MMM dd, yyyy 'at' hh:mm a") : 'Invalid Date';
  } catch (e) {
    return 'Invalid Date Format';
  }
};


export default function AccountChangesPage() {
  const { toast } = useToast();
  const [logs, setLogs] = useState<AccountChangeLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- MOCK DATA & FUNCTIONS ---
  const mockAccountChanges: AccountChangeLogEntry[] = [
    { id: '1', UserEmail: 'user1@example.com', UserName: 'Alice Smith', Action: 'Profile Update', Timestamp: new Date(Date.now() - 1*60*60000).toISOString(), Details: 'Updated DOB', ChangedBy: 'User' },
    { id: '2', UserEmail: 'user2@example.com', UserName: 'Bob Johnson', Action: 'Password Change', Timestamp: new Date(Date.now() - 2*60*60000).toISOString(), Details: 'Password changed successfully', ChangedBy: 'User' },
    { id: '3', UserEmail: 'user1@example.com', UserName: 'Alice Smith', Action: 'Email Changed', Timestamp: new Date(Date.now() - 5*60*60000).toISOString(), Details: 'Email changed from old@example.com to user1@example.com', ChangedBy: 'Admin' },
    { id: '4', UserEmail: 'user3@example.com', UserName: 'Charlie Brown', Action: 'Account Created', Timestamp: new Date(Date.now() - 24*60*60000).toISOString(), Details: 'New account registered via email.', ChangedBy: 'System' },
  ];
  const mockGetAccountChangesLogAction = async () => {
    await new Promise(resolve => setTimeout(resolve, 600)); // Simulate delay
    return { success: true, logs: [...mockAccountChanges].sort((a,b) => new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime()) };
  };
  // --- END MOCK ---

  const fetchLogs = async () => {
    setIsLoading(true); setError(null);
    try {
      // const result = await getAccountChangesLogAction();
      const result = await mockGetAccountChangesLogAction();
      if (result.success && result.logs) {
        setLogs(result.logs);
      } else {
        setError("Failed to load account change logs."); // result.error
        toast({ variant: "destructive", title: "Error", description: "Failed to load logs." });
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <NewTopNav />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <section className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <PageIcon className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">Account Changes (User)</h1>
            </div>
            <p className="text-lg text-muted-foreground ml-13">
              Review recent modifications and updates to user accounts. (Specific Baserow table for audit log TBD)
            </p>
          </div>
           <Button onClick={fetchLogs} variant="outline" disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Logs
          </Button>
        </section>

        <section className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Change Log</CardTitle>
              <CardDescription>A log of recent user account modifications.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
               {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="ml-2">Loading logs...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-20 text-destructive">
                  <AlertTriangle className="h-8 w-8 mb-2" />
                  <p className="font-semibold">Error loading logs</p>
                  <p className="text-sm">{error}</p>
                  <Button onClick={fetchLogs} variant="outline" className="mt-4">Try Again</Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>User Email</TableHead>
                        <TableHead>User Name</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>Changed By</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logs.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                            No account changes logged.
                          </TableCell>
                        </TableRow>
                      ) : (
                        logs.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{formatTimestamp(log.Timestamp)}</TableCell>
                            <TableCell className="font-medium">{log.UserEmail}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{log.UserName || 'N/A'}</TableCell>
                            <TableCell className="text-sm">{log.Action}</TableCell>
                            <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{log.Details || 'N/A'}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{log.ChangedBy || 'N/A'}</TableCell>
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

    