// src/app/not-found.tsx
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <NewTopNav />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl w-full"
        >
          {/* Card-like container for continuous animation */}
          <motion.div
            className="bg-card p-8 sm:p-10 md:p-12 rounded-xl shadow-xl border border-border/30"
            animate={{
              scale: [1, 1.005, 1], // Subtle pulse
              boxShadow: [
                "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                "0 10px 15px -3px rgba(0, 0, 0, 0.12), 0 4px 6px -2px rgba(0, 0, 0, 0.07)",
                "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              ],
            }}
            transition={{
              duration: 3, // Slower pulse
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "mirror",
            }}
          >
            <div className="mb-8">
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

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="my-8 sm:my-10 md:my-12"
            >
              <Image
                src="https://placehold.co/800x300.png"
                alt="Abstract 404 illustration"
                width={800}
                height={300}
                className="rounded-lg object-cover mx-auto shadow-lg"
                data-ai-hint="abstract white forms"
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-sm text-muted-foreground mb-8"
            >
              If you believe this is a mistake, please let us know and we&apos;ll get it sorted out.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Button
                asChild
                size="lg"
                className="bg-emerald-500 hover:bg-emerald-600 text-primary-foreground font-semibold text-base px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                <Link href="/">
                  Go back to home page
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
