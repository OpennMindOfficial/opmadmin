
// src/app/actions/api-testing/page.tsx
"use client";

import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TestTube2 as PageIcon, Loader2, AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { getApiTestConfigsAction } from '@/app/actions/apiTestActions';
import type { ApiTestConfigRecord } from '@/services/baserowService';

// Function to parse comma-separated API keys
const parseApiKeys = (dataField?: string): string[] => {
  if (!dataField) return [];
  return dataField.split(',').map(key => key.trim()).filter(key => key);
};

const getStatusIndicator = (activeValue?: boolean | string) => {
  const isActive = activeValue === true || (typeof activeValue === 'string' && String(activeValue).toLowerCase() === 'true');
  if (isActive) return <CheckCircle className="h-5 w-5 text-green-500" title="Active" />;
  return <XCircle className="h-5 w-5 text-red-500" title="Inactive"/>;
};

export default function ApiTestingPage() {
  const { toast } = useToast();
  const [configs, setConfigs] = useState<ApiTestConfigRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchConfigs = async () => {
    setIsLoading(true); setError(null);
    try {
      const result = await getApiTestConfigsAction();
      if (result.success && result.configs) {
        setConfigs(result.configs);
      } else {
        setError(result.error || "Failed to load API test configurations.");
        toast({ variant: "destructive", title: "Error", description: result.error || "Failed to load configurations." });
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
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
              <h1 className="text-4xl font-bold tracking-tight">API Testing Configurations</h1>
            </div>
            <p className="text-lg text-muted-foreground ml-13">
              View configured API endpoints. (Table ID: 542783)
            </p>
          </div>
           <Button onClick={fetchConfigs} variant="outline" disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Configurations
          </Button>
        </section>

        <section className="space-y-6">
           <Card>
            <CardHeader>
              <CardTitle>Available API Configurations</CardTitle>
              <CardDescription>List of APIs sourced from Baserow.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="ml-2">Loading configurations...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-20 text-destructive">
                  <AlertTriangle className="h-8 w-8 mb-2" />
                  <p className="font-semibold">Error loading configurations</p>
                  <p className="text-sm">{error}</p>
                  <Button onClick={fetchConfigs} variant="outline" className="mt-4">Try Again</Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>API Keys (Data)</TableHead>
                        <TableHead>Use Case</TableHead>
                        <TableHead>Active</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {configs.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                            No API configurations found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        configs.map((config) => (
                          <TableRow key={config.id}>
                            <TableCell className="font-medium">{config.ID || 'N/A'}</TableCell>
                            <TableCell>{config.Type || 'N/A'}</TableCell>
                            <TableCell>
                              {parseApiKeys(config.Data).length > 0 ? (
                                <div className="flex flex-col gap-1.5">
                                  {parseApiKeys(config.Data).map((apiKey, index) => (
                                    <div key={index} className="flex items-center justify-between gap-2">
                                      <span className="text-xs font-mono bg-muted p-1 rounded break-all">{apiKey}</span>
                                      {/* Test button removed */}
                                    </div>
                                  ))}
                                </div>
                              ) : <span className="text-xs text-muted-foreground">No keys</span>}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">{config['Use case'] || 'N/A'}</TableCell>
                            <TableCell>{getStatusIndicator(config.Active)}</TableCell>
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
        {/* Dialog component removed */}
      </main>
    </div>
  );
}
