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

// Mock data based on the Prisma schema
const mockParcelData = {
   id: '652f4e5a8b123456789abcde',
   trackingNumber: 'PX24567890123',
   parcelType: 'Electronics',
   weight: 2.5,
   dimensions: '30cm x 20cm x 15cm',
   status: 'IN_TRANSIT',
   paymentStatus: 'PAID',
   paymentMethod: 'CARD',
   estimatedDelivery: '2024-01-25T14:30:00Z',
   deliveryType: 'EXPRESS',
   deliveredAt: null,
   notes: 'Handle with care - fragile electronics inside. Signature required upon delivery.',
   sender: {
      name: 'Sarah Johnson',
      phone: '+1 (555) 123-4567',
      email: 'sarah.johnson@email.com',
   },
   recipient: {
      name: 'Michael Chen',
      phone: '+1 (555) 987-6543',
      email: 'michael.chen@email.com',
   },
   pickupAddress: {
      street: '1234 Tech Valley Drive',
      city: 'San Francisco',
      state: 'CA',
      country: 'United States',
      zip: '94105',
   },
   deliveryAddress: {
      street: '5678 Innovation Boulevard, Apt 15B',
      city: 'Austin',
      state: 'TX',
      country: 'United States',
      zip: '73301',
   },
   fees: {
      price: 299.99,
      deliveryFee: 15.5,
      handlingFee: 5.0,
      insuranceFee: 12.0,
      signatureFee: 3.5,
   },
   createdAt: '2024-01-20T10:15:00Z',
   updatedAt: '2024-01-23T16:45:00Z',
   deliveryAgent: {
      firstName: 'David',
      lastName: 'Rodriguez',
      phone: '+1 (555) 456-7890',
   },
};

const formatDate = (dateString: string) => {
   return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
   }).format(new Date(dateString));
};

function ParcelDetailsPage() {
   const parcel = mockParcelData;

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
