import { AgentType } from '@/app/admin-panel/assign/page';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Star, Truck, User } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

interface DBAvailableAgentsProps {
   agents: AgentType[];
   selectedAgent: string;
   setSelectedAgent: Dispatch<SetStateAction<string>>;
}

const getInitials = (name: string) => {
   return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
};

const DBAvailableAgents = ({
   agents,
   selectedAgent,
   setSelectedAgent,
}: DBAvailableAgentsProps) => {
   return (
      <div className="space-y-6">
         {/* Available Agents */}
         <Card className="animate-fade-in-up">
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Available Agents (5)
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               {agents.map((agent) => (
                  <div
                     key={agent.id}
                     className={`cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md ${
                        selectedAgent === agent.id
                           ? 'border-primary bg-primary/5'
                           : 'border-border hover:border-primary/50'
                     }`}
                     onClick={() => setSelectedAgent(agent.id)}
                  >
                     <div className="flex items-start gap-3">
                        <Avatar className="h-12 w-12">
                           <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                              {getInitials(agent.name)}
                           </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                           <div className="mb-1 flex items-center justify-between">
                              <h3 className="truncate text-sm font-semibold">
                                 {agent.name}
                              </h3>
                           </div>

                           <div className="text-muted-foreground space-y-1 text-xs">
                              <div className="flex items-center gap-1">
                                 <Phone className="h-3 w-3" />
                                 <span className="truncate">{agent.phone}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                 <MapPin className="h-3 w-3" />
                                 <span>{agent.zone}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                 <Truck className="h-3 w-3" />
                                 <span>{agent.vehicleType}</span>
                              </div>
                           </div>

                           <div className="mt-3 space-y-2">
                              <div className="flex justify-between text-xs">
                                 <span>Capacity</span>
                                 <span className="font-medium">
                                    {agent.currentParcels}/{agent.maxCapacity}
                                 </span>
                              </div>
                              <div className="bg-muted h-1.5 w-full rounded-full">
                                 <div
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                       agent.currentParcels >= agent.maxCapacity
                                          ? 'bg-red-500'
                                          : agent.currentParcels /
                                                 agent.maxCapacity >
                                              0.8
                                            ? 'bg-orange-500'
                                            : 'bg-primary'
                                    }`}
                                    style={{
                                       width: `${(agent.currentParcels / agent.maxCapacity) * 100}%`,
                                    }}
                                 />
                              </div>
                           </div>

                           <div className="mt-3 flex items-center justify-between border-t pt-2">
                              <div className="flex items-center gap-1 text-xs">
                                 <Star className="h-3 w-3 fill-current text-yellow-500" />
                                 <span className="font-medium">
                                    {agent.rating}
                                 </span>
                              </div>
                              <span className="text-muted-foreground text-xs">
                                 {agent.completedDeliveries} deliveries
                              </span>
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </CardContent>
         </Card>
      </div>
   );
};

export { DBAvailableAgents };
