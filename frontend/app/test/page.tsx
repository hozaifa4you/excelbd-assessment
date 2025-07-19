'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowRight, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { ParcelDetails } from '@/components/parcel/parcel-details';
import { ParcelAddress } from '@/components/parcel/parcel-address';
import { DeliveryOptions } from '@/components/parcel/delivery-options';
import { ParcelReview } from '@/components/parcel/parcel-review';
import { BookingSuccess } from '@/components/parcel/booking-success';
import {
   selectStep,
   nextStep as nextStepStore,
   prevStep as prevStepStore,
   selectParcelBooking,
   setParcelBooking,
} from '@/redux/reducers/parcelBookingSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

export default function ParcelBooking() {
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState('');
   const [success, setSuccess] = useState(false);
   const stepsState = useAppSelector(selectStep);
   const dispatch = useAppDispatch();
   const parcel = useAppSelector(selectParcelBooking);

   const steps = [
      {
         number: 0,
         title: 'Parcel Details',
         description: 'Package information',
      },
      {
         number: 1,
         title: 'Addresses',
         description: 'Pickup & delivery locations',
      },
      {
         number: 2,
         title: 'Delivery Options',
         description: 'Speed & payment method',
      },
      {
         number: 3,
         title: 'Review & Book',
         description: 'Confirm your booking',
      },
   ];

   const deliveryOptions = [
      {
         value: 'standard',
         label: 'Standard Delivery',
         time: '3-5 business days',
         price: 12.99,
         description: 'Reliable delivery at an affordable price',
      },
      {
         value: 'express',
         label: 'Express Delivery',
         time: '1-2 business days',
         price: 24.99,
         description: 'Faster delivery for urgent packages',
      },
      {
         value: 'overnight',
         label: 'Overnight Delivery',
         time: 'Next business day',
         price: 39.99,
         description: 'Next day delivery guaranteed',
      },
      {
         value: 'same-day',
         label: 'Same Day Delivery',
         time: 'Within 6 hours',
         price: 59.99,
         description: 'Ultra-fast same day delivery',
      },
   ];

   const calculateDeliveryFee = () => {
      const selectedOption = deliveryOptions.find(
         (opt) => opt.value === parcel.deliveryType,
      );
      let baseFee = selectedOption?.price || 0;

      // Add weight-based pricing
      const weight = parcel.weight || 0;
      if (weight > 5) baseFee += (weight - 5) * 2;

      // Add insurance fee
      if (parcel.fees?.insuranceFee) baseFee += 5.99;

      // Add signature confirmation fee
      if (parcel.fees?.signatureFee) baseFee += 2.99;

      return baseFee;
   };

   const validateStep = (step: number): boolean => {
      setError('');

      switch (step) {
         case 0:
            if (!parcel.parcelType || !parcel.weight) {
               setError('Please fill in all required parcel details');
               return false;
            }
            break;
         case 1:
            if (
               !parcel?.sender?.name ||
               !parcel.sender.phone ||
               !parcel?.recipient?.name ||
               !parcel.recipient.phone ||
               !parcel.pickupAddress?.street ||
               !parcel.deliveryAddress?.street
            ) {
               setError('Please fill in all required address information');
               return false;
            }
            break;
         case 2:
            if (!parcel.deliveryType || !parcel.paymentMethod) {
               setError('Please select delivery speed and payment method');
               return false;
            }
            break;
      }
      return true;
   };

   const handleNextStep = () => {
      if (validateStep(stepsState)) {
         if (stepsState === 2) {
            const fee = calculateDeliveryFee();
            dispatch(
               setParcelBooking({
                  type: 'fees',
                  data: {
                     ...parcel.fees,
                     deliveryFee: fee,
                  },
               }),
            );

            const estimatedDate = new Date();
            switch (parcel.deliveryType) {
               case 'SAME_DAY':
                  estimatedDate.setHours(estimatedDate.getHours() + 12);
                  break;
               case 'OVERNIGHT':
                  estimatedDate.setDate(estimatedDate.getDate() + 1);
                  break;
               case 'EXPRESS':
                  estimatedDate.setDate(estimatedDate.getDate() + 2);
                  break;
               default:
                  estimatedDate.setDate(estimatedDate.getDate() + 5);
            }

            dispatch(
               setParcelBooking({
                  type: 'estimateDelivery',
                  data: estimatedDate.toLocaleDateString(),
               }),
            );
         }

         dispatch(nextStepStore());
      }
   };

   const prevStep = () => {
      dispatch(prevStepStore());
   };

   const handleSubmit = async () => {
      if (!validateStep(4)) return;

      setIsLoading(true);
      setError('');

      // Simulate API call
      setTimeout(() => {
         setSuccess(true);
         setIsLoading(false);
      }, 2000);
   };

   if (success) {
      return <BookingSuccess />;
   }

   return (
      <div className="bg-background relative min-h-screen overflow-hidden">
         {/* Background Gradients */}
         <div className="from-background via-primary/5 to-primary/10 absolute inset-0 bg-gradient-to-br"></div>
         <div className="via-accent/30 to-secondary/20 absolute inset-0 bg-gradient-to-tr from-transparent"></div>

         {/* Main Content */}
         <div className="relative z-10 py-8 lg:py-12">
            <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
               {/* Page Header */}
               <div className="mb-8 space-y-4 text-center">
                  <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                     Book Your Parcel
                  </h1>
                  <p className="text-muted-foreground text-lg">
                     Fast, secure, and reliable delivery service
                  </p>
               </div>

               {/* Progress Steps */}
               <div className="mb-8">
                  <div className="mb-4 flex items-center justify-between">
                     {steps.map((step, index) => (
                        <div key={step.number} className="flex items-center">
                           <div
                              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                                 stepsState >= step.number
                                    ? 'bg-primary border-primary text-primary-foreground'
                                    : 'border-muted-foreground/30 text-muted-foreground'
                              }`}
                           >
                              {stepsState > step.number ? (
                                 <CheckCircle className="h-5 w-5" />
                              ) : (
                                 <span className="text-sm font-semibold">
                                    {step.number}
                                 </span>
                              )}
                           </div>
                           {index < steps.length - 1 && (
                              <div
                                 className={`mx-2 hidden h-0.5 w-16 sm:block lg:w-24 ${
                                    stepsState > step.number
                                       ? 'bg-primary'
                                       : 'bg-muted-foreground/30'
                                 }`}
                              />
                           )}
                        </div>
                     ))}
                  </div>
                  <div className="text-center">
                     <h2 className="text-xl font-bold">
                        {steps[stepsState].title}
                     </h2>
                     <p className="text-muted-foreground">
                        {steps[stepsState].description}
                     </p>
                  </div>
               </div>

               {/* Error Alert */}
               {error && (
                  <Alert variant="destructive" className="mb-6">
                     <AlertCircle className="h-4 w-4" />
                     <AlertDescription>{error}</AlertDescription>
                  </Alert>
               )}

               {/* Form Steps */}
               <Card className="bg-card/80 border-0 shadow-2xl backdrop-blur">
                  <CardContent className="p-6 lg:p-8">
                     {/* Step 1: Parcel Details */}
                     {stepsState === 0 && <ParcelDetails />}

                     {/* Step 2: Addresses */}
                     {stepsState === 1 && <ParcelAddress />}

                     {/* Step 3: Delivery Options */}
                     {stepsState === 2 && <DeliveryOptions />}

                     {/* Step 4: Review & Book */}
                     {stepsState === 3 && <ParcelReview />}

                     {/* Navigation Buttons */}
                     <div className="border-border flex items-center justify-between border-t pt-8">
                        <Button
                           variant="outline"
                           onClick={prevStep}
                           disabled={stepsState === 1}
                           className="h-12 px-6"
                        >
                           <ArrowLeft className="mr-2 h-4 w-4" />
                           Previous
                        </Button>

                        {stepsState < 4 ? (
                           <Button
                              onClick={handleNextStep}
                              className="h-12 px-6"
                           >
                              Next
                              <ArrowRight className="ml-2 h-4 w-4" />
                           </Button>
                        ) : (
                           <Button
                              onClick={handleSubmit}
                              disabled={isLoading}
                              className="h-12 px-8"
                           >
                              {isLoading ? (
                                 <div className="flex items-center space-x-2">
                                    <div className="border-primary-foreground/30 border-t-primary-foreground h-4 w-4 animate-spin rounded-full border-2"></div>
                                    <span>Booking...</span>
                                 </div>
                              ) : (
                                 <div className="flex items-center space-x-2">
                                    <span>Confirm Booking</span>
                                    <CheckCircle className="h-4 w-4" />
                                 </div>
                              )}
                           </Button>
                        )}
                     </div>
                  </CardContent>
               </Card>
            </div>
         </div>
      </div>
   );
}
