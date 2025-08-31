import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Package, Clock, Shield, Truck, Star } from 'lucide-react';

export function Hero() {
   return (
      <section className="from-background via-background to-primary/5 relative overflow-hidden bg-gradient-to-br">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-16 sm:py-20 lg:py-24">
               <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
                  {/* Left Content */}
                  <div className="space-y-8 text-center lg:text-left">
                     <div className="space-y-6">
                        <Badge
                           variant="secondary"
                           className="inline-flex items-center space-x-2 px-4 py-2"
                        >
                           <Truck className="h-4 w-4" />
                           <span className="font-medium">
                              Fast & Reliable Delivery
                           </span>
                        </Badge>

                        <h1 className="text-4xl leading-tight font-bold tracking-tight sm:text-5xl lg:text-6xl">
                           Ship Your Packages
                           <span className="text-primary mt-2 block">
                              Anywhere, Anytime
                           </span>
                        </h1>

                        <p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed sm:text-xl lg:mx-0">
                           Experience lightning-fast delivery with real-time
                           tracking, secure handling, and competitive rates.
                           Your packages, our priority.
                        </p>
                     </div>

                     {/* CTA Buttons */}
                     <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                        <Button
                           size="lg"
                           className="h-14 px-8 text-lg font-semibold"
                        >
                           Ship Now
                        </Button>
                        <Button
                           variant="outline"
                           size="lg"
                           className="h-14 px-8 text-lg font-semibold"
                        >
                           Calculate Shipping
                        </Button>
                     </div>

                     {/* Trust Indicators */}
                     <div className="text-muted-foreground flex flex-wrap items-center justify-center gap-6 text-sm lg:justify-start">
                        <div className="flex items-center space-x-2">
                           <Clock className="text-primary h-4 w-4" />
                           <span className="font-medium">24/7 Support</span>
                        </div>
                        <div className="flex items-center space-x-2">
                           <Shield className="text-primary h-4 w-4" />
                           <span className="font-medium">Secure Handling</span>
                        </div>
                        <div className="flex items-center space-x-2">
                           <Package className="text-primary h-4 w-4" />
                           <span className="font-medium">
                              Real-time Tracking
                           </span>
                        </div>
                     </div>
                  </div>

                  {/* Right Content - Tracking Card */}
                  <div className="relative">
                     <Card className="bg-card/50 border-0 p-6 shadow-2xl backdrop-blur sm:p-8">
                        <CardContent className="space-y-8 p-0">
                           {/* Header */}
                           <div className="space-y-4 text-center">
                              <div className="bg-primary/10 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl">
                                 <Package className="text-primary h-8 w-8" />
                              </div>
                              <div>
                                 <h3 className="text-card-foreground text-2xl font-bold">
                                    Track Your Package
                                 </h3>
                                 <p className="text-muted-foreground mt-2">
                                    Enter your tracking number for real-time
                                    updates
                                 </p>
                              </div>
                           </div>

                           {/* Tracking Input */}
                           <div className="space-y-4">
                              <div className="relative">
                                 <Input
                                    placeholder="Enter tracking number (e.g., QK123456789)"
                                    className="focus:border-primary h-14 border-2 pr-14 pl-4 text-lg"
                                 />
                                 <Button
                                    size="icon"
                                    className="absolute top-2 right-2 h-10 w-10"
                                 >
                                    <Search className="h-5 w-5" />
                                 </Button>
                              </div>
                           </div>

                           {/* Stats */}
                           <div className="border-border grid grid-cols-2 gap-6 border-t pt-6">
                              <div className="space-y-2 text-center">
                                 <div className="text-primary text-3xl font-bold">
                                    15K+
                                 </div>
                                 <div className="text-muted-foreground text-sm font-medium">
                                    Delivered Today
                                 </div>
                              </div>
                              <div className="space-y-2 text-center">
                                 <div className="text-primary text-3xl font-bold">
                                    99.9%
                                 </div>
                                 <div className="text-muted-foreground text-sm font-medium">
                                    On-time Delivery
                                 </div>
                              </div>
                           </div>

                           {/* Rating */}
                           <div className="flex items-center justify-center space-x-2 pt-4">
                              <div className="flex space-x-1">
                                 {[...Array(5)].map((_, i) => (
                                    <Star
                                       key={i}
                                       className="text-primary h-4 w-4 fill-current"
                                    />
                                 ))}
                              </div>
                              <span className="text-muted-foreground text-sm font-medium">
                                 4.9/5 from 10K+ reviews
                              </span>
                           </div>
                        </CardContent>
                     </Card>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}
