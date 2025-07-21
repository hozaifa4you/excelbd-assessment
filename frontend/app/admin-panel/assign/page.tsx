'use client';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
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
import { Package, Search, UserPlus, CheckCircle, Loader2 } from 'lucide-react';
import { DbHeader } from '@/components/dashboard/db-header';
import { DBAvailableAgents } from '@/components/dashboard/admin/db-available-agents';
import { ParcelCard } from '@/components/dashboard/admin/parcel-card';
import { AssignmentLoader } from '@/components/dashboard/admin/assignment-loader';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
   fetchAssignableAgents,
   fetchAssignableParcels,
   selectAssignableAgents,
   selectAssignableParcels,
   selectStatus,
   selectStatusAssign,
   selectStatusParcel,
   setAssignParcel,
} from '@/redux/reducers/adminSlice';
import { useSession } from '@/hooks/use-session';
import { toast } from 'sonner';

export default function DeliveryAgentAssignment() {
   const [selectedAgent, setSelectedAgent] = useState<string>('');
   const [selectedParcels, setSelectedParcels] = useState<string[]>([]);
   const [searchTerm, setSearchTerm] = useState('');
   const [statusFilter, setStatusFilter] = useState('ALL');
   const [priorityFilter, setPriorityFilter] = useState('ALL');

   const dispatch = useAppDispatch();
   const assignableParcels = useAppSelector(selectAssignableParcels);
   const assignableAgents = useAppSelector(selectAssignableAgents);
   const parcelStatus = useAppSelector(selectStatusParcel);
   const agentStatus = useAppSelector(selectStatus);
   const assignStatus = useAppSelector(selectStatusAssign);
   const { session } = useSession();

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

         return matchesSearch && matchesStatus;
      });
   }, [assignableParcels, searchTerm, statusFilter]);

   const selectedAgentData = useMemo(
      () => assignableAgents.find((a) => a.id === selectedAgent),
      [assignableAgents, selectedAgent],
   );

   const canAssign = useMemo(
      () =>
         Boolean(
            selectedAgent &&
               selectedParcels.length > 0 &&
               assignStatus !== 'loading',
         ),
      [selectedAgent, selectedParcels.length, assignStatus],
   );

   const agentsCount = useMemo(
      () => assignableAgents.length,
      [assignableAgents.length],
   );

   const selectAllState = useMemo(
      () => ({
         checked:
            selectedParcels.length === filteredParcels.length &&
            filteredParcels.length > 0,
         indeterminate:
            selectedParcels.length > 0 &&
            selectedParcels.length < filteredParcels.length,
      }),
      [selectedParcels.length, filteredParcels.length],
   );

   const isInitialLoading = useMemo(() => {
      return (
         (agentStatus === 'loading' && assignableAgents.length === 0) ||
         (parcelStatus === 'loading' && assignableParcels.length === 0)
      );
   }, [
      agentStatus,
      parcelStatus,
      assignableAgents.length,
      assignableParcels.length,
   ]);

   const handleParcelSelect = useCallback((parcelId: string) => {
      setSelectedParcels((prev) =>
         prev.includes(parcelId)
            ? prev.filter((id) => id !== parcelId)
            : [...prev, parcelId],
      );
   }, []);

   const handleSelectAll = useCallback(() => {
      if (selectedParcels.length === filteredParcels.length) {
         setSelectedParcels([]);
      } else {
         setSelectedParcels(filteredParcels.map((p) => p.id));
      }
   }, [selectedParcels.length, filteredParcels]);

   const handleAssignParcels = useCallback(async () => {
      if (
         !selectedAgent ||
         selectedParcels.length === 0 ||
         !session?.accessToken
      )
         return;

      try {
         dispatch(
            setAssignParcel(
               session.accessToken,
               selectedAgent,
               selectedParcels,
            ),
         );

         setSelectedParcels([]);
         setSelectedAgent('');

         toast.success('Parcels Assigned Successfully', {
            description: `${selectedParcels.length} parcel(s) have been assigned to the selected agent.`,
         });
      } catch (error) {
         toast.error('Assignment Failed', {
            description:
               error instanceof Error
                  ? error.message
                  : 'Failed to assign parcels. Please try again.',
         });
         console.error('Failed to assign parcels:', error);
      }
   }, [selectedAgent, selectedParcels, session?.accessToken, dispatch]);

   const handleSearchChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
         setSearchTerm(e.target.value);
      },
      [],
   );

   useEffect(() => {
      if (session?.accessToken) {
         dispatch(fetchAssignableAgents(session.accessToken));
      }
   }, [dispatch, session?.accessToken]);

   useEffect(() => {
      if (session?.accessToken) {
         dispatch(fetchAssignableParcels(session.accessToken));
      }
   }, [dispatch, session?.accessToken]);

   // Show initial loader when either agents or parcels are loading
   if (isInitialLoading) {
      return (
         <>
            <DbHeader />
            <AssignmentLoader
               isLoadingAgents={agentStatus === 'loading'}
               isLoadingParcels={parcelStatus === 'loading'}
            />
         </>
      );
   }

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
                  count={agentsCount}
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
                                    onChange={handleSearchChange}
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
                                 {assignStatus === 'loading' ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                 ) : (
                                    <UserPlus className="mr-2 h-4 w-4" />
                                 )}
                                 {assignStatus === 'loading'
                                    ? 'Assigning...'
                                    : 'Assign Parcels'}
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
                                 checked={selectAllState.checked}
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
