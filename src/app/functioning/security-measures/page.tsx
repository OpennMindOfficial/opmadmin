
// src/app/functioning/security-measures/page.tsx
"use client";

import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Lock, KeyRound, Fingerprint, Network } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function SecurityMeasuresPage() {
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
              <ShieldCheck className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold tracking-tight">Security Measures</h1>
            </div>
            <p className="text-lg text-muted-foreground ml-13">
              Understanding our commitment to protecting your data and ensuring platform integrity.
            </p>
          </div>
        </motion.section>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div variants={fadeIn} transition={{ delay: 0.2, duration: 0.5 }}>
            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-6 w-6 text-primary" />
                  Data Encryption
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground">
                <p>All sensitive data is encrypted both in transit (using TLS/SSL) and at rest. We employ industry-standard encryption algorithms to safeguard your information.</p>
                <p>Passwords are hashed using strong, one-way algorithms like bcrypt, ensuring they are never stored in plaintext.</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn} transition={{ delay: 0.3, duration: 0.5 }}>
            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <KeyRound className="h-6 w-6 text-primary" />
                  Access Control
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground">
                <p>We implement robust role-based access control (RBAC) to ensure users only have access to the data and features relevant to their roles.</p>
                <p>Authentication mechanisms include multi-factor authentication (MFA) options and secure session management.</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn} transition={{ delay: 0.4, duration: 0.5 }}>
            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Fingerprint className="h-6 w-6 text-primary" />
                  Regular Audits & Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground">
                <p>Our systems undergo regular security audits and penetration testing to identify and address potential vulnerabilities.</p>
                <p>Continuous monitoring and logging are in place to detect and respond to suspicious activities promptly.</p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={fadeIn} transition={{ delay: 0.5, duration: 0.5 }}>
            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-6 w-6 text-primary" />
                  Network Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-muted-foreground">
                <p>Firewalls, intrusion detection/prevention systems (IDS/IPS), and DDoS mitigation strategies are employed to protect our network infrastructure.</p>
                <p>Secure coding practices and regular updates help prevent common web vulnerabilities like XSS and SQL injection.</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
