'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import {
   Package,
   MapPin,
   User,
   Phone,
   Mail,
   Truck,
   QrCode,
   BarChart3,
   CheckCircle,
   X,
   Download,
   Printer as Print,
   Share2,
} from 'lucide-react';
import { Address, DeliveryType, Person } from '@/types/parcel';

export interface ParcelData {
   deliveryAddress: Address;
   pickupAddress: Address;
   recipient: Person;
   sender: Person;
   parcelType: string;
   deliveryType: DeliveryType;
   trackingNumber: string;
   barcode: string;
   barcodeUrl: string;
   trackingQrCode: string;
}

interface ParcelBookingDetailsProps {
   data: ParcelData;
}

const deliveryTypeColors = {
   EXPRESS: 'text-blue-600 bg-blue-50 border-blue-200',
   SAME_DAY: 'text-purple-600 bg-purple-50 border-purple-200',
   STANDARD: 'text-green-600 bg-green-50 border-green-200',
   OVERNIGHT: 'text-orange-600 bg-orange-50 border-orange-200',
};

const deliveryTypeOptions = [
   { value: 'EXPRESS', label: 'Express Delivery' },
   { value: 'SAME_DAY', label: 'Same Day Delivery' },
   { value: 'STANDARD', label: 'Standard Delivery' },
   { value: 'OVERNIGHT', label: 'Overnight Delivery' },
];

