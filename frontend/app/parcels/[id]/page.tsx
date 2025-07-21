import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Download, MessageSquare, Star } from 'lucide-react';
import { PDHeader } from '@/components/parcel/pd-header';
import { PDStatus } from '@/components/parcel/pd-status';
import { PaymentMethod, PaymentStatus, Status } from '@/types/parcel';
import { PDParcelInfo } from '@/components/parcel/pd-parcel-info';
import { PDTransitInfo } from '@/components/parcel/pd-transit-info';
import { PDPaymentInfo } from '@/components/parcel/pd-payment-info';
import { PDDeliveryAgent } from '@/components/parcel/pd-delivery-agent';
import { authFetch } from '@/lib/authFetch';
import { PDParcelAuthorInfo } from '@/components/parcel/pd-parcel-author-info';

const formatDate = (dateString: string) => {
   return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
   }).format(new Date(dateString));
};

async function ParcelDetailsPage({
   params,
}: {
   params: Promise<{ id: string }>;
}) {
   const parcelId = (await params).id;
   const response = await authFetch('/parcels/' + parcelId);
   const parcel = await response.json();
   if (!response.ok) {
      throw new Error(parcel.message);
   }

   return (
      <div className="bg-background min-h-screen">
         {/* Header */}
         <PDHeader />

         <div className="container mx-auto px-4 py-8">
            {/* Tracking Number & Status */}
            <PDStatus
               status={parcel.status as Status}
               trackingNumber={parcel.trackingNumber}
            />

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
               {/* Left Column */}
               <div className="space-y-6 lg:col-span-2">
                  {/* Parcel Information */}
                  <PDParcelInfo
                     deliveryType={parcel.deliveryType}
                     dimensions={parcel.dimensions}
                     parcelType={parcel.parcelType}
                     weight={parcel.weight}
                     estimatedDelivery={parcel.estimatedDelivery}
                     notes={parcel.notes}
                  />

                  <PDParcelAuthorInfo author={parcel.creator} />

                  <PDTransitInfo
                     deliveryAddress={parcel.deliveryAddress}
                     pickupAddress={parcel.pickupAddress}
                     recipient={parcel.recipient}
                     sender={parcel.sender}
                  />
               </div>

               {/* Right Column */}
               <div className="space-y-6">
                  {/* Payment Summary */}
                  <PDPaymentInfo
                     fees={parcel.fees}
                     paymentStatus={parcel.paymentStatus as PaymentStatus}
                     paymentMethod={parcel.paymentMethod as PaymentMethod}
                  />

                  {/* Delivery Agent */}
                  {parcel.deliveryAgent && (
                     <PDDeliveryAgent deliveryAgent={parcel.deliveryAgent} />
                  )}

                  {/* Actions */}
                  <Card className="animate-fade-in-up">
                     <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-3">
                        <Button className="w-full" variant="outline">
                           <Star className="mr-2 h-4 w-4" />
                           Rate Experience
                        </Button>
                        <Button className="w-full" variant="outline">
                           <MessageSquare className="mr-2 h-4 w-4" />
                           Report Issue
                        </Button>
                        <Button className="w-full" variant="outline">
                           <Download className="mr-2 h-4 w-4" />
                           Download Receipt
                        </Button>
                     </CardContent>
                  </Card>

                  {/* Timeline Info */}
                  <Card className="animate-fade-in-up">
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <Clock className="h-5 w-5" />
                           Timeline
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-3 text-sm">
                        <div className="flex justify-between">
                           <span className="text-muted-foreground">
                              Created
                           </span>
                           <span>{formatDate(parcel.createdAt)}</span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-muted-foreground">
                              Last Updated
                           </span>
                           <span>{formatDate(parcel.updatedAt)}</span>
                        </div>
                     </CardContent>
                  </Card>
               </div>
            </div>
         </div>
      </div>
   );
}

export default ParcelDetailsPage;
