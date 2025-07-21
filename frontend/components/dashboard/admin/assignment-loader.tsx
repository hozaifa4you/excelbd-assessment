import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, Users, Loader2 } from 'lucide-react';

interface AssignmentLoaderProps {
   isLoadingAgents: boolean;
   isLoadingParcels: boolean;
}

export const AssignmentLoader: React.FC<AssignmentLoaderProps> = ({
   isLoadingAgents,
   isLoadingParcels,
}) => {
   const isFullyLoading = isLoadingAgents && isLoadingParcels;

   if (isFullyLoading) {
      // Full page loading state
      return (
         <div className="bg-background min-h-screen">
            {/* Loading indicator at the top */}
            <div className="bg-primary/10 fixed top-0 right-0 left-0 z-50 border-b">
               <div className="flex items-center justify-center py-3">
                  <Loader2 className="text-primary mr-2 h-4 w-4 animate-spin" />
                  <span className="text-primary text-sm font-medium">
                     Loading Assignment Dashboard...
                  </span>
               </div>
            </div>

            <div className="container mx-auto mt-12 px-4 py-8">
               <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                  {/* Left Column - Agents Loading */}
                  <div className="space-y-6">
                     <Card className="animate-pulse">
                        <CardHeader>
                           <div className="flex items-center gap-2">
                              <Users className="text-muted-foreground h-5 w-5" />
                              <Skeleton className="h-6 w-32" />
                           </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           {[...Array(3)].map((_, i) => (
                              <div
                                 key={i}
                                 className="border-muted rounded-lg border-2 p-4"
                              >
                                 <div className="flex items-start gap-3">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="flex-1 space-y-2">
                                       <Skeleton className="h-4 w-24" />
                                       <div className="space-y-1">
                                          <Skeleton className="h-3 w-20" />
                                          <Skeleton className="h-3 w-16" />
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </CardContent>
                     </Card>
                  </div>

                  {/* Right Column - Parcels Loading */}
                  <div className="space-y-6 lg:col-span-2">
                     {/* Search and Filters Loading */}
                     <Card className="animate-pulse">
                        <CardContent className="p-6">
                           <div className="flex flex-col gap-4 md:flex-row">
                              <div className="flex-1">
                                 <Skeleton className="h-10 w-full" />
                              </div>
                              <div className="flex gap-2">
                                 <Skeleton className="h-10 w-32" />
                                 <Skeleton className="h-10 w-32" />
                              </div>
                           </div>
                        </CardContent>
                     </Card>

                     {/* Parcel List Loading */}
                     <Card className="animate-pulse">
                        <CardHeader>
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                 <Package className="text-muted-foreground h-5 w-5" />
                                 <Skeleton className="h-6 w-40" />
                              </div>
                              <div className="flex items-center gap-2">
                                 <Skeleton className="h-4 w-4" />
                                 <Skeleton className="h-4 w-16" />
                              </div>
                           </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           {[...Array(4)].map((_, i) => (
                              <div
                                 key={i}
                                 className="border-muted rounded-lg border-2 p-4"
                              >
                                 <div className="flex items-start gap-4">
                                    <Skeleton className="mt-1 h-5 w-5" />
                                    <div className="flex-1 space-y-3">
                                       <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-3">
                                             <Skeleton className="h-6 w-24" />
                                             <Skeleton className="h-5 w-16" />
                                          </div>
                                          <Skeleton className="h-5 w-20" />
                                       </div>
                                       <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                          <div className="space-y-2">
                                             <Skeleton className="h-4 w-20" />
                                             <Skeleton className="h-3 w-16" />
                                             <Skeleton className="h-4 w-24" />
                                             <Skeleton className="h-3 w-20" />
                                          </div>
                                          <div className="space-y-2">
                                             <Skeleton className="h-3 w-24" />
                                             <Skeleton className="h-4 w-32" />
                                             <Skeleton className="h-3 w-20" />
                                             <Skeleton className="h-4 w-28" />
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </CardContent>
                     </Card>
                  </div>
               </div>
            </div>
         </div>
      );
   }

   // Partial loading states for individual sections
   return (
      <div className="space-y-6">
         {isLoadingAgents && (
            <Card className="animate-pulse">
               <CardHeader>
                  <div className="flex items-center gap-2">
                     <Users className="text-muted-foreground h-5 w-5" />
                     <Skeleton className="h-6 w-32" />
                  </div>
               </CardHeader>
               <CardContent className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                     <div
                        key={i}
                        className="border-muted rounded-lg border-2 p-4"
                     >
                        <div className="flex items-start gap-3">
                           <Skeleton className="h-12 w-12 rounded-full" />
                           <div className="flex-1 space-y-2">
                              <Skeleton className="h-4 w-24" />
                              <div className="space-y-1">
                                 <Skeleton className="h-3 w-20" />
                                 <Skeleton className="h-3 w-16" />
                              </div>
                           </div>
                        </div>
                     </div>
                  ))}
               </CardContent>
            </Card>
         )}

         {isLoadingParcels && (
            <Card className="animate-pulse">
               <CardHeader>
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <Package className="text-muted-foreground h-5 w-5" />
                        <Skeleton className="h-6 w-40" />
                     </div>
                     <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-16" />
                     </div>
                  </div>
               </CardHeader>
               <CardContent className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                     <div
                        key={i}
                        className="border-muted rounded-lg border-2 p-4"
                     >
                        <div className="flex items-start gap-4">
                           <Skeleton className="mt-1 h-5 w-5" />
                           <div className="flex-1 space-y-3">
                              <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-3">
                                    <Skeleton className="h-6 w-24" />
                                    <Skeleton className="h-5 w-16" />
                                 </div>
                                 <Skeleton className="h-5 w-20" />
                              </div>
                              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                 <div className="space-y-2">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-3 w-16" />
                                 </div>
                                 <div className="space-y-2">
                                    <Skeleton className="h-3 w-24" />
                                    <Skeleton className="h-4 w-32" />
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  ))}
               </CardContent>
            </Card>
         )}
      </div>
   );
};
