import { AlertCircle, Calendar, Package, Ruler, Weight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface PDParcelInfoProps {
   parcelType: string;
   weight: number;
   deliveryType: string;
   dimensions: string;
   estimatedDelivery?: string;
   notes?: string;
}

const formatDate = (dateString: string) => {
   return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
   }).format(new Date(dateString));
};

const PDParcelInfo = ({
   deliveryType,
   dimensions,
   parcelType,
   weight,
   estimatedDelivery,
   notes,
}: PDParcelInfoProps) => {
   return (
      <Card className="animate-fade-in-up">
         <CardHeader>
            <CardTitle className="flex items-center gap-2">
               <Package className="h-5 w-5" />
               Parcel Information
            </CardTitle>
         </CardHeader>
         <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
               <div className="space-y-3">
                  <div>
                     <p className="text-muted-foreground text-sm">Type</p>
                     <p className="font-medium">{parcelType}</p>
                  </div>
                  <div>
                     <p className="text-muted-foreground flex items-center gap-1 text-sm">
                        <Weight className="h-3 w-3" />
                        Weight
                     </p>
                     <p className="font-medium">{weight} kg</p>
                  </div>
               </div>
               <div className="space-y-3">
                  <div>
                     <p className="text-muted-foreground text-sm">
                        Delivery Type
                     </p>
                     <Badge variant="secondary">{deliveryType}</Badge>
                  </div>
                  <div>
                     <p className="text-muted-foreground flex items-center gap-1 text-sm">
                        <Ruler className="h-3 w-3" />
                        Dimensions
                     </p>
                     <p className="font-medium">{dimensions}</p>
                  </div>
               </div>
            </div>

            {estimatedDelivery && (
               <div className="border-t pt-4">
                  <p className="text-muted-foreground flex items-center gap-1 text-sm">
                     <Calendar className="h-3 w-3" />
                     Estimated Delivery
                  </p>
                  <p className="text-lg font-medium">
                     {formatDate(estimatedDelivery)}
                  </p>
               </div>
            )}

            {notes && (
               <div className="border-t pt-4">
                  <p className="text-muted-foreground flex items-center gap-1 text-sm">
                     <AlertCircle className="h-3 w-3" />
                     Special Instructions
                  </p>
                  <p className="bg-muted mt-1 rounded-md p-3 text-sm">
                     {notes}
                  </p>
               </div>
            )}
         </CardContent>
      </Card>
   );
};

export { PDParcelInfo };
