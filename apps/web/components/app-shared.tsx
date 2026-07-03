import { LayoutDashboardIcon, SparklesIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export type SidebarNavItem = {
  title: string;
  path?: string;
  icon?: ReactNode;
  isActive?: boolean;
  subItems?: SidebarNavItem[];
};

export type SidebarNavGroup = {
  label?: string;
  items: SidebarNavItem[];
};

export const navGroups: SidebarNavGroup[] = [
  {
    items: [
      {
        title: 'Dashboard',
        path: '/dashboard',
        icon: <LayoutDashboardIcon />,
      },
      {
        title: 'Brand Studio',
        path: '/project/new',
        icon: <SparklesIcon />,
      },
    ],
  },
];
