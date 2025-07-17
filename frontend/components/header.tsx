'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import {
   Sheet,
   SheetContent,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
} from '@/components/ui/sheet';
import { Menu, Package, Phone, User } from 'lucide-react';

export function Header() {
   const [isOpen, setIsOpen] = useState(false);

   const navigation = [
      { name: 'Services', href: '#services' },
      { name: 'Track Package', href: '#track' },
      { name: 'How it Works', href: '#how-it-works' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'About', href: '#about' },
      { name: 'Contact', href: '#contact' },
   ];

   const handleNavClick = (href: string) => {
      setIsOpen(false);
      // Smooth scroll to section
      const element = document.querySelector(href);
      if (element) {
         element.scrollIntoView({ behavior: 'smooth' });
      }
   };

   return (
      <header className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
               {/* Logo */}
               <div className="flex items-center space-x-3">
                  <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-xl">
                     <Package className="text-primary-foreground h-6 w-6" />
                  </div>
                  <span className="text-foreground text-2xl font-bold">
                     Quicko
                  </span>
               </div>

               {/* Desktop Navigation */}
               <nav className="hidden items-center space-x-8 lg:flex">
                  {navigation.map((item) => (
                     <button
                        key={item.name}
                        onClick={() => handleNavClick(item.href)}
                        className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors duration-200"
                     >
                        {item.name}
                     </button>
                  ))}
               </nav>

               {/* Desktop Actions */}
               <div className="hidden items-center space-x-4 lg:flex">
                  <ThemeToggle />
                  <Button variant="ghost" size="sm" className="text-sm">
                     <User className="mr-2 h-4 w-4" />
                     Sign In
                  </Button>
                  <Button size="sm" className="text-sm">
                     <Phone className="mr-2 h-4 w-4" />
                     Get Quote
                  </Button>
               </div>

               {/* Mobile Actions */}
               <div className="flex items-center space-x-2 lg:hidden">
                  <ThemeToggle />
                  <Sheet open={isOpen} onOpenChange={setIsOpen}>
                     <SheetTrigger asChild>
                        <Button
                           variant="ghost"
                           size="icon"
                           className="h-10 w-10"
                        >
                           <Menu className="h-5 w-5" />
                           <span className="sr-only">Open menu</span>
                        </Button>
                     </SheetTrigger>
                     <SheetContent side="right" className="w-80 p-5 sm:w-96">
                        <SheetHeader className="text-left">
                           <SheetTitle className="flex items-center space-x-3">
                              <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
                                 <Package className="text-primary-foreground h-5 w-5" />
                              </div>
                              <span className="text-xl font-bold">Quicko</span>
                           </SheetTitle>
                        </SheetHeader>

                        <nav className="mt-8 space-y-4">
                           {navigation.map((item) => (
                              <button
                                 key={item.name}
                                 onClick={() => handleNavClick(item.href)}
                                 className="text-muted-foreground hover:text-foreground hover:bg-accent block w-full rounded-lg px-4 py-3 text-left text-base font-medium transition-colors duration-200"
                              >
                                 {item.name}
                              </button>
                           ))}
                        </nav>

                        <div className="border-border mt-8 space-y-4 border-t pt-6">
                           <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start"
                           >
                              <User className="mr-3 h-4 w-4" />
                              Sign In
                           </Button>
                           <Button size="sm" className="w-full justify-start">
                              <Phone className="mr-3 h-4 w-4" />
                              Get Quote
                           </Button>
                        </div>
                     </SheetContent>
                  </Sheet>
               </div>
            </div>
         </div>
      </header>
   );
}
