import { Calculator, MapPin, Package, Truck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useAppSelector } from '@/redux/hooks';
import { selectParcelBooking } from '@/redux/reducers/parcelBookingSlice';

const ParcelReview = () => {
   const parcel = useAppSelector(selectParcelBooking);

   return (
      <div className="space-y-8">
         <div className="space-y-2 text-center">
            <h3 className="text-2xl font-bold">Review Your Booking</h3>
            <p className="text-muted-foreground">
               Please review all details before confirming
            </p>
         </div>

         {/* Booking Summary */}
         <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
               {/* Parcel Details */}
               <div className="bg-muted/50 space-y-4 rounded-xl p-6">
                  <h4 className="flex items-center space-x-2 font-semibold">
                     <Package className="h-4 w-4" />
                     <span>Parcel Details</span>
                  </h4>
                  <div className="space-y-2 text-sm">
                     <div className="flex justify-between">
                        <span>Type:</span>
                        <span className="font-medium capitalize">
                           {parcel.parcelType}
                        </span>
                     </div>
                     <div className="flex justify-between">
                        <span>Weight:</span>
                        <span className="font-medium">{parcel.weight} kg</span>
                     </div>
                     {true && (
                        <div className="flex justify-between">
                           <span>Dimensions:</span>
                           <span className="font-medium">
                              {parcel.dimensions
                                 ? `${parcel.dimensions} cm`
                                 : 'Not mention'}
                           </span>
                        </div>
                     )}
                  </div>
               </div>

               {/* Addresses */}
               <div className="bg-muted/50 space-y-4 rounded-xl p-6">
                  <h4 className="flex items-center space-x-2 font-semibold">
                     <MapPin className="h-4 w-4" />
                     <span>Addresses</span>
                  </h4>
                  <div className="space-y-4 text-sm">
                     <address>
                        <div className="text-primary mb-1 font-medium">
                           From:
                        </div>
                        <strong>{parcel.sender?.name}</strong>
                        <div>{parcel.sender?.phone}</div>
                        <div>{parcel.pickupAddress?.street}</div>
                        <div>
                           {parcel.pickupAddress?.city},{' '}
                           {parcel.pickupAddress?.state}{' '}
                           {parcel.pickupAddress?.zip}
                        </div>
                     </address>
                     <address>
                        <div className="text-primary mb-1 font-medium">To:</div>
                        <strong>{parcel.recipient?.name}</strong>
                        <div>{parcel.recipient?.phone}</div>
                        <div>{parcel.deliveryAddress?.street}</div>
                        <div>
                           {parcel.deliveryAddress?.city},{' '}
                           {parcel.deliveryAddress?.state}{' '}
                           {parcel.deliveryAddress?.zip}
                        </div>
                     </address>
                  </div>
               </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
               {/* Delivery Options */}
               <div className="bg-muted/50 space-y-4 rounded-xl p-6">
                  <h4 className="flex items-center space-x-2 font-semibold">
                     <Truck className="h-4 w-4" />
                     <span>Delivery Options</span>
                  </h4>
                  <div className="space-y-2 text-sm">
                     <div className="flex justify-between">
                        <span>Speed:</span>
                        <span className="font-medium capitalize">
                           {parcel.deliveryType}
                        </span>
                     </div>
                     <div className="flex justify-between">
                        <span>Estimated Delivery:</span>
                        <span className="text-primary font-medium">
                           {parcel.estimateDelivery}
                        </span>
                     </div>
                     <div className="flex justify-between">
                        <span>Payment:</span>
                        <span className="font-medium">
                           {parcel.paymentStatus}
                        </span>
                     </div>
                  </div>
               </div>

               {/* Cost Breakdown */}
               <div className="bg-primary/5 border-primary/20 space-y-4 rounded-xl border p-6">
                  <h4 className="flex items-center space-x-2 font-semibold">
                     <Calculator className="h-4 w-4" />
                     <span>Cost Breakdown</span>
                  </h4>
                  <div className="space-y-2 text-sm">
                     <div className="flex justify-between">
                        <span>Product Price:</span>
                        <span>{parcel.fees?.price ?? 0}Tk</span>
                     </div>
                     <div className="flex justify-between">
                        <span>Delivery Fee:</span>
                        <span>{parcel.fees?.deliveryFee ?? 0}Tk</span>
                     </div>
                     <div className="flex justify-between">
                        <span>Insurance:</span>
                        <span>{parcel.fees?.insuranceFee ?? 0}Tk</span>
                     </div>
                     <div className="flex justify-between">
                        <span>Signature Required:</span>
                        <span>{parcel.fees?.signatureFee ?? 0}Tk</span>
                     </div>
                     <Separator />
                     <div className="text-primary flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span>
                           {(
                              (parcel.fees?.price ?? 0) +
                              (parcel.fees?.deliveryFee ?? 0) +
                              (parcel.fees?.insuranceFee ?? 0) +
                              (parcel.fees?.signatureFee ?? 0) +
                              (parcel.fees?.handlingFee ?? 0)
                           ).toFixed(2)}
                           Tk
                        </span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export { ParcelReview };
