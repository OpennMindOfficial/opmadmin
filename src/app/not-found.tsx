// src/app/not-found.tsx
"use client";

import Link from 'next/link';
import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search, FileQuestion, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <NewTopNav />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-2xl w-full"
        >
          <div className="relative mb-10 sm:mb-12 md:mb-16 flex flex-col items-center justify-center">
            <motion.div
              animate={{ 
                y: [0, -8, 0, 8, 0],
                rotate: [0, 2, -2, 2, 0],
              }}
              transition={{
                duration: 8,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "mirror",
              }}
            >
              <FileQuestion className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 text-primary/60" />
            </motion.div>
            <motion.div
              className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6"
              animate={{ rotate: 360 }}
              transition={{
                duration: 12,
                ease: "linear",
                repeat: Infinity,
              }}
            >
              <Search className="h-6 w-6 sm:h-8 sm:w-8 text-primary/40" />
            </motion.div>
             <motion.div
              className="absolute -bottom-2 left-0 sm:-bottom-4 sm:left-2"
              animate={{ rotate: -360, scale: [1, 0.8, 1] }}
              transition={{
                duration: 15,
                ease: "linear",
                repeat: Infinity,
                repeatType: "mirror"
              }}
            >
              <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-primary/30" />
            </motion.div>
          </div>

          <div className="mb-6 sm:mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
              Looks like there&apos;s not
              <br className="hidden sm:inline" />
              enough space for that
              <span className="inline-block mx-2 px-2 py-0.5 border-2 border-foreground rounded-lg">
                page
              </span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Error 404 Page not found
            </p>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm text-muted-foreground mb-8 sm:mb-10"
          >
            If you believe this is a mistake, please let us know and we&apos;ll get it sorted out.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button
              asChild
              size="lg"
              className="font-semibold text-base px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <Link href="/">
                Go back to home page
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
