'use client';
import { CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useOptions } from '@/hooks/use-options';
import Link from 'next/link';
import { route } from '@/lib/routes';
import { buttonVariants } from '@/components/ui/button';

const RegisterSuccessMsg = () => {
   const options = useOptions();

   if (!options.isRegisterSuccess) return null;

   return (
      <div className="bg-background fixed inset-0 z-20 min-h-screen overflow-hidden">
         {/* Success Message */}
         <div className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
            <Card className="bg-card/80 w-full max-w-md border-0 shadow-2xl backdrop-blur">
               <CardContent className="space-y-6 p-8 text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                     <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="space-y-2">
                     <h2 className="text-2xl font-bold">
                        Account Created Successfully!
                     </h2>
                     <p className="text-muted-foreground">
                        {options.registerSuccessMessage}
                     </p>
                  </div>
                  <div className="space-y-3">
                     <Link
                        href={route('signin')}
                        className={buttonVariants({
                           className: 'h-12 w-full',
                        })}
                     >
                        Continue to Sign In
                     </Link>
                     <Link
                        href={route('home')}
                        className={buttonVariants({
                           className: 'h-12 w-full',
                           variant: 'outline',
                        })}
                     >
                        Back to Homepage
                     </Link>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
   );
};

export { RegisterSuccessMsg };
