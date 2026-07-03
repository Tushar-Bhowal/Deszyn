'use client';

import { useEffect, useState } from 'react';

import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export function StudioShell({ children }: { children: React.ReactNode }) {
  // Mount the sidebar open, then close it after paint so the user sees it
  // smoothly slide shut on entry instead of the page loading with it gone.
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setOpen(false), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SidebarProvider
      open={open}
      onOpenChange={setOpen}
      className={cn('[--app-header-height:3rem]')}
    >
      <AppSidebar collapsible="offcanvas" headerTrigger={false} />
      <SidebarInset className="bg-[#0a0a0b]">{children}</SidebarInset>
    </SidebarProvider>
  );
}
