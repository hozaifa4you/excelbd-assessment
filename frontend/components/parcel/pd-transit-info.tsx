import { Mail, MapPin, Phone, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Address, Person } from '@/types/parcel';

interface PDTransitInfoProps {
   pickupAddress: Address;
   deliveryAddress: Address;
   sender: Person;
   recipient: Person;
}

const formatAddress = (address: Address) => {
   return `${address.street}, ${address.city}, ${address.state} ${address.zip}, ${address.country}`;
};

const PDTransitInfo = ({
   deliveryAddress,
   pickupAddress,
   recipient,
   sender,
}: PDTransitInfoProps) => {
   return (
      <>
         {/* Addresses */}
         <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Pickup Address */}
            <Card className="animate-fade-in-up">
               <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                     <MapPin className="h-5 w-5 text-blue-600" />
                     Pickup Address
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <p className="text-sm leading-relaxed">
                     {formatAddress(pickupAddress)}
                  </p>
               </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card className="animate-fade-in-up">
               <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                     <MapPin className="h-5 w-5 text-green-600" />
                     Delivery Address
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <p className="text-sm leading-relaxed">
                     {formatAddress(deliveryAddress)}
                  </p>
               </CardContent>
            </Card>
         </div>

         {/* Contact Information */}
         <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Sender */}
            <Card className="animate-fade-in-up">
               <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                     <User className="h-5 w-5" />
                     Sender
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-3">
                  <div>
                     <p className="font-medium">{sender.name}</p>
                  </div>
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                     <Phone className="h-4 w-4" />
                     <span>{sender.phone}</span>
                  </div>
                  {sender.email && (
                     <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4" />
                        <span>{sender.email}</span>
                     </div>
                  )}
               </CardContent>
            </Card>

            {/* Recipient */}
            <Card className="animate-fade-in-up">
               <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                     <User className="h-5 w-5" />
                     Recipient
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-3">
                  <div>
                     <p className="font-medium">{recipient.name}</p>
                  </div>
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                     <Phone className="h-4 w-4" />
                     <span>{recipient.phone}</span>
                  </div>
                  {recipient.email && (
                     <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4" />
                        <span>{recipient.email}</span>
                     </div>
                  )}
               </CardContent>
            </Card>
         </div>
      </>
   );
};

export { PDTransitInfo };
