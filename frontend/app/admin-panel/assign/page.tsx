'use client';
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
   User,
   Package,
   MapPin,
   Phone,
   Search,
   Filter,
   UserPlus,
   Truck,
   CheckCircle,
   Users,
   Calendar,
   Star,
   Activity,
} from 'lucide-react';

// Mock data for delivery agents
const mockAgents = [
   {
      id: 'agent1',
      name: 'David Rodriguez',
      phone: '+1 (555) 456-7890',
      email: 'david.rodriguez@company.com',
      status: 'ACTIVE',
      currentParcels: 8,
      maxCapacity: 15,
      rating: 4.8,
      completedDeliveries: 1247,
      zone: 'Downtown',
      vehicleType: 'Van',
   },
   {
      id: 'agent2',
      name: 'Sarah Chen',
      phone: '+1 (555) 789-0123',
      email: 'sarah.chen@company.com',
      status: 'ACTIVE',
      currentParcels: 12,
      maxCapacity: 20,
      rating: 4.9,
      completedDeliveries: 892,
      zone: 'North Side',
      vehicleType: 'Truck',
   },
   {
      id: 'agent3',
      name: 'Michael Johnson',
      phone: '+1 (555) 234-5678',
      email: 'michael.johnson@company.com',
      status: 'BUSY',
      currentParcels: 15,
      maxCapacity: 15,
      rating: 4.7,
      completedDeliveries: 2103,
      zone: 'East District',
      vehicleType: 'Motorcycle',
   },
   {
      id: 'agent4',
      name: 'Emma Wilson',
      phone: '+1 (555) 345-6789',
      email: 'emma.wilson@company.com',
      status: 'ACTIVE',
      currentParcels: 5,
      maxCapacity: 18,
      rating: 4.9,
      completedDeliveries: 567,
      zone: 'West End',
      vehicleType: 'Van',
   },
];

// Mock data for unassigned parcels
const mockParcels = [
   {
      id: 'parcel1',
      trackingNumber: 'PX24567890123',
      parcelType: 'Electronics',
      weight: 2.5,
      status: 'PICKED_UP',
      deliveryType: 'EXPRESS',
      estimatedDelivery: '2024-01-25T14:30:00Z',
      recipient: { name: 'Michael Chen', phone: '+1 (555) 987-6543' },
      deliveryAddress: {
         street: '5678 Innovation Blvd',
         city: 'Austin',
         state: 'TX',
         zip: '73301',
      },
      priority: 'HIGH',
      createdAt: '2024-01-20T10:15:00Z',
   },
   {
      id: 'parcel2',
      trackingNumber: 'PX24567890124',
      parcelType: 'Documents',
      weight: 0.5,
      status: 'PICKED_UP',
      deliveryType: 'STANDARD',
      estimatedDelivery: '2024-01-26T16:00:00Z',
      recipient: { name: 'Lisa Park', phone: '+1 (555) 123-9876' },
      deliveryAddress: {
         street: '1234 Business Ave',
         city: 'Austin',
         state: 'TX',
         zip: '73302',
      },
      priority: 'MEDIUM',
      createdAt: '2024-01-21T09:30:00Z',
   },
   {
      id: 'parcel3',
      trackingNumber: 'PX24567890125',
      parcelType: 'Clothing',
      weight: 1.8,
      status: 'PICKED_UP',
      deliveryType: 'EXPRESS',
      estimatedDelivery: '2024-01-25T12:00:00Z',
      recipient: { name: 'John Smith', phone: '+1 (555) 456-1234' },
      deliveryAddress: {
         street: '9876 Retail St',
         city: 'Austin',
         state: 'TX',
         zip: '73303',
      },
      priority: 'HIGH',
      createdAt: '2024-01-20T14:45:00Z',
   },
   {
      id: 'parcel4',
      trackingNumber: 'PX24567890126',
      parcelType: 'Books',
      weight: 3.2,
      status: 'PICKED_UP',
      deliveryType: 'STANDARD',
      estimatedDelivery: '2024-01-27T10:30:00Z',
      recipient: { name: 'Anna Davis', phone: '+1 (555) 789-4567' },
      deliveryAddress: {
         street: '4567 Academic Dr',
         city: 'Austin',
         state: 'TX',
         zip: '73304',
      },
      priority: 'LOW',
      createdAt: '2024-01-21T11:20:00Z',
   },
   {
      id: 'parcel5',
      trackingNumber: 'PX24567890127',
      parcelType: 'Medical Supplies',
      weight: 1.2,
      status: 'PICKED_UP',
      deliveryType: 'SAME_DAY',
      estimatedDelivery: '2024-01-24T18:00:00Z',
      recipient: { name: 'Dr. Robert Lee', phone: '+1 (555) 321-6547' },
      deliveryAddress: {
         street: '7890 Health Plaza',
         city: 'Austin',
         state: 'TX',
         zip: '73305',
      },
      priority: 'URGENT',
      createdAt: '2024-01-24T08:15:00Z',
   },
];

