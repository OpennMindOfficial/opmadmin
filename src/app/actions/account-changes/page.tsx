
// src/app/actions/account-changes/page.tsx
"use client";

import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UserCog as PageIcon, Loader2, AlertTriangle, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { getAccountChangesLogAction, type AccountChangeLogEntry } from '@/app/actions/accountLogActions';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { format, parseISO, isValid } from 'date-fns';

const formatTimestamp = (timestamp?: string) => {
  if (!timestamp) return 'N/A';
  try {
    const date = parseISO(timestamp);
    return isValid(date) ? format(date, "MMM dd, yyyy 'at' hh:mm a") : 'Invalid Date';
  } catch (e) {
    return 'Invalid Date Format';
  }
};

const getStatusIndicator = (status?: string) => {
  if (!status) return <span className="text-xs text-muted-foreground">N/A</span>;
  const lowerStatus = status.toLowerCase();
  if (lowerStatus === 'success' || lowerStatus === 'true') {
    return <CheckCircle className="h-5 w-5 text-green-500" title="Success" />;
  }
  if (lowerStatus === 'failure' || lowerStatus === 'false') {
    return <XCircle className="h-5 w-5 text-red-500" title="Failure" />;
  }
  return <span className="text-xs text-muted-foreground">{status}</span>;
};


export default function AccountChangesPage() {
  const { toast } = useToast();
  const [logs, setLogs] = useState<AccountChangeLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    setIsLoading(true); setError(null);
    try {
      const result = await getAccountChangesLogAction();
      if (result.success && result.logs) {
        setLogs(result.logs);
      } else {
        setError(result.error || "Failed to load account change logs.");
        toast({ variant: "destructive", title: "Error", description: result.error || "Failed to load logs." });
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
              Review recent modifications and updates to user accounts. (Table ID: 542794)
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
              <CardDescription>A log of recent user account modifications from Baserow.</CardDescription>
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
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="w-2/5">Change Description</TableHead>
                        <TableHead className="text-center">Result</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logs.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                            No account changes logged in Baserow table 542794.
                          </TableCell>
                        </TableRow>
                      ) : (
                        logs.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{formatTimestamp(log.timestamp)}</TableCell>
                            <TableCell className="font-medium">{log.userName || 'N/A'}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{log.userEmail || 'N/A'}</TableCell>
                            <TableCell className="text-sm text-muted-foreground whitespace-pre-wrap break-words">{log.action || 'N/A'}</TableCell>
                            <TableCell className="text-center">{getStatusIndicator(log.status)}</TableCell>
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
