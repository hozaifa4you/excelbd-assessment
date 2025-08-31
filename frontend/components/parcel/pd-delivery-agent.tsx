import { Phone, Truck, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { DeliveryAgent } from '@/types/user';

interface PDDeliveryAgentProps {
   deliveryAgent: DeliveryAgent;
}

const PDDeliveryAgent = ({ deliveryAgent }: PDDeliveryAgentProps) => {
   return (
      <Card className="animate-fade-in-up">
         <CardHeader>
            <CardTitle className="flex items-center gap-2">
               <Truck className="h-5 w-5" />
               Delivery Agent
            </CardTitle>
         </CardHeader>
         <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
               <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                  <User className="text-primary h-5 w-5" />
               </div>
               <div>
                  <p className="font-medium">
                     {deliveryAgent.firstName + ' ' + deliveryAgent.lastName}
                  </p>
                  <p className="text-muted-foreground text-sm">
                     Delivery Specialist
                  </p>
               </div>
            </div>

            <div className="text-muted-foreground flex items-center gap-2 text-sm">
               <Phone className="h-4 w-4" />
               <span>{deliveryAgent.phone}</span>
            </div>

            <Button className="mt-4 w-full" variant="outline">
               <Phone className="mr-2 h-4 w-4" />
               Contact Agent
            </Button>
         </CardContent>
      </Card>
   );
};

export { PDDeliveryAgent };
