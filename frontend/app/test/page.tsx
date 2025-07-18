'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import {
   Package,
   MapPin,
   User,
   CreditCard,
   Truck,
   ArrowRight,
   ArrowLeft,
   CheckCircle,
   AlertCircle,
   Calculator,
   Shield,
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

interface BookingProps {
   onBackToHome: () => void;
}

interface Address {
   street: string;
   city: string;
   state: string;
   country: string;
   zip: string;
}

interface ParcelData {
   // Parcel Details
   parcelType: string;
   weight: string;
   dimensions: string;
   notes: string;

   // Sender Details
   senderName: string;
   senderPhone: string;
   senderEmail: string;
   pickupAddress: Address;

   // Recipient Details
   recipientName: string;
   recipientPhone: string;
   recipientEmail: string;
   deliveryAddress: Address;

   // Delivery Options
   deliverySpeed: string;
   paymentMethod: string;
   estimatedDelivery: string;
   deliveryFee: number;

   // Additional Options
   insurance: boolean;
   signature: boolean;
   fragile: boolean;
}

const initialFormData: ParcelData = {
   parcelType: '',
   weight: '',
   dimensions: '',
   notes: '',
   senderName: '',
   senderPhone: '',
   senderEmail: '',
   pickupAddress: {
      street: '',
      city: '',
      state: '',
      country: 'United States',
      zip: '',
   },
   recipientName: '',
   recipientPhone: '',
   recipientEmail: '',
   deliveryAddress: {
      street: '',
      city: '',
      state: '',
      country: 'United States',
      zip: '',
   },
   deliverySpeed: '',
   paymentMethod: '',
   estimatedDelivery: '',
   deliveryFee: 0,
   insurance: false,
   signature: false,
   fragile: false,
};

