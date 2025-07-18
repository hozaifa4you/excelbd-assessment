import { Calculator, MapPin, Package, Truck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const ParcelReview = () => {
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
                           parcelType
                        </span>
                     </div>
                     <div className="flex justify-between">
                        <span>Weight:</span>
                        <span className="font-medium">weight kg</span>
                     </div>
                     {true && (
                        <div className="flex justify-between">
                           <span>Dimensions:</span>
                           <span className="font-medium">dimensions cm</span>
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
                     <div>
                        <div className="text-primary mb-1 font-medium">
                           From:
                        </div>
                        <div>Sender name</div>
                        <div>{'street'}</div>
                        <div>
                           {'city'}, {'state'} {'zip'}
                        </div>
                     </div>
                     <div>
                        <div className="text-primary mb-1 font-medium">To:</div>
                        <div>{'recipientName'}</div>
                        <div>{'street'}</div>
                        <div>
                           {'city'}, {'state'} {'zip'}
                        </div>
                     </div>
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
                           {'deliverySpeed'}
                        </span>
                     </div>
                     <div className="flex justify-between">
                        <span>Estimated Delivery:</span>
                        <span className="text-primary font-medium">
                           {'estimatedDelivery'}
                        </span>
                     </div>
                     <div className="flex justify-between">
                        <span>Payment:</span>
                        <span className="font-medium">
                           {true ? 'Cash on Delivery' : 'Pay Now'}
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
                        <span>Base Delivery Fee:</span>
                        <span>$ base price</span>
                     </div>
                     {parseFloat('6') > 5 && (
                        <div className="flex justify-between">
                           <span>
                              Extra Weight ({(parseFloat('6') - 5).toFixed(1)}{' '}
                              kg):
                           </span>
                           <span>
                              ${((parseFloat('6') - 5) * 2).toFixed(2)}
                           </span>
                        </div>
                     )}
                     {true && (
                        <div className="flex justify-between">
                           <span>Insurance:</span>
                           <span>$5.99</span>
                        </div>
                     )}
                     {true && (
                        <div className="flex justify-between">
                           <span>Signature Required:</span>
                           <span>$2.99</span>
                        </div>
                     )}
                     <Separator />
                     <div className="text-primary flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span>${'total'}</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export { ParcelReview };
