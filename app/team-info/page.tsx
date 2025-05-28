
// src/app/team-info/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { NewTopNav } from '@/components/dashboard/new-top-nav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { fetchTeamInfo, type TeamMemberInfo } from '@/app/actions/authActions';
import { Users as PageIcon, UserCircle, Mail, Briefcase, Loader2, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const obfuscateEmail = (email: string): string => {
  if (!email || !email.includes('@')) return 'N/A';
  const [localPart, domain] = email.split('@');
  if (localPart.length <= 2) {
    return `${'*'.repeat(localPart.length)}@${domain}`;
  }
  return `${localPart.substring(0, 2)}${'*'.repeat(Math.min(3, localPart.length - 2))}@${domain}`;
};

export default function TeamInfoPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMemberInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTeamInfo()
      .then(result => {
        if (result.success && result.teamMembers) {
          setTeamMembers(result.teamMembers);
        } else {
          setError(result.error || 'Failed to load team information.');
          toast({ title: "Error", description: result.error || 'Failed to load team information.', variant: "destructive" });
        }
      })
      .catch(err => {
        setError('An unexpected error occurred.');
        toast({ title: "Error", description: 'An unexpected error occurred.', variant: "destructive" });
      })
      .finally(() => setIsLoading(false));
  }, [toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <NewTopNav />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <NewTopNav />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
           <div className="text-center py-10 text-destructive bg-destructive/10 p-4 rounded-md">
            <AlertTriangle className="mx-auto h-10 w-10 md:h-12 md:w-12" />
            <p className="mt-4 text-lg md:text-xl font-semibold">Could not load team information</p>
            <p className="text-sm md:text-md">{error}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <NewTopNav />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 mb-8 md:mb-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
               <motion.div
                animate={{ x: [0, 2, -2, 0], filter: ["hue-rotate(0deg)", "hue-rotate(15deg)", "hue-rotate(-15deg)", "hue-rotate(0deg)"] }}
                transition={{ duration: 4, repeat: Infinity, repeatType: "mirror", ease: "linear" }}
              >
                <PageIcon className="h-8 w-8 md:h-10 md:w-10 text-primary" />
              </motion.div>
              <h1 className="text-2xl md:text-4xl font-bold tracking-tight">Team Information</h1>
            </div>
            <p className="text-md md:text-lg text-muted-foreground md:ml-13">
              Overview of your team members and their roles.
            </p>
          </div>
        </section>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="text-xl">Team Members</CardTitle>
              <CardDescription>List of all registered users in the platform.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {teamMembers.length === 0 ? (
                <p className="text-muted-foreground text-center py-10">No team members found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px] hidden sm:table-cell">S.No.</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Email</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teamMembers.map((member, index) => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium hidden sm:table-cell">{index + 1}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 sm:gap-3">
                              <Avatar className="h-7 w-7 sm:h-8 sm:w-8">
                                <AvatarImage src={`https://placehold.co/40x40.png?text=${member.name.charAt(0)}`} alt={member.name} data-ai-hint="person user"/>
                                <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-sm sm:text-base">{member.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 sm:gap-1.5 text-muted-foreground text-xs sm:text-sm">
                               <Briefcase className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary/70"/> {member.role}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 sm:gap-1.5 text-muted-foreground text-xs sm:text-sm">
                                <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary/70"/> {obfuscateEmail(member.email)}
                            </div>
                            </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
    