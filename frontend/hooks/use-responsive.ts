import * as React from 'react';

const breakpoints = {
   sm: 640,
   md: 768,
   lg: 1024,
   xl: 1280,
   '2xl': 1536,
};

type Breakpoint = keyof typeof breakpoints | 'base';

function getCurrentBreakpoint(width: number): Breakpoint {
   if (width < breakpoints.sm) return 'base';
   if (width < breakpoints.md) return 'sm';
   if (width < breakpoints.lg) return 'md';
   if (width < breakpoints.xl) return 'lg';
   if (width < breakpoints['2xl']) return 'xl';
   return '2xl';
}

export function useResponsive(): Breakpoint {
   const [breakpoint, setBreakpoint] = React.useState<Breakpoint>(() =>
      typeof window !== 'undefined'
         ? getCurrentBreakpoint(window.innerWidth)
         : 'base',
   );

   React.useEffect(() => {
      const onResize = () => {
         setBreakpoint(getCurrentBreakpoint(window.innerWidth));
      };
      window.addEventListener('resize', onResize);
      onResize();
      return () => window.removeEventListener('resize', onResize);
   }, []);

   return breakpoint;
}
