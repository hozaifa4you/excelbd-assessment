import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Truck, CheckCircle, MapPin, ArrowRight } from 'lucide-react';

export function HowItWorks() {
   const steps = [
      {
         icon: <Package className="h-12 w-12" />,
         title: 'Book Your Shipment',
         description:
            'Enter pickup and delivery details, select service type, and schedule pickup time through our website or mobile app.',
         step: '01',
      },
      {
         icon: <MapPin className="h-12 w-12" />,
         title: 'Package Pickup',
         description:
            'Our professional delivery partner will collect your package from your location at the scheduled time with proper documentation.',
         step: '02',
      },
      {
         icon: <Truck className="h-12 w-12" />,
         title: 'In Transit',
         description:
            'Track your package in real-time as it moves through our secure network with live GPS updates and status notifications.',
         step: '03',
      },
      {
         icon: <CheckCircle className="h-12 w-12" />,
         title: 'Safe Delivery',
         description:
            'Your package is safely delivered to the recipient with digital confirmation, signature proof, and delivery photos.',
         step: '04',
      },
   ];

   return (
      <section
         className="bg-muted/30 py-16 sm:py-20 lg:py-24"
         id="how-it-works"
      >
         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="mb-16 space-y-4 text-center">
               <Badge
                  variant="secondary"
                  className="inline-flex items-center px-4 py-2"
               >
                  <span className="font-medium">Simple Process</span>
               </Badge>
               <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                  How It Works
               </h2>
               <p className="text-muted-foreground mx-auto max-w-3xl text-lg leading-relaxed sm:text-xl">
                  Shipping with Quicko is simple and straightforward.
                  Here&apos;s how we make your delivery experience seamless in
                  just 4 easy steps.
               </p>
            </div>

            {/* Steps Grid */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-6 xl:grid-cols-4">
               {steps.map((step, index) => (
                  <div key={index} className="group relative">
                     <Card className="bg-card/80 h-full border-0 backdrop-blur transition-all duration-300 hover:scale-105 hover:shadow-xl">
                        <CardContent className="relative space-y-6 p-8 text-center">
                           {/* Step Number Badge */}
                           <div className="absolute -top-4 -right-4">
                              <Badge
                                 variant="default"
                                 className="bg-primary text-primary-foreground flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold"
                              >
                                 {step.step}
                              </Badge>
                           </div>

                           {/* Icon */}
                           <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground mx-auto flex h-20 w-20 items-center justify-center rounded-2xl transition-all duration-300">
                              {step.icon}
                           </div>

                           {/* Content */}
                           <div className="space-y-4">
                              <h3 className="text-xl leading-tight font-bold">
                                 {step.title}
                              </h3>
                              <p className="text-muted-foreground leading-relaxed">
                                 {step.description}
                              </p>
                           </div>
                        </CardContent>
                     </Card>

                     {/* Connector Arrow - Desktop Only */}
                     {index < steps.length - 1 && (
                        <div className="absolute top-1/2 -right-3 z-10 hidden xl:block">
                           <div className="bg-primary/20 flex h-6 w-6 items-center justify-center rounded-full">
                              <ArrowRight className="text-primary h-4 w-4" />
                           </div>
                        </div>
                     )}
                  </div>
               ))}
            </div>
         </div>
      </section>
   );
}
