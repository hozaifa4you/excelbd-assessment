import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { PropsWithChildren } from 'react';

const AgentDashboardLayout = ({ children }: PropsWithChildren) => {
   return (
      <SidebarProvider
         style={
            {
               '--sidebar-width': 'calc(var(--spacing) * 72)',
               '--header-height': 'calc(var(--spacing) * 12)',
            } as React.CSSProperties
         }
      >
         <AppSidebar variant="sidebar" dashboardFor="agent" />
         <SidebarInset>
            <SiteHeader dashboardFor="agent" />
            <div className="flex flex-1 flex-col">
               <div className="@container/main flex flex-1 flex-col gap-2">
                  {children}
               </div>
            </div>
         </SidebarInset>
      </SidebarProvider>
   );
};

export default AgentDashboardLayout;
