
// src/app/actions/website-traffic/page.tsx
"use client";

import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity as PageIcon, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { getWebsiteTrafficDataAction } from '@/app/actions/websiteTrafficActions';
import type { WebsiteTrafficBaserowRecord } from '@/services/baserowService';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { format, parseISO, isValid } from 'date-fns';

const formatDateForDisplay = (dateString?: string) => {
  if (!dateString) return 'N/A';
  try {
    const date = parseISO(dateString);
    return isValid(date) ? format(date, "MMM dd, yyyy") : dateString; // Fallback to original string if not ISO
  } catch (e) {
    return dateString; // Fallback if parsing fails
  }
};


export default function WebsiteTrafficPage() {
  const { toast } = useToast();
  const [trafficLogs, setTrafficLogs] = useState<WebsiteTrafficBaserowRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getWebsiteTrafficDataAction();
      if (result.success && result.trafficData) {
        setTrafficLogs(result.trafficData);
      } else {
        setError(result.error || "Failed to load website traffic logs.");
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
              <h1 className="text-4xl font-bold tracking-tight">Website Traffic</h1>
            </div>
            <p className="text-lg text-muted-foreground ml-13">
              Log of website visits and user activity metrics. (Table ID: 542800)
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
              <CardTitle>Traffic Log</CardTitle>
              <CardDescription>Detailed log of website traffic metrics from Baserow.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
               {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="ml-2">Loading traffic logs...</p>
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
                        <TableHead className="text-right">Visits</TableHead>
                        <TableHead>Avg. Active Time</TableHead>
                        <TableHead className="text-right">Number of Users</TableHead>
                        <TableHead className="text-right">Logged-in Users</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {trafficLogs.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                            No website traffic data found in Baserow table 542800.
                          </TableCell>
                        </TableRow>
                      ) : (
                        trafficLogs.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{formatDateForDisplay(log.Date)}</TableCell>
                            <TableCell className="text-right font-medium">{log.Visits ?? 'N/A'}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{log['Avg active time'] || 'N/A'}</TableCell>
                            <TableCell className="text-right text-sm text-muted-foreground">{log['Number of users'] ?? 'N/A'}</TableCell>
                            <TableCell className="text-right text-sm text-muted-foreground">{log['Logged in users'] ?? 'N/A'}</TableCell>
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
