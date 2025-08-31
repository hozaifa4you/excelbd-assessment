import { DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { Fees, PaymentMethod, PaymentStatus } from '@/types/parcel';

const formatCurrency = (amount: number) => {
   return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'BDT',
   }).format(amount);
};

interface PDPaymentInfoProps {
   fees: Fees;
   paymentStatus: PaymentStatus;
   paymentMethod: PaymentMethod | null;
}

const PDPaymentInfo = ({
   fees,
   paymentStatus,
   paymentMethod,
}: PDPaymentInfoProps) => {
   const totalAmount =
      (fees.price || 0) +
      (fees?.deliveryFee || 0) +
      (fees.handlingFee || 0) +
      (fees.insuranceFee || 0) +
      (fees.signatureFee || 0);

   return (
      <Card className="animate-fade-in-up">
         <CardHeader>
            <CardTitle className="flex items-center gap-2">
               <DollarSign className="h-5 w-5" />
               Payment Summary
            </CardTitle>
         </CardHeader>
         <CardContent className="space-y-4">
            <div className="space-y-3">
               {fees.price && (
                  <div className="flex justify-between">
                     <span className="text-sm">Item Value</span>
                     <span className="font-sans font-medium">
                        {formatCurrency(fees.price)}
                     </span>
                  </div>
               )}
               <div className="flex justify-between">
                  <span className="text-sm">Delivery Fee</span>
                  <span className="font-sans font-medium">
                     {formatCurrency(fees?.deliveryFee ?? 0)}
                  </span>
               </div>
               {fees.handlingFee && (
                  <div className="flex justify-between">
                     <span className="text-sm">Handling Fee</span>
                     <span className="font-sans font-medium">
                        {formatCurrency(fees.handlingFee)}
                     </span>
                  </div>
               )}
               {fees.insuranceFee && (
                  <div className="flex justify-between">
                     <span className="text-sm">Insurance</span>
                     <span className="font-sans font-medium">
                        {formatCurrency(fees.insuranceFee)}
                     </span>
                  </div>
               )}
               {fees.signatureFee && (
                  <div className="flex justify-between">
                     <span className="text-sm">Signature Required</span>
                     <span className="font-sans font-medium">
                        {formatCurrency(fees.signatureFee)}
                     </span>
                  </div>
               )}
            </div>

            <Separator />

            <div className="flex justify-between text-lg font-semibold">
               <span>Total</span>
               <span className="font-sans">{formatCurrency(totalAmount)}</span>
            </div>

            <div className="pt-2">
               <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">
                     Payment Status
                  </span>
                  <Badge
                     variant={
                        paymentStatus === 'PAID' ? 'default' : 'secondary'
                     }
                  >
                     {paymentStatus}
                  </Badge>
               </div>
               {paymentMethod && (
                  <div className="mt-2 flex items-center justify-between">
                     <span className="text-muted-foreground text-sm">
                        Payment Method
                     </span>
                     <span className="text-sm font-medium">
                        {paymentMethod}
                     </span>
                  </div>
               )}
            </div>
         </CardContent>
      </Card>
   );
};

export { PDPaymentInfo };
