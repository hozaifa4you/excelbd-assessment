'use client';
import * as React from 'react';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
   Sidebar,
   SidebarContent,
   SidebarFooter,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Logo } from './logo';
import { AppSidebarItem, dashboardMenuItems } from '@/lib/navigate';

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
   dashboardFor: 'user' | 'agent' | 'admin';
}

export function AppSidebar({ dashboardFor, ...props }: AppSidebarProps) {
   const items = dashboardMenuItems[dashboardFor] as AppSidebarItem[];

   return (
      <Sidebar collapsible="offcanvas" {...props}>
         <SidebarHeader>
            <SidebarMenu>
               <SidebarMenuItem>
                  <SidebarMenuButton
                     asChild
                     className="data-[slot=sidebar-menu-button]:!p-1.5"
                  >
                     <Logo />
                  </SidebarMenuButton>
               </SidebarMenuItem>
            </SidebarMenu>
         </SidebarHeader>
         <SidebarContent>
            <NavMain items={items} />
         </SidebarContent>
         <SidebarFooter>
            <NavUser />
         </SidebarFooter>
      </Sidebar>
   );
}
