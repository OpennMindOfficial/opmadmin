
// src/app/functioning/database-architecture/page.tsx
"use client";

import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Layers, Zap, Server } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function DatabaseArchitecturePage() {
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
              <Database className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">Database Architecture</h1>
            </div>
            <p className="text-lg text-muted-foreground ml-13">
              An overview of our database structure, chosen technologies, and optimization strategies.
            </p>
          </div>
        </motion.section>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div variants={fadeIn} transition={{ delay: 0.2, duration: 0.5 }}>
            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-6 w-6 text-primary" />
                  Technology Stack
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground">
                <p>Our primary database technology is [Specify Database, e.g., PostgreSQL/MongoDB/Baserow] chosen for its [Specify Reason, e.g., scalability, flexibility, ease of use].</p>
                <p>We may also employ caching solutions like Redis for performance optimization of frequently accessed data.</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn} transition={{ delay: 0.3, duration: 0.5 }}>
            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-6 w-6 text-primary" />
                  Scalability & Reliability
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground">
                <p>The architecture is designed for horizontal and/or vertical scalability to handle growing data volumes and user load.</p>
                <p>Regular backups, replication, and failover mechanisms are in place to ensure data durability and high availability.</p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={fadeIn} transition={{ delay: 0.4, duration: 0.5 }}>
            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-6 w-6 text-primary" />
                  Performance Optimization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground">
                <p>Query optimization, appropriate indexing strategies, and connection pooling are used to ensure fast data retrieval and updates.</p>
                <p>We continuously monitor database performance and make adjustments as needed to maintain optimal efficiency.</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
