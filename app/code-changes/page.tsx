
// src/app/code-changes/page.tsx
"use client";

import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { Construction, Settings, Workflow } from 'lucide-react'; 
import { motion } from 'framer-motion';

export default function CodeChangesUnderDevelopmentPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <NewTopNav />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center justify-center text-center">
        <div className="relative mb-8">
          <motion.div
            animate={{ 
              y: [0, -5, 0, 5, 0],
              rotate: [0, 3, -3, 0],
            }}
            transition={{
              duration: 6,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "mirror"
            }}
          >
            <Construction className="h-20 w-20 sm:h-24 sm:w-24 text-primary/70" />
          </motion.div>
          <motion.div
            className="absolute -top-4 -right-4 text-primary/50"
            animate={{ rotate: 360 }}
            transition={{
              duration: 10,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            <Settings className="h-6 w-6 sm:h-8 sm:w-8" />
          </motion.div>
           <motion.div
            className="absolute -bottom-3 -left-3 text-primary/40"
            animate={{ rotate: -360 }}
            transition={{
              duration: 12,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            <Workflow className="h-5 w-5 sm:h-6 sm:w-6" />
          </motion.div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4"
        >
          Feature Under Development
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-md sm:text-lg text-muted-foreground mb-10 max-w-md"
        >
          Our dedicated team is meticulously crafting this feature. Please check back soon for exciting updates!
        </motion.p>
        
        <motion.div 
          className="flex space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-2 w-2 sm:h-3 sm:w-3 bg-primary/30 rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "mirror",
                delay: i * 0.2
              }}
            />
          ))}
        </motion.div>
      </main>
    </div>
  );
}
    