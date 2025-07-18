import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import z from 'zod';

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export function zodErrorFormat(errors: z.ZodError<Record<string, string>>) {
   const errs = z.treeifyError(errors);

   const properties = Object.keys(errs?.properties ?? {}).reduce(
      (acc, key) => {
         const error = errs?.properties?.[key];
         if (error) {
            acc[key] = error.errors.toString();
         }
         return acc;
      },
      {} as Record<string, string>,
   );

   return properties;
}
