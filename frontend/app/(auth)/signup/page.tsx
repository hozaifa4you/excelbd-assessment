'use client';
import { useState } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
   Eye,
   EyeOff,
   Mail,
   Lock,
   User,
   Phone,
   Building,
   ArrowRight,
   AlertCircle,
   Chrome,
   Facebook,
   Apple,
   CheckCircle,
} from 'lucide-react';
import Link from 'next/link';
import { route } from '@/lib/routes';

interface RegisterProps {
   onSwitchToLogin: () => void;
}

export default function Register({ onSwitchToLogin }: RegisterProps) {
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      accountType: '',
      companyName: '',
   });
   const [acceptTerms, setAcceptTerms] = useState(false);
   const [acceptMarketing, setAcceptMarketing] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState('');
   const [success, setSuccess] = useState(false);

   const handleInputChange = (field: string, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
   };

   const validateForm = () => {
      if (
         !formData.firstName ||
         !formData.lastName ||
         !formData.email ||
         !formData.phone ||
         !formData.password ||
         !formData.accountType
      ) {
         return 'Please fill in all required fields';
      }
      if (formData.password.length < 8) {
         return 'Password must be at least 8 characters long';
      }
      if (formData.password !== formData.confirmPassword) {
         return 'Passwords do not match';
      }
      if (!acceptTerms) {
         return 'Please accept the Terms of Service and Privacy Policy';
      }
      return null;
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');

      const validationError = validateForm();
      if (validationError) {
         setError(validationError);
         return;
      }

      setIsLoading(true);

      // Simulate API call
      setTimeout(() => {
         setSuccess(true);
         setIsLoading(false);
      }, 2000);
   };

   if (success) {
      return (
         <div className="bg-background relative min-h-screen overflow-hidden">
            {/* Background Gradients */}
            <div className="from-background via-primary/5 to-primary/10 absolute inset-0 bg-gradient-to-br"></div>
            <div className="via-accent/30 to-secondary/20 absolute inset-0 bg-gradient-to-tr from-transparent"></div>

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
                           Welcome to Quicko! We&apos;ve sent a verification
                           email to {formData.email}. Please check your inbox
                           and click the verification link to activate your
                           account.
                        </p>
                     </div>
                     <div className="space-y-3">
                        <Button
                           onClick={onSwitchToLogin}
                           className="h-12 w-full"
                        >
                           Continue to Sign In
                        </Button>
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
   }

   return (
      <div className="bg-background relative min-h-screen overflow-hidden">
         {/* Background Gradients */}
         <div className="from-background via-primary/5 to-primary/10 absolute inset-0 bg-gradient-to-br"></div>
         <div className="via-accent/30 to-secondary/20 absolute inset-0 bg-gradient-to-tr from-transparent"></div>

         {/* Main Content */}
         <div className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 py-8">
            <div className="w-full max-w-lg space-y-8">
               {/* Welcome Message */}
               <div className="space-y-2 text-center">
                  <h1 className="text-3xl font-bold tracking-tight">
                     Create your account
                  </h1>
                  <p className="text-muted-foreground">
                     Join thousands of customers who trust Quicko for their
                     delivery needs
                  </p>
               </div>

               {/* Register Card */}
               <Card className="bg-card/80 border-0 shadow-2xl backdrop-blur">
                  <CardHeader className="space-y-1 pb-6">
                     <CardTitle className="text-center text-2xl font-bold">
                        Sign Up
                     </CardTitle>
                     <CardDescription className="text-center">
                        Create your Quicko account to start shipping
                     </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                     {/* Error Alert */}
                     {error && (
                        <Alert variant="destructive">
                           <AlertCircle className="h-4 w-4" />
                           <AlertDescription>{error}</AlertDescription>
                        </Alert>
                     )}

                     {/* Social Registration */}
                     <div className="space-y-3">
                        <Button
                           variant="outline"
                           className="h-12 w-full"
                           disabled={isLoading}
                        >
                           <Chrome className="mr-3 h-5 w-5" />
                           Continue with Google
                        </Button>
                        <div className="grid grid-cols-2 gap-3">
                           <Button
                              variant="outline"
                              className="h-12"
                              disabled={isLoading}
                           >
                              <Facebook className="mr-2 h-5 w-5" />
                              Facebook
                           </Button>
                           <Button
                              variant="outline"
                              className="h-12"
                              disabled={isLoading}
                           >
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

                     {/* Registration Form */}
                     <form onSubmit={handleSubmit} className="space-y-4">
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
                                    value={formData.firstName}
                                    onChange={(e) =>
                                       handleInputChange(
                                          'firstName',
                                          e.target.value,
                                       )
                                    }
                                    className="h-12 pl-10"
                                    required
                                    disabled={isLoading}
                                 />
                              </div>
                           </div>
                           <div className="space-y-2">
                              <Label htmlFor="lastName">Last Name *</Label>
                              <Input
                                 id="lastName"
                                 type="text"
                                 placeholder="Doe"
                                 value={formData.lastName}
                                 onChange={(e) =>
                                    handleInputChange(
                                       'lastName',
                                       e.target.value,
                                    )
                                 }
                                 className="h-12"
                                 required
                                 disabled={isLoading}
                              />
                           </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                           <Label htmlFor="email">Email Address *</Label>
                           <div className="relative">
                              <Mail className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform" />
                              <Input
                                 id="email"
                                 type="email"
                                 placeholder="john.doe@example.com"
                                 value={formData.email}
                                 onChange={(e) =>
                                    handleInputChange('email', e.target.value)
                                 }
                                 className="h-12 pl-10"
                                 required
                                 disabled={isLoading}
                              />
                           </div>
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                           <Label htmlFor="phone">Phone Number *</Label>
                           <div className="relative">
                              <Phone className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform" />
                              <Input
                                 id="phone"
                                 type="tel"
                                 placeholder="+1 (555) 123-4567"
                                 value={formData.phone}
                                 onChange={(e) =>
                                    handleInputChange('phone', e.target.value)
                                 }
                                 className="h-12 pl-10"
                                 required
                                 disabled={isLoading}
                              />
                           </div>
                        </div>

                        {/* Company Name (conditional) */}
                        <div className="space-y-2">
                           <Label htmlFor="companyName">Company Name</Label>
                           <div className="relative">
                              <Building className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform" />
                              <Input
                                 id="companyName"
                                 type="text"
                                 placeholder="Your Company Name"
                                 value={formData.companyName}
                                 onChange={(e) =>
                                    handleInputChange(
                                       'companyName',
                                       e.target.value,
                                    )
                                 }
                                 className="h-12 pl-10"
                                 disabled={isLoading}
                              />
                           </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                           <Label htmlFor="password">Password *</Label>
                           <div className="relative">
                              <Lock className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform" />
                              <Input
                                 id="password"
                                 type={showPassword ? 'text' : 'password'}
                                 placeholder="Create a strong password"
                                 value={formData.password}
                                 onChange={(e) =>
                                    handleInputChange(
                                       'password',
                                       e.target.value,
                                    )
                                 }
                                 className="h-12 pr-10 pl-10"
                                 required
                                 disabled={isLoading}
                              />
                              <button
                                 type="button"
                                 onClick={() => setShowPassword(!showPassword)}
                                 className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transform transition-colors"
                                 disabled={isLoading}
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

                        {/* Confirm Password */}
                        <div className="space-y-2">
                           <Label htmlFor="confirmPassword">
                              Confirm Password *
                           </Label>
                           <div className="relative">
                              <Lock className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform" />
                              <Input
                                 id="confirmPassword"
                                 type={
                                    showConfirmPassword ? 'text' : 'password'
                                 }
                                 placeholder="Confirm your password"
                                 value={formData.confirmPassword}
                                 onChange={(e) =>
                                    handleInputChange(
                                       'confirmPassword',
                                       e.target.value,
                                    )
                                 }
                                 className="h-12 pr-10 pl-10"
                                 required
                                 disabled={isLoading}
                              />
                              <button
                                 type="button"
                                 onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                 }
                                 className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transform transition-colors"
                                 disabled={isLoading}
                              >
                                 {showConfirmPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                 ) : (
                                    <Eye className="h-5 w-5" />
                                 )}
                              </button>
                           </div>
                        </div>

                        {/* Terms and Marketing */}
                        <div className="space-y-4">
                           <div className="flex items-start space-x-2">
                              <Checkbox
                                 id="terms"
                                 checked={acceptTerms}
                                 onCheckedChange={(checked) =>
                                    setAcceptTerms(checked as boolean)
                                 }
                                 disabled={isLoading}
                                 className="mt-1"
                              />
                              <Label
                                 htmlFor="terms"
                                 className="text-sm leading-relaxed"
                              >
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
                                 disabled={isLoading}
                                 className="mt-1"
                              />
                              <Label
                                 htmlFor="marketing"
                                 className="text-sm leading-relaxed"
                              >
                                 I would like to receive marketing emails about
                                 Quicko&apos;s services and special offers
                              </Label>
                           </div>
                        </div>

                        <Button
                           type="submit"
                           className="h-12 w-full text-base font-semibold"
                           disabled={isLoading}
                        >
                           {isLoading ? (
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
                  </CardContent>
               </Card>

               {/* Switch to Login */}
               <div className="text-center">
                  <p className="text-muted-foreground">
                     Already have an account?{' '}
                     <Link
                        href={route('signin')}
                        className="text-primary hover:text-primary/80 font-semibold transition-colors"
                     >
                        Sign in
                     </Link>
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
}
