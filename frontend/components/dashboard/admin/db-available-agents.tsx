import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AssignableAgent } from '@/types/user';
import { MapPin, Phone, User } from 'lucide-react';
import { Dispatch, SetStateAction } from 'react';

interface DBAvailableAgentsProps {
   agents: AssignableAgent[];
   selectedAgent: string;
   setSelectedAgent: Dispatch<SetStateAction<string>>;
   count: number;
}

const DBAvailableAgents = ({
   agents,
   selectedAgent,
   setSelectedAgent,
   count,
}: DBAvailableAgentsProps) => {
   return (
      <div className="space-y-6">
         {/* Available Agents */}
         <Card className="animate-fade-in-up">
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Available Agents ({count})
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
                              QK
                           </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                           <div className="mb-1 flex items-center justify-between">
                              <h3 className="truncate text-sm font-semibold">
                                 {`${agent.firstName} ${agent.lastName}`}
                              </h3>
                           </div>

                           <div className="text-muted-foreground space-y-1 text-xs">
                              <div className="flex items-center gap-1">
                                 <Phone className="h-3 w-3" />
                                 <span className="truncate">{agent.phone}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                 <MapPin className="h-3 w-3" />
                                 <span>{agent?.Address.city}</span>
                              </div>
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
