import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import z from 'zod';

export function cn(...inputs: ClassValue[]) {
   return twMerge(clsx(inputs));
}

export function zodErrorFormat(errors: z.ZodError<Record<string, string>>) {
   const errs = z.treeifyError(errors);

   return { ...errs.properties };
}
