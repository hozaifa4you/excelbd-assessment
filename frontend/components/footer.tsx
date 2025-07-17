import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
   Package,
   Mail,
   Phone,
   MapPin,
   Facebook,
   Twitter,
   Instagram,
   Linkedin,
   Send,
} from 'lucide-react';

export function Footer() {
   const services = [
      'Express Delivery',
      'Same Day Delivery',
      'International Shipping',
      'Bulk Shipping',
      'Document Delivery',
      'Fragile Items',
   ];

   const company = [
      'About Us',
      'Our Team',
      'Careers',
      'Press',
      'Blog',
      'Contact',
   ];

   const support = [
      'Help Center',
      'Track Package',
      'Shipping Calculator',
      'Returns',
      'Claims',
      'Insurance',
   ];

   const legal = [
      'Terms of Service',
      'Privacy Policy',
      'Cookie Policy',
      'Data Protection',
      'Refund Policy',
      'Disclaimer',
   ];

   return (
      <footer className="bg-muted/50 border-border border-t">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Main Footer Content */}
            <div className="py-16 sm:py-20">
               <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5 lg:gap-12">
                  {/* Company Info */}
                  <div className="space-y-6 lg:col-span-2">
                     <div className="flex items-center space-x-3">
                        <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-xl">
                           <Package className="text-primary-foreground h-6 w-6" />
                        </div>
                        <span className="text-foreground text-2xl font-bold">
                           Quicko
                        </span>
                     </div>

                     <p className="text-muted-foreground max-w-md leading-relaxed">
                        Your trusted partner for fast, secure, and reliable
                        package delivery. We connect people and businesses
                        across the nation with our comprehensive logistics
                        network and cutting-edge technology.
                     </p>

                     <div className="space-y-3">
                        <div className="flex items-center space-x-3 text-sm">
                           <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                              <Mail className="text-primary h-4 w-4" />
                           </div>
                           <span className="text-muted-foreground">
                              hello@quicko.com
                           </span>
                        </div>
                        <div className="flex items-center space-x-3 text-sm">
                           <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                              <Phone className="text-primary h-4 w-4" />
                           </div>
                           <span className="text-muted-foreground">
                              +1 (555) 123-4567
                           </span>
                        </div>
                        <div className="flex items-center space-x-3 text-sm">
                           <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                              <MapPin className="text-primary h-4 w-4" />
                           </div>
                           <span className="text-muted-foreground">
                              123 Delivery Street, City, State 12345
                           </span>
                        </div>
                     </div>
                  </div>

                  {/* Services */}
                  <div className="space-y-6">
                     <h3 className="text-foreground text-lg font-bold">
                        Services
                     </h3>
                     <nav className="space-y-3">
                        {services.map((service) => (
                           <a
                              key={service}
                              href="#"
                              className="text-muted-foreground hover:text-primary block text-sm transition-colors duration-200"
                           >
                              {service}
                           </a>
                        ))}
                     </nav>
                  </div>

                  {/* Company */}
                  <div className="space-y-6">
                     <h3 className="text-foreground text-lg font-bold">
                        Company
                     </h3>
                     <nav className="space-y-3">
                        {company.map((item) => (
                           <a
                              key={item}
                              href="#"
                              className="text-muted-foreground hover:text-primary block text-sm transition-colors duration-200"
                           >
                              {item}
                           </a>
                        ))}
                     </nav>
                  </div>

                  {/* Support */}
                  <div className="space-y-6">
                     <h3 className="text-foreground text-lg font-bold">
                        Support
                     </h3>
                     <nav className="space-y-3">
                        {support.map((item) => (
                           <a
                              key={item}
                              href="#"
                              className="text-muted-foreground hover:text-primary block text-sm transition-colors duration-200"
                           >
                              {item}
                           </a>
                        ))}
                     </nav>
                  </div>
               </div>
            </div>

            {/* Newsletter Section */}
            <div className="border-border border-t py-8">
               <div className="bg-card/50 rounded-2xl p-8 backdrop-blur lg:p-12">
                  <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
                     <div className="space-y-4">
                        <h3 className="text-card-foreground text-2xl font-bold lg:text-3xl">
                           Stay Updated with Quicko
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                           Subscribe to our newsletter for shipping tips,
                           special offers, service updates, and exclusive deals
                           for our valued customers.
                        </p>
                     </div>
                     <div className="space-y-4">
                        <div className="flex flex-col gap-3 sm:flex-row">
                           <Input
                              placeholder="Enter your email address"
                              className="h-12 flex-1"
                              type="email"
                           />
                           <Button className="h-12 px-6">
                              <Send className="mr-2 h-4 w-4" />
                              Subscribe
                           </Button>
                        </div>
                        <p className="text-muted-foreground text-xs">
                           By subscribing, you agree to our Privacy Policy and
                           consent to receive updates.
                        </p>
                     </div>
                  </div>
               </div>
            </div>

            <Separator className="my-8" />

            {/* Bottom Footer */}
            <div className="py-8">
               <div className="flex flex-col items-center justify-between space-y-6 lg:flex-row lg:space-y-0">
                  {/* Legal Links */}
                  <div className="text-muted-foreground flex flex-wrap items-center justify-center gap-6 text-sm lg:justify-start">
                     {legal.map((item) => (
                        <a
                           key={item}
                           href="#"
                           className="hover:text-primary transition-colors duration-200"
                        >
                           {item}
                        </a>
                     ))}
                  </div>

                  {/* Social Links */}
                  <div className="flex items-center space-x-4">
                     {[
                        { icon: Facebook, href: '#' },
                        { icon: Twitter, href: '#' },
                        { icon: Instagram, href: '#' },
                        { icon: Linkedin, href: '#' },
                     ].map(({ icon: Icon, href }, index) => (
                        <a
                           key={index}
                           href={href}
                           className="bg-muted hover:bg-primary hover:text-primary-foreground flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200"
                        >
                           <Icon className="h-5 w-5" />
                        </a>
                     ))}
                  </div>
               </div>

               {/* Copyright */}
               <div className="text-muted-foreground border-border mt-8 border-t pt-8 text-center text-sm">
                  <p>
                     &copy; 2025 Quicko. All rights reserved. Built with ❤️ for
                     better deliveries.
                  </p>
               </div>
            </div>
         </div>
      </footer>
   );
}
