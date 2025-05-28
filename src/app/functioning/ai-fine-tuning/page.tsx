
// src/app/functioning/ai-fine-tuning/page.tsx
"use client";

import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCog, Aperture, Layers, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function AiFineTuningPage() {
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
              <BrainCog className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">AI Fine-Tuning</h1>
            </div>
            <p className="text-lg text-muted-foreground ml-13">
              The process behind customizing and optimizing our AI models for better performance.
            </p>
          </div>
        </motion.section>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div variants={fadeIn} transition={{ delay: 0.2, duration: 0.5 }}>
            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Aperture className="h-6 w-6 text-primary" />
                  Model Selection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground">
                <p>We start by selecting state-of-the-art base models (e.g., from OpenAI, Google) that are suitable for the specific tasks our platform addresses.</p>
                <p>The choice of model depends on factors like accuracy, speed, cost, and the nature of the problem (e.g., text generation, image analysis).</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn} transition={{ delay: 0.3, duration: 0.5 }}>
            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-6 w-6 text-primary" />
                  Dataset Preparation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground">
                <p>High-quality, domain-specific datasets are curated for fine-tuning. This involves data collection, cleaning, labeling, and formatting.</p>
                <p>Ensuring a diverse and representative dataset is crucial for achieving robust and unbiased model performance.</p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={fadeIn} transition={{ delay: 0.4, duration: 0.5 }}>
            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SlidersHorizontal className="h-6 w-6 text-primary" />
                  Fine-Tuning Process
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground">
                <p>The selected base model is then fine-tuned on our custom dataset. This involves adjusting the model's parameters to specialize its knowledge and behavior for our platform's needs.</p>
                <p>Hyperparameter optimization and iterative training cycles are employed to achieve the best possible results.</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
