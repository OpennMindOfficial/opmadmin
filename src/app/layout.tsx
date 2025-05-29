// app/layout.tsx

import './globals.css';
import { Poppins } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from 'next';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'OpennMind Dashboard',
  description: 'The Task Management Dashboard for OpennMind.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
