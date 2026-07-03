'use client';

import { SettingsIcon } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { AppSearch } from '@/components/app-search';
import { navGroups } from '@/components/app-shared';
import { CustomTrigger } from '@/components/custom-trigger';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';

const user = {
  name: 'Tushar Bhowal',
  email: 'itportal6@gmail.com',
};

export function AppSidebar({
  collapsible = 'icon',
  headerTrigger = true,
}: {
  collapsible?: 'offcanvas' | 'icon' | 'none';
  headerTrigger?: boolean;
}) {
  const pathname = usePathname();
  const activeSection = pathname.split('/')[1] ?? '';

  return (
    <Sidebar
      className="*:data-[slot=sidebar-inner]:bg-background"
      collapsible={collapsible}
      variant="sidebar"
    >
      <SidebarHeader className="h-(--app-header-height,3rem) flex-row items-center justify-between">
        <Button
          asChild
          variant="ghost"
          className="h-8 min-w-0 flex-1 justify-start gap-2 px-2 hover:bg-foreground/5 hover:text-foreground group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 dark:hover:bg-foreground/5"
        >
          <a href="/dashboard">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-foreground/10 p-1.5">
              <Image
                src="/logo.png"
                alt="Deszyn"
                width={465}
                height={486}
                className="size-full object-contain"
              />
            </span>
            <span className="truncate font-display font-semibold group-data-[collapsible=icon]:hidden">
              Deszyn
            </span>
          </a>
        </Button>
        {headerTrigger && (
          <div className="group-data-[collapsible=icon]:hidden">
            <CustomTrigger place="sidebar" />
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <AppSearch />
        </SidebarGroup>
        {navGroups.map((group, groupIndex) => (
          <SidebarGroup key={group.label ?? groupIndex}>
            {group.label && (
              <SidebarGroupLabel className="group-data-[collapsible=icon]:pointer-events-none">
                {group.label}
              </SidebarGroupLabel>
            )}
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={!!item.path && item.path.split('/')[1] === activeSection}
                    tooltip={item.title}
                  >
                    <a href={item.path}>
                      {item.icon}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="p-2">
        <div className="bg-cta-primary flex items-center gap-2 rounded-lg border border-(--cta-primary-border) p-2 text-white shadow-(--cta-primary-shadow) group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:border-transparent group-data-[collapsible=icon]:bg-none group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:shadow-none">
          <Avatar className="size-8 shrink-0 rounded-md">
            <AvatarFallback className="rounded-md bg-white/15 text-white text-xs">
              {user.name
                .split(' ')
                .map((part) => part[0])
                .join('')
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="grid min-w-0 flex-1 leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate font-medium text-sm">{user.name}</span>
            <span className="truncate text-white/70 text-xs">{user.email}</span>
          </div>
          <Button
            asChild
            className="shrink-0 text-white/80 hover:bg-white/15 hover:text-white group-data-[collapsible=icon]:hidden"
            size="icon-sm"
            variant="ghost"
          >
            <a aria-label="Settings" href="#">
              <SettingsIcon />
            </a>
          </Button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
