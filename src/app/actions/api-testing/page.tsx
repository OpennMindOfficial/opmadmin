
// src/app/actions/api-testing/page.tsx
"use client";

import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TestTube2 as PageIcon, Play, Loader2, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
// TODO: Implement Server Actions for API Testing
// import { runApiTestAction, type ApiTestResult } from '@/app/actions/apiTestActions'; // Placeholder
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Placeholder type
interface ApiTestResult {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: any; // Can be JSON, text, etc.
  duration: number; // ms
  error?: string;
}

const apiTestSchema = z.object({
  endpoint: z.string().url("Must be a valid API endpoint URL."),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  headers: z.string().optional().transform(val => {
    try { return val ? JSON.parse(val) : {}; } catch { return {}; }
  }),
  body: z.string().optional().transform(val => {
    try { return val ? JSON.parse(val) : null; } catch { return val || null; } // Keep as string if not JSON
  }),
});
type ApiTestFormData = z.infer<typeof apiTestSchema>;

const availableEndpoints = [
  { name: "Get All Users (Mock)", url: "/api/mock/users", method: "GET" },
  { name: "Create User (Mock)", url: "/api/mock/users", method: "POST", bodyExample: '{\n  "name": "Test User",\n  "email": "test@example.com"\n}' },
  { name: "Baserow List Rows (Example)", url: "https://api.baserow.io/api/database/rows/table/YOUR_TABLE_ID/", method: "GET", headersExample: '{\n  "Authorization": "Token YOUR_BASEROW_API_KEY"\n}'},
];


