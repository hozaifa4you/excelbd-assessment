import { Card, CardContent } from '@/components/ui/card';
import { Package, Users, MapPin, Clock, TrendingUp } from 'lucide-react';

export function Stats() {
   const stats = [
      {
         icon: <Package className="h-8 w-8" />,
         value: '2.5M+',
         label: 'Packages Delivered',
         description: 'Successfully delivered with 99.9% accuracy',
         trend: '+15%',
      },
      {
         icon: <Users className="h-8 w-8" />,
         value: '500K+',
         label: 'Happy Customers',
         description: 'Trusted by individuals and businesses',
         trend: '+25%',
      },
      {
         icon: <MapPin className="h-8 w-8" />,
         value: '200+',
         label: 'Cities Covered',
         description: 'Extensive delivery network nationwide',
         trend: '+12%',
      },
      {
         icon: <Clock className="h-8 w-8" />,
         value: '99.9%',
         label: 'On-time Delivery',
         description: 'Reliable and punctual service record',
         trend: '+2%',
      },
   ];

   return (
      <section className="py-16 sm:py-20 lg:py-24">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="mb-16 space-y-4 text-center">
               <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                  Our Impact in Numbers
               </h2>
               <p className="text-muted-foreground mx-auto max-w-3xl text-lg leading-relaxed sm:text-xl">
                  These numbers reflect our commitment to excellence and the
                  trust our customers place in us every day for their delivery
                  needs.
               </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
               {stats.map((stat, index) => (
                  <Card
                     key={index}
                     className="group bg-card/50 relative overflow-hidden border-0 backdrop-blur transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                     <CardContent className="space-y-6 p-8 text-center">
                        {/* Icon */}
                        <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground mx-auto flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300">
                           {stat.icon}
                        </div>

                        {/* Value with Trend */}
                        <div className="space-y-2">
                           <div className="flex items-center justify-center space-x-2">
                              <div className="text-primary text-4xl font-bold lg:text-5xl">
                                 {stat.value}
                              </div>
                              <div className="flex items-center space-x-1 text-sm font-medium text-green-600">
                                 <TrendingUp className="h-3 w-3" />
                                 <span>{stat.trend}</span>
                              </div>
                           </div>
                           <div className="text-foreground text-xl font-bold">
                              {stat.label}
                           </div>
                        </div>

                        {/* Description */}
                        <p className="text-muted-foreground text-sm leading-relaxed">
                           {stat.description}
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
