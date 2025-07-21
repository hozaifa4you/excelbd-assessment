import {
   Icon,
   IconDashboard,
   IconPackage,
   IconScooter,
   IconTruckDelivery,
   IconUsersGroup,
} from '@tabler/icons-react';
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
         url: route('user.bookings'),
         Icon: IconPackage,
      },
   ],
   agent: [
      {
         title: 'Dashboard',
         url: route('agent.dashboard'),
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
         url: route('admin.dashboard'),
         Icon: IconDashboard,
      },
      {
         title: 'Bookings',
         url: route('admin.bookings'),
         Icon: IconPackage,
      },
      {
         title: 'Customers',
         url: route('admin.customers'),
         Icon: IconUsersGroup,
      },
      {
         title: 'Agents',
         url: route('admin.agents'),
         Icon: IconScooter,
      },
      {
         title: 'Assign Agent',
         url: route('admin.assign'),
         Icon: IconTruckDelivery,
      },
   ],
};
