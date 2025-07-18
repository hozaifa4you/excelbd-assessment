'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useActionState, useEffect, useState } from 'react';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import { signIn } from '@/actions/auth.action';
import { toast } from 'sonner';

const initialState = {
   error: {
      email: undefined,
      password: undefined,
   },
   message: undefined,
};

const SigninForm = () => {
   const [state, signinAction, pending] = useActionState(signIn, initialState);
   const [showPassword, setShowPassword] = useState(false);
   const message = state?.message;

   useEffect(() => {
      if (!pending && message) {
         toast.error('Login Failed', {
            description: message.toString(),
            icon: <AlertCircle />,
         });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [pending]);

   return (
      <form className="space-y-4" action={signinAction}>
         <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
               <Mail className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform" />
               <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="h-12 pl-10"
                  required
                  name="email"
               />
            </div>
         </div>

         {state?.error?.email && (
            <p className="text-primary text-sm">{state.error.email}</p>
         )}

         <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
               <Lock className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform" />
               <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="h-12 pr-10 pl-10"
                  required
                  name="password"
               />
               <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transform transition-colors"
               >
                  {showPassword ? (
                     <EyeOff className="h-5 w-5" />
                  ) : (
                     <Eye className="h-5 w-5" />
                  )}
               </button>
            </div>
         </div>

         {state?.error?.password && (
            <p className="text-primary text-sm">{state.error.password}</p>
         )}

         <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
               <Checkbox id="remember" name="rememberMe" />
               <Label htmlFor="remember" className="text-sm font-medium">
                  Remember me
               </Label>
            </div>
            <button
               type="button"
               className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
            >
               Forgot password?
            </button>
         </div>

         <Button type="submit" className="h-12 w-full text-base font-semibold">
            {pending ? (
               <div className="flex items-center space-x-2">
                  <div className="border-primary-foreground/30 border-t-primary-foreground h-4 w-4 animate-spin rounded-full border-2"></div>
                  <span>Signing in...</span>
               </div>
            ) : (
               <div className="flex items-center space-x-2">
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
               </div>
            )}
         </Button>
      </form>
   );
};

export { SigninForm };
