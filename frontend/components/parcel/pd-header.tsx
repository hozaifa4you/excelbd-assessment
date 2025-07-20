import { Download, MessageSquare, Package } from 'lucide-react';
import { Button } from '../ui/button';

const PDHeader = () => {
   return (
      <div className="bg-card border-b">
         <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="bg-primary/10 rounded-xl p-3">
                     <Package className="text-primary h-8 w-8" />
                  </div>
                  <div>
                     <h1 className="text-3xl font-bold tracking-tight">
                        Parcel Details
                     </h1>
                     <p className="text-muted-foreground">
                        Track and manage your shipment
                     </p>
                  </div>
               </div>
               <div className="flex gap-3">
                  <Button variant="outline" size="sm">
                     <Download className="mr-2 h-4 w-4" />
                     Download Label
                  </Button>
                  <Button size="sm">
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
