// app/layout.tsx

import './globals.css';
import { Poppins } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from 'next'; // Added for completeness, good practice to include

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = { // This is where metadata goes
  title: 'OpennMind Dashboard',
  description: 'The Task Management Dashboard for OpennMind (v2).',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Corrected to <html>
    <html lang="en">
      {/* Corrected to <body> */}
      <body className={`${poppins.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
