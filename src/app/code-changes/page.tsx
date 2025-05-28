
// src/app/code-changes/page.tsx
"use client";

import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { Construction, Settings } from 'lucide-react'; // Using Construction and Settings for animation
import { motion } from 'framer-motion';

export default function CodeChangesUnderDevelopmentPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <NewTopNav />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center justify-center text-center">
        <div className="relative mb-8">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "mirror"
            }}
          >
            <Construction className="h-24 w-24 text-primary/70" />
          </motion.div>
          <motion.div
            className="absolute -top-4 -right-4"
            animate={{ rotate: 360 }}
            transition={{
              duration: 8,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            <Settings className="h-8 w-8 text-primary/50" />
          </motion.div>
           <motion.div
            className="absolute -bottom-3 -left-3"
            animate={{ rotate: -360 }}
            transition={{
              duration: 10,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            <Settings className="h-6 w-6 text-primary/40" />
          </motion.div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl font-bold tracking-tight text-foreground mb-4"
        >
          Feature Under Development
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-lg text-muted-foreground mb-10 max-w-md"
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
              className="h-3 w-3 bg-primary/30 rounded-full"
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

    
