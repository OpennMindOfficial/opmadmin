
// src/app/actions/api-status/page.tsx
"use client";

import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlugZap as PageIcon, Loader2, AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
// TODO: Implement Server Actions and Baserow Service for API Status
// import { getApiStatusAction, type ApiStatusRecord } from '@/app/actions/apiStatusActions'; // Placeholder
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

// Placeholder type
interface ApiStatusRecord {
  id: string; // Or number if from Baserow
  apiName: string;
  status: 'Operational' | 'Degraded' | 'Outage' | 'Unknown';
  lastChecked: string; // ISO date string
  responseTime?: string; // e.g., "120ms"
  endpoint: string;
}

export default function ApiStatusPage() {
  const { toast } = useToast();
  const [apiStatuses, setApiStatuses] = useState<ApiStatusRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- MOCK DATA & FUNCTIONS ---
  const mockApiStatuses: ApiStatusRecord[] = [
    { id: '1', apiName: 'Baserow User API', status: 'Operational', lastChecked: new Date().toISOString(), responseTime: '85ms', endpoint: 'https://api.baserow.io/api/user/' },
    { id: '2', apiName: 'OpenAI GPT-4 API', status: 'Degraded', lastChecked: new Date(Date.now() - 5*60000).toISOString(), responseTime: '1500ms', endpoint: 'https://api.openai.com/v1/chat/completions' },
    { id: '3', apiName: 'Internal Notifications API', status: 'Operational', lastChecked: new Date(Date.now() - 2*60000).toISOString(), responseTime: '30ms', endpoint: '/api/notifications' },
    { id: '4', apiName: 'Third-party Analytics API', status: 'Outage', lastChecked: new Date(Date.now() - 10*60000).toISOString(), endpoint: 'https://analytics.example.com/api' },
  ];
  const mockGetApiStatusAction = async () => {
    await new Promise(resolve => setTimeout(resolve, 700)); // Simulate delay
    // Randomly change one status for demo
    const randomIndex = Math.floor(Math.random() * mockApiStatuses.length);
    const statuses: ('Operational' | 'Degraded' | 'Outage' | 'Unknown')[] = ['Operational', 'Degraded', 'Outage'];
    mockApiStatuses[randomIndex].status = statuses[Math.floor(Math.random() * statuses.length)];
    mockApiStatuses[randomIndex].lastChecked = new Date().toISOString();
    return { success: true, statuses: [...mockApiStatuses].sort((a,b) => a.apiName.localeCompare(b.apiName)) };
  };
  // --- END MOCK ---

  const fetchApiStatuses = async () => {
    setIsLoading(true); setError(null);
    try {
      // const result = await getApiStatusAction();
      const result = await mockGetApiStatusAction();
      if (result.success && result.statuses) {
        setApiStatuses(result.statuses);
      } else {
        setError("Failed to load API statuses."); // result.error
        toast({ variant: "destructive", title: "Error", description: "Failed to load API statuses." });
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApiStatuses();
    const interval = setInterval(fetchApiStatuses, 60000); // Refresh every minute
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStatusIndicator = (status: ApiStatusRecord['status']) => {
    switch (status) {
      case 'Operational': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Degraded': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'Outage': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatLastChecked = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <NewTopNav />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <section className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <PageIcon className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">API in Use</h1>
            </div>
            <p className="text-lg text-muted-foreground ml-13">
              Monitor the status and usage of currently active APIs. (Specific Baserow table TBD)
            </p>
          </div>
           <Button onClick={fetchApiStatuses} variant="outline" disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Status
          </Button>
        </section>

        <section className="space-y-6">
           <Card>
            <CardHeader>
              <CardTitle>API Status Dashboard</CardTitle>
              <CardDescription>Real-time status and metrics for integrated APIs.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading && apiStatuses.length === 0 ? ( // Show loader only on initial load
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="ml-2">Loading API statuses...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-20 text-destructive">
                  <AlertTriangle className="h-8 w-8 mb-2" />
                  <p className="font-semibold">Error loading API statuses</p>
                  <p className="text-sm">{error}</p>
                  <Button onClick={fetchApiStatuses} variant="outline" className="mt-4">Try Again</Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]"></TableHead>
                        <TableHead>API Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Response Time</TableHead>
                        <TableHead>Endpoint</TableHead>
                        <TableHead className="text-right">Last Checked</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {apiStatuses.length === 0 && !isLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                            No API statuses to display.
                          </TableCell>
                        </TableRow>
                      ) : (
                        apiStatuses.map((api) => (
                          <TableRow key={api.id}>
                            <TableCell>{getStatusIndicator(api.status)}</TableCell>
                            <TableCell className="font-medium">{api.apiName}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                                api.status === 'Operational' ? 'bg-green-100 text-green-700' :
                                api.status === 'Degraded' ? 'bg-yellow-100 text-yellow-700' :
                                api.status === 'Outage' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                              }`}>
                                {api.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">{api.responseTime || 'N/A'}</TableCell>
                            <TableCell className="text-sm text-muted-foreground truncate max-w-xs">{api.endpoint}</TableCell>
                            <TableCell className="text-right text-sm text-muted-foreground">{formatLastChecked(api.lastChecked)}</TableCell>
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

    