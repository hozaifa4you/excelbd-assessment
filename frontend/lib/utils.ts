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

export const getStatusColor = (status: string) => {
   switch (status) {
      case 'ACTIVE':
         return 'text-green-600 bg-green-50 border-green-200';
      case 'BUSY':
         return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'OFFLINE':
         return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
         return 'text-gray-600 bg-gray-50 border-gray-200';
   }
};
