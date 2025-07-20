import { Badge, CheckCircle, MapPin, Package, Truck } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';
import { useState } from 'react';

const statusSteps = [
   { key: 'PENDING', label: 'Order Placed', icon: Package },
   { key: 'PICKED_UP', label: 'Picked Up', icon: CheckCircle },
   { key: 'IN_TRANSIT', label: 'In Transit', icon: Truck },
   { key: 'DELIVERING', label: 'Out for Delivery', icon: MapPin },
   { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle },
];

const getStatusColor = (status: string) => {
   switch (status) {
      case 'PENDING':
         return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'PICKED_UP':
         return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'IN_TRANSIT':
         return 'text-primary bg-primary/10 border-primary/20';
      case 'DELIVERING':
         return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'DELIVERED':
         return 'text-green-600 bg-green-50 border-green-200';
      case 'CANCELLED':
         return 'text-red-600 bg-red-50 border-red-200';
      default:
         return 'text-gray-600 bg-gray-50 border-gray-200';
   }
};

const getStatusProgress = (status: string) => {
   const statusIndex = statusSteps.findIndex((step) => step.key === status);
   return ((statusIndex + 1) / statusSteps.length) * 100;
};

const PDStatus = () => {
   const [copiedTracking, setCopiedTracking] = useState(false);
   const currentStatusIndex = statusSteps.findIndex(
      (step) => step.key === parcel.status,
   );
   const progressValue = getStatusProgress(parcel.status);
   const copyTrackingNumber = async () => {
      try {
         await navigator.clipboard.writeText(parcel.trackingNumber);
         setCopiedTracking(true);
         setTimeout(() => setCopiedTracking(false), 2000);
      } catch (err) {
         console.error('Failed to copy tracking number');
      }
   };

   return (
      <Card className="animate-fade-in-up mb-8">
         <CardContent className="p-8">
            <div className="mb-6 flex items-center justify-between">
               <div>
                  <p className="text-muted-foreground mb-2 text-sm">
                     Tracking Number
                  </p>
                  <div className="flex items-center gap-3">
                     <code className="bg-muted rounded px-3 py-1 font-mono text-2xl font-semibold">
                        {parcel.trackingNumber}
                     </code>
                     <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyTrackingNumber}
                        className="h-8 w-8 p-0"
                     >
                        <Copy className="h-4 w-4" />
                     </Button>
                     {copiedTracking && (
                        <span className="text-sm font-medium text-green-600">
                           Copied!
                        </span>
                     )}
                  </div>
               </div>
               <Badge
                  className={`px-4 py-2 text-sm font-medium ${getStatusColor(parcel.status)}`}
               >
                  {parcel.status.replace('_', ' ')}
               </Badge>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
               <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-medium">Delivery Progress</span>
                  <span className="text-muted-foreground text-sm">
                     {Math.round(progressValue)}% Complete
                  </span>
               </div>
               <Progress value={progressValue} className="h-3" />
            </div>

            {/* Status Timeline */}
            <div className="relative flex justify-between">
               <div className="bg-border absolute top-8 right-8 left-8 -z-10 h-0.5"></div>
               {statusSteps.map((step, index) => {
                  const isCompleted = index <= currentStatusIndex;
                  const isCurrent = index === currentStatusIndex;
                  const IconComponent = step.icon;

                  return (
                     <div key={step.key} className="flex flex-col items-center">
                        <div
                           className={`bg-background mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                              isCompleted
                                 ? 'bg-primary border-primary text-primary-foreground'
                                 : 'bg-background border-border text-muted-foreground border-2'
                           } ${isCurrent ? 'status-active' : ''} `}
                        >
                           <IconComponent className="h-6 w-6" />
                        </div>
                        <span
                           className={`max-w-20 text-center text-sm font-medium ${
                              isCompleted
                                 ? 'text-foreground'
                                 : 'text-muted-foreground'
                           }`}
                        >
                           {step.label}
                        </span>
                     </div>
                  );
               })}
            </div>
         </CardContent>
      </Card>
   );
};

export { PDStatus };
