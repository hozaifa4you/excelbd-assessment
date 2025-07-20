import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';

import { Badge } from '@/components/ui/badge';
import {
   Card,
   CardAction,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';

interface SummaryCardsProps {
   summary: {
      total: { total: number; totalGrowth: number };
      delivery: { delivered: number; deliveryGrowth: number };
      cancel: { canceled: number; canceledGrowth: number };
      pending: number;
   };
}

export function SectionCards({ summary }: SummaryCardsProps) {
   return (
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
         <Card className="@container/card">
            <CardHeader>
               <CardDescription>Total Bookings</CardDescription>
               <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {summary.total.total}
               </CardTitle>
               <CardAction>
                  <Badge variant="outline">
                     {summary.total.totalGrowth > 0 ? (
                        <IconTrendingUp />
                     ) : (
                        <IconTrendingDown />
                     )}
                     {summary.total.totalGrowth > 0
                        ? `+${summary.total.totalGrowth.toFixed(2)}`
                        : summary.total.totalGrowth.toFixed()}
                     %
                  </Badge>
               </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
               <div className="line-clamp-1 flex gap-2 font-medium">
                  {summary.total.totalGrowth > 0
                     ? 'Growing steadily'
                     : summary.total.totalGrowth < 0
                       ? 'Declining this month'
                       : 'Stable performance'}{' '}
                  {summary.total.totalGrowth > 0 ? (
                     <IconTrendingUp className="size-4" />
                  ) : (
                     <IconTrendingDown className="size-4" />
                  )}
               </div>
               <div className="text-muted-foreground">
                  Total bookings for the month
               </div>
            </CardFooter>
         </Card>
         <Card className="@container/card">
            <CardHeader>
               <CardDescription>Delivered Parcels</CardDescription>
               <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {summary.delivery.delivered}
               </CardTitle>
               <CardAction>
                  <Badge variant="outline">
                     {summary.delivery.deliveryGrowth > 0 ? (
                        <IconTrendingUp />
                     ) : (
                        <IconTrendingDown />
                     )}
                     {summary.delivery.deliveryGrowth > 0
                        ? `+${summary.delivery.deliveryGrowth.toFixed(2)}`
                        : summary.delivery.deliveryGrowth.toFixed(2)}
                     %
                  </Badge>
               </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
               <div className="line-clamp-1 flex gap-2 font-medium">
                  {summary.delivery.deliveryGrowth > 0
                     ? 'Trending up'
                     : 'Trending down'}{' '}
                  this month{' '}
                  {summary.delivery.deliveryGrowth > 0 ? (
                     <IconTrendingUp className="size-4" />
                  ) : (
                     <IconTrendingDown className="size-4" />
                  )}
               </div>
               <div className="text-muted-foreground">
                  Successfully delivered parcels
               </div>
            </CardFooter>
         </Card>
         <Card className="@container/card">
            <CardHeader>
               <CardDescription>Cancelled Parcels</CardDescription>
               <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {summary.cancel.canceled}
               </CardTitle>
               <CardAction>
                  <Badge variant="outline">
                     {summary.cancel.canceledGrowth > 0 ? (
                        <IconTrendingUp />
                     ) : (
                        <IconTrendingDown />
                     )}
                     {summary.cancel.canceledGrowth > 0
                        ? `+${summary.cancel.canceledGrowth.toFixed(2)}`
                        : summary.cancel.canceledGrowth.toFixed(2)}
                     %
                  </Badge>
               </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
               <div className="line-clamp-1 flex gap-2 font-medium">
                  {summary.cancel.canceledGrowth > 0
                     ? 'Trending up'
                     : 'Trending down'}{' '}
                  this month{' '}
                  {summary.cancel.canceledGrowth > 0 ? (
                     <IconTrendingUp className="size-4" />
                  ) : (
                     <IconTrendingDown className="size-4" />
                  )}
               </div>
               <div className="text-muted-foreground">
                  {summary.cancel.canceledGrowth <= 0
                     ? 'Good performance'
                     : 'Needs attention'}
               </div>
            </CardFooter>
         </Card>
         <Card className="@container/card">
            <CardHeader>
               <CardDescription>Pending Parcels</CardDescription>
               <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {summary.pending}
               </CardTitle>
               <CardAction>
                  <Badge variant="outline">
                     {summary.pending > 0 ? (
                        <IconTrendingUp />
                     ) : (
                        <IconTrendingDown />
                     )}
                     {summary.pending > 0 ? 'Active' : 'None'}
                  </Badge>
               </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
               <div className="line-clamp-1 flex gap-2 font-medium">
                  {summary.pending > 0 ? 'Requires attention' : 'All clear'}{' '}
                  {summary.pending > 0 ? (
                     <IconTrendingUp className="size-4" />
                  ) : (
                     <IconTrendingDown className="size-4" />
                  )}
               </div>
               <div className="text-muted-foreground">
                  Parcels awaiting processing
               </div>
            </CardFooter>
         </Card>
      </div>
   );
}
