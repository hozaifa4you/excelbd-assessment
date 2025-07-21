'use client';
import { IconCirclePlusFilled, IconMail } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import {
   SidebarGroup,
   SidebarGroupContent,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
} from '@/components/ui/sidebar';
import { AppSidebarItem } from '@/lib/navigate';
import { usePathname, useRouter } from 'next/navigation';
import { route } from '@/lib/routes';
import { useSession } from '@/hooks/use-session';
import { cn } from '@/lib/utils';

interface NavMainProps {
   items: AppSidebarItem[];
}

export function NavMain({ items }: NavMainProps) {
   const router = useRouter();
   const pathname = usePathname();
   const { session } = useSession();

   const navigateUrl = (url: string) => {
      router.push(url);
   };

   return (
      <SidebarGroup>
         <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
               <SidebarMenuItem className="flex items-center gap-2">
                  <SidebarMenuButton
                     onClick={() => navigateUrl(route('parcels.booking'))}
                     tooltip="Quick Create"
                     className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
                     disabled={session?.user.role !== 'USER'}
                  >
                     <IconCirclePlusFilled />
                     <span>Quick Create</span>
                  </SidebarMenuButton>
                  <Button
                     size="icon"
                     className="size-8 group-data-[collapsible=icon]:opacity-0"
                     variant="outline"
                  >
                     <IconMail />
                     <span className="sr-only">Inbox</span>
                  </Button>
               </SidebarMenuItem>
            </SidebarMenu>
            <SidebarMenu>
               {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                     <SidebarMenuButton
                        tooltip={item.title}
                        onClick={() => navigateUrl(item.url)}
                        className={cn({
                           'text-primary bg-slate-100': pathname === item.url,
                        })}
                     >
                        <item.Icon />
                        <span>{item.title}</span>
                     </SidebarMenuButton>
                  </SidebarMenuItem>
               ))}
            </SidebarMenu>
         </SidebarGroupContent>
      </SidebarGroup>
   );
}
