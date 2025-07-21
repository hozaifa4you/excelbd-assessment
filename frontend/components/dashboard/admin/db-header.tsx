import { Activity, UserPlus, Users } from 'lucide-react';
import { Button } from '../../ui/button';

const DbHeader = () => {
   return (
      <div className="bg-card border-b">
         <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="bg-primary/10 rounded-xl p-3">
                     <Users className="text-primary h-8 w-8" />
                  </div>
                  <div>
                     <h1 className="text-3xl font-bold tracking-tight">
                        Delivery Agent Assignment
                     </h1>
                     <p className="text-muted-foreground">
                        Assign parcels to delivery agents efficiently
                     </p>
                  </div>
               </div>
               <div className="flex gap-3">
                  <Button variant="outline" size="sm">
                     <UserPlus className="mr-2 h-4 w-4" />
                     Add Agent
                  </Button>
                  <Button size="sm">
                     <Activity className="mr-2 h-4 w-4" />
                     View Analytics
                  </Button>
               </div>
            </div>
         </div>
      </div>
   );
};

export { DbHeader };
