import React, { memo, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { AssignableParcel, DeliveryType } from '@/types/parcel';
import { Calendar, MapPin, Phone } from 'lucide-react';

interface ParcelCardProps {
   parcel: AssignableParcel;
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

const getPriorityColor = (priority: DeliveryType) => {
   switch (priority) {
      case 'SAME_DAY':
         return 'text-red-600 bg-red-50 border-red-200';
      case 'EXPRESS':
         return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'OVERNIGHT':
         return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'STANDARD':
         return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
         return 'text-gray-600 bg-gray-50 border-gray-200';
   }
};

export const getPriority = (priority: DeliveryType) => {
   switch (priority) {
      case 'SAME_DAY':
         return 'HIGH';
      case 'EXPRESS':
         return 'MEDIUM';
      case 'OVERNIGHT':
         return 'LOW';
      case 'STANDARD':
         return 'LOW';
   }
};

const ParcelCard = memo(
   ({ parcel, selectedParcels, handleSelectedParcel }: ParcelCardProps) => {
      const isSelected = selectedParcels.includes(parcel.id);

      const handleCheckboxChange = useCallback(() => {
         handleSelectedParcel(parcel.id);
      }, [parcel.id, handleSelectedParcel]);

      // Memoize formatted date
      const formattedDate = React.useMemo(
         () => formatDate(parcel.estimatedDelivery.toString()),
         [parcel.estimatedDelivery],
      );

      // Memoize priority color and badge
      const priorityColor = React.useMemo(
         () => getPriorityColor(parcel.deliveryType),
         [parcel.deliveryType],
      );

      const priority = React.useMemo(
         () => getPriority(parcel.deliveryType),
         [parcel.deliveryType],
      );

      return (
         <div
            className={`rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-sm ${
               isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/30'
            }`}
         >
            <div className="flex items-start gap-4">
               <Checkbox
                  checked={isSelected}
                  onCheckedChange={handleCheckboxChange}
                  className="mt-1"
               />

               <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <code className="bg-muted rounded px-2 py-1 font-mono text-sm font-semibold">
                           {parcel.trackingNumber}
                        </code>
                        <Badge className={`text-xs ${priorityColor}`}>
                           {priority}
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
                              {formattedDate}
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      );
   },
);

ParcelCard.displayName = 'ParcelCard';

export { ParcelCard };
