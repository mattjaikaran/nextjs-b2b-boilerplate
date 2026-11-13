'use client';

import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { useAuth } from '@/lib/store';
import { redirect } from 'next/navigation';

export default function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, hasHydrated } = useAuth();

  // Wait for the cached session before deciding to redirect, otherwise a
  // reload bounces authenticated users to the login page.
  if (!hasHydrated) {
    return null;
  }

  if (!isAuthenticated) {
    redirect('/login');
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