export default function ParcelBookingDetails({
   data,
}: ParcelBookingDetailsProps) {
   const [selectedDeliveryType, setSelectedDeliveryType] = useState(
      data.deliveryType,
   );
   const [isSubmitting, setIsSubmitting] = useState(false);

   const handleSubmit = async () => {
      setIsSubmitting(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsSubmitting(false);
      console.log(
         'Parcel booking submitted with delivery type:',
         selectedDeliveryType,
      );
   };

   const handleCancel = () => {
      console.log('Parcel booking cancelled');
   };

   const formatAddress = (address: typeof data.deliveryAddress) => {
      return `${address.street}, ${address.city}, ${address.state} ${address.zip || ''}, ${address.country}`;
   };

   return (
      <div className="bg-background min-h-screen">
         {/* Header */}
         <div className="bg-card border-b">
            <div className="container mx-auto px-4 py-4 lg:py-6">
               <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3 lg:gap-4">
                     <div className="bg-primary/10 rounded-xl p-3">
                        <Package className="text-primary h-6 w-6 lg:h-8 lg:w-8" />
                     </div>
                     <div>
                        <h1 className="text-xl font-bold tracking-tight lg:text-3xl">
                           Parcel Booking Details
                        </h1>
                        <p className="text-muted-foreground text-sm lg:text-base">
                           Review and manage parcel information
                        </p>
                     </div>
                  </div>
                  <div className="flex gap-2 lg:gap-3">
                     <Button variant="outline" size="sm">
                        <Print className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Print</span>
                     </Button>
                     <Button variant="outline" size="sm">
                        <Share2 className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Share</span>
                     </Button>
                  </div>
               </div>
            </div>
         </div>

         <div className="container mx-auto px-4 py-6 lg:py-8">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
               {/* Left Column - Main Details */}
               <div className="space-y-6 lg:col-span-2">
                  {/* Tracking Information */}
                  <Card className="animate-fade-in-up">
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <Package className="h-5 w-5" />
                           Tracking Information
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                           <div>
                              <label className="text-muted-foreground text-sm font-medium">
                                 Tracking Number
                              </label>
                              <div className="mt-1">
                                 <code className="bg-muted block rounded-md px-3 py-2 font-mono text-lg font-bold">
                                    {data.trackingNumber}
                                 </code>
                              </div>
                           </div>
                           <div>
                              <label className="text-muted-foreground text-sm font-medium">
                                 Parcel Type
                              </label>
                              <p className="mt-1 text-lg font-semibold">
                                 {data.parcelType}
                              </p>
                           </div>
                        </div>

                        <div>
                           <label className="text-muted-foreground text-sm font-medium">
                              Delivery Type
                           </label>
                           <div className="mt-2">
                              <Select
                                 value={selectedDeliveryType}
                                 // onValueChange={setSelectedDeliveryType}
                              >
                                 <SelectTrigger className="w-full sm:w-64">
                                    <SelectValue />
                                 </SelectTrigger>
                                 <SelectContent>
                                    {deliveryTypeOptions.map((option) => (
                                       <SelectItem
                                          key={option.value}
                                          value={option.value}
                                       >
                                          {option.label}
                                       </SelectItem>
                                    ))}
                                 </SelectContent>
                              </Select>
                           </div>
                        </div>
                     </CardContent>
                  </Card>

                  {/* Address Information */}
                  <Card className="animate-fade-in-up">
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <MapPin className="h-5 w-5" />
                           Address Information
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-6">
                        {/* Pickup Address */}
                        <div>
                           <div className="mb-3 flex items-center gap-2">
                              <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                              <h3 className="font-semibold">Pickup Address</h3>
                           </div>
                           <div className="bg-muted/50 rounded-lg p-4">
                              <p className="text-sm leading-relaxed">
                                 {formatAddress(data.pickupAddress)}
                              </p>
                           </div>
                        </div>

                        <div className="flex justify-center">
                           <div className="bg-border h-8 w-px"></div>
                        </div>

                        {/* Delivery Address */}
                        <div>
                           <div className="mb-3 flex items-center gap-2">
                              <div className="h-3 w-3 rounded-full bg-green-500"></div>
                              <h3 className="font-semibold">
                                 Delivery Address
                              </h3>
                           </div>
                           <div className="bg-muted/50 rounded-lg p-4">
                              <p className="text-sm leading-relaxed">
                                 {formatAddress(data.deliveryAddress)}
                              </p>
                           </div>
                        </div>
                     </CardContent>
                  </Card>

                  {/* Contact Information */}
                  <Card className="animate-fade-in-up">
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <User className="h-5 w-5" />
                           Contact Information
                        </CardTitle>
                     </CardHeader>
                     <CardContent>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                           {/* Sender */}
                           <div>
                              <h3 className="mb-3 flex items-center gap-2 font-semibold">
                                 <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                 Sender
                              </h3>
                              <div className="space-y-2">
                                 <div className="flex items-center gap-2 text-sm">
                                    <User className="text-muted-foreground h-4 w-4" />
                                    <span className="font-medium">
                                       {data.sender.name}
                                    </span>
                                 </div>
                                 <div className="flex items-center gap-2 text-sm">
                                    <Phone className="text-muted-foreground h-4 w-4" />
                                    <span>{data.sender.phone}</span>
                                 </div>
                                 {data.sender.email && (
                                    <div className="flex items-center gap-2 text-sm">
                                       <Mail className="text-muted-foreground h-4 w-4" />
                                       <span className="truncate">
                                          {data.sender.email}
                                       </span>
                                    </div>
                                 )}
                              </div>
                           </div>

                           {/* Recipient */}
                           <div>
                              <h3 className="mb-3 flex items-center gap-2 font-semibold">
                                 <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                 Recipient
                              </h3>
                              <div className="space-y-2">
                                 <div className="flex items-center gap-2 text-sm">
                                    <User className="text-muted-foreground h-4 w-4" />
                                    <span className="font-medium">
                                       {data.recipient.name}
                                    </span>
                                 </div>
                                 <div className="flex items-center gap-2 text-sm">
                                    <Phone className="text-muted-foreground h-4 w-4" />
                                    <span>{data.recipient.phone}</span>
                                 </div>
                                 {data.recipient.email && (
                                    <div className="flex items-center gap-2 text-sm">
                                       <Mail className="text-muted-foreground h-4 w-4" />
                                       <span className="truncate">
                                          {data.recipient.email}
                                       </span>
                                    </div>
                                 )}
                              </div>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               </div>

               {/* Right Column - Barcode & Actions */}
               <div className="space-y-6">
                  {/* Delivery Type Badge */}
                  <Card className="animate-fade-in-up">
                     <CardContent className="p-6 text-center">
                        <Badge
                           className={`px-4 py-2 text-sm ${deliveryTypeColors[selectedDeliveryType]}`}
                        >
                           <Truck className="mr-2 h-4 w-4" />
                           {
                              deliveryTypeOptions.find(
                                 (opt) => opt.value === selectedDeliveryType,
                              )?.label
                           }
                        </Badge>
                     </CardContent>
                  </Card>

                  {/* Barcode */}
                  <Card className="animate-fade-in-up">
                     <CardHeader>
                        <CardTitle className="flex items-center justify-center gap-2 text-center">
                           <BarChart3 className="h-5 w-5" />
                           Barcode
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4 text-center">
                        <div className="rounded-lg border bg-white p-4">
                           <img
                              src={data.barcodeUrl}
                              alt="Barcode"
                              className="mx-auto w-full max-w-64"
                           />
                        </div>
                        <p className="text-muted-foreground font-mono text-xs">
                           {data.trackingNumber}
                        </p>
                        <Button variant="outline" size="sm" className="w-full">
                           <Download className="mr-2 h-4 w-4" />
                           Download Barcode
                        </Button>
                     </CardContent>
                  </Card>

                  {/* QR Code */}
                  <Card className="animate-fade-in-up">
                     <CardHeader>
                        <CardTitle className="flex items-center justify-center gap-2 text-center">
                           <QrCode className="h-5 w-5" />
                           QR Code
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4 text-center">
                        <div className="inline-block rounded-lg border bg-white p-4">
                           <img
                              src={data.trackingQrCode}
                              alt="QR Code"
                              className="mx-auto h-32 w-32"
                           />
                        </div>
                        <p className="text-muted-foreground text-xs">
                           Scan to track parcel
                        </p>
                        <Button variant="outline" size="sm" className="w-full">
                           <Download className="mr-2 h-4 w-4" />
                           Download QR Code
                        </Button>
                     </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <Card className="animate-fade-in-up">
                     <CardContent className="space-y-3 p-6">
                        <Button
                           onClick={handleSubmit}
                           disabled={isSubmitting}
                           className="w-full"
                           size="lg"
                        >
                           {isSubmitting ? (
                              <>
                                 <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                 Processing...
                              </>
                           ) : (
                              <>
                                 <CheckCircle className="mr-2 h-4 w-4" />
                                 Submit Booking
                              </>
                           )}
                        </Button>
                        <Button
                           variant="outline"
                           onClick={handleCancel}
                           disabled={isSubmitting}
                           className="w-full"
                           size="lg"
                        >
                           <X className="mr-2 h-4 w-4" />
                           Cancel Booking
                        </Button>
                     </CardContent>
                  </Card>
               </div>
            </div>
         </div>
      </div>
   );
}