export default function ApiTestingPage() {
  const { toast } = useToast();
  const [testResult, setTestResult] = useState<ApiTestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit: handleFormSubmit, reset, setValue, watch, formState: { errors } } = useForm<ApiTestFormData>({
    resolver: zodResolver(apiTestSchema),
    defaultValues: { method: "GET", headers: "{}", body: "" },
  });

  const selectedMethod = watch("method");

  // --- MOCK DATA & FUNCTIONS ---
  const mockRunApiTestAction = async (data: ApiTestFormData): Promise<ApiTestResult> => {
    setIsLoading(true); setError(null); setTestResult(null);
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000)); // Simulate API call
    
    // Simulate different responses
    const randomStatus = Math.random();
    if (randomStatus < 0.7) { // 70% success
      let responseBody: any = { message: "Success!" };
      if (data.method === "GET") responseBody = { data: [{id:1, name:"Item 1"}, {id:2, name:"Item 2"}]};
      else if (data.method === "POST" && data.body) responseBody = { message: "Resource created", created: data.body };

      setIsLoading(false);
      return {
        status: data.method === "POST" ? 201 : 200,
        statusText: data.method === "POST" ? "Created" : "OK",
        headers: { "content-type": "application/json", "x-request-id": "mock-" + Date.now() },
        body: responseBody,
        duration: Math.floor(Math.random() * 300) + 50,
      };
    } else if (randomStatus < 0.9) { // 20% client error
      setIsLoading(false);
      return {
        status: 400, statusText: "Bad Request",
        headers: { "content-type": "application/json" },
        body: { error: "Invalid input provided", details: "Mock validation failed." },
        duration: Math.floor(Math.random() * 100) + 20,
        error: "Mock Client Error: Invalid input provided"
      };
    } else { // 10% server error
      setIsLoading(false);
      return {
        status: 500, statusText: "Internal Server Error",
        headers: {},
        body: "A server error occurred.",
        duration: Math.floor(Math.random() * 50) + 10,
        error: "Mock Server Error: Something went wrong on the server"
      };
    }
  };
  // --- END MOCK ---

  const onSubmit: SubmitHandler<ApiTestFormData> = async (data) => {
    setIsLoading(true); setError(null); setTestResult(null);
    try {
      // const result = await runApiTestAction(data);
      const result = await mockRunApiTestAction(data);
      setTestResult(result);
      if(result.error) {
        toast({ variant: "destructive", title: `API Test Failed (${result.status})`, description: result.error });
      } else {
        toast({ title: `API Test Successful (${result.status})`, description: `Duration: ${result.duration}ms` });
      }
    } catch (e: any) {
      setError(e.message);
      setTestResult({ status: 0, statusText: "Client Error", headers: {}, body: null, duration:0, error: e.message });
      toast({ variant: "destructive", title: "Test Execution Error", description: e.message });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEndpointPreset = (url?: string, method?: string, headers?: string, body?: string) => {
    if (url) setValue("endpoint", url);
    if (method) setValue("method", method as ApiTestFormData["method"]);
    if (headers) setValue("headers", headers); else setValue("headers", "{}");
    if (body) setValue("body", body); else setValue("body", "");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <NewTopNav />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <section className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <PageIcon className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">API Testing</h1>
            </div>
            <p className="text-lg text-muted-foreground ml-13">
              Perform tests and diagnostics on various API endpoints. (Results not saved, for live testing only)
            </p>
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <Card>
            <CardHeader>
              <CardTitle>API Test Configuration</CardTitle>
              <CardDescription>Configure and run a test against an API endpoint.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFormSubmit(onSubmit)} className="space-y-4">
                 <div>
                    <Label htmlFor="endpointPreset">Endpoint Presets (Optional)</Label>
                    <Select onValueChange={(value) => {
                        const selected = availableEndpoints.find(ep => ep.url === value);
                        if(selected) handleEndpointPreset(selected.url, selected.method, selected.headersExample, selected.bodyExample);
                        else handleEndpointPreset(); // Clear if "custom"
                    }}>
                        <SelectTrigger><SelectValue placeholder="Select a preset or enter custom" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="custom">Custom Endpoint</SelectItem>
                            {availableEndpoints.map(ep => <SelectItem key={ep.name} value={ep.url}>{ep.name} ({ep.method})</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                  <Label htmlFor="endpoint">Endpoint URL <span className="text-destructive">*</span></Label>
                  <Input id="endpoint" {...register('endpoint')} placeholder="https://api.example.com/data" disabled={isLoading} />
                  {errors.endpoint && <p className="text-sm text-destructive mt-1">{errors.endpoint.message}</p>}
                </div>
                <div>
                  <Label htmlFor="method">HTTP Method <span className="text-destructive">*</span></Label>
                  <Select value={selectedMethod} onValueChange={(value) => setValue("method", value as ApiTestFormData["method"])} disabled={isLoading}>
                    <SelectTrigger id="method"> <SelectValue placeholder="Select method" /> </SelectTrigger>
                    <SelectContent>
                      {["GET", "POST", "PUT", "PATCH", "DELETE"].map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="headers">Headers (JSON format)</Label>
                  <Textarea id="headers" {...register('headers')} rows={3} placeholder='{ "Authorization": "Bearer YOUR_TOKEN" }' disabled={isLoading} />
                  {errors.headers && <p className="text-sm text-destructive mt-1">{errors.headers.message}</p>}
                </div>
                {(selectedMethod === "POST" || selectedMethod === "PUT" || selectedMethod === "PATCH") && (
                  <div>
                    <Label htmlFor="body">Body (JSON or plain text)</Label>
                    <Textarea id="body" {...register('body')} rows={4} placeholder='{ "key": "value" }' disabled={isLoading} />
                    {errors.body && <p className="text-sm text-destructive mt-1">{errors.body.message}</p>}
                  </div>
                )}
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                  Run Test
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="sticky top-24"> {/* Make results card sticky */}
            <CardHeader>
              <CardTitle>Test Result</CardTitle>
              <CardDescription>Output from the API test will appear here.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && <div className="flex items-center justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /><p className="ml-2">Running test...</p></div>}
              {error && !testResult && <div className="text-destructive p-4 bg-destructive/10 rounded-md"><AlertTriangle className="inline mr-2"/>{error}</div>}
              {testResult && (
                <div className="space-y-3 text-sm">
                  <div className={`flex items-center p-2 rounded-md ${testResult.status >= 200 && testResult.status < 300 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {testResult.status >= 200 && testResult.status < 300 ? <CheckCircle className="mr-2 h-5 w-5"/> : <XCircle className="mr-2 h-5 w-5"/>}
                    <strong>Status: {testResult.status} {testResult.statusText}</strong>
                    <span className="ml-auto text-xs">Duration: {testResult.duration}ms</span>
                  </div>
                  {testResult.error && <p className="text-red-600"><strong>Error:</strong> {testResult.error}</p>}
                  
                  <div>
                    <h4 className="font-semibold mb-1">Headers:</h4>
                    <pre className="p-2 bg-muted rounded-md text-xs overflow-x-auto max-h-40">
                      {JSON.stringify(testResult.headers, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Body:</h4>
                    <pre className="p-2 bg-muted rounded-md text-xs overflow-x-auto max-h-60">
                      {testResult.body !== null && testResult.body !== undefined ? 
                       (typeof testResult.body === 'object' ? JSON.stringify(testResult.body, null, 2) : String(testResult.body))
                       : "No body returned or null."
                      }
                    </pre>
                  </div>
                </div>
              )}
              {!isLoading && !testResult && !error && <p className="text-muted-foreground text-center py-10">No test run yet or waiting for configuration.</p>}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

    