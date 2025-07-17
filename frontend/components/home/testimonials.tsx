import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Quote } from 'lucide-react';

export function Testimonials() {
   const testimonials = [
      {
         name: 'Sarah Johnson',
         role: 'Small Business Owner',
         company: 'Artisan Crafts Co.',
         content:
            'Quicko has completely transformed how I ship products to my customers. The tracking system is excellent, delivery is always on time, and the customer service is outstanding. My business has grown 40% since switching to Quicko.',
         rating: 5,
         image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=100&h=100&fit=crop&crop=face',
      },
      {
         name: 'Michael Chen',
         role: 'E-commerce Manager',
         company: 'TechGear Solutions',
         content:
            'Outstanding service that has exceeded all our expectations! The customer support team is incredibly responsive, the delivery network is reliable, and the pricing is competitive. I highly recommend Quicko for any business.',
         rating: 5,
         image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=100&h=100&fit=crop&crop=face',
      },
      {
         name: 'Emily Davis',
         role: 'Freelance Designer',
         company: 'Creative Studio',
         content:
            'As a freelancer, I regularly ship design samples and documents to clients across the country. Quicko makes it incredibly easy with their user-friendly app, fast delivery times, and affordable rates. Absolutely love it!',
         rating: 5,
         image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=100&h=100&fit=crop&crop=face',
      },
   ];

   return (
      <section className="bg-muted/30 py-16 sm:py-20 lg:py-24">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="mb-16 space-y-4 text-center">
               <Badge
                  variant="secondary"
                  className="inline-flex items-center px-4 py-2"
               >
                  <span className="font-medium">Customer Reviews</span>
               </Badge>
               <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                  What Our Customers Say
               </h2>
               <p className="text-muted-foreground mx-auto max-w-3xl text-lg leading-relaxed sm:text-xl">
                  Don&apos;t just take our word for it. Here&apos;s what our
                  valued customers have to say about their experience with
                  Quicko&lsquo;s delivery services.
               </p>
            </div>

            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
               {testimonials.map((testimonial, index) => (
                  <Card
                     key={index}
                     className="group bg-card/80 relative overflow-hidden border-0 backdrop-blur transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  >
                     <CardContent className="space-y-6 p-8">
                        {/* Quote Icon */}
                        <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full">
                           <Quote className="h-6 w-6" />
                        </div>

                        {/* Rating */}
                        <div className="flex items-center space-x-1">
                           {[...Array(testimonial.rating)].map((_, i) => (
                              <Star
                                 key={i}
                                 className="text-primary h-5 w-5 fill-current"
                              />
                           ))}
                        </div>

                        {/* Content */}
                        <blockquote className="text-muted-foreground leading-relaxed italic">
                           &quot;{testimonial.content}&quot;
                        </blockquote>

                        {/* Author */}
                        <div className="border-border flex items-center space-x-4 border-t pt-4">
                           <img
                              src={testimonial.image}
                              alt={testimonial.name}
                              className="ring-primary/20 h-12 w-12 rounded-full object-cover ring-2"
                           />
                           <div>
                              <div className="text-foreground font-bold">
                                 {testimonial.name}
                              </div>
                              <div className="text-muted-foreground text-sm">
                                 {testimonial.role}
                              </div>
                              <div className="text-primary text-xs font-medium">
                                 {testimonial.company}
                              </div>
                           </div>
                        </div>
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
