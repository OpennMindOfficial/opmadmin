
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNowStrict, parseISO } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimeAgo(dateString?: string): string {
  if (!dateString) return 'just now';
  try {
    const date = parseISO(dateString);
    return formatDistanceToNowStrict(date, { addSuffix: true });
  } catch (error) {
    console.error("Error formatting time ago:", error);
    return dateString; // Fallback to original string if parsing fails
  }
}
