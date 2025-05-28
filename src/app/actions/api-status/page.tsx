
// src/app/actions/api-status/page.tsx
"use client";

import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlugZap as PageIcon, Loader2, AlertTriangle, CheckCircle, XCircle, RefreshCw, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { getApiStatusesAction, type ApiStatusBaserowRecord } from '@/app/actions/apiStatusActions';
// Dialog and form components will be needed to "Add New API"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Switch } from '@/components/ui/switch';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';

// Function to mask API Key (shows first 4 and last 4 chars)
const maskApiKey = (apiKey?: string): string => {
  if (!apiKey || apiKey.length < 8) return apiKey || 'N/A';
  return `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`;
};

export default function ApiStatusPage() {
  const { toast } = useToast();
  const [apiStatuses, setApiStatuses] = useState<ApiStatusBaserowRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const fetchApiStatuses = async () => {
    setIsLoading(true); setError(null);
    try {
      const result = await getApiStatusesAction();
      if (result.success && result.statuses) {
        setApiStatuses(result.statuses);
      } else {
        setError(result.error || "Failed to load API statuses.");
        toast({ variant: "destructive", title: "Error", description: result.error || "Failed to load API statuses." });
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getStatusIndicator = (activeValue?: boolean | string) => {
    const isActive = activeValue === true || (typeof activeValue === 'string' && activeValue.toLowerCase() === 'true');
    const isInactive = activeValue === false || (typeof activeValue === 'string' && activeValue.toLowerCase() === 'false');

    if (isActive) return <CheckCircle className="h-5 w-5 text-green-500" title="Active" />;
    if (isInactive) return <XCircle className="h-5 w-5 text-red-500" title="Inactive"/>;
    return <AlertTriangle className="h-5 w-5 text-gray-500" title="Unknown Status" />;
  };

  // Placeholder for Add API functionality
  const handleAddNewApi = () => {
    // setIsAddDialogOpen(true);
    toast({title: "Feature Coming Soon", description: "Adding new API entries will be implemented."});
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
              Monitor the status and usage of currently active APIs. (Table ID: 542782)
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={fetchApiStatuses} variant="outline" disabled={isLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Status
            </Button>
             <Button onClick={handleAddNewApi} variant="default">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New API
            </Button>
          </div>
        </section>

        <section className="space-y-6">
           <Card>
            <CardHeader>
              <CardTitle>API Status Dashboard</CardTitle>
              <CardDescription>Real-time status and details for integrated APIs.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading && apiStatuses.length === 0 ? ( 
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
                        <TableHead>ID</TableHead>
                        <TableHead>Used In</TableHead>
                        <TableHead>API Key (Masked)</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>By</TableHead>
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
                        apiStatuses.map((api) => {
                          const isActive = api.Active === true || (typeof api.Active === 'string' && api.Active.toLowerCase() === 'true');
                          const isInactive = api.Active === false || (typeof api.Active === 'string' && api.Active.toLowerCase() === 'false');
                          
                          let statusText = 'Unknown';
                          let statusClass = 'bg-gray-100 text-gray-700 dark:bg-gray-700/30 dark:text-gray-300';

                          if (isActive) {
                            statusText = 'Active';
                            statusClass = 'bg-green-100 text-green-700 dark:bg-green-800/30 dark:text-green-300';
                          } else if (isInactive) {
                            statusText = 'Inactive';
                            statusClass = 'bg-red-100 text-red-700 dark:bg-red-800/30 dark:text-red-300';
                          }

                          return (
                            <TableRow key={api.id}>
                              <TableCell>{getStatusIndicator(api.Active)}</TableCell>
                              <TableCell className="font-medium">{api.ID || 'N/A'}</TableCell>
                              <TableCell>{api['Used In'] || 'N/A'}</TableCell>
                              <TableCell className="font-mono text-sm text-muted-foreground">{maskApiKey(api['API Key'])}</TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 text-xs rounded-full font-semibold ${statusClass}`}>
                                  {statusText}
                                </span>
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">{api.By || 'N/A'}</TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
        {/* Placeholder for Add API Dialog. Will be implemented later if requested. */}
        {/* <AddApiDialog isOpen={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} onApiAdded={fetchApiStatuses} /> */}
      </main>
    </div>
  );
}

// Placeholder component for Add API Dialog
/*
const addApiSchema = z.object({
  ID: z.string().optional(), // Or z.number() if it's always numeric
  'Used In': z.string().min(1, "Usage location is required."),
  'API Key': z.string().min(1, "API Key is required."),
  'Active': z.boolean().default(true),
  'By': z.string().min(1, "Submitter name is required."),
});
type AddApiFormData = z.infer<typeof addApiSchema>;

interface AddApiDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onApiAdded: () => void; // Callback to refresh the list
}

function AddApiDialog({ isOpen, onOpenChange, onApiAdded }: AddApiDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<AddApiFormData>({
    resolver: zodResolver(addApiSchema),
    defaultValues: { Active: true }
  });

  const onSubmit: SubmitHandler<AddApiFormData> = async (data) => {
    setIsSubmitting(true);
    try {
      // const result = await addApiStatusAction(data); // Assuming addApiStatusAction exists
      // For now, let's mock it:
      await new Promise(resolve => setTimeout(resolve, 500));
      const result = { success: true, statusEntry: { ...data, id: Date.now(), order: ''} };


      if (result.success) {
        toast({ title: "API Entry Added", description: "New API status has been successfully logged." });
        onApiAdded();
        onOpenChange(false);
        reset();
      } else {
        // toast({ variant: "destructive", title: "Error", description: result.error || "Failed to add API status." });
        toast({ variant: "destructive", title: "Error", description: "Mock: Failed to add API status." });
      }
    } catch (error: any) {
      toast({ variant: "destructive", title: "Submission Error", description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New API Status</DialogTitle>
          <DialogDescription>Enter the details for the API you want to track.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          <div>
            <Label htmlFor="api-id">ID (Optional)</Label>
            <Input id="api-id" {...register('ID')} disabled={isSubmitting} />
          </div>
          <div>
            <Label htmlFor="used-in">Used In <span className="text-destructive">*</span></Label>
            <Input id="used-in" {...register('Used In')} disabled={isSubmitting} />
            {errors['Used In'] && <p className="text-sm text-destructive mt-1">{errors['Used In'].message}</p>}
          </div>
          <div>
            <Label htmlFor="api-key">API Key <span className="text-destructive">*</span></Label>
            <Input id="api-key" type="password" {...register('API Key')} disabled={isSubmitting} />
            {errors['API Key'] && <p className="text-sm text-destructive mt-1">{errors['API Key'].message}</p>}
          </div>
          <div>
            <Label htmlFor="by">By <span className="text-destructive">*</span></Label>
            <Input id="by" {...register('By')} disabled={isSubmitting} />
            {errors.By && <p className="text-sm text-destructive mt-1">{errors.By.message}</p>}
          </div>
          <div className="flex items-center space-x-2">
             <Controller
                control={control}
                name="Active"
                render={({ field }) => (
                    <Switch
                        id="active-switch"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                    />
                )}
            />
            <Label htmlFor="active-switch">Active</Label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Add API"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
*/
    
