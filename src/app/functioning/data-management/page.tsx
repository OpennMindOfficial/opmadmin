
// src/app/functioning/data-management/page.tsx
"use client";

import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DatabaseZap, Filter, GitBranch, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function DataManagementPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <NewTopNav />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <motion.section 
          initial="initial"
          animate="animate"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <DatabaseZap className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">Data Management</h1>
            </div>
            <p className="text-lg text-muted-foreground ml-13">
              Exploring how data is collected, processed, stored, and utilized within our platform.
            </p>
          </div>
        </motion.section>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div variants={fadeIn} transition={{ delay: 0.2, duration: 0.5 }}>
            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-6 w-6 text-primary" />
                  Data Collection & Processing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground">
                <p>Data is collected through user interactions, API integrations, and automated processes. We ensure data accuracy and relevance from the point of entry.</p>
                <p>Processing involves validation, cleaning, transformation, and enrichment to prepare data for storage and analysis.</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn} transition={{ delay: 0.3, duration: 0.5 }}>
            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="h-6 w-6 text-primary" />
                  Data Storage & Organization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground">
                <p>We utilize robust database solutions tailored to the type of data being stored, ensuring scalability and reliability.</p>
                <p>Data is organized logically with clear schemas and relationships, facilitating efficient querying and retrieval.</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn} transition={{ delay: 0.4, duration: 0.5 }}>
            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-primary" />
                  Data Governance & Compliance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground">
                <p>Our data governance policies ensure data quality, security, and compliance with regulations (e.g., GDPR, CCPA).</p>
                <p>Data lineage and audit trails are maintained to track data an_d ensure accountability.</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
