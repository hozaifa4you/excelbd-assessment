'use client';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';

export function ThemeToggle() {
   const { theme, setTheme } = useTheme();

   const toggleTheme = () => {
      if (theme === 'light') {
         setTheme('dark');
      } else if (theme === 'dark') {
         setTheme('system');
      } else {
         setTheme('light');
      }
   };

   return (
      <Button
         variant="ghost"
         size="icon"
         onClick={toggleTheme}
         className="hover:bg-accent h-10 w-10 rounded-full transition-colors"
         aria-label="Toggle theme"
      >
         <Sun className="h-5 w-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
         <Moon className="absolute h-5 w-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      </Button>
   );
}
