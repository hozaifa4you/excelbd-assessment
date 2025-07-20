'use client';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { dashboardMenuItems } from '@/lib/navigate';
import { BellPlus } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface SiteHeaderProps {
   dashboardFor: 'user' | 'agent' | 'admin';
}

export function SiteHeader({ dashboardFor }: SiteHeaderProps) {
   const pathname = usePathname();
   const title = dashboardMenuItems[dashboardFor];
   const headerTitle =
      title.find((item) => item.url === pathname)?.title || 'Dashboard';

   return (
      <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
         <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
            <SidebarTrigger className="-ml-1" />
            <Separator
               orientation="vertical"
               className="mx-2 data-[orientation=vertical]:h-4"
            />
            <h1 className="text-base font-medium">{headerTitle}</h1>
            <div className="ml-auto flex items-center gap-2">
               <Button
                  variant="outline"
                  size="icon"
                  className="border-primary hidden sm:flex"
               >
                  <BellPlus className="text-primary size-5" />
               </Button>
            </div>
         </div>
      </header>
   );
}
