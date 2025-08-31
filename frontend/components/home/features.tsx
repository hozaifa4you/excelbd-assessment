import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
   Truck,
   Shield,
   Clock,
   MapPin,
   CreditCard,
   Headphones,
   Package,
   Globe,
} from 'lucide-react';

export function Features() {
   const features = [
      {
         icon: <Truck className="h-8 w-8" />,
         title: 'Express Delivery',
         description:
            'Same-day and next-day delivery options for urgent packages with guaranteed time slots',
      },
      {
         icon: <Shield className="h-8 w-8" />,
         title: 'Secure Handling',
         description:
            'Full insurance coverage and careful handling protocols for maximum package protection',
      },
      {
         icon: <Clock className="h-8 w-8" />,
         title: 'Real-time Tracking',
         description:
            'Live GPS tracking with instant notifications and delivery status updates',
      },
      {
         icon: <MapPin className="h-8 w-8" />,
         title: 'Wide Coverage',
         description:
            'Comprehensive delivery network covering 200+ cities nationwide with rural reach',
      },
      {
         icon: <CreditCard className="h-8 w-8" />,
         title: 'Flexible Payment',
         description:
            'Multiple payment options including online, cash on delivery, and corporate billing',
      },
      {
         icon: <Headphones className="h-8 w-8" />,
         title: '24/7 Support',
         description:
            'Round-the-clock customer service with dedicated support agents for assistance',
      },
      {
         icon: <Package className="h-8 w-8" />,
         title: 'All Package Sizes',
         description:
            'From documents to large freight - specialized handling for every package type',
      },
      {
         icon: <Globe className="h-8 w-8" />,
         title: 'Global Shipping',
         description:
            'International delivery network with customs clearance and door-to-door service',
      },
   ];

   return (
      <section className="py-16 sm:py-20 lg:py-24" id="services">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="mb-16 space-y-4 text-center">
               <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                  Why Choose Quicko?
               </h2>
               <p className="text-muted-foreground mx-auto max-w-3xl text-lg leading-relaxed sm:text-xl">
                  We provide comprehensive delivery solutions with cutting-edge
                  technology and unmatched customer service to ensure your
                  packages reach safely and on time.
               </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
               {features.map((feature, index) => (
                  <Card
                     key={index}
                     className="group bg-card/50 hover:bg-card relative overflow-hidden border-0 backdrop-blur transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                     <CardHeader className="pb-4">
                        <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300">
                           {feature.icon}
                        </div>
                        <CardTitle className="text-xl leading-tight font-bold">
                           {feature.title}
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="pt-0">
                        <p className="text-muted-foreground leading-relaxed">
                           {feature.description}
                        </p>
                     </CardContent>

                     {/* Hover Effect */}
                     <div className="from-primary/5 pointer-events-none absolute inset-0 bg-gradient-to-r to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </Card>
               ))}
            </div>
         </div>
      </section>
   );
}
