import { BadgePercent, CreditCard, Shield, Truck } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
   Fees,
   selectParcelBooking,
   setParcelBooking,
} from '@/redux/reducers/parcelBookingSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Input } from '../ui/input';
import { useState } from 'react';

const deliveryOptions = [
   {
      value: 'STANDARD',
      label: 'Standard Delivery',
      time: '3-5 business days',
      price: 150,
      description: 'Reliable delivery at an affordable price',
   },
   {
      value: 'EXPRESS',
      label: 'Express Delivery',
      time: '1-2 business days',
      price: 200,
      description: 'Faster delivery for urgent packages',
   },
   {
      value: 'OVERNIGHT',
      label: 'Overnight Delivery',
      time: 'Next business day',
      price: 250,
      description: 'Next day delivery guaranteed',
   },
   {
      value: 'SAME_DAY',
      label: 'Same Day Delivery',
      time: 'Within 6 hours',
      price: 300,
      description: 'Ultra-fast same day delivery',
   },
];

const DeliveryOptions = () => {
   const [isPrice, setIsPrice] = useState(false);
   const dispatch = useAppDispatch();
   const parcel = useAppSelector(selectParcelBooking);

   const handleFeesInput = (field: keyof Fees, value: number | undefined) => {
      dispatch(
         setParcelBooking({
            type: 'fees',
            data: {
               ...parcel.fees,
               [field]: value,
            },
         }),
      );
   };

   return (
      <div className="space-y-8">
         <div className="space-y-6">
            <div className="flex items-center space-x-2">
               <BadgePercent className="text-primary h-5 w-5" />
               <h3 className="text-lg font-semibold">Delivery Options</h3>
            </div>

            <div className="relative">
               <div
                  className={`border-border hover:border-primary/50 cursor-pointer rounded-xl border-2 p-4 transition-all`}
               >
                  <div className="flex-1 space-y-2">
                     <div className="flex items-center gap-2.5">
                        <Checkbox
                           id="codPrice"
                           onCheckedChange={(check) =>
                              setIsPrice(check as boolean)
                           }
                        />
                        <Label
                           htmlFor="codPrice"
                           className="cursor-pointer text-base font-semibold"
                        >
                           Product Price
                        </Label>
                     </div>
                     <div className="text-right">
                        <Input
                           placeholder="Enter product price"
                           className="max-w-sm"
                           type="number"
                           disabled={!isPrice}
                           value={parcel.fees?.price}
                           onChange={(e) =>
                              handleFeesInput(
                                 'price',
                                 e.target.value
                                    ? parseFloat(e.target.value)
                                    : undefined,
                              )
                           }
                        />
                     </div>
                     <p className="text-muted-foreground mt-1 text-sm">
                        Enter the total price of the product being shipped.
                     </p>
                  </div>
               </div>
            </div>

            <Separator />

            <div className="flex items-center space-x-2">
               <Truck className="text-primary h-5 w-5" />
               <h3 className="text-lg font-semibold">Delivery Speed</h3>
            </div>

            <RadioGroup className="space-y-4">
               {deliveryOptions.map((option) => (
                  <div key={option.value} className="relative">
                     <div
                        onClick={() => {
                           dispatch(
                              setParcelBooking({
                                 type: 'deliveryType',
                                 data: option.value,
                              }),
                           );
                        }}
                        className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                           parcel.deliveryType === option.value
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                        }`}
                     >
                        <div className="flex items-center space-x-3">
                           <RadioGroupItem
                              value={option.value}
                              id={option.value}
                              checked={option.value === parcel.deliveryType}
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
                                       {option.price}TK
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
               <h3 className="text-lg font-semibold">Additional Services</h3>
            </div>

            <div className="space-y-4">
               <div className="border-border flex items-center justify-between rounded-xl border p-4">
                  <div className="flex items-center space-x-3">
                     <Checkbox
                        id="insurance"
                        onCheckedChange={(check) =>
                           check
                              ? handleFeesInput('insuranceFee', 520)
                              : handleFeesInput('insuranceFee', undefined)
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
                           Protect your package up to Tk10000 value
                        </p>
                     </div>
                  </div>
                  <Badge variant="secondary">+Tk599</Badge>
               </div>

               <div className="border-border flex items-center justify-between rounded-xl border p-4">
                  <div className="flex items-center space-x-3">
                     <Checkbox
                        id="signature"
                        onCheckedChange={(check) =>
                           check
                              ? handleFeesInput('signatureFee', 520)
                              : handleFeesInput('signatureFee', undefined)
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
                  <Badge variant="secondary">+Tk299</Badge>
               </div>
            </div>
         </div>

         <Separator />

         <div className="space-y-6">
            <div className="flex items-center space-x-2">
               <CreditCard className="text-primary h-5 w-5" />
               <h3 className="text-lg font-semibold">Payment Method</h3>
            </div>

            <RadioGroup
               className="space-y-3"
               onValueChange={(value) => {
                  dispatch(
                     setParcelBooking({
                        type: 'paymentStatus',
                        data: value === 'COD' ? 'COD' : 'PAID',
                     }),
                  );
               }}
            >
               <div className="border-border flex items-center space-x-3 rounded-xl border p-4">
                  <RadioGroupItem value="COD" id="cod" />
                  <Label htmlFor="cod" className="flex-1 cursor-pointer">
                     <div className="font-medium">Cash on Delivery (COD)</div>
                     <div className="text-muted-foreground text-sm">
                        Pay when package is delivered
                     </div>
                  </Label>
               </div>
               <div className="border-border flex items-center space-x-3 rounded-xl border p-4">
                  <RadioGroupItem value="ONLINE" id="prepaid" />
                  <Label htmlFor="prepaid" className="flex-1 cursor-pointer">
                     <div className="font-medium">Pay Now</div>
                     <div className="text-muted-foreground text-sm">
                        Pay online with card or digital wallet
                     </div>
                  </Label>
               </div>
            </RadioGroup>
         </div>
      </div>
   );
};

export { DeliveryOptions };
