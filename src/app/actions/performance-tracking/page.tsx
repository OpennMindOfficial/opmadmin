
// src/app/actions/performance-tracking/page.tsx
"use client";

import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart3 as PageIcon, Loader2, AlertTriangle, Database } from 'lucide-react';
// TODO: Implement Server Actions and Baserow Service for Performance Data
// import { getPerformanceDataAction, type PerformanceDataRecord } from '@/app/actions/performanceActions'; // Placeholder
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

// Placeholder type - replace with actual from performanceActions
interface PerformanceDataRecord {
  id: number;
  order: string;
  Name?: string;
  Email?: string;
  // Fields for table 546405 (User Main Data)
  'Total Study Hours'?: number;
  'Goal Completion'?: string; // e.g., "80%"
  'Active days streak'?: number;
  'Lessons Completed'?: number;
  'Avg Study Session'?: string; // e.g., "45 min"
  'Completion Rate'?: string; // e.g., "75%"
  'Notes Taken'?: number;
  'Retention Rate'?: string; // e.g., "90%"
  'Daily Study'?: string; // e.g., "1.5 hr"
  // Fields for table 546409 (Subject Data)
  Subjects?: string; // comma-separated
  Hours?: string; // comma-separated
  'Goal Progress'?: string; // comma-separated
  'Last Active'?: string; // comma-separated, or single date if for the user record overall
  [key: string]: any;
}

const TABLE_USER_MAIN_DATA_ID = '546405';
const TABLE_SUBJECT_DATA_ID = '546409';

const userMainDataFields = [
  'Name', 'Email', 'Total Study Hours', 'Goal Completion',
  'Active days streak', 'Lessons Completed', 'Avg Study Session',
  'Completion Rate', 'Notes Taken', 'Retention Rate', 'Daily Study'
];
const subjectDataFields = ['Name', 'Email', 'Subjects', 'Hours', 'Goal Progress', 'Last Active'];


export default function PerformanceTrackingPage() {
  const { toast } = useToast();
  const [data, setData] = useState<PerformanceDataRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<string>(TABLE_USER_MAIN_DATA_ID);
  const [currentFields, setCurrentFields] = useState<string[]>(userMainDataFields);

  // --- MOCK DATA & FUNCTIONS (Remove when actual actions are ready) ---
   const generateMockData = (tableId: string): PerformanceDataRecord[] => {
    if (tableId === TABLE_USER_MAIN_DATA_ID) {
      return Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        order: (i + 1).toString(),
        Name: `User ${i + 1}`,
        Email: `user${i + 1}@example.com`,
        'Total Study Hours': Math.floor(Math.random() * 200),
        'Goal Completion': `${Math.floor(Math.random() * 100)}%`,
        'Active days streak': Math.floor(Math.random() * 50),
        'Lessons Completed': Math.floor(Math.random() * 100),
        'Avg Study Session': `${Math.floor(Math.random() * 60) + 15} min`,
        'Completion Rate': `${Math.floor(Math.random() * 100)}%`,
        'Notes Taken': Math.floor(Math.random() * 200),
        'Retention Rate': `${Math.floor(Math.random() * 100)}%`,
        'Daily Study': `${(Math.random() * 3).toFixed(1)} hr`,
      }));
    } else if (tableId === TABLE_SUBJECT_DATA_ID) {
      return Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        order: (i + 1).toString(),
        Name: `User ${i + 1}`,
        Email: `user${i + 1}@example.com`,
        Subjects: 'Math,Science,History',
        Hours: '10,15,5',
        'Goal Progress': '80%,90%,70%',
        'Last Active': '2024-07-15,2024-07-14,2024-07-16',
      }));
    }
    return [];
  };
  const mockGetPerformanceDataAction = async (sourceTableId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
    return { success: true, data: generateMockData(sourceTableId) };
  };
  // --- END MOCK DATA & FUNCTIONS ---


  const fetchData = async (tableId: string) => {
    setIsLoading(true);
    setError(null);
    setCurrentFields(tableId === TABLE_USER_MAIN_DATA_ID ? userMainDataFields : subjectDataFields);
    try {
      // Replace with actual action: const result = await getPerformanceDataAction(tableId);
      const result = await mockGetPerformanceDataAction(tableId);
      if (result.success && result.data) {
        setData(result.data);
      } else {
        setError("Failed to load performance data."); // result.error
        toast({ variant: "destructive", title: "Error", description: "Failed to load performance data." });
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedTable);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTable]);

  const handleTableChange = (value: string) => {
    setSelectedTable(value);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <NewTopNav />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <section className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <PageIcon className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">Performance Tracking</h1>
            </div>
            <p className="text-lg text-muted-foreground ml-13">
              Analyze user study habits, goal progress, and subject performance metrics.
            </p>
          </div>
        </section>

        <section className="space-y-6">
           <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>User Performance Data</CardTitle>
                  <CardDescription>
                    Select a data view to analyze performance metrics.
                  </CardDescription>
                </div>
                <Select value={selectedTable} onValueChange={handleTableChange}>
                  <SelectTrigger className="w-full sm:w-[280px]">
                    <SelectValue placeholder="Select data source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TABLE_USER_MAIN_DATA_ID}>User Main Data (ID: 546405)</SelectItem>
                    <SelectItem value={TABLE_SUBJECT_DATA_ID}>Subject Data (ID: 546409)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
               {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="ml-2">Loading data...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-20 text-destructive">
                  <AlertTriangle className="h-8 w-8 mb-2" />
                  <p className="font-semibold">Error loading data</p>
                  <p className="text-sm">{error}</p>
                  <Button onClick={() => fetchData(selectedTable)} variant="outline" className="mt-4">Try Again</Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {currentFields.map(field => <TableHead key={field}>{field}</TableHead>)}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={currentFields.length} className="text-center text-muted-foreground py-10">
                            No data found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        data.map((row) => (
                          <TableRow key={row.id}>
                            {currentFields.map(field => (
                              <TableCell key={field} className="text-sm text-muted-foreground whitespace-nowrap">
                                {row[field] !== undefined && row[field] !== null ? String(row[field]) : 'N/A'}
                              </TableCell>
                            ))}
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

    