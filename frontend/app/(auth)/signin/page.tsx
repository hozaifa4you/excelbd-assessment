import { Button } from '@/components/ui/button';
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Chrome, Facebook, Apple } from 'lucide-react';
import Link from 'next/link';
import { route } from '@/lib/routes';
import { SigninForm } from '@/components/auth/signin-form';

export default function Signin() {
   return (
      <div className="bg-background relative min-h-screen overflow-hidden">
         {/* Background Gradients */}
         <div className="from-background via-primary/5 to-primary/10 absolute inset-0 bg-gradient-to-br"></div>
         <div className="via-accent/30 to-secondary/20 absolute inset-0 bg-gradient-to-tr from-transparent"></div>

         {/* Main Content */}
         <div className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
               {/* Welcome Message */}
               <div className="space-y-2 text-center">
                  <h1 className="text-3xl font-bold tracking-tight">
                     Welcome back
                  </h1>
                  <p className="text-muted-foreground">
                     Sign in to your Quicko account to manage your shipments
                  </p>
               </div>

               {/* Login Card */}
               <Card className="bg-card/80 border-0 shadow-2xl backdrop-blur">
                  <CardHeader className="space-y-1 pb-6">
                     <CardTitle className="text-center text-2xl font-bold">
                        Sign In
                     </CardTitle>
                     <CardDescription className="text-center">
                        Enter your credentials to access your account
                     </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                     {/* {error && (
                        <Alert variant="destructive">
                           <AlertCircle className="h-4 w-4" />
                           <AlertDescription>{error}</AlertDescription>
                        </Alert>
                     )} */}

                     {/* Social Login */}
                     <div className="space-y-3">
                        <Button variant="outline" className="h-12 w-full">
                           <Chrome className="mr-3 h-5 w-5" />
                           Continue with Google
                        </Button>
                        <div className="grid grid-cols-2 gap-3">
                           <Button variant="outline" className="h-12">
                              <Facebook className="mr-2 h-5 w-5" />
                              Facebook
                           </Button>
                           <Button variant="outline" className="h-12">
                              <Apple className="mr-2 h-5 w-5" />
                              Apple
                           </Button>
                        </div>
                     </div>

                     <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                           <Separator className="w-full" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                           <span className="bg-card text-muted-foreground px-2">
                              Or continue with email
                           </span>
                        </div>
                     </div>

                     {/* Login Form */}
                     <SigninForm />
                  </CardContent>
               </Card>

               {/* Switch to Register */}
               <div className="mb-10 text-center">
                  <p className="text-muted-foreground">
                     Don&apos;t have an account?{' '}
                     <Link
                        href={route('signup')}
                        className="text-primary hover:text-primary/80 font-semibold transition-colors"
                     >
                        Create account
                     </Link>
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
}
