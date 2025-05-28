
// src/app/functioning/page.tsx
"use client";

import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { NewActionCard } from '@/components/dashboard/new-action-card';
import { Cog, ShieldCheck, DatabaseZap, Database, HardDrive, BrainCog } from 'lucide-react';

export default function FunctioningPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <NewTopNav />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <section className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <Cog className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">System Functioning</h1>
            </div>
            <p className="text-lg text-muted-foreground ml-13">
              Learn about the core components of our platform and how they operate.
            </p>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Core System Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <NewActionCard
              title="Security Measures"
              description="Understand the protocols and practices ensuring data safety and system integrity."
              imageHint="security shield lock"
              actionIcon={ShieldCheck}
              cardVariant="system"
              primaryActionLabel="View Details"
              href="/functioning/security-measures" 
            />
            <NewActionCard
              title="Data Management"
              description="Explore how data is processed, organized, and utilized within the platform."
              imageHint="data flow charts"
              actionIcon={DatabaseZap}
              cardVariant="data"
              primaryActionLabel="Learn More"
              href="/functioning/data-management"
            />
            <NewActionCard
              title="Database Architecture"
              description="An overview of our database structure, technology, and optimization strategies."
              imageHint="database server nodes"
              actionIcon={Database}
              cardVariant="server"
              primaryActionLabel="Read How"
              href="/functioning/database-architecture"
            />
            <NewActionCard
              title="Storage Solutions"
              description="Details on how files and application data are stored securely and efficiently."
              imageHint="cloud storage drives"
              actionIcon={HardDrive}
              cardVariant="server"
              primaryActionLabel="See Architecture"
              href="/functioning/storage-solutions"
            />
            <NewActionCard
              title="AI Fine-Tuning"
              description="Discover the process behind customizing and optimizing our AI models for better performance."
              imageHint="ai brain neural network"
              actionIcon={BrainCog}
              cardVariant="data"
              primaryActionLabel="Explore Process"
              href="/functioning/ai-fine-tuning"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
