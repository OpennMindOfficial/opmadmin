
// src/app/actions/ai-usage/page.tsx
"use client";

import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BrainCircuit as PageIcon, Users, BarChart, CheckCircle, AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
// For charts, you'd use a library like Recharts or Chart.js
// import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';

// Placeholder types
interface AiUsageMetric {
  id: string;
  title: string;
  value: string | number;
  unit?: string;
  trend?: string; // e.g., "+5%", "-10 queries"
  trendDirection?: 'up' | 'down' | 'neutral';
  icon: React.ElementType;
}

interface AiFeatureUsage {
  name: string;
  invocations: number;
  successRate: string; // e.g., "98%"
  avgProcessingTime: string; // e.g., "1.2s"
}

interface AiUsageData {
  overallMetrics: AiUsageMetric[];
  featureBreakdown: AiFeatureUsage[];
  // tokenUsageData: { date: string, tokens: number }[]; // For a chart
}

const mockAiUsageData: AiUsageData = {
  overallMetrics: [
    { id: '1', title: 'Total AI Invocations', value: 150789, trend: '+12K last 7d', trendDirection: 'up', icon: BrainCircuit },
    { id: '2', title: 'Successful Responses', value: '99.2%', trend: '+0.1% vs last period', trendDirection: 'up', icon: CheckCircle },
    { id: '3', title: 'Avg. Tokens per Request', value: 256, unit: 'tokens', trend: 'stable', trendDirection: 'neutral', icon: BarChart },
    { id: '4', title: 'Active AI Users', value: 1203, trend: '+50 today', trendDirection: 'up', icon: Users },
  ],
  featureBreakdown: [
    { name: 'Content Summarization', invocations: 75000, successRate: '99.5%', avgProcessingTime: '0.8s' },
    { name: 'Question Answering Bot', invocations: 45000, successRate: '98.8%', avgProcessingTime: '1.5s' },
    { name: 'Image Generation Assist', invocations: 20789, successRate: '97.0%', avgProcessingTime: '5.2s' },
    { name: 'Data Analysis Helper', invocations: 10000, successRate: '99.9%', avgProcessingTime: '2.1s' },
  ],
  // tokenUsageData: Array.from({length:30}, (_,i) => ({date: `Day ${i+1}`, tokens: Math.floor(Math.random() * 50000) + 10000})),
};


export default function AiUsagePage() {
  const [usageData, setUsageData] = useState<AiUsageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsageData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    setUsageData(mockAiUsageData);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUsageData();
  }, []);

  if (isLoading && !usageData) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <NewTopNav />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="ml-3 text-lg">Loading AI usage data...</p>
        </main>
      </div>
    );
  }

  if (!usageData) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <NewTopNav />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-destructive" />
          <p className="text-xl font-semibold text-destructive">Failed to load AI usage data.</p>
          <Button onClick={fetchUsageData} variant="outline" className="mt-4">Try Again</Button>
        </main>
      </div>
    );
  }

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
              Track metrics and patterns related to AI feature utilization. (Specific Baserow table for AI logs TBD)
            </p>
          </div>
          <Button onClick={fetchUsageData} variant="outline" disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </section>

        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {usageData.overallMetrics.map(metric => {
                const MetricIcon = metric.icon;
                return (
                    <Card key={metric.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
                            <MetricIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                                {metric.unit && <span className="text-xs font-normal text-muted-foreground ml-1">{metric.unit}</span>}
                            </div>
                            <p className={`text-xs ${metric.trendDirection === 'down' ? 'text-red-500' : 'text-muted-foreground'}`}>{metric.trend || " "}</p>
                        </CardContent>
                    </Card>
                );
            })}
        </section>

        <section>
             <Card>
                <CardHeader>
                <CardTitle>AI Feature Breakdown</CardTitle>
                <CardDescription>Usage statistics for individual AI-powered features.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Feature Name</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Invocations</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Success Rate</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Avg. Processing Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {usageData.featureBreakdown.map(feature => (
                                    <tr key={feature.name}>
                                        <td className="px-4 py-3 text-sm font-medium">{feature.name}</td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">{feature.invocations.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">{feature.successRate}</td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">{feature.avgProcessingTime}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </section>

        {/* Placeholder for Token Usage Chart */}
        <section>
            <Card>
                <CardHeader>
                    <CardTitle>Daily Token Usage</CardTitle>
                    <CardDescription>Chart showing AI tokens consumed over the last 30 days.</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center bg-muted/30 rounded-md">
                    {/* 
                    <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart data={usageData.tokenUsageData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="tokens" fill="hsl(var(--primary))" />
                        </RechartsBarChart>
                    </ResponsiveContainer>
                    */}
                    <p className="text-muted-foreground">[Daily Token Usage Bar Chart Placeholder]</p>
                </CardContent>
            </Card>
        </section>
      </main>
    </div>
  );
}

    