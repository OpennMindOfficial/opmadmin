
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

// New Types for Management Pages

export interface SubjectRecord {
  id: number;
  order: string;
  Subject: string;
  Topics?: string; // Likely comma-separated or long text
  Chapters?: string; // Likely comma-separated or long text
  'Topics divided'?: string; // Or TopicsDivided if user_field_names is true
  [key: string]: any;
}

export interface BugReportRecord {
  id: number;
  order: string;
  Name: string;
  Email: string;
  Report: string;
  Date: string; // Assuming date is stored as text or proper date type
  [key: string]: any;
}

export interface AboutUsContentRecord {
  id: number; // Assuming there's only one row for this, or it's identifiable
  order: string;
  Mission: string;
  Story: string;
  [key: string]: any;
}

    