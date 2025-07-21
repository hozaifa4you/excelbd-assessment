import { ParcelType } from '@/app/admin-panel/assign/page';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, MapPin, Phone } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

interface ParcelCardProps {
   parcel: ParcelType;
   selectedParcels: string[];
   handleSelectedParcel: (parcelId: string) => void;
}

const formatDate = (dateString: string) => {
   return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
   }).format(new Date(dateString));
};

const getPriorityColor = (priority: string) => {
   switch (priority) {
      case 'URGENT':
         return 'text-red-600 bg-red-50 border-red-200';
      case 'HIGH':
         return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'MEDIUM':
         return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'LOW':
         return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
         return 'text-gray-600 bg-gray-50 border-gray-200';
   }
};

const ParcelCard = ({
   parcel,
   selectedParcels,
   handleSelectedParcel,
}: ParcelCardProps) => {
   return (
      <div
         key={parcel.id}
         className={`rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-sm ${
            selectedParcels.includes(parcel.id)
               ? 'border-primary bg-primary/5'
               : 'border-border hover:border-primary/30'
         }`}
      >
         <div className="flex items-start gap-4">
            <Checkbox
               checked={selectedParcels.includes(parcel.id)}
               onCheckedChange={() => handleSelectedParcel(parcel.id)}
               className="mt-1"
            />

            <div className="min-w-0 flex-1">
               <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <code className="bg-muted rounded px-2 py-1 font-mono text-sm font-semibold">
                        {parcel.trackingNumber}
                     </code>
                     <Badge
                        className={`text-xs ${getPriorityColor(parcel.priority)}`}
                     >
                        {parcel.priority}
                     </Badge>
                  </div>
                  <Badge variant="outline" className="text-xs">
                     {parcel.deliveryType}
                  </Badge>
               </div>

               <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                     <div>
                        <p className="text-sm font-medium">
                           {parcel.parcelType}
                        </p>
                        <p className="text-muted-foreground text-xs">
                           Weight: {parcel.weight} kg
                        </p>
                     </div>
                     <div>
                        <p className="text-sm font-medium">
                           {parcel.recipient.name}
                        </p>
                        <p className="text-muted-foreground flex items-center gap-1 text-xs">
                           <Phone className="h-3 w-3" />
                           {parcel.recipient.phone}
                        </p>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <div>
                        <p className="text-muted-foreground flex items-center gap-1 text-xs">
                           <MapPin className="h-3 w-3" />
                           Delivery Address
                        </p>
                        <p className="text-sm">
                           {parcel.deliveryAddress.street},{' '}
                           {parcel.deliveryAddress.city}
                        </p>
                     </div>
                     <div>
                        <p className="text-muted-foreground flex items-center gap-1 text-xs">
                           <Calendar className="h-3 w-3" />
                           Est. Delivery
                        </p>
                        <p className="text-sm font-medium">
                           {formatDate(parcel.estimatedDelivery)}
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export { ParcelCard };
