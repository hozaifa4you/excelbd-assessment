import { Download, MessageSquare, Package } from 'lucide-react';
import { Button } from '../ui/button';

const PDHeader = () => {
   return (
      <div className="bg-card border-b">
         <div className="container mx-auto px-4 py-4 sm:py-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
               <div className="flex items-center gap-3 sm:gap-4">
                  <div className="bg-primary/10 rounded-xl p-2 sm:p-3">
                     <Package className="text-primary h-6 w-6 sm:h-8 sm:w-8" />
                  </div>
                  <div>
                     <h1 className="text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl">
                        Parcel Details
                     </h1>
                     <p className="muted-foreground text-sm sm:text-base">
                        Track and manage your shipment
                     </p>
                  </div>
               </div>
               <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                  <Button
                     variant="outline"
                     size="sm"
                     className="w-full sm:w-auto"
                  >
                     <Download className="mr-2 h-4 w-4" />
                     Download Label
                  </Button>
                  <Button size="sm" className="w-full sm:w-auto">
                     <MessageSquare className="mr-2 h-4 w-4" />
                     Contact Support
                  </Button>
               </div>
            </div>
         </div>
      </div>
   );
};

export { PDHeader };
