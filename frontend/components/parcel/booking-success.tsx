import { CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { selectSuccessResponse } from '@/redux/reducers/parcelBookingSlice';
import { useAppSelector } from '@/redux/hooks';
import Image from 'next/image';

const BookingSuccess = () => {
   const successResponse = useAppSelector(selectSuccessResponse);

   return (
      <div className="bg-background relative min-h-screen overflow-hidden">
         {/* Success Content */}
         <div className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
            <Card className="bg-card/80 w-full max-w-2xl border-0 shadow-2xl backdrop-blur">
               <CardContent className="space-y-8 p-8 text-center lg:p-12">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                     <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                  </div>

                  <div className="space-y-4">
                     <h2 className="text-3xl font-bold lg:text-4xl">
                        Booking Confirmed!
                     </h2>
                     <p className="text-muted-foreground text-lg">
                        Your parcel has been successfully booked for delivery.
                     </p>
                  </div>

                  <div className="bg-muted/50 space-y-4 rounded-xl p-6">
                     <div className="flex items-center justify-between">
                        <span className="font-medium">Tracking Number:</span>
                        <Badge
                           variant="secondary"
                           className="px-4 py-2 text-lg"
                        >
                           {successResponse?.trackingNumber}
                        </Badge>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="font-medium">Parcel ID:</span>
                        <span className="text-primary font-semibold">
                           {successResponse?.parcelId}Tk
                        </span>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="font-medium">Total Cost:</span>
                        <span className="text-primary text-2xl font-bold">
                           {successResponse?.cost}Tk
                        </span>
                     </div>
                  </div>

                  <div className="flex flex-col items-center justify-center">
                     <Image
                        src={successResponse?.qrCode ?? ''}
                        alt="Quicko"
                        width={300}
                        height={300}
                     />
                     <p className="text-muted-foreground text-sm">
                        Scan the QR code to track your parcel
                     </p>
                  </div>

                  <div className="space-y-3">
                     <Button className="h-12 w-full text-lg">
                        Back to Homepage
                     </Button>
                     <Button variant="outline" className="h-12 w-full text-lg">
                        Track Your Package
                     </Button>
                  </div>

                  <p className="text-muted-foreground text-sm">
                     We&apos;ve sent a confirmation email with tracking details
                     to {'senderEmail'}
                  </p>
               </CardContent>
            </Card>
         </div>
      </div>
   );
};

export { BookingSuccess };