export default function ParcelBooking({ onBackToHome }: BookingProps) {
   const [currentStep, setCurrentStep] = useState(1);
   const [formData, setFormData] = useState<ParcelData>(initialFormData);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState('');
   const [success, setSuccess] = useState(false);

   const steps = [
      {
         number: 1,
         title: 'Parcel Details',
         description: 'Package information',
      },
      {
         number: 2,
         title: 'Addresses',
         description: 'Pickup & delivery locations',
      },
      {
         number: 3,
         title: 'Delivery Options',
         description: 'Speed & payment method',
      },
      {
         number: 4,
         title: 'Review & Book',
         description: 'Confirm your booking',
      },
   ];

   const parcelTypes = [
      { value: 'document', label: 'Documents', icon: '📄' },
      { value: 'package', label: 'Package', icon: '📦' },
      { value: 'fragile', label: 'Fragile Items', icon: '🔸' },
      { value: 'electronics', label: 'Electronics', icon: '💻' },
      { value: 'clothing', label: 'Clothing', icon: '👕' },
      { value: 'food', label: 'Food Items', icon: '🍕' },
      { value: 'other', label: 'Other', icon: '📋' },
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

   const updateFormData = (field: string, value: unknown) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
   };

   const updateAddress = (
      type: 'pickupAddress' | 'deliveryAddress',
      field: string,
      value: string,
   ) => {
      setFormData((prev) => ({
         ...prev,
         [type]: { ...prev[type], [field]: value },
      }));
   };

   const calculateDeliveryFee = () => {
      const selectedOption = deliveryOptions.find(
         (opt) => opt.value === formData.deliverySpeed,
      );
      let baseFee = selectedOption?.price || 0;

      // Add weight-based pricing
      const weight = parseFloat(formData.weight) || 0;
      if (weight > 5) baseFee += (weight - 5) * 2;

      // Add insurance fee
      if (formData.insurance) baseFee += 5.99;

      // Add signature confirmation fee
      if (formData.signature) baseFee += 2.99;

      return baseFee;
   };

   const validateStep = (step: number): boolean => {
      setError('');

      switch (step) {
         case 1:
            if (!formData.parcelType || !formData.weight) {
               setError('Please fill in all required parcel details');
               return false;
            }
            break;
         case 2:
            if (
               !formData.senderName ||
               !formData.senderPhone ||
               !formData.recipientName ||
               !formData.recipientPhone ||
               !formData.pickupAddress.street ||
               !formData.deliveryAddress.street
            ) {
               setError('Please fill in all required address information');
               return false;
            }
            break;
         case 3:
            if (!formData.deliverySpeed || !formData.paymentMethod) {
               setError('Please select delivery speed and payment method');
               return false;
            }
            break;
      }
      return true;
   };

   const nextStep = () => {
      if (validateStep(currentStep)) {
         if (currentStep === 3) {
            const fee = calculateDeliveryFee();
            updateFormData('deliveryFee', fee);

            // Calculate estimated delivery
            const selectedOption = deliveryOptions.find(
               (opt) => opt.value === formData.deliverySpeed,
            );
            const estimatedDate = new Date();
            switch (formData.deliverySpeed) {
               case 'same-day':
                  estimatedDate.setHours(estimatedDate.getHours() + 6);
                  break;
               case 'overnight':
                  estimatedDate.setDate(estimatedDate.getDate() + 1);
                  break;
               case 'express':
                  estimatedDate.setDate(estimatedDate.getDate() + 2);
                  break;
               default:
                  estimatedDate.setDate(estimatedDate.getDate() + 4);
            }
            updateFormData(
               'estimatedDelivery',
               estimatedDate.toLocaleDateString(),
            );
         }
         setCurrentStep((prev) => Math.min(prev + 1, 4));
      }
   };

   const prevStep = () => {
      setCurrentStep((prev) => Math.max(prev - 1, 1));
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
      return (
         <div className="bg-background relative min-h-screen overflow-hidden">
            {/* Background Gradients */}
            <div className="from-background via-primary/5 to-primary/10 absolute inset-0 bg-gradient-to-br"></div>
            <div className="via-accent/30 to-secondary/20 absolute inset-0 bg-gradient-to-tr from-transparent"></div>

            {/* Header */}
            <header className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 relative z-10 border-b backdrop-blur">
               <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex h-16 items-center justify-between">
                     <button
                        onClick={onBackToHome}
                        className="flex items-center space-x-3 transition-opacity hover:opacity-80"
                     >
                        <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-xl">
                           <Package className="text-primary-foreground h-6 w-6" />
                        </div>
                        <span className="text-foreground text-2xl font-bold">
                           Quicko
                        </span>
                     </button>
                     <ThemeToggle />
                  </div>
               </div>
            </header>

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
                           Your parcel has been successfully booked for
                           delivery.
                        </p>
                     </div>

                     <div className="bg-muted/50 space-y-4 rounded-xl p-6">
                        <div className="flex items-center justify-between">
                           <span className="font-medium">Tracking Number:</span>
                           <Badge
                              variant="secondary"
                              className="px-4 py-2 text-lg"
                           >
                              QK
                              {Math.random()
                                 .toString(36)
                                 .substr(2, 9)
                                 .toUpperCase()}
                           </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                           <span className="font-medium">
                              Estimated Delivery:
                           </span>
                           <span className="text-primary font-semibold">
                              {formData.estimatedDelivery}
                           </span>
                        </div>
                        <div className="flex items-center justify-between">
                           <span className="font-medium">Total Cost:</span>
                           <span className="text-primary text-2xl font-bold">
                              ${formData.deliveryFee.toFixed(2)}
                           </span>
                        </div>
                     </div>

                     <div className="space-y-3">
                        <Button
                           onClick={onBackToHome}
                           className="h-12 w-full text-lg"
                        >
                           Back to Homepage
                        </Button>
                        <Button
                           variant="outline"
                           className="h-12 w-full text-lg"
                        >
                           Track Your Package
                        </Button>
                     </div>

                     <p className="text-muted-foreground text-sm">
                        We&apos;ve sent a confirmation email with tracking
                        details to {formData.senderEmail}
                     </p>
                  </CardContent>
               </Card>
            </div>
         </div>
      );
   }

   return (
      <div className="bg-background relative min-h-screen overflow-hidden">
         {/* Background Gradients */}
         <div className="from-background via-primary/5 to-primary/10 absolute inset-0 bg-gradient-to-br"></div>
         <div className="via-accent/30 to-secondary/20 absolute inset-0 bg-gradient-to-tr from-transparent"></div>

         {/* Header */}
         <header className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 relative z-10 border-b backdrop-blur">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
               <div className="flex h-16 items-center justify-between">
                  <button
                     onClick={onBackToHome}
                     className="flex items-center space-x-3 transition-opacity hover:opacity-80"
                  >
                     <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-xl">
                        <Package className="text-primary-foreground h-6 w-6" />
                     </div>
                     <span className="text-foreground text-2xl font-bold">
                        Quicko
                     </span>
                  </button>
                  <ThemeToggle />
               </div>
            </div>
         </header>

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
                                 currentStep >= step.number
                                    ? 'bg-primary border-primary text-primary-foreground'
                                    : 'border-muted-foreground/30 text-muted-foreground'
                              }`}
                           >
                              {currentStep > step.number ? (
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
                                    currentStep > step.number
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
                        {steps[currentStep - 1].title}
                     </h2>
                     <p className="text-muted-foreground">
                        {steps[currentStep - 1].description}
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
                     {currentStep === 1 && (
                        <div className="space-y-6">
                           <div className="space-y-4">
                              <Label className="text-base font-semibold">
                                 What are you shipping? *
                              </Label>
                              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                                 {parcelTypes.map((type) => (
                                    <button
                                       key={type.value}
                                       type="button"
                                       onClick={() =>
                                          updateFormData(
                                             'parcelType',
                                             type.value,
                                          )
                                       }
                                       className={`rounded-xl border-2 p-4 text-center transition-all hover:scale-105 ${
                                          formData.parcelType === type.value
                                             ? 'border-primary bg-primary/10 text-primary'
                                             : 'border-border hover:border-primary/50'
                                       }`}
                                    >
                                       <div className="mb-2 text-2xl">
                                          {type.icon}
                                       </div>
                                       <div className="text-sm font-medium">
                                          {type.label}
                                       </div>
                                    </button>
                                 ))}
                              </div>
                           </div>

                           <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                              <div className="space-y-2">
                                 <Label htmlFor="weight">Weight (kg) *</Label>
                                 <Input
                                    id="weight"
                                    type="number"
                                    step="0.1"
                                    placeholder="0.5"
                                    value={formData.weight}
                                    onChange={(e) =>
                                       updateFormData('weight', e.target.value)
                                    }
                                    className="h-12"
                                 />
                              </div>
                              <div className="space-y-2">
                                 <Label htmlFor="dimensions">
                                    Dimensions (L×W×H cm)
                                 </Label>
                                 <Input
                                    id="dimensions"
                                    placeholder="20×15×10"
                                    value={formData.dimensions}
                                    onChange={(e) =>
                                       updateFormData(
                                          'dimensions',
                                          e.target.value,
                                       )
                                    }
                                    className="h-12"
                                 />
                              </div>
                           </div>

                           <div className="space-y-4">
                              <Label className="text-base font-semibold">
                                 Special Handling
                              </Label>
                              <div className="space-y-3">
                                 <div className="flex items-center space-x-2">
                                    <Checkbox
                                       id="fragile"
                                       checked={formData.fragile}
                                       onCheckedChange={(checked) =>
                                          updateFormData('fragile', checked)
                                       }
                                    />
                                    <Label
                                       htmlFor="fragile"
                                       className="flex items-center space-x-2"
                                    >
                                       <span>Fragile - Handle with care</span>
                                       <Badge variant="secondary">+$2.99</Badge>
                                    </Label>
                                 </div>
                              </div>
                           </div>

                           <div className="space-y-2">
                              <Label htmlFor="notes">
                                 Special Instructions
                              </Label>
                              <Textarea
                                 id="notes"
                                 placeholder="Any special delivery instructions..."
                                 value={formData.notes}
                                 onChange={(e) =>
                                    updateFormData('notes', e.target.value)
                                 }
                                 className="min-h-[100px]"
                              />
                           </div>
                        </div>
                     )}

                     {/* Step 2: Addresses */}
                     {currentStep === 2 && (
                        <div className="space-y-8">
                           {/* Sender Information */}
                           <div className="space-y-6">
                              <div className="flex items-center space-x-2">
                                 <User className="text-primary h-5 w-5" />
                                 <h3 className="text-lg font-semibold">
                                    Sender Information
                                 </h3>
                              </div>

                              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                 <div className="space-y-2">
                                    <Label htmlFor="senderName">
                                       Full Name *
                                    </Label>
                                    <Input
                                       id="senderName"
                                       placeholder="John Doe"
                                       value={formData.senderName}
                                       onChange={(e) =>
                                          updateFormData(
                                             'senderName',
                                             e.target.value,
                                          )
                                       }
                                       className="h-12"
                                    />
                                 </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="senderPhone">
                                       Phone Number *
                                    </Label>
                                    <Input
                                       id="senderPhone"
                                       placeholder="+1 (555) 123-4567"
                                       value={formData.senderPhone}
                                       onChange={(e) =>
                                          updateFormData(
                                             'senderPhone',
                                             e.target.value,
                                          )
                                       }
                                       className="h-12"
                                    />
                                 </div>
                              </div>

                              <div className="space-y-2">
                                 <Label htmlFor="senderEmail">
                                    Email Address
                                 </Label>
                                 <Input
                                    id="senderEmail"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={formData.senderEmail}
                                    onChange={(e) =>
                                       updateFormData(
                                          'senderEmail',
                                          e.target.value,
                                       )
                                    }
                                    className="h-12"
                                 />
                              </div>

                              <div className="space-y-4">
                                 <Label className="text-base font-semibold">
                                    Pickup Address *
                                 </Label>
                                 <div className="space-y-4">
                                    <Input
                                       placeholder="Street Address"
                                       value={formData.pickupAddress.street}
                                       onChange={(e) =>
                                          updateAddress(
                                             'pickupAddress',
                                             'street',
                                             e.target.value,
                                          )
                                       }
                                       className="h-12"
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                       <Input
                                          placeholder="City"
                                          value={formData.pickupAddress.city}
                                          onChange={(e) =>
                                             updateAddress(
                                                'pickupAddress',
                                                'city',
                                                e.target.value,
                                             )
                                          }
                                          className="h-12"
                                       />
                                       <Input
                                          placeholder="State"
                                          value={formData.pickupAddress.state}
                                          onChange={(e) =>
                                             updateAddress(
                                                'pickupAddress',
                                                'state',
                                                e.target.value,
                                             )
                                          }
                                          className="h-12"
                                       />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                       <Input
                                          placeholder="ZIP Code"
                                          value={formData.pickupAddress.zip}
                                          onChange={(e) =>
                                             updateAddress(
                                                'pickupAddress',
                                                'zip',
                                                e.target.value,
                                             )
                                          }
                                          className="h-12"
                                       />
                                       <Select
                                          value={formData.pickupAddress.country}
                                          onValueChange={(value) =>
                                             updateAddress(
                                                'pickupAddress',
                                                'country',
                                                value,
                                             )
                                          }
                                       >
                                          <SelectTrigger className="h-12">
                                             <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                             <SelectItem value="United States">
                                                United States
                                             </SelectItem>
                                             <SelectItem value="Canada">
                                                Canada
                                             </SelectItem>
                                             <SelectItem value="Mexico">
                                                Mexico
                                             </SelectItem>
                                          </SelectContent>
                                       </Select>
                                    </div>
                                 </div>
                              </div>
                           </div>

                           <Separator />

                           {/* Recipient Information */}
                           <div className="space-y-6">
                              <div className="flex items-center space-x-2">
                                 <MapPin className="text-primary h-5 w-5" />
                                 <h3 className="text-lg font-semibold">
                                    Recipient Information
                                 </h3>
                              </div>

                              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                 <div className="space-y-2">
                                    <Label htmlFor="recipientName">
                                       Full Name *
                                    </Label>
                                    <Input
                                       id="recipientName"
                                       placeholder="Jane Smith"
                                       value={formData.recipientName}
                                       onChange={(e) =>
                                          updateFormData(
                                             'recipientName',
                                             e.target.value,
                                          )
                                       }
                                       className="h-12"
                                    />
                                 </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="recipientPhone">
                                       Phone Number *
                                    </Label>
                                    <Input
                                       id="recipientPhone"
                                       placeholder="+1 (555) 987-6543"
                                       value={formData.recipientPhone}
                                       onChange={(e) =>
                                          updateFormData(
                                             'recipientPhone',
                                             e.target.value,
                                          )
                                       }
                                       className="h-12"
                                    />
                                 </div>
                              </div>

                              <div className="space-y-2">
                                 <Label htmlFor="recipientEmail">
                                    Email Address
                                 </Label>
                                 <Input
                                    id="recipientEmail"
                                    type="email"
                                    placeholder="jane@example.com"
                                    value={formData.recipientEmail}
                                    onChange={(e) =>
                                       updateFormData(
                                          'recipientEmail',
                                          e.target.value,
                                       )
                                    }
                                    className="h-12"
                                 />
                              </div>

                              <div className="space-y-4">
                                 <Label className="text-base font-semibold">
                                    Delivery Address *
                                 </Label>
                                 <div className="space-y-4">
                                    <Input
                                       placeholder="Street Address"
                                       value={formData.deliveryAddress.street}
                                       onChange={(e) =>
                                          updateAddress(
                                             'deliveryAddress',
                                             'street',
                                             e.target.value,
                                          )
                                       }
                                       className="h-12"
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                       <Input
                                          placeholder="City"
                                          value={formData.deliveryAddress.city}
                                          onChange={(e) =>
                                             updateAddress(
                                                'deliveryAddress',
                                                'city',
                                                e.target.value,
                                             )
                                          }
                                          className="h-12"
                                       />
                                       <Input
                                          placeholder="State"
                                          value={formData.deliveryAddress.state}
                                          onChange={(e) =>
                                             updateAddress(
                                                'deliveryAddress',
                                                'state',
                                                e.target.value,
                                             )
                                          }
                                          className="h-12"
                                       />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                       <Input
                                          placeholder="ZIP Code"
                                          value={formData.deliveryAddress.zip}
                                          onChange={(e) =>
                                             updateAddress(
                                                'deliveryAddress',
                                                'zip',
                                                e.target.value,
                                             )
                                          }
                                          className="h-12"
                                       />
                                       <Select
                                          value={
                                             formData.deliveryAddress.country
                                          }
                                          onValueChange={(value) =>
                                             updateAddress(
                                                'deliveryAddress',
                                                'country',
                                                value,
                                             )
                                          }
                                       >
                                          <SelectTrigger className="h-12">
                                             <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                             <SelectItem value="United States">
                                                United States
                                             </SelectItem>
                                             <SelectItem value="Canada">
                                                Canada
                                             </SelectItem>
                                             <SelectItem value="Mexico">
                                                Mexico
                                             </SelectItem>
                                          </SelectContent>
                                       </Select>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     )}

                     {/* Step 3: Delivery Options */}
                     {currentStep === 3 && (
                        <div className="space-y-8">
                           <div className="space-y-6">
                              <div className="flex items-center space-x-2">
                                 <Truck className="text-primary h-5 w-5" />
                                 <h3 className="text-lg font-semibold">
                                    Delivery Speed
                                 </h3>
                              </div>

                              <RadioGroup
                                 value={formData.deliverySpeed}
                                 onValueChange={(value) =>
                                    updateFormData('deliverySpeed', value)
                                 }
                                 className="space-y-4"
                              >
                                 {deliveryOptions.map((option) => (
                                    <div
                                       key={option.value}
                                       className="relative"
                                    >
                                       <div
                                          className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                                             formData.deliverySpeed ===
                                             option.value
                                                ? 'border-primary bg-primary/5'
                                                : 'border-border hover:border-primary/50'
                                          }`}
                                       >
                                          <div className="flex items-center space-x-3">
                                             <RadioGroupItem
                                                value={option.value}
                                                id={option.value}
                                             />
                                             <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                   <Label
                                                      htmlFor={option.value}
                                                      className="cursor-pointer text-base font-semibold"
                                                   >
                                                      {option.label}
                                                   </Label>
                                                   <div className="text-right">
                                                      <div className="text-primary text-lg font-bold">
                                                         ${option.price}
                                                      </div>
                                                      <div className="text-muted-foreground text-sm">
                                                         {option.time}
                                                      </div>
                                                   </div>
                                                </div>
                                                <p className="text-muted-foreground mt-1 text-sm">
                                                   {option.description}
                                                </p>
                                             </div>
                                          </div>
                                       </div>
                                    </div>
                                 ))}
                              </RadioGroup>
                           </div>

                           <Separator />

                           <div className="space-y-6">
                              <div className="flex items-center space-x-2">
                                 <Shield className="text-primary h-5 w-5" />
                                 <h3 className="text-lg font-semibold">
                                    Additional Services
                                 </h3>
                              </div>

                              <div className="space-y-4">
                                 <div className="border-border flex items-center justify-between rounded-xl border p-4">
                                    <div className="flex items-center space-x-3">
                                       <Checkbox
                                          id="insurance"
                                          checked={formData.insurance}
                                          onCheckedChange={(checked) =>
                                             updateFormData(
                                                'insurance',
                                                checked,
                                             )
                                          }
                                       />
                                       <div>
                                          <Label
                                             htmlFor="insurance"
                                             className="cursor-pointer font-medium"
                                          >
                                             Package Insurance
                                          </Label>
                                          <p className="text-muted-foreground text-sm">
                                             Protect your package up to $100
                                             value
                                          </p>
                                       </div>
                                    </div>
                                    <Badge variant="secondary">+$5.99</Badge>
                                 </div>

                                 <div className="border-border flex items-center justify-between rounded-xl border p-4">
                                    <div className="flex items-center space-x-3">
                                       <Checkbox
                                          id="signature"
                                          checked={formData.signature}
                                          onCheckedChange={(checked) =>
                                             updateFormData(
                                                'signature',
                                                checked,
                                             )
                                          }
                                       />
                                       <div>
                                          <Label
                                             htmlFor="signature"
                                             className="cursor-pointer font-medium"
                                          >
                                             Signature Required
                                          </Label>
                                          <p className="text-muted-foreground text-sm">
                                             Require signature upon delivery
                                          </p>
                                       </div>
                                    </div>
                                    <Badge variant="secondary">+$2.99</Badge>
                                 </div>
                              </div>
                           </div>

                           <Separator />

                           <div className="space-y-6">
                              <div className="flex items-center space-x-2">
                                 <CreditCard className="text-primary h-5 w-5" />
                                 <h3 className="text-lg font-semibold">
                                    Payment Method
                                 </h3>
                              </div>

                              <RadioGroup
                                 value={formData.paymentMethod}
                                 onValueChange={(value) =>
                                    updateFormData('paymentMethod', value)
                                 }
                                 className="space-y-3"
                              >
                                 <div className="border-border flex items-center space-x-3 rounded-xl border p-4">
                                    <RadioGroupItem value="COD" id="cod" />
                                    <Label
                                       htmlFor="cod"
                                       className="flex-1 cursor-pointer"
                                    >
                                       <div className="font-medium">
                                          Cash on Delivery (COD)
                                       </div>
                                       <div className="text-muted-foreground text-sm">
                                          Pay when package is delivered
                                       </div>
                                    </Label>
                                 </div>
                                 <div className="border-border flex items-center space-x-3 rounded-xl border p-4">
                                    <RadioGroupItem value="PAID" id="prepaid" />
                                    <Label
                                       htmlFor="prepaid"
                                       className="flex-1 cursor-pointer"
                                    >
                                       <div className="font-medium">
                                          Pay Now
                                       </div>
                                       <div className="text-muted-foreground text-sm">
                                          Pay online with card or digital wallet
                                       </div>
                                    </Label>
                                 </div>
                              </RadioGroup>
                           </div>
                        </div>
                     )}

                     {/* Step 4: Review & Book */}
                     {currentStep === 4 && (
                        <div className="space-y-8">
                           <div className="space-y-2 text-center">
                              <h3 className="text-2xl font-bold">
                                 Review Your Booking
                              </h3>
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
                                             {formData.parcelType}
                                          </span>
                                       </div>
                                       <div className="flex justify-between">
                                          <span>Weight:</span>
                                          <span className="font-medium">
                                             {formData.weight} kg
                                          </span>
                                       </div>
                                       {formData.dimensions && (
                                          <div className="flex justify-between">
                                             <span>Dimensions:</span>
                                             <span className="font-medium">
                                                {formData.dimensions} cm
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
                                       <div>
                                          <div className="text-primary mb-1 font-medium">
                                             From:
                                          </div>
                                          <div>{formData.senderName}</div>
                                          <div>
                                             {formData.pickupAddress.street}
                                          </div>
                                          <div>
                                             {formData.pickupAddress.city},{' '}
                                             {formData.pickupAddress.state}{' '}
                                             {formData.pickupAddress.zip}
                                          </div>
                                       </div>
                                       <div>
                                          <div className="text-primary mb-1 font-medium">
                                             To:
                                          </div>
                                          <div>{formData.recipientName}</div>
                                          <div>
                                             {formData.deliveryAddress.street}
                                          </div>
                                          <div>
                                             {formData.deliveryAddress.city},{' '}
                                             {formData.deliveryAddress.state}{' '}
                                             {formData.deliveryAddress.zip}
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
                                             {formData.deliverySpeed?.replace(
                                                '-',
                                                ' ',
                                             )}
                                          </span>
                                       </div>
                                       <div className="flex justify-between">
                                          <span>Estimated Delivery:</span>
                                          <span className="text-primary font-medium">
                                             {formData.estimatedDelivery}
                                          </span>
                                       </div>
                                       <div className="flex justify-between">
                                          <span>Payment:</span>
                                          <span className="font-medium">
                                             {formData.paymentMethod === 'COD'
                                                ? 'Cash on Delivery'
                                                : 'Pay Now'}
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
                                          <span>
                                             $
                                             {deliveryOptions
                                                .find(
                                                   (opt) =>
                                                      opt.value ===
                                                      formData.deliverySpeed,
                                                )
                                                ?.price.toFixed(2)}
                                          </span>
                                       </div>
                                       {parseFloat(formData.weight) > 5 && (
                                          <div className="flex justify-between">
                                             <span>
                                                Extra Weight (
                                                {(
                                                   parseFloat(formData.weight) -
                                                   5
                                                ).toFixed(1)}{' '}
                                                kg):
                                             </span>
                                             <span>
                                                $
                                                {(
                                                   (parseFloat(
                                                      formData.weight,
                                                   ) -
                                                      5) *
                                                   2
                                                ).toFixed(2)}
                                             </span>
                                          </div>
                                       )}
                                       {formData.insurance && (
                                          <div className="flex justify-between">
                                             <span>Insurance:</span>
                                             <span>$5.99</span>
                                          </div>
                                       )}
                                       {formData.signature && (
                                          <div className="flex justify-between">
                                             <span>Signature Required:</span>
                                             <span>$2.99</span>
                                          </div>
                                       )}
                                       <Separator />
                                       <div className="text-primary flex justify-between text-lg font-bold">
                                          <span>Total:</span>
                                          <span>
                                             ${formData.deliveryFee.toFixed(2)}
                                          </span>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     )}

                     {/* Navigation Buttons */}
                     <div className="border-border flex items-center justify-between border-t pt-8">
                        <Button
                           variant="outline"
                           onClick={prevStep}
                           disabled={currentStep === 1}
                           className="h-12 px-6"
                        >
                           <ArrowLeft className="mr-2 h-4 w-4" />
                           Previous
                        </Button>

                        {currentStep < 4 ? (
                           <Button onClick={nextStep} className="h-12 px-6">
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
