"use client";

import type { ReactNode } from 'react';
import { AppLayout } from './app-layout';

export function ClientAppLayout({ children }: { children: ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}
