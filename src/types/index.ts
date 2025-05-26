import type { LucideIcon } from 'lucide-react';

export interface Metric {
  id: string;
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
}

export interface CourseProgress {
  id: string;
  courseName: string;
  progressPercentage: number;
  imageUrl?: string;
  dataAiHint?: string;
}

export interface CourseStatus {
  id:string;
  courseName: string;
  instructor: string;
  status: "Completed" | "In Progress" | "Not Started";
  enrolledDate: string;
  thumbnailUrl?: string;
  dataAiHint?: string;
}