const getStatusColor = (status: string) => {
   switch (status) {
      case 'ACTIVE':
         return 'text-green-600 bg-green-50 border-green-200';
      case 'BUSY':
         return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'OFFLINE':
         return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
         return 'text-gray-600 bg-gray-50 border-gray-200';
   }
};

const getPriorityColor = (priority: string) => {
   switch (priority) {
      case 'URGENT':
         return 'text-red-600 bg-red-50 border-red-200';
      case 'HIGH':
         return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'MEDIUM':
         return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'LOW':
         return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
         return 'text-gray-600 bg-gray-50 border-gray-200';
   }
};

const formatDate = (dateString: string) => {
   return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
   }).format(new Date(dateString));
};

const getInitials = (name: string) => {
   return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
};

export default function DeliveryAgentAssignment() {
   const [selectedAgent, setSelectedAgent] = useState<string>('');
   const [selectedParcels, setSelectedParcels] = useState<string[]>([]);
   const [searchTerm, setSearchTerm] = useState('');
   const [statusFilter, setStatusFilter] = useState('ALL');
   const [priorityFilter, setPriorityFilter] = useState('ALL');
   const [agentFilter, setAgentFilter] = useState('ALL');

   // Filter parcels based on search and filters
   const filteredParcels = useMemo(() => {
      return mockParcels.filter((parcel) => {
         const matchesSearch =
            parcel.trackingNumber
               .toLowerCase()
               .includes(searchTerm.toLowerCase()) ||
            parcel.recipient.name
               .toLowerCase()
               .includes(searchTerm.toLowerCase()) ||
            parcel.parcelType.toLowerCase().includes(searchTerm.toLowerCase());

         const matchesStatus =
            statusFilter === 'ALL' || parcel.status === statusFilter;
         const matchesPriority =
            priorityFilter === 'ALL' || parcel.priority === priorityFilter;

         return matchesSearch && matchesStatus && matchesPriority;
      });
   }, [searchTerm, statusFilter, priorityFilter]);

   // Filter agents based on status
   const filteredAgents = useMemo(() => {
      return mockAgents.filter((agent) => {
         return agentFilter === 'ALL' || agent.status === agentFilter;
      });
   }, [agentFilter]);

   const handleParcelSelect = (parcelId: string) => {
      setSelectedParcels((prev) =>
         prev.includes(parcelId)
            ? prev.filter((id) => id !== parcelId)
            : [...prev, parcelId],
      );
   };

   const handleSelectAll = () => {
      if (selectedParcels.length === filteredParcels.length) {
         setSelectedParcels([]);
      } else {
         setSelectedParcels(filteredParcels.map((p) => p.id));
      }
   };

   const handleAssignParcels = () => {
      if (!selectedAgent || selectedParcels.length === 0) return;

      const agent = mockAgents.find((a) => a.id === selectedAgent);
      console.log(
         `Assigning ${selectedParcels.length} parcels to ${agent?.name}`,
      );

      // Reset selections after assignment
      setSelectedParcels([]);
      setSelectedAgent('');

      // Here you would typically make an API call to assign the parcels
   };

   const selectedAgentData = mockAgents.find((a) => a.id === selectedAgent);
   const canAssign = selectedAgent && selectedParcels.length > 0;

   return (
      <div className="bg-background min-h-screen">
         {/* Header */}
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

         <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
               {/* Left Column - Agent Selection */}
               <div className="space-y-6">
                  {/* Agent Filter */}
                  <Card className="animate-fade-in-up">
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <Filter className="h-5 w-5" />
                           Filter Agents
                        </CardTitle>
                     </CardHeader>
                     <CardContent>
                        <Select
                           value={agentFilter}
                           onValueChange={setAgentFilter}
                        >
                           <SelectTrigger>
                              <SelectValue placeholder="Filter by status" />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectItem value="ALL">All Agents</SelectItem>
                              <SelectItem value="ACTIVE">Active</SelectItem>
                              <SelectItem value="BUSY">Busy</SelectItem>
                              <SelectItem value="OFFLINE">Offline</SelectItem>
                           </SelectContent>
                        </Select>
                     </CardContent>
                  </Card>

                  {/* Available Agents */}
                  <Card className="animate-fade-in-up">
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <User className="h-5 w-5" />
                           Available Agents ({filteredAgents.length})
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        {filteredAgents.map((agent) => (
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
                                       <Badge
                                          className={`text-xs ${getStatusColor(agent.status)}`}
                                       >
                                          {agent.status}
                                       </Badge>
                                    </div>

                                    <div className="text-muted-foreground space-y-1 text-xs">
                                       <div className="flex items-center gap-1">
                                          <Phone className="h-3 w-3" />
                                          <span className="truncate">
                                             {agent.phone}
                                          </span>
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
                                             {agent.currentParcels}/
                                             {agent.maxCapacity}
                                          </span>
                                       </div>
                                       <div className="bg-muted h-1.5 w-full rounded-full">
                                          <div
                                             className={`h-1.5 rounded-full transition-all duration-300 ${
                                                agent.currentParcels >=
                                                agent.maxCapacity
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

               {/* Right Column - Parcel Selection */}
               <div className="space-y-6 lg:col-span-2">
                  {/* Search and Filters */}
                  <Card className="animate-fade-in-up">
                     <CardContent className="p-6">
                        <div className="flex flex-col gap-4 md:flex-row">
                           <div className="flex-1">
                              <div className="relative">
                                 <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                                 <Input
                                    placeholder="Search by tracking number, recipient, or type..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                       setSearchTerm(e.target.value)
                                    }
                                    className="pl-10"
                                 />
                              </div>
                           </div>
                           <div className="flex gap-2">
                              <Select
                                 value={statusFilter}
                                 onValueChange={setStatusFilter}
                              >
                                 <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Status" />
                                 </SelectTrigger>
                                 <SelectContent>
                                    <SelectItem value="ALL">
                                       All Status
                                    </SelectItem>
                                    <SelectItem value="PICKED_UP">
                                       Picked Up
                                    </SelectItem>
                                    <SelectItem value="IN_TRANSIT">
                                       In Transit
                                    </SelectItem>
                                 </SelectContent>
                              </Select>
                              <Select
                                 value={priorityFilter}
                                 onValueChange={setPriorityFilter}
                              >
                                 <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Priority" />
                                 </SelectTrigger>
                                 <SelectContent>
                                    <SelectItem value="ALL">
                                       All Priority
                                    </SelectItem>
                                    <SelectItem value="URGENT">
                                       Urgent
                                    </SelectItem>
                                    <SelectItem value="HIGH">High</SelectItem>
                                    <SelectItem value="MEDIUM">
                                       Medium
                                    </SelectItem>
                                    <SelectItem value="LOW">Low</SelectItem>
                                 </SelectContent>
                              </Select>
                           </div>
                        </div>
                     </CardContent>
                  </Card>

                  {/* Assignment Summary */}
                  {(selectedAgent || selectedParcels.length > 0) && (
                     <Card className="animate-fade-in-up border-primary/20 bg-primary/5">
                        <CardContent className="p-6">
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                 <div className="bg-primary/10 rounded-lg p-2">
                                    <CheckCircle className="text-primary h-5 w-5" />
                                 </div>
                                 <div>
                                    <h3 className="font-semibold">
                                       Assignment Summary
                                    </h3>
                                    <p className="text-muted-foreground text-sm">
                                       {selectedParcels.length} parcel(s)
                                       selected
                                       {selectedAgentData &&
                                          ` for ${selectedAgentData.name}`}
                                    </p>
                                 </div>
                              </div>
                              <Button
                                 onClick={handleAssignParcels}
                                 disabled={!canAssign}
                                 className="min-w-32"
                              >
                                 <UserPlus className="mr-2 h-4 w-4" />
                                 Assign Parcels
                              </Button>
                           </div>
                        </CardContent>
                     </Card>
                  )}

                  {/* Parcel List */}
                  <Card className="animate-fade-in-up">
                     <CardHeader>
                        <div className="flex items-center justify-between">
                           <CardTitle className="flex items-center gap-2">
                              <Package className="h-5 w-5" />
                              Unassigned Parcels ({filteredParcels.length})
                           </CardTitle>
                           <div className="flex items-center gap-2">
                              <Checkbox
                                 checked={
                                    selectedParcels.length ===
                                       filteredParcels.length &&
                                    filteredParcels.length > 0
                                 }
                                 onCheckedChange={handleSelectAll}
                              />
                              <span className="text-muted-foreground text-sm">
                                 Select All
                              </span>
                           </div>
                        </div>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        {filteredParcels.map((parcel) => (
                           <div
                              key={parcel.id}
                              className={`rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-sm ${
                                 selectedParcels.includes(parcel.id)
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:border-primary/30'
                              }`}
                           >
                              <div className="flex items-start gap-4">
                                 <Checkbox
                                    checked={selectedParcels.includes(
                                       parcel.id,
                                    )}
                                    onCheckedChange={() =>
                                       handleParcelSelect(parcel.id)
                                    }
                                    className="mt-1"
                                 />

                                 <div className="min-w-0 flex-1">
                                    <div className="mb-2 flex items-center justify-between">
                                       <div className="flex items-center gap-3">
                                          <code className="bg-muted rounded px-2 py-1 font-mono text-sm font-semibold">
                                             {parcel.trackingNumber}
                                          </code>
                                          <Badge
                                             className={`text-xs ${getPriorityColor(parcel.priority)}`}
                                          >
                                             {parcel.priority}
                                          </Badge>
                                       </div>
                                       <Badge
                                          variant="outline"
                                          className="text-xs"
                                       >
                                          {parcel.deliveryType}
                                       </Badge>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                       <div className="space-y-2">
                                          <div>
                                             <p className="text-sm font-medium">
                                                {parcel.parcelType}
                                             </p>
                                             <p className="text-muted-foreground text-xs">
                                                Weight: {parcel.weight} kg
                                             </p>
                                          </div>
                                          <div>
                                             <p className="text-sm font-medium">
                                                {parcel.recipient.name}
                                             </p>
                                             <p className="text-muted-foreground flex items-center gap-1 text-xs">
                                                <Phone className="h-3 w-3" />
                                                {parcel.recipient.phone}
                                             </p>
                                          </div>
                                       </div>

                                       <div className="space-y-2">
                                          <div>
                                             <p className="text-muted-foreground flex items-center gap-1 text-xs">
                                                <MapPin className="h-3 w-3" />
                                                Delivery Address
                                             </p>
                                             <p className="text-sm">
                                                {parcel.deliveryAddress.street},{' '}
                                                {parcel.deliveryAddress.city}
                                             </p>
                                          </div>
                                          <div>
                                             <p className="text-muted-foreground flex items-center gap-1 text-xs">
                                                <Calendar className="h-3 w-3" />
                                                Est. Delivery
                                             </p>
                                             <p className="text-sm font-medium">
                                                {formatDate(
                                                   parcel.estimatedDelivery,
                                                )}
                                             </p>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        ))}

                        {filteredParcels.length === 0 && (
                           <div className="py-12 text-center">
                              <Package className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                              <h3 className="mb-2 text-lg font-semibold">
                                 No parcels found
                              </h3>
                              <p className="text-muted-foreground">
                                 Try adjusting your search criteria or filters
                              </p>
                           </div>
                        )}
                     </CardContent>
                  </Card>
               </div>
            </div>
         </div>
      </div>
   );
}
