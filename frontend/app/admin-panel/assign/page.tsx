'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Package, Search, UserPlus, CheckCircle } from 'lucide-react';
import { DbHeader } from '@/components/dashboard/admin/db-header';
import { DBAvailableAgents } from '@/components/dashboard/admin/db-available-agents';
import { ParcelCard } from '@/components/dashboard/admin/parcel-card';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
   fetchAssignableAgents,
   fetchAssignableParcels,
   selectAssignableAgents,
   selectAssignableParcels,
   selectStatus,
   selectStatusParcel,
} from '@/redux/reducers/adminSlice';
import { useSession } from '@/hooks/use-session';

// // Mock data for delivery agents
// const mockAgents = [
//    {
//       id: 'agent1',
//       name: 'David Rodriguez',
//       phone: '+1 (555) 456-7890',
//       email: 'david.rodriguez@company.com',
//       status: 'ACTIVE',
//       currentParcels: 8,
//       maxCapacity: 15,
//       rating: 4.8,
//       completedDeliveries: 1247,
//       zone: 'Downtown',
//       vehicleType: 'Van',
//    },
//    {
//       id: 'agent2',
//       name: 'Sarah Chen',
//       phone: '+1 (555) 789-0123',
//       email: 'sarah.chen@company.com',
//       status: 'ACTIVE',
//       currentParcels: 12,
//       maxCapacity: 20,
//       rating: 4.9,
//       completedDeliveries: 892,
//       zone: 'North Side',
//       vehicleType: 'Truck',
//    },
//    {
//       id: 'agent3',
//       name: 'Michael Johnson',
//       phone: '+1 (555) 234-5678',
//       email: 'michael.johnson@company.com',
//       status: 'BUSY',
//       currentParcels: 15,
//       maxCapacity: 15,
//       rating: 4.7,
//       completedDeliveries: 2103,
//       zone: 'East District',
//       vehicleType: 'Motorcycle',
//    },
//    {
//       id: 'agent4',
//       name: 'Emma Wilson',
//       phone: '+1 (555) 345-6789',
//       email: 'emma.wilson@company.com',
//       status: 'ACTIVE',
//       currentParcels: 5,
//       maxCapacity: 18,
//       rating: 4.9,
//       completedDeliveries: 567,
//       zone: 'West End',
//       vehicleType: 'Van',
//    },
// ];
// // Mock data for unassigned parcels
// const mockParcels = [
//    {
//       id: 'parcel1',
//       trackingNumber: 'PX24567890123',
//       parcelType: 'Electronics',
//       weight: 2.5,
//       status: 'PICKED_UP',
//       deliveryType: 'EXPRESS',
//       estimatedDelivery: '2024-01-25T14:30:00Z',
//       recipient: { name: 'Michael Chen', phone: '+1 (555) 987-6543' },
//       deliveryAddress: {
//          street: '5678 Innovation Blvd',
//          city: 'Austin',
//          state: 'TX',
//          zip: '73301',
//       },
//       priority: 'HIGH',
//       createdAt: '2024-01-20T10:15:00Z',
//    },
//    {
//       id: 'parcel2',
//       trackingNumber: 'PX24567890124',
//       parcelType: 'Documents',
//       weight: 0.5,
//       status: 'PICKED_UP',
//       deliveryType: 'STANDARD',
//       estimatedDelivery: '2024-01-26T16:00:00Z',
//       recipient: { name: 'Lisa Park', phone: '+1 (555) 123-9876' },
//       deliveryAddress: {
//          street: '1234 Business Ave',
//          city: 'Austin',
//          state: 'TX',
//          zip: '73302',
//       },
//       priority: 'MEDIUM',
//       createdAt: '2024-01-21T09:30:00Z',
//    },
//    {
//       id: 'parcel3',
//       trackingNumber: 'PX24567890125',
//       parcelType: 'Clothing',
//       weight: 1.8,
//       status: 'PICKED_UP',
//       deliveryType: 'EXPRESS',
//       estimatedDelivery: '2024-01-25T12:00:00Z',
//       recipient: { name: 'John Smith', phone: '+1 (555) 456-1234' },
//       deliveryAddress: {
//          street: '9876 Retail St',
//          city: 'Austin',
//          state: 'TX',
//          zip: '73303',
//       },
//       priority: 'HIGH',
//       createdAt: '2024-01-20T14:45:00Z',
//    },
//    {
//       id: 'parcel4',
//       trackingNumber: 'PX24567890126',
//       parcelType: 'Books',
//       weight: 3.2,
//       status: 'PICKED_UP',
//       deliveryType: 'STANDARD',
//       estimatedDelivery: '2024-01-27T10:30:00Z',
//       recipient: { name: 'Anna Davis', phone: '+1 (555) 789-4567' },
//       deliveryAddress: {
//          street: '4567 Academic Dr',
//          city: 'Austin',
//          state: 'TX',
//          zip: '73304',
//       },
//       priority: 'LOW',
//       createdAt: '2024-01-21T11:20:00Z',
//    },
//    {
//       id: 'parcel5',
//       trackingNumber: 'PX24567890127',
//       parcelType: 'Medical Supplies',
//       weight: 1.2,
//       status: 'PICKED_UP',
//       deliveryType: 'SAME_DAY',
//       estimatedDelivery: '2024-01-24T18:00:00Z',
//       recipient: { name: 'Dr. Robert Lee', phone: '+1 (555) 321-6547' },
//       deliveryAddress: {
//          street: '7890 Health Plaza',
//          city: 'Austin',
//          state: 'TX',
//          zip: '73305',
//       },
//       priority: 'URGENT',
//       createdAt: '2024-01-24T08:15:00Z',
//    },
// ];

