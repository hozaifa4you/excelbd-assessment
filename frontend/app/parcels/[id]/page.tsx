'use client';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
   Package,
   MapPin,
   User,
   Phone,
   Mail,
   Calendar,
   DollarSign,
   Truck,
   CheckCircle,
   Clock,
   AlertCircle,
   Copy,
   Download,
   MessageSquare,
   Star,
   Weight,
   Ruler,
} from 'lucide-react';
import { PDHeader } from '@/components/parcel/pd-header';

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
      name: 'David Rodriguez',
      phone: '+1 (555) 456-7890',
   },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatAddress = (address: any) => {
   return `${address.street}, ${address.city}, ${address.state} ${address.zip}, ${address.country}`;
};

const formatCurrency = (amount: number) => {
   return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
   }).format(amount);
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

   const totalAmount =
      (parcel.fees.price || 0) +
      parcel.fees.deliveryFee +
      (parcel.fees.handlingFee || 0) +
      (parcel.fees.insuranceFee || 0) +
      (parcel.fees.signatureFee || 0);

   return (
      <div className="bg-background min-h-screen">
         {/* Header */}
         <PDHeader />

         <div className="container mx-auto px-4 py-8">
            {/* Tracking Number & Status */}
            {/*  */}

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
               {/* Left Column */}
               <div className="space-y-6 lg:col-span-2">
                  {/* Parcel Information */}
                  <Card className="animate-fade-in-up">
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <Package className="h-5 w-5" />
                           Parcel Information
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                           <div className="space-y-3">
                              <div>
                                 <p className="text-muted-foreground text-sm">
                                    Type
                                 </p>
                                 <p className="font-medium">
                                    {parcel.parcelType}
                                 </p>
                              </div>
                              <div>
                                 <p className="text-muted-foreground flex items-center gap-1 text-sm">
                                    <Weight className="h-3 w-3" />
                                    Weight
                                 </p>
                                 <p className="font-medium">
                                    {parcel.weight} kg
                                 </p>
                              </div>
                           </div>
                           <div className="space-y-3">
                              <div>
                                 <p className="text-muted-foreground text-sm">
                                    Delivery Type
                                 </p>
                                 <Badge variant="secondary">
                                    {parcel.deliveryType}
                                 </Badge>
                              </div>
                              <div>
                                 <p className="text-muted-foreground flex items-center gap-1 text-sm">
                                    <Ruler className="h-3 w-3" />
                                    Dimensions
                                 </p>
                                 <p className="font-medium">
                                    {parcel.dimensions}
                                 </p>
                              </div>
                           </div>
                        </div>

                        {parcel.estimatedDelivery && (
                           <div className="border-t pt-4">
                              <p className="text-muted-foreground flex items-center gap-1 text-sm">
                                 <Calendar className="h-3 w-3" />
                                 Estimated Delivery
                              </p>
                              <p className="text-lg font-medium">
                                 {formatDate(parcel.estimatedDelivery)}
                              </p>
                           </div>
                        )}

                        {parcel.notes && (
                           <div className="border-t pt-4">
                              <p className="text-muted-foreground flex items-center gap-1 text-sm">
                                 <AlertCircle className="h-3 w-3" />
                                 Special Instructions
                              </p>
                              <p className="bg-muted mt-1 rounded-md p-3 text-sm">
                                 {parcel.notes}
                              </p>
                           </div>
                        )}
                     </CardContent>
                  </Card>

                  {/* Addresses */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                     {/* Pickup Address */}
                     <Card className="animate-fade-in-up">
                        <CardHeader>
                           <CardTitle className="flex items-center gap-2">
                              <MapPin className="h-5 w-5 text-blue-600" />
                              Pickup Address
                           </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <p className="text-sm leading-relaxed">
                              {formatAddress(parcel.pickupAddress)}
                           </p>
                        </CardContent>
                     </Card>

                     {/* Delivery Address */}
                     <Card className="animate-fade-in-up">
                        <CardHeader>
                           <CardTitle className="flex items-center gap-2">
                              <MapPin className="h-5 w-5 text-green-600" />
                              Delivery Address
                           </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <p className="text-sm leading-relaxed">
                              {formatAddress(parcel.deliveryAddress)}
                           </p>
                        </CardContent>
                     </Card>
                  </div>

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                     {/* Sender */}
                     <Card className="animate-fade-in-up">
                        <CardHeader>
                           <CardTitle className="flex items-center gap-2">
                              <User className="h-5 w-5" />
                              Sender
                           </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                           <div>
                              <p className="font-medium">
                                 {parcel.sender.name}
                              </p>
                           </div>
                           <div className="text-muted-foreground flex items-center gap-2 text-sm">
                              <Phone className="h-4 w-4" />
                              <span>{parcel.sender.phone}</span>
                           </div>
                           {parcel.sender.email && (
                              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                                 <Mail className="h-4 w-4" />
                                 <span>{parcel.sender.email}</span>
                              </div>
                           )}
                        </CardContent>
                     </Card>

                     {/* Recipient */}
                     <Card className="animate-fade-in-up">
                        <CardHeader>
                           <CardTitle className="flex items-center gap-2">
                              <User className="h-5 w-5" />
                              Recipient
                           </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                           <div>
                              <p className="font-medium">
                                 {parcel.recipient.name}
                              </p>
                           </div>
                           <div className="text-muted-foreground flex items-center gap-2 text-sm">
                              <Phone className="h-4 w-4" />
                              <span>{parcel.recipient.phone}</span>
                           </div>
                           {parcel.recipient.email && (
                              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                                 <Mail className="h-4 w-4" />
                                 <span>{parcel.recipient.email}</span>
                              </div>
                           )}
                        </CardContent>
                     </Card>
                  </div>
               </div>

               {/* Right Column */}
               <div className="space-y-6">
                  {/* Payment Summary */}
                  <Card className="animate-fade-in-up">
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <DollarSign className="h-5 w-5" />
                           Payment Summary
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="space-y-3">
                           {parcel.fees.price && (
                              <div className="flex justify-between">
                                 <span className="text-sm">Item Value</span>
                                 <span className="font-medium">
                                    {formatCurrency(parcel.fees.price)}
                                 </span>
                              </div>
                           )}
                           <div className="flex justify-between">
                              <span className="text-sm">Delivery Fee</span>
                              <span className="font-medium">
                                 {formatCurrency(parcel.fees.deliveryFee)}
                              </span>
                           </div>
                           {parcel.fees.handlingFee && (
                              <div className="flex justify-between">
                                 <span className="text-sm">Handling Fee</span>
                                 <span className="font-medium">
                                    {formatCurrency(parcel.fees.handlingFee)}
                                 </span>
                              </div>
                           )}
                           {parcel.fees.insuranceFee && (
                              <div className="flex justify-between">
                                 <span className="text-sm">Insurance</span>
                                 <span className="font-medium">
                                    {formatCurrency(parcel.fees.insuranceFee)}
                                 </span>
                              </div>
                           )}
                           {parcel.fees.signatureFee && (
                              <div className="flex justify-between">
                                 <span className="text-sm">
                                    Signature Required
                                 </span>
                                 <span className="font-medium">
                                    {formatCurrency(parcel.fees.signatureFee)}
                                 </span>
                              </div>
                           )}
                        </div>

                        <Separator />

                        <div className="flex justify-between text-lg font-semibold">
                           <span>Total</span>
                           <span>{formatCurrency(totalAmount)}</span>
                        </div>

                        <div className="pt-2">
                           <div className="flex items-center justify-between">
                              <span className="text-muted-foreground text-sm">
                                 Payment Status
                              </span>
                              <Badge
                                 variant={
                                    parcel.paymentStatus === 'PAID'
                                       ? 'default'
                                       : 'secondary'
                                 }
                              >
                                 {parcel.paymentStatus}
                              </Badge>
                           </div>
                           {parcel.paymentMethod && (
                              <div className="mt-2 flex items-center justify-between">
                                 <span className="text-muted-foreground text-sm">
                                    Payment Method
                                 </span>
                                 <span className="text-sm font-medium">
                                    {parcel.paymentMethod}
                                 </span>
                              </div>
                           )}
                        </div>
                     </CardContent>
                  </Card>

                  {/* Delivery Agent */}
                  {parcel.deliveryAgent && (
                     <Card className="animate-fade-in-up">
                        <CardHeader>
                           <CardTitle className="flex items-center gap-2">
                              <Truck className="h-5 w-5" />
                              Delivery Agent
                           </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                           <div className="flex items-center gap-3">
                              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                                 <User className="text-primary h-5 w-5" />
                              </div>
                              <div>
                                 <p className="font-medium">
                                    {parcel.deliveryAgent.name}
                                 </p>
                                 <p className="text-muted-foreground text-sm">
                                    Delivery Specialist
                                 </p>
                              </div>
                           </div>

                           <div className="text-muted-foreground flex items-center gap-2 text-sm">
                              <Phone className="h-4 w-4" />
                              <span>{parcel.deliveryAgent.phone}</span>
                           </div>

                           <Button className="mt-4 w-full" variant="outline">
                              <Phone className="mr-2 h-4 w-4" />
                              Contact Agent
                           </Button>
                        </CardContent>
                     </Card>
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
