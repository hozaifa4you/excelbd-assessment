'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
   ArrowRight,
   AlertCircle,
   Chrome,
   Facebook,
   Apple,
} from 'lucide-react';
import Link from 'next/link';
import { route } from '@/lib/routes';

export default function Signin() {
   const [showPassword, setShowPassword] = useState(false);
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [rememberMe, setRememberMe] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState('');

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');

      // Simulate API call
      setTimeout(() => {
         if (email === 'demo@quicko.com' && password === 'password') {
            // Success - would redirect to dashboard
            console.log('Login successful');
         } else {
            setError('Invalid email or password. Please try again.');
         }
         setIsLoading(false);
      }, 1500);
   };

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
                     {/* Error Alert */}
                     {error && (
                        <Alert variant="destructive">
                           <AlertCircle className="h-4 w-4" />
                           <AlertDescription>{error}</AlertDescription>
                        </Alert>
                     )}

                     {/* Social Login */}
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

                     {/* Login Form */}
                     <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                           <Label htmlFor="email">Email Address</Label>
                           <div className="relative">
                              <Mail className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform" />
                              <Input
                                 id="email"
                                 type="email"
                                 placeholder="Enter your email"
                                 value={email}
                                 onChange={(e) => setEmail(e.target.value)}
                                 className="h-12 pl-10"
                                 required
                                 disabled={isLoading}
                              />
                           </div>
                        </div>

                        <div className="space-y-2">
                           <Label htmlFor="password">Password</Label>
                           <div className="relative">
                              <Lock className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform" />
                              <Input
                                 id="password"
                                 type={showPassword ? 'text' : 'password'}
                                 placeholder="Enter your password"
                                 value={password}
                                 onChange={(e) => setPassword(e.target.value)}
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
                        </div>

                        <div className="flex items-center justify-between">
                           <div className="flex items-center space-x-2">
                              <Checkbox
                                 id="remember"
                                 checked={rememberMe}
                                 onCheckedChange={(checked) =>
                                    setRememberMe(checked as boolean)
                                 }
                                 disabled={isLoading}
                              />
                              <Label
                                 htmlFor="remember"
                                 className="text-sm font-medium"
                              >
                                 Remember me
                              </Label>
                           </div>
                           <button
                              type="button"
                              className="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
                              disabled={isLoading}
                           >
                              Forgot password?
                           </button>
                        </div>

                        <Button
                           type="submit"
                           className="h-12 w-full text-base font-semibold"
                           disabled={isLoading}
                        >
                           {isLoading ? (
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
