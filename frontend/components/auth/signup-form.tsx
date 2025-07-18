'use client';
import { useActionState, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
   Eye,
   EyeOff,
   Mail,
   Lock,
   User,
   Phone,
   ArrowRight,
   AlertCircle,
} from 'lucide-react';
import { Button } from '../ui/button';
import { signUp } from '@/actions/auth.action';
import { toast } from 'sonner';
import { useOptions } from '@/hooks/use-options';

const initialState = {
   success: false,
   error: undefined,
   message: undefined,
};

const SignupForm = () => {
   const [state, signupAction, pending] = useActionState(signUp, initialState);
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [acceptTerms, setAcceptTerms] = useState(false);
   const [acceptMarketing, setAcceptMarketing] = useState(false);
   const options = useOptions();

   const message = state?.message;

   useEffect(() => {
      if (!pending && state?.success) {
         options.setRegisterSuccess(message || 'Registration successful!');
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [pending]);

   useEffect(() => {
      if (!pending && message) {
         toast.error('Register Failed', {
            description: message.toString(),
            icon: <AlertCircle />,
         });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [pending]);

   return (
      <form className="space-y-4" action={signupAction}>
         {/* Name Fields */}
         <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
               <Label htmlFor="firstName">First Name *</Label>
               <div className="relative">
                  <User className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform" />
                  <Input
                     id="firstName"
                     type="text"
                     placeholder="John"
                     className="h-12 pl-10"
                     name="firstName"
                  />
               </div>
            </div>
            <div className="space-y-2">
               <Label htmlFor="lastName">Last Name *</Label>
               <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  className="h-12"
                  name="lastName"
               />
            </div>
         </div>

         {(state?.error?.firstName || state?.error?.lastName) && (
            <p className="text-primary">
               {state.error.firstName || state.error.lastName}
            </p>
         )}

         {/* Email */}
         <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <div className="relative">
               <Mail className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform" />
               <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  className="h-12 pl-10"
                  name="email"
               />
            </div>
         </div>

         {state?.error?.email && (
            <p className="text-primary text-sm">{state.error.email}</p>
         )}

         {/* Phone */}
         <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <div className="relative">
               <Phone className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform" />
               <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  className="h-12 pl-10"
                  name="phone"
               />
            </div>
         </div>

         {state?.error?.phone && (
            <p className="text-primary text-sm">{state.error.phone}</p>
         )}

         {/* Password */}
         <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
               <Lock className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform" />
               <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  className="h-12 pr-10 pl-10"
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
            <p className="text-muted-foreground text-xs">
               Password must be at least 8 characters long
            </p>
         </div>

         {state?.error?.password && (
            <p className="text-primary text-sm">{state.error.password}</p>
         )}

         {/* Confirm Password */}
         <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password *</Label>
            <div className="relative">
               <Lock className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform" />
               <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  className="h-12 pr-10 pl-10"
                  name="confirmPassword"
               />
               <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transform transition-colors"
               >
                  {showConfirmPassword ? (
                     <EyeOff className="h-5 w-5" />
                  ) : (
                     <Eye className="h-5 w-5" />
                  )}
               </button>
            </div>
         </div>

         {state?.error?.confirmPassword && (
            <p className="text-primary text-sm">
               {state.error.confirmPassword}
            </p>
         )}

         {/* Accept Terms and Marketing */}

         {/* Terms and Marketing */}
         <div className="space-y-4">
            <div className="flex items-start space-x-2">
               <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) =>
                     setAcceptTerms(checked as boolean)
                  }
                  className="mt-1"
                  name="terms"
               />
               <Label htmlFor="terms" className="text-sm leading-relaxed">
                  I agree to the{' '}
                  <a
                     href="#"
                     className="text-primary hover:text-primary/80 font-medium"
                  >
                     Terms of Service
                  </a>{' '}
                  and{' '}
                  <a
                     href="#"
                     className="text-primary hover:text-primary/80 font-medium"
                  >
                     Privacy Policy
                  </a>
               </Label>
            </div>

            <div className="flex items-start space-x-2">
               <Checkbox
                  id="marketing"
                  checked={acceptMarketing}
                  onCheckedChange={(checked) =>
                     setAcceptMarketing(checked as boolean)
                  }
                  className="mt-1"
                  name="marketing"
               />
               <Label htmlFor="marketing" className="text-sm leading-relaxed">
                  I would like to receive marketing emails about Quicko&apos;s
                  services and special offers
               </Label>
            </div>
         </div>

         <Button
            type="submit"
            disabled={!acceptTerms}
            className="h-12 w-full text-base font-semibold"
         >
            {pending ? (
               <div className="flex items-center space-x-2">
                  <div className="border-primary-foreground/30 border-t-primary-foreground h-4 w-4 animate-spin rounded-full border-2"></div>
                  <span>Creating account...</span>
               </div>
            ) : (
               <div className="flex items-center space-x-2">
                  <span>Create Account</span>
                  <ArrowRight className="h-4 w-4" />
               </div>
            )}
         </Button>
      </form>
   );
};

export { SignupForm };
