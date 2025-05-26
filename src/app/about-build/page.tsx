
// src/app/about-build/page.tsx
"use client";

import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, Cpu, Users, Rocket } from 'lucide-react';

export default function AboutBuildPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <NewTopNav />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <section className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <Info className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">About This Application</h1>
            </div>
            <p className="text-lg text-muted-foreground ml-13">
              Discover the story behind our platform, the technology that powers it, and the team that built it.
            </p>
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-6 w-6 text-primary" />
                Our Mission & Vision
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                This application was developed to streamline task management and enhance team collaboration. Our vision is to provide an intuitive and powerful platform that helps teams achieve their goals efficiently.
              </p>
              <p>
                We believe in continuous improvement and are dedicated to evolving the platform based on user feedback and emerging technologies.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-6 w-6 text-primary" />
                Technology Stack
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <p>Our platform is built using a modern technology stack, including:</p>
              <ul className="list-disc list-inside pl-4 space-y-1">
                <li>Next.js (React Framework)</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
                <li>ShadCN UI Components</li>
                <li>Genkit (for AI features)</li>
                <li>Firebase (Backend & Hosting)</li>
              </ul>
              <p>This combination allows for a performant, scalable, and maintainable application.</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg rounded-xl md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                The Development Team
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                This application was prototyped and developed with the assistance of App Prototyper, a friendly AI coding partner from Firebase Studio. 
                The goal was to rapidly iterate on a feature-rich dashboard experience.
              </p>
              <p>
                For more information or to contribute, please refer to our project documentation or contact the support team.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