// export type AgentType = (typeof mockAgents)[number];
// export type ParcelType = (typeof mockParcels)[number];

export default function DeliveryAgentAssignment() {
   const [selectedAgent, setSelectedAgent] = useState<string>('');
   const [selectedParcels, setSelectedParcels] = useState<string[]>([]);
   const [searchTerm, setSearchTerm] = useState('');
   const [statusFilter, setStatusFilter] = useState('ALL');
   const [priorityFilter, setPriorityFilter] = useState('ALL');
   const dispatch = useAppDispatch();
   const assignableParcels = useAppSelector(selectAssignableParcels);
   const assignableAgents = useAppSelector(selectAssignableAgents);
   const { session } = useSession();
   const statusAgent = useAppSelector(selectStatus);
   const statusParcel = useAppSelector(selectStatusParcel);

   // Filter parcels based on search and filters
   const filteredParcels = useMemo(() => {
      return assignableParcels.filter((parcel) => {
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
         // const matchesPriority =
         //    priorityFilter === 'ALL' || parcel.priority === priorityFilter;

         return matchesSearch && matchesStatus;
         //  && matchesPriority;
      });
   }, [assignableParcels, searchTerm, statusFilter]);

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

      const agent = assignableAgents.find((a) => a.id === selectedAgent);

      // Reset selections after assignment
      setSelectedParcels([]);
      setSelectedAgent('');

      // Here you would typically make an API call to assign the parcels
   };

   const selectedAgentData = assignableAgents.find(
      (a) => a.id === selectedAgent,
   );
   const canAssign = selectedAgent && selectedParcels.length > 0;

   useEffect(() => {
      if (session) {
         dispatch(fetchAssignableAgents(session.accessToken));
      }
   }, [dispatch, session]);

   useEffect(() => {
      if (session) {
         dispatch(fetchAssignableParcels(session.accessToken));
      }
   }, [dispatch, session]);

   return (
      <div className="bg-background min-h-screen">
         {/* Header */}
         <DbHeader />

         <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
               {/* Left Column - Agent Selection */}
               <DBAvailableAgents
                  agents={assignableAgents}
                  selectedAgent={selectedAgent}
                  setSelectedAgent={setSelectedAgent}
                  count={assignableAgents.length}
               />

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
                                          ` for ${selectedAgentData.firstName}`}
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
                           <ParcelCard
                              key={parcel.id}
                              parcel={parcel}
                              handleSelectedParcel={handleParcelSelect}
                              selectedParcels={selectedParcels}
                           />
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
