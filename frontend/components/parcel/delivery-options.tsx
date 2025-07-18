import { CreditCard, Shield, Truck } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';

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

const DeliveryOptions = () => {
   return (
      <div className="space-y-8">
         <div className="space-y-6">
            <div className="flex items-center space-x-2">
               <Truck className="text-primary h-5 w-5" />
               <h3 className="text-lg font-semibold">Delivery Speed</h3>
            </div>

            <RadioGroup className="space-y-4">
               {deliveryOptions.map((option) => (
                  <div key={option.value} className="relative">
                     <div
                        className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                           // formData.deliverySpeed === option.value
                           false
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
               <h3 className="text-lg font-semibold">Additional Services</h3>
            </div>

            <div className="space-y-4">
               <div className="border-border flex items-center justify-between rounded-xl border p-4">
                  <div className="flex items-center space-x-3">
                     <Checkbox id="insurance" />
                     <div>
                        <Label
                           htmlFor="insurance"
                           className="cursor-pointer font-medium"
                        >
                           Package Insurance
                        </Label>
                        <p className="text-muted-foreground text-sm">
                           Protect your package up to $100 value
                        </p>
                     </div>
                  </div>
                  <Badge variant="secondary">+$5.99</Badge>
               </div>

               <div className="border-border flex items-center justify-between rounded-xl border p-4">
                  <div className="flex items-center space-x-3">
                     <Checkbox id="signature" />
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
               <h3 className="text-lg font-semibold">Payment Method</h3>
            </div>

            <RadioGroup className="space-y-3">
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
                  <RadioGroupItem value="PAID" id="prepaid" />
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
