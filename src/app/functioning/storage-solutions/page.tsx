
// src/app/functioning/storage-solutions/page.tsx
"use client";

import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HardDrive, Archive, Cloud, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function StorageSolutionsPage() {
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
              <HardDrive className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">Storage Solutions</h1>
            </div>
            <p className="text-lg text-muted-foreground ml-13">
              Details on how files and application data are stored securely and efficiently.
            </p>
          </div>
        </motion.section>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div variants={fadeIn} transition={{ delay: 0.2, duration: 0.5 }}>
            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="h-6 w-6 text-primary" />
                  Primary Storage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground">
                <p>We primarily use Firebase Storage for storing user-uploaded files and application assets.</p>
                <p>This provides high durability, availability, and scalability for various data types like images, documents, and media files.</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn} transition={{ delay: 0.3, duration: 0.5 }}>
            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Archive className="h-6 w-6 text-primary" />
                  Archival & Backup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground">
                <p>Long-term archival of data is managed using cost-effective solutions to ensure data retention.</p>
                <p>Regular automated backups of critical data are performed and stored securely in geographically separate locations to prevent data loss.</p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={fadeIn} transition={{ delay: 0.4, duration: 0.5 }}>
            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldAlert className="h-6 w-6 text-primary" />
                  Security & Access
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground">
                <p>Access to stored files is controlled through signed URLs or scoped permissions, ensuring only authorized users can access specific data.</p>
                <p>Data in storage buckets is encrypted at rest, and versioning is enabled to protect against accidental deletions or modifications.</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
