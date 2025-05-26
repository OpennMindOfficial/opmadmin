import type { Metadata } from 'next';
import { Poppins } from 'next/font/google'; // Changed from Geist to Poppins
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // Keep Toaster for notifications

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // Added weights as commonly used
});

export const metadata: Metadata = {
  title: 'OpennMind Dashboard', // Kept existing title
  description: 'Task Management Dashboard', // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
