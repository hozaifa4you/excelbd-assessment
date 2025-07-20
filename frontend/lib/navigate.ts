import { Icon, IconDashboard, IconPackage } from '@tabler/icons-react';
import { route } from './routes';

export interface AppSidebarItem {
   title: string;
   url: string;
   Icon: Icon;
}

interface MenuItemType {
   user: [AppSidebarItem, ...AppSidebarItem[]];
   agent: [AppSidebarItem, ...AppSidebarItem[]];
   admin: [AppSidebarItem, ...AppSidebarItem[]];
}

export const dashboardMenuItems: MenuItemType = {
   user: [
      {
         title: 'Dashboard',
         url: route('dashboard'),
         Icon: IconDashboard,
      },
      {
         title: 'Bookings',
         url: route('dashboard'),
         Icon: IconPackage,
      },
   ],
   agent: [
      {
         title: 'Dashboard',
         url: route('dashboard'),
         Icon: IconDashboard,
      },
      {
         title: 'Bookings',
         url: route('dashboard'),
         Icon: IconPackage,
      },
   ],
   admin: [
      {
         title: 'Dashboard',
         url: route('dashboard'),
         Icon: IconDashboard,
      },
      {
         title: 'Bookings',
         url: route('dashboard'),
         Icon: IconPackage,
      },
   ],
};
