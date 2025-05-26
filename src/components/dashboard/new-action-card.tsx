// src/components/dashboard/new-action-card.tsx
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw, type LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface NewActionCardProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  imageHint: string;
  actionIcon?: LucideIcon; // For the small icon on the "Create a Thread" card image
}

export function NewActionCard({ title, description, imageSrc, imageAlt, imageHint, actionIcon: ActionIcon }: NewActionCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-200 rounded-lg overflow-hidden flex flex-col">
      <div className="relative h-36 bg-muted/30 flex items-center justify-center">
        <Image 
          src={imageSrc} 
          alt={imageAlt} 
          width={200} 
          height={100} 
          className="object-contain"
          data-ai-hint={imageHint} 
        />
        {ActionIcon && (
          <div className="absolute top-3 right-3 bg-blue-500 p-1.5 rounded-md text-white">
            <ActionIcon size={16} />
          </div>
        )}
      </div>
      <CardHeader className="pb-2 pt-4">
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow pb-3">
        <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>
      </CardContent>
      <CardFooter className="flex-col items-start space-y-3 pt-0 pb-4 px-4">
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="mr-2 h-4 w-4" /> Create
        </Button>
        <Link href="#" className="text-sm text-muted-foreground hover:text-foreground flex items-center self-center">
          <RefreshCw className="mr-2 h-3 w-3" /> Generate example
        </Link>
      </CardFooter>
    </Card>
  );
}
