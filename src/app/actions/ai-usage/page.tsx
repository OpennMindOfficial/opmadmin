
// src/app/actions/ai-usage/page.tsx
"use client";

import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BrainCircuit as PageIcon, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { getAiUsageDataAction } from '@/app/actions/aiUsageActions';
import type { AiUsageBaserowRecord } from '@/services/baserowService';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { format, parseISO, isValid } from 'date-fns';

const formatDateForDisplay = (dateString?: string) => {
  if (!dateString) return 'N/A';
  try {
    const date = parseISO(dateString);
    return isValid(date) ? format(date, "MMM dd, yyyy") : dateString; // Fallback if not ISO
  } catch (e) {
    return dateString;
  }
};

export default function AiUsagePage() {
  const { toast } = useToast();
  const [usageLogs, setUsageLogs] = useState<AiUsageBaserowRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getAiUsageDataAction();
      if (result.success && result.usageData) {
        setUsageLogs(result.usageData);
      } else {
        setError(result.error || "Failed to load AI usage logs.");
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
              <h1 className="text-4xl font-bold tracking-tight">AI Usage</h1>
            </div>
            <p className="text-lg text-muted-foreground ml-13">
              Track metrics and patterns related to AI feature utilization. (Table ID: 553904)
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
              <CardTitle>AI Usage Log</CardTitle>
              <CardDescription>Detailed log of AI usage metrics from Baserow table 553904.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
               {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="ml-2">Loading AI usage logs...</p>
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
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Messages Sent</TableHead>
                        <TableHead className="text-right">Active Users</TableHead>
                        <TableHead>Most Asked Subject</TableHead>
                        <TableHead className="text-right">Tokens Used</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usageLogs.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                            No AI usage data found in Baserow table 553904.
                          </TableCell>
                        </TableRow>
                      ) : (
                        usageLogs.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{formatDateForDisplay(log.Date)}</TableCell>
                            <TableCell className="text-right font-medium">{log['Number of Messages sent'] ?? 'N/A'}</TableCell>
                            <TableCell className="text-right text-sm text-muted-foreground">{log['Number of users'] ?? 'N/A'}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{log['Most asked subject'] || 'N/A'}</TableCell>
                            <TableCell className="text-right text-sm text-muted-foreground">{log['Tokens used'] ?? 'N/A'}</TableCell>
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
