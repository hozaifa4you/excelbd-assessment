import { MapPin, User } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

const ParcelAddress = () => {
   return (
      <div className="space-y-8">
         {/* Sender Information */}
         <div className="space-y-6">
            <div className="flex items-center space-x-2">
               <User className="text-primary h-5 w-5" />
               <h3 className="text-lg font-semibold">Sender Information</h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
               <div className="space-y-2">
                  <Label htmlFor="senderName">Full Name *</Label>
                  <Input
                     id="senderName"
                     placeholder="John Doe"
                     className="h-12"
                  />
               </div>
               <div className="space-y-2">
                  <Label htmlFor="senderPhone">Phone Number *</Label>
                  <Input
                     id="senderPhone"
                     placeholder="+1 (555) 123-4567"
                     className="h-12"
                  />
               </div>
            </div>

            <div className="space-y-2">
               <Label htmlFor="senderEmail">Email Address</Label>
               <Input
                  id="senderEmail"
                  type="email"
                  placeholder="john@example.com"
                  className="h-12"
               />
            </div>

            <div className="space-y-4">
               <Label className="text-base font-semibold">
                  Pickup Address *
               </Label>
               <div className="space-y-4">
                  <Input placeholder="Street Address" className="h-12" />
                  <div className="grid grid-cols-2 gap-4">
                     <Input placeholder="City" className="h-12" />
                     <Input placeholder="State" className="h-12" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <Input placeholder="ZIP Code" className="h-12" />
                     <Select>
                        <SelectTrigger className="h-12">
                           <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="United States">
                              United States
                           </SelectItem>
                           <SelectItem value="Canada">Canada</SelectItem>
                           <SelectItem value="Mexico">Mexico</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
               </div>
            </div>
         </div>

         <Separator />

         {/* Recipient Information */}
         <div className="space-y-6">
            <div className="flex items-center space-x-2">
               <MapPin className="text-primary h-5 w-5" />
               <h3 className="text-lg font-semibold">Recipient Information</h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
               <div className="space-y-2">
                  <Label htmlFor="recipientName">Full Name *</Label>
                  <Input
                     id="recipientName"
                     placeholder="Jane Smith"
                     className="h-12"
                  />
               </div>
               <div className="space-y-2">
                  <Label htmlFor="recipientPhone">Phone Number *</Label>
                  <Input
                     id="recipientPhone"
                     placeholder="+1 (555) 987-6543"
                     className="h-12"
                  />
               </div>
            </div>

            <div className="space-y-2">
               <Label htmlFor="recipientEmail">Email Address</Label>
               <Input
                  id="recipientEmail"
                  type="email"
                  placeholder="jane@example.com"
                  className="h-12"
               />
            </div>

            <div className="space-y-4">
               <Label className="text-base font-semibold">
                  Delivery Address *
               </Label>
               <div className="space-y-4">
                  <Input placeholder="Street Address" className="h-12" />
                  <div className="grid grid-cols-2 gap-4">
                     <Input placeholder="City" className="h-12" />
                     <Input placeholder="State" className="h-12" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <Input placeholder="ZIP Code" className="h-12" />
                     <Select>
                        <SelectTrigger className="h-12">
                           <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="United States">
                              United States
                           </SelectItem>
                           <SelectItem value="Canada">Canada</SelectItem>
                           <SelectItem value="Mexico">Mexico</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export { ParcelAddress };
