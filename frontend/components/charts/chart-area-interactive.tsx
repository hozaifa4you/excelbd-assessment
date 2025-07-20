'use client';
import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';
import {
   Card,
   CardAction,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import {
   ChartConfig,
   ChartContainer,
   ChartTooltip,
   ChartTooltipContent,
} from '@/components/ui/chart';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export const description =
   'This chart displays the total bookings over a specified time range, with options to filter by the last 3 months, 30 days, or 7 days.';

const chartData = [
   { date: '2024-04-01', delivered: 222, canceled: 150 },
   { date: '2024-04-02', delivered: 97, canceled: 180 },
   { date: '2024-04-03', delivered: 167, canceled: 120 },
   { date: '2024-04-04', delivered: 242, canceled: 260 },
   { date: '2024-04-05', delivered: 373, canceled: 290 },
   { date: '2024-04-06', delivered: 301, canceled: 340 },
   { date: '2024-04-07', delivered: 245, canceled: 180 },
   { date: '2024-04-08', delivered: 409, canceled: 320 },
   { date: '2024-04-09', delivered: 59, canceled: 110 },
   { date: '2024-04-10', delivered: 261, canceled: 190 },
   { date: '2024-04-11', delivered: 327, canceled: 350 },
   { date: '2024-04-12', delivered: 292, canceled: 210 },
   { date: '2024-04-13', delivered: 342, canceled: 380 },
   { date: '2024-04-14', delivered: 137, canceled: 220 },
   { date: '2024-04-15', delivered: 120, canceled: 170 },
   { date: '2024-04-16', delivered: 138, canceled: 190 },
   { date: '2024-04-17', delivered: 446, canceled: 360 },
   { date: '2024-04-18', delivered: 364, canceled: 410 },
   { date: '2024-04-19', delivered: 243, canceled: 180 },
   { date: '2024-04-20', delivered: 89, canceled: 150 },
   { date: '2024-04-21', delivered: 137, canceled: 200 },
   { date: '2024-04-22', delivered: 224, canceled: 170 },
   { date: '2024-04-23', delivered: 138, canceled: 230 },
   { date: '2024-04-24', delivered: 387, canceled: 290 },
   { date: '2024-04-25', delivered: 215, canceled: 250 },
   { date: '2024-04-26', delivered: 75, canceled: 130 },
   { date: '2024-04-27', delivered: 383, canceled: 420 },
   { date: '2024-04-28', delivered: 122, canceled: 180 },
   { date: '2024-04-29', delivered: 315, canceled: 240 },
   { date: '2024-04-30', delivered: 454, canceled: 380 },
   { date: '2024-05-01', delivered: 165, canceled: 220 },
   { date: '2024-05-02', delivered: 293, canceled: 310 },
   { date: '2024-05-03', delivered: 247, canceled: 190 },
   { date: '2024-05-04', delivered: 385, canceled: 420 },
   { date: '2024-05-05', delivered: 481, canceled: 390 },
   { date: '2024-05-06', delivered: 498, canceled: 520 },
   { date: '2024-05-07', delivered: 388, canceled: 300 },
   { date: '2024-05-08', delivered: 149, canceled: 210 },
   { date: '2024-05-09', delivered: 227, canceled: 180 },
   { date: '2024-05-10', delivered: 293, canceled: 330 },
   { date: '2024-05-11', delivered: 335, canceled: 270 },
   { date: '2024-05-12', delivered: 197, canceled: 240 },
   { date: '2024-05-13', delivered: 197, canceled: 160 },
   { date: '2024-05-14', delivered: 448, canceled: 490 },
   { date: '2024-05-15', delivered: 473, canceled: 380 },
   { date: '2024-05-16', delivered: 338, canceled: 400 },
   { date: '2024-05-17', delivered: 499, canceled: 420 },
   { date: '2024-05-18', delivered: 315, canceled: 350 },
   { date: '2024-05-19', delivered: 235, canceled: 180 },
   { date: '2024-05-20', delivered: 177, canceled: 230 },
   { date: '2024-05-21', delivered: 82, canceled: 140 },
   { date: '2024-05-22', delivered: 81, canceled: 120 },
   { date: '2024-05-23', delivered: 252, canceled: 290 },
   { date: '2024-05-24', delivered: 294, canceled: 220 },
   { date: '2024-05-25', delivered: 201, canceled: 250 },
   { date: '2024-05-26', delivered: 213, canceled: 170 },
   { date: '2024-05-27', delivered: 420, canceled: 460 },
   { date: '2024-05-28', delivered: 233, canceled: 190 },
   { date: '2024-05-29', delivered: 78, canceled: 130 },
   { date: '2024-05-30', delivered: 340, canceled: 280 },
   { date: '2024-05-31', delivered: 178, canceled: 230 },
   { date: '2024-06-01', delivered: 178, canceled: 200 },
   { date: '2024-06-02', delivered: 470, canceled: 410 },
   { date: '2024-06-03', delivered: 103, canceled: 160 },
   { date: '2024-06-04', delivered: 439, canceled: 380 },
   { date: '2024-06-05', delivered: 88, canceled: 140 },
   { date: '2024-06-06', delivered: 294, canceled: 250 },
   { date: '2024-06-07', delivered: 323, canceled: 370 },
   { date: '2024-06-08', delivered: 385, canceled: 320 },
   { date: '2024-06-09', delivered: 438, canceled: 480 },
   { date: '2024-06-10', delivered: 155, canceled: 200 },
   { date: '2024-06-11', delivered: 92, canceled: 150 },
   { date: '2024-06-12', delivered: 492, canceled: 420 },
   { date: '2024-06-13', delivered: 81, canceled: 130 },
   { date: '2024-06-14', delivered: 426, canceled: 380 },
   { date: '2024-06-15', delivered: 307, canceled: 350 },
   { date: '2024-06-16', delivered: 371, canceled: 310 },
   { date: '2024-06-17', delivered: 475, canceled: 520 },
   { date: '2024-06-18', delivered: 107, canceled: 170 },
   { date: '2024-06-19', delivered: 341, canceled: 290 },
   { date: '2024-06-20', delivered: 408, canceled: 450 },
   { date: '2024-06-21', delivered: 169, canceled: 210 },
   { date: '2024-06-22', delivered: 317, canceled: 270 },
   { date: '2024-06-23', delivered: 480, canceled: 530 },
   { date: '2024-06-24', delivered: 132, canceled: 180 },
   { date: '2024-06-25', delivered: 141, canceled: 190 },
   { date: '2024-06-26', delivered: 434, canceled: 380 },
   { date: '2024-06-27', delivered: 448, canceled: 490 },
   { date: '2024-06-28', delivered: 149, canceled: 200 },
   { date: '2024-06-29', delivered: 103, canceled: 160 },
   { date: '2024-06-30', delivered: 446, canceled: 400 },
];

interface ChartAreaProps {
   data?: unknown;
}

export function BookingsAreaChart() {
   const isMobile = useIsMobile();
   const [timeRange, setTimeRange] = React.useState('90d');

   const chartConfig = {
      visitors: {
         label: 'Bookings',
      },
      delivered: {
         label: 'Delivery',
         color: 'var(--primary)',
      },
      canceled: {
         label: 'Canceled',
         color: 'var(--primary)',
      },
   } satisfies ChartConfig;

   React.useEffect(() => {
      if (isMobile) {
         setTimeRange('7d');
      }
   }, [isMobile]);

   const filteredData = chartData.filter((item) => {
      const date = new Date(item.date);
      const referenceDate = new Date('2024-06-30');
      let daysToSubtract = 90;
      if (timeRange === '30d') {
         daysToSubtract = 30;
      } else if (timeRange === '7d') {
         daysToSubtract = 7;
      }
      const startDate = new Date(referenceDate);
      startDate.setDate(startDate.getDate() - daysToSubtract);
      return date >= startDate;
   });

   return (
      <Card className="@container/card">
         <CardHeader>
            <CardTitle>Total Bookings</CardTitle>
            <CardDescription>
               <span className="hidden @[540px]/card:block">
                  Total for the last 3 months
               </span>
               <span className="@[540px]/card:hidden">Last 3 months</span>
            </CardDescription>
            <CardAction>
               <ToggleGroup
                  type="single"
                  value={timeRange}
                  onValueChange={setTimeRange}
                  variant="outline"
                  className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
               >
                  <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
                  <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
                  <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
               </ToggleGroup>
               <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger
                     className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                     size="sm"
                     aria-label="Select a value"
                  >
                     <SelectValue placeholder="Last 3 months" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                     <SelectItem value="90d" className="rounded-lg">
                        Last 3 months
                     </SelectItem>
                     <SelectItem value="30d" className="rounded-lg">
                        Last 30 days
                     </SelectItem>
                     <SelectItem value="7d" className="rounded-lg">
                        Last 7 days
                     </SelectItem>
                  </SelectContent>
               </Select>
            </CardAction>
         </CardHeader>
         <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
            <ChartContainer
               config={chartConfig}
               className="aspect-auto h-[250px] w-full"
            >
               <AreaChart data={filteredData}>
                  <defs>
                     <linearGradient
                        id="fillDesktop"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                     >
                        <stop
                           offset="5%"
                           stopColor="var(--color-desktop)"
                           stopOpacity={1.0}
                        />
                        <stop
                           offset="95%"
                           stopColor="var(--color-desktop)"
                           stopOpacity={0.1}
                        />
                     </linearGradient>
                     <linearGradient
                        id="fillMobile"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                     >
                        <stop
                           offset="5%"
                           stopColor="var(--color-mobile)"
                           stopOpacity={0.8}
                        />
                        <stop
                           offset="95%"
                           stopColor="var(--color-mobile)"
                           stopOpacity={0.1}
                        />
                     </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} />
                  <XAxis
                     dataKey="date"
                     tickLine={false}
                     axisLine={false}
                     tickMargin={8}
                     minTickGap={32}
                     tickFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString('en-US', {
                           month: 'short',
                           day: 'numeric',
                        });
                     }}
                  />
                  <ChartTooltip
                     cursor={false}
                     defaultIndex={isMobile ? -1 : 10}
                     content={
                        <ChartTooltipContent
                           labelFormatter={(value) => {
                              return new Date(value).toLocaleDateString(
                                 'en-US',
                                 {
                                    month: 'short',
                                    day: 'numeric',
                                 },
                              );
                           }}
                           indicator="dot"
                        />
                     }
                  />
                  <Area
                     dataKey="delivered"
                     type="natural"
                     fill="url(#fillMobile)"
                     stroke="var(--color-mobile)"
                     stackId="a"
                  />
                  <Area
                     dataKey="canceled"
                     type="natural"
                     fill="url(#fillDesktop)"
                     stroke="var(--color-desktop)"
                     stackId="a"
                  />
               </AreaChart>
            </ChartContainer>
         </CardContent>
      </Card>
   );
}
