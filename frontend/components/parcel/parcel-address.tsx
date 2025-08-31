import { MapPin, User } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useSession } from '@/hooks/use-session';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
   selectParcelBooking,
   setParcelBooking,
   type Address,
   type Person,
} from '@/redux/reducers/parcelBookingSlice';
import { useEffect, useRef } from 'react';

const ParcelAddress = () => {
   const { session, fullName } = useSession();
   const dispatch = useAppDispatch();
   const parcel = useAppSelector(selectParcelBooking);
   const hasInitialized = useRef(false);

   useEffect(() => {
      if (
         session &&
         fullName &&
         session.user.email &&
         !hasInitialized.current
      ) {
         dispatch(
            setParcelBooking({
               type: 'sender',
               data: {
                  name: fullName,
                  email: session.user.email,
                  phone: '',
               },
            }),
         );
         hasInitialized.current = true;
      }
   }, [dispatch, fullName, session]);

   // Optimized input handlers
   const handleSenderInput = (field: keyof Person, value: string) => {
      dispatch(
         setParcelBooking({
            type: 'sender',
            data: {
               ...parcel.sender,
               [field]: value,
            },
         }),
      );
   };

   const handleRecipientInput = (field: keyof Person, value: string) => {
      dispatch(
         setParcelBooking({
            type: 'recipient',
            data: {
               ...parcel.recipient,
               [field]: value,
            },
         }),
      );
   };

   const handlePickupAddressInput = (field: keyof Address, value: string) => {
      dispatch(
         setParcelBooking({
            type: 'pickupAddress',
            data: {
               ...parcel.pickupAddress,
               [field]: value,
            },
         }),
      );
   };

   const handleDeliveryAddressInput = (field: keyof Address, value: string) => {
      dispatch(
         setParcelBooking({
            type: 'deliveryAddress',
            data: {
               ...parcel.deliveryAddress,
               [field]: value,
            },
         }),
      );
   };

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
                     value={parcel.sender?.name || ''}
                     onChange={(e) => handleSenderInput('name', e.target.value)}
                  />
               </div>
               <div className="space-y-2">
                  <Label htmlFor="senderPhone">Phone Number *</Label>
                  <Input
                     id="senderPhone"
                     placeholder="+1 (555) 123-4567"
                     className="h-12"
                     value={parcel.sender?.phone || ''}
                     onChange={(e) =>
                        handleSenderInput('phone', e.target.value)
                     }
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
                  value={parcel.sender?.email || ''}
                  onChange={(e) => handleSenderInput('email', e.target.value)}
               />
            </div>

            <div className="space-y-4">
               <Label className="text-base font-semibold">
                  Pickup Address *
               </Label>
               <div className="space-y-4">
                  <Input
                     placeholder="Street Address"
                     className="h-12"
                     value={parcel.pickupAddress?.street || ''}
                     onChange={(e) =>
                        handlePickupAddressInput('street', e.target.value)
                     }
                  />
                  <div className="grid grid-cols-2 gap-4">
                     <Input
                        placeholder="City"
                        className="h-12"
                        value={parcel.pickupAddress?.city || ''}
                        onChange={(e) =>
                           handlePickupAddressInput('city', e.target.value)
                        }
                     />
                     <Input
                        placeholder="State"
                        className="h-12"
                        value={parcel.pickupAddress?.state || ''}
                        onChange={(e) =>
                           handlePickupAddressInput('state', e.target.value)
                        }
                     />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <Input
                        placeholder="ZIP Code"
                        className="h-12"
                        value={parcel.pickupAddress?.zip || ''}
                        onChange={(e) =>
                           handlePickupAddressInput('zip', e.target.value)
                        }
                     />
                     <Input
                        placeholder="Country"
                        className="h-12"
                        disabled
                        value={parcel.pickupAddress?.country || 'Bangladesh'}
                     />
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
                     value={parcel.recipient?.name || ''}
                     onChange={(e) =>
                        handleRecipientInput('name', e.target.value)
                     }
                  />
               </div>
               <div className="space-y-2">
                  <Label htmlFor="recipientPhone">Phone Number *</Label>
                  <Input
                     id="recipientPhone"
                     placeholder="+1 (555) 987-6543"
                     className="h-12"
                     value={parcel.recipient?.phone || ''}
                     onChange={(e) =>
                        handleRecipientInput('phone', e.target.value)
                     }
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
                  value={parcel.recipient?.email || ''}
                  onChange={(e) =>
                     handleRecipientInput('email', e.target.value)
                  }
               />
            </div>

            <div className="space-y-4">
               <Label className="text-base font-semibold">
                  Delivery Address *
               </Label>
               <div className="space-y-4">
                  <Input
                     placeholder="Street Address"
                     className="h-12"
                     value={parcel.deliveryAddress?.street || ''}
                     onChange={(e) =>
                        handleDeliveryAddressInput('street', e.target.value)
                     }
                  />
                  <div className="grid grid-cols-2 gap-4">
                     <Input
                        placeholder="City"
                        className="h-12"
                        value={parcel.deliveryAddress?.city || ''}
                        onChange={(e) =>
                           handleDeliveryAddressInput('city', e.target.value)
                        }
                     />
                     <Input
                        placeholder="State"
                        className="h-12"
                        value={parcel.deliveryAddress?.state || ''}
                        onChange={(e) =>
                           handleDeliveryAddressInput('state', e.target.value)
                        }
                     />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <Input
                        placeholder="ZIP Code"
                        className="h-12"
                        value={parcel.deliveryAddress?.zip || ''}
                        onChange={(e) =>
                           handleDeliveryAddressInput('zip', e.target.value)
                        }
                     />
                     <Input
                        placeholder="Country"
                        className="h-12"
                        disabled
                        value={parcel.deliveryAddress?.country || 'Bangladesh'}
                     />
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export { ParcelAddress };
