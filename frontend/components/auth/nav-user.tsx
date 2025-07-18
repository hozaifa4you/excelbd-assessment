'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BellDot, CreditCard, LogOut, User, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NavUser({
   user,
}: {
   user: {
      name: string;
      email: string;
      avatar: string;
   };
}) {
   const handleLogout = async () => {
      const response = await fetch('/api/auth/signout', {
         method: 'DELETE',
         headers: {
            'Content-Type': 'application/json',
         },
      });

      if (response.ok) {
         window.location.href = '/';
      }
   };

   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>
            <Button size="icon" className="text-sm">
               <User className="size-4.5" />
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side="bottom"
            align="end"
            sideOffset={4}
         >
            <DropdownMenuLabel className="p-0 font-normal">
               <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                     <AvatarImage src={user.avatar} alt={user.name} />
                     <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                     <span className="truncate font-medium">{user.name}</span>
                     <span className="text-muted-foreground truncate text-xs">
                        {user.email}
                     </span>
                  </div>
               </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
               <DropdownMenuItem>
                  <UserCircle />
                  Account
               </DropdownMenuItem>
               <DropdownMenuItem>
                  <CreditCard />
                  Billing
               </DropdownMenuItem>
               <DropdownMenuItem>
                  <BellDot />
                  Notifications
               </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} variant="destructive">
               <LogOut />
               Log out
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   );
}
