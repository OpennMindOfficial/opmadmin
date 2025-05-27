
// src/app/actions/view-bugs/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { MetricsOverview } from '@/components/dashboard/metrics-overview';
import { Button } from '@/components/ui/button';
import { Bug as PageIcon, PlusCircle, Loader2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from '@/hooks/use-toast';
import { getBugReportsAction } from '@/app/actions/managementActions'; // Assuming actions are here
import type { BugReportBaserowRecord } from '@/services/baserowService';
import { format, parseISO, isValid } from 'date-fns';

const formatDate = (dateString?: string) => {
  if (!dateString) return 'N/A';
  try {
    const date = parseISO(dateString);
    return isValid(date) ? format(date, "MMM dd, yyyy 'at' hh:mm a") : 'Invalid Date';
  } catch (e) {
    return 'Invalid Date Format';
  }
};

export default function ViewBugsPage() {
  const { toast } = useToast();
  const [bugReports, setBugReports] = useState<BugReportBaserowRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBugReports = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getBugReportsAction();
      if (result.success && result.reports) {
        setBugReports(result.reports);
      } else {
        setError(result.error || "Failed to load bug reports.");
        toast({ variant: "destructive", title: "Error", description: result.error });
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBugReports();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <NewTopNav />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <section className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <PageIcon className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">View Reported Bugs</h1>
            </div>
            <p className="text-lg text-muted-foreground ml-13">
              Track, review, and manage software bugs reported by users and team members.
            </p>
          </div>
          {/* <Button variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" />
            Report New Bug (Placeholder)
          </Button> */}
        </section>

        <section className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bug Reports</CardTitle>
              <CardDescription>List of all reported issues on the platform.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="ml-2">Loading bug reports...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-10 text-destructive">
                  <AlertTriangle className="h-8 w-8 mb-2" />
                  <p className="font-semibold">Error loading reports</p>
                  <p className="text-sm">{error}</p>
                  <Button onClick={fetchBugReports} variant="outline" className="mt-4">Try Again</Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reporter Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="w-2/5">Report Description</TableHead>
                      <TableHead>Date Reported</TableHead>
                      {/* <TableHead className="text-right">Actions</TableHead> */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bugReports.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground py-10">
                          No bug reports found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      bugReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">{report.Name || 'N/A'}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{report.Email || 'N/A'}</TableCell>
                          <TableCell className="text-sm text-muted-foreground whitespace-pre-wrap break-words">{report.Report || 'N/A'}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{formatDate(report.Date)}</TableCell>
                          {/* <TableCell className="text-right space-x-1">
                            <Button variant="ghost" size="icon" title="View Details" disabled><Eye className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" title="Mark as Resolved" disabled><CheckSquare className="h-4 w-4 text-green-600" /></Button>
                          </TableCell> */}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </section>
        
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Key Metrics</h2>
          <MetricsOverview />
        </section>
      </main>
    </div>
  );
}

    