'use client';
import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
   closestCenter,
   DndContext,
   KeyboardSensor,
   MouseSensor,
   TouchSensor,
   useSensor,
   useSensors,
   type DragEndEvent,
   type UniqueIdentifier,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
   arrayMove,
   SortableContext,
   useSortable,
   verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
   IconChevronDown,
   IconChevronLeft,
   IconChevronRight,
   IconChevronsLeft,
   IconChevronsRight,
   IconCircleCheckFilled,
   IconDotsVertical,
   IconLayoutColumns,
   IconLoader,
   IconPlus,
   IconTrendingUp,
} from '@tabler/icons-react';
import {
   ColumnDef,
   ColumnFiltersState,
   flexRender,
   getCoreRowModel,
   getFacetedRowModel,
   getFacetedUniqueValues,
   getFilteredRowModel,
   getSortedRowModel,
   Row,
   SortingState,
   useReactTable,
   VisibilityState,
} from '@tanstack/react-table';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import { z } from 'zod';

import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
   ChartConfig,
   ChartContainer,
   ChartTooltip,
   ChartTooltipContent,
} from '@/components/ui/chart';
import { Checkbox } from '@/components/ui/checkbox';
import {
   Drawer,
   DrawerClose,
   DrawerContent,
   DrawerDescription,
   DrawerFooter,
   DrawerHeader,
   DrawerTitle,
   DrawerTrigger,
} from '@/components/ui/drawer';
import {
   DropdownMenu,
   DropdownMenuCheckboxItem,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const schema = z.object({
   id: z.string(),
   parcelType: z.string(),
   trackingNumber: z.string(),
   status: z.string(),
   estimatedDelivery: z.string().nullable(),
   recipient: z.object({
      name: z.string(),
      phone: z.string(),
   }),
   sender: z.object({
      name: z.string(),
      phone: z.string(),
   }),
   pickupAddress: z.object({ city: z.string() }),
   deliveryAddress: z.object({ city: z.string() }),
});

type ParcelData = z.infer<typeof schema>;

const columns: ColumnDef<ParcelData>[] = [
   {
      id: 'select',
      header: ({ table }) => (
         <div className="flex items-center justify-center">
            <Checkbox
               checked={
                  table.getIsAllPageRowsSelected() ||
                  (table.getIsSomePageRowsSelected() && 'indeterminate')
               }
               onCheckedChange={(value) =>
                  table.toggleAllPageRowsSelected(!!value)
               }
               aria-label="Select all"
            />
         </div>
      ),
      cell: ({ row }) => (
         <div className="flex items-center justify-center">
            <Checkbox
               checked={row.getIsSelected()}
               onCheckedChange={(value) => row.toggleSelected(!!value)}
               aria-label="Select row"
            />
         </div>
      ),
      enableSorting: false,
      enableHiding: false,
   },
   {
      accessorKey: 'parcelType',
      header: 'Parcel Type',
      cell: ({ row }) => {
         return <TableCellViewer item={row.original} />;
      },
      enableHiding: false,
   },
   {
      accessorKey: 'trackingNumber',
      header: 'Tracking Number',
      cell: ({ row }) => (
         <div className="w-32">
            <Badge variant="outline" className="text-muted-foreground px-1.5">
               {row.original.trackingNumber.substring(0, 6)}
            </Badge>
         </div>
      ),
   },
   {
      id: 'route',
      header: 'From / To',
      cell: ({ row }) => (
         <div className="text-sm">
            <div className="font-medium">{row.original.pickupAddress.city}</div>
            <div className="text-muted-foreground">
               ↓ {row.original.deliveryAddress.city}
            </div>
         </div>
      ),
   },
   {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
         <Badge variant="outline" className="text-muted-foreground px-1.5">
            {row.original.status === 'DELIVERED' ? (
               <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
            ) : (
               <IconLoader />
            )}
            {row.original.status}
         </Badge>
      ),
   },
   {
      accessorKey: 'sender',
      header: () => <div className="w-full text-right">Sender</div>,
      cell: ({ row }) => (
         <div className="text-right">
            <div className="font-medium">{row.original.sender.name}</div>
            <div className="text-muted-foreground text-sm">
               {row.original.sender.phone}
            </div>
         </div>
      ),
   },
   {
      accessorKey: 'recipient',
      header: () => <div className="w-full text-right">Recipient</div>,
      cell: ({ row }) => (
         <div className="text-right">
            <div className="font-medium">{row.original.recipient.name}</div>
            <div className="text-muted-foreground text-sm">
               {row.original.recipient.phone}
            </div>
         </div>
      ),
   },
   {
      accessorKey: 'estimatedDelivery',
      header: 'Est. Delivery',
      cell: ({ row }) => {
         const deliveryDate = row.original?.estimatedDelivery;

         if (!deliveryDate) {
            return (
               <div className="text-muted-foreground text-sm">
                  <div className="flex items-center gap-1">
                     <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                     <span>Not set</span>
                  </div>
               </div>
            );
         }

         const date = new Date(deliveryDate);
         const now = new Date();
         const diffTime = date.getTime() - now.getTime();
         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

         // Format the date
         const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year:
               date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
         });

         const formattedTime = date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
         });

         // Determine status and color
         let statusColor = 'bg-green-500';
         let statusText = '';
         let textColor = 'text-green-700 dark:text-green-400';

         if (diffDays < 0) {
            statusColor = 'bg-red-500';
            statusText = `${Math.abs(diffDays)} days overdue`;
            textColor = 'text-red-700 dark:text-red-400';
         } else if (diffDays === 0) {
            statusColor = 'bg-orange-500';
            statusText = 'Today';
            textColor = 'text-orange-700 dark:text-orange-400';
         } else if (diffDays === 1) {
            statusColor = 'bg-yellow-500';
            statusText = 'Tomorrow';
            textColor = 'text-yellow-700 dark:text-yellow-400';
         } else if (diffDays <= 3) {
            statusColor = 'bg-blue-500';
            statusText = `In ${diffDays} days`;
            textColor = 'text-blue-700 dark:text-blue-400';
         } else {
            statusText = `In ${diffDays} days`;
         }

         return (
            <div className="text-sm">
               <div className={`flex items-center gap-2 ${textColor}`}>
                  <div className={`h-2 w-2 rounded-full ${statusColor}`}></div>
                  <div className="flex flex-col">
                     <span className="font-medium">{formattedDate}</span>
                     <span className="text-muted-foreground text-xs">
                        {formattedTime} • {statusText}
                     </span>
                  </div>
               </div>
            </div>
         );
      },
   },
   {
      id: 'actions',
      cell: () => (
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button
                  variant="ghost"
                  className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                  size="icon"
               >
                  <IconDotsVertical />
                  <span className="sr-only">Open menu</span>
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
               <DropdownMenuItem>Edit</DropdownMenuItem>
               <DropdownMenuItem variant="destructive">Cancel</DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
      ),
   },
];

function DraggableRow({ row }: { row: Row<ParcelData> }) {
   const { transform, transition, setNodeRef, isDragging } = useSortable({
      id: row.original.id,
   });

   return (
      <TableRow
         data-state={row.getIsSelected() && 'selected'}
         data-dragging={isDragging}
         ref={setNodeRef}
         className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
         style={{
            transform: CSS.Transform.toString(transform),
            transition: transition,
         }}
      >
         {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id}>
               {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
         ))}
      </TableRow>
   );
}

export function DataTable({
   data: initialData,
   paginationInfo,
}: {
   data: ParcelData[];
   paginationInfo: { page: number; total: number; pages: number };
}) {
   const router = useRouter();
   const searchParams = useSearchParams();
   const [data, setData] = React.useState(() => initialData);
   const [rowSelection, setRowSelection] = React.useState({});
   const [columnVisibility, setColumnVisibility] =
      React.useState<VisibilityState>({});
   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
      [],
   );
   const [sorting, setSorting] = React.useState<SortingState>([]);

   // Initialize pagination state from paginationInfo
   const [pagination, setPagination] = React.useState({
      pageIndex: paginationInfo.page - 1, // Convert to 0-based index
      pageSize: Number(searchParams.get('limit')) || 10,
   });

   // Sync pagination state when paginationInfo changes
   React.useEffect(() => {
      setPagination((prev) => ({
         ...prev,
         pageIndex: paginationInfo.page - 1,
      }));
   }, [paginationInfo.page]);

   // Update data when initialData changes
   React.useEffect(() => {
      setData(initialData);
   }, [initialData]);

   const sortableId = React.useId();
   const sensors = useSensors(
      useSensor(MouseSensor, {}),
      useSensor(TouchSensor, {}),
      useSensor(KeyboardSensor, {}),
   );

   // Update URL parameters when pagination changes
   const updateURL = React.useCallback(
      (page: number, limit: number) => {
         const params = new URLSearchParams(searchParams.toString());
         params.set('page', page.toString());
         params.set('limit', limit.toString());
         router.push(`?${params.toString()}`);
      },
      [router, searchParams],
   );

   // Handle page size change
   const handlePageSizeChange = React.useCallback(
      (newPageSize: number) => {
         const newPageIndex = 0; // Reset to first page when changing page size
         setPagination({
            pageIndex: newPageIndex,
            pageSize: newPageSize,
         });
         updateURL(1, newPageSize); // Convert back to 1-based for URL
      },
      [updateURL],
   );

   // Handle page navigation
   const handlePageChange = React.useCallback(
      (newPageIndex: number) => {
         setPagination((prev) => ({
            ...prev,
            pageIndex: newPageIndex,
         }));
         updateURL(newPageIndex + 1, pagination.pageSize); // Convert to 1-based for URL
      },
      [updateURL, pagination.pageSize],
   );

   const dataIds = React.useMemo<UniqueIdentifier[]>(
      () => data?.map(({ id }) => id) || [],
      [data],
   );

   const table = useReactTable({
      data,
      columns,
      state: {
         sorting,
         columnVisibility,
         rowSelection,
         columnFilters,
         pagination,
      },
      getRowId: (row) => row.id,
      enableRowSelection: true,
      onRowSelectionChange: setRowSelection,
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      onColumnVisibilityChange: setColumnVisibility,
      onPaginationChange: setPagination,
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFacetedRowModel: getFacetedRowModel(),
      getFacetedUniqueValues: getFacetedUniqueValues(),
      // Disable built-in pagination since we're handling it server-side
      manualPagination: true,
      pageCount: paginationInfo.pages,
   });

   function handleDragEnd(event: DragEndEvent) {
      const { active, over } = event;
      if (active && over && active.id !== over.id) {
         setData((data) => {
            const oldIndex = dataIds.indexOf(active.id);
            const newIndex = dataIds.indexOf(over.id);
            return arrayMove(data, oldIndex, newIndex);
         });
      }
   }

   return (
      <Tabs
         defaultValue="outline"
         className="w-full flex-col justify-start gap-6"
      >
         <div className="flex items-center justify-between px-4 lg:px-6">
            <Label htmlFor="view-selector" className="sr-only">
               View
            </Label>
            <Select defaultValue="outline">
               <SelectTrigger
                  className="flex w-fit @4xl/main:hidden"
                  size="sm"
                  id="view-selector"
               >
                  <SelectValue placeholder="Select a view" />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value="outline">Outline</SelectItem>
                  <SelectItem value="past-performance">
                     Past Performance
                  </SelectItem>
                  <SelectItem value="key-personnel">Key Personnel</SelectItem>
                  <SelectItem value="focus-documents">
                     Focus Documents
                  </SelectItem>
               </SelectContent>
            </Select>
            <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
               <TabsTrigger value="outline">Outline</TabsTrigger>
               <TabsTrigger value="past-performance">
                  Past Performance <Badge variant="secondary">3</Badge>
               </TabsTrigger>
               <TabsTrigger value="key-personnel">
                  Key Personnel <Badge variant="secondary">2</Badge>
               </TabsTrigger>
               <TabsTrigger value="focus-documents">
                  Focus Documents
               </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variant="outline" size="sm">
                        <IconLayoutColumns />
                        <span className="hidden lg:inline">
                           Customize Columns
                        </span>
                        <span className="lg:hidden">Columns</span>
                        <IconChevronDown />
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                     {table
                        .getAllColumns()
                        .filter(
                           (column) =>
                              typeof column.accessorFn !== 'undefined' &&
                              column.getCanHide(),
                        )
                        .map((column) => {
                           return (
                              <DropdownMenuCheckboxItem
                                 key={column.id}
                                 className="capitalize"
                                 checked={column.getIsVisible()}
                                 onCheckedChange={(value) =>
                                    column.toggleVisibility(!!value)
                                 }
                              >
                                 {column.id}
                              </DropdownMenuCheckboxItem>
                           );
                        })}
                  </DropdownMenuContent>
               </DropdownMenu>
               <Button variant="outline" size="sm">
                  <IconPlus />
                  <span className="hidden lg:inline">Add Section</span>
               </Button>
            </div>
         </div>
         <TabsContent
            value="outline"
            className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
         >
            <div className="overflow-hidden rounded-lg border">
               <DndContext
                  collisionDetection={closestCenter}
                  modifiers={[restrictToVerticalAxis]}
                  onDragEnd={handleDragEnd}
                  sensors={sensors}
                  id={sortableId}
               >
                  <Table>
                     <TableHeader className="bg-muted sticky top-0 z-10">
                        {table.getHeaderGroups().map((headerGroup) => (
                           <TableRow key={headerGroup.id}>
                              {headerGroup.headers.map((header) => {
                                 return (
                                    <TableHead
                                       key={header.id}
                                       colSpan={header.colSpan}
                                    >
                                       {header.isPlaceholder
                                          ? null
                                          : flexRender(
                                               header.column.columnDef.header,
                                               header.getContext(),
                                            )}
                                    </TableHead>
                                 );
                              })}
                           </TableRow>
                        ))}
                     </TableHeader>
                     <TableBody className="**:data-[slot=table-cell]:first:w-8">
                        {table.getRowModel().rows?.length ? (
                           <SortableContext
                              items={dataIds}
                              strategy={verticalListSortingStrategy}
                           >
                              {table.getRowModel().rows.map((row) => (
                                 <DraggableRow key={row.id} row={row} />
                              ))}
                           </SortableContext>
                        ) : (
                           <TableRow>
                              <TableCell
                                 colSpan={columns.length}
                                 className="h-24 text-center"
                              >
                                 No results.
                              </TableCell>
                           </TableRow>
                        )}
                     </TableBody>
                  </Table>
               </DndContext>
            </div>
            <div className="flex items-center justify-between px-4">
               <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                  {table.getFilteredSelectedRowModel().rows.length} of{' '}
                  {paginationInfo.total} row(s) selected. Showing {data.length}{' '}
                  of {paginationInfo.total} total records.
               </div>
               <div className="flex w-full items-center gap-8 lg:w-fit">
                  <div className="hidden items-center gap-2 lg:flex">
                     <Label
                        htmlFor="rows-per-page"
                        className="text-sm font-medium"
                     >
                        Rows per page
                     </Label>
                     <Select
                        value={`${pagination.pageSize}`}
                        onValueChange={(value) => {
                           handlePageSizeChange(Number(value));
                        }}
                     >
                        <SelectTrigger
                           size="sm"
                           className="w-20"
                           id="rows-per-page"
                        >
                           <SelectValue placeholder={pagination.pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                           {[10, 20, 30, 40, 50].map((pageSize) => (
                              <SelectItem key={pageSize} value={`${pageSize}`}>
                                 {pageSize}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>
                  <div className="flex w-fit items-center justify-center text-sm font-medium">
                     Page {paginationInfo.page} of {paginationInfo.pages}
                  </div>
                  <div className="ml-auto flex items-center gap-2 lg:ml-0">
                     <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => handlePageChange(0)}
                        disabled={paginationInfo.page === 1}
                     >
                        <span className="sr-only">Go to first page</span>
                        <IconChevronsLeft />
                     </Button>
                     <Button
                        variant="outline"
                        className="size-8"
                        size="icon"
                        onClick={() =>
                           handlePageChange(pagination.pageIndex - 1)
                        }
                        disabled={paginationInfo.page === 1}
                     >
                        <span className="sr-only">Go to previous page</span>
                        <IconChevronLeft />
                     </Button>
                     <Button
                        variant="outline"
                        className="size-8"
                        size="icon"
                        onClick={() =>
                           handlePageChange(pagination.pageIndex + 1)
                        }
                        disabled={paginationInfo.page === paginationInfo.pages}
                     >
                        <span className="sr-only">Go to next page</span>
                        <IconChevronRight />
                     </Button>
                     <Button
                        variant="outline"
                        className="hidden size-8 lg:flex"
                        size="icon"
                        onClick={() =>
                           handlePageChange(paginationInfo.pages - 1)
                        }
                        disabled={paginationInfo.page === paginationInfo.pages}
                     >
                        <span className="sr-only">Go to last page</span>
                        <IconChevronsRight />
                     </Button>
                  </div>
               </div>
            </div>
         </TabsContent>
         <TabsContent
            value="past-performance"
            className="flex flex-col px-4 lg:px-6"
         >
            <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
         </TabsContent>
         <TabsContent
            value="key-personnel"
            className="flex flex-col px-4 lg:px-6"
         >
            <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
         </TabsContent>
         <TabsContent
            value="focus-documents"
            className="flex flex-col px-4 lg:px-6"
         >
            <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
         </TabsContent>
      </Tabs>
   );
}

const chartData = [
   { month: 'January', desktop: 186, mobile: 80 },
   { month: 'February', desktop: 305, mobile: 200 },
   { month: 'March', desktop: 237, mobile: 120 },
   { month: 'April', desktop: 73, mobile: 190 },
   { month: 'May', desktop: 209, mobile: 130 },
   { month: 'June', desktop: 214, mobile: 140 },
];

const chartConfig = {
   desktop: {
      label: 'Desktop',
      color: 'var(--primary)',
   },
   mobile: {
      label: 'Mobile',
      color: 'var(--primary)',
   },
} satisfies ChartConfig;

function TableCellViewer({ item }: { item: ParcelData }) {
   const isMobile = useIsMobile();

   return (
      <Drawer direction={isMobile ? 'bottom' : 'right'}>
         <DrawerTrigger asChild>
            <Button
               variant="link"
               className="text-foreground w-fit px-0 text-left"
            >
               {item.parcelType}
            </Button>
         </DrawerTrigger>
         <DrawerContent>
            <DrawerHeader className="gap-1">
               <DrawerTitle>{item.parcelType}</DrawerTitle>
               <DrawerDescription>
                  Parcel details and tracking information
               </DrawerDescription>
            </DrawerHeader>
            <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
               {!isMobile && (
                  <>
                     <ChartContainer config={chartConfig}>
                        <AreaChart
                           accessibilityLayer
                           data={chartData}
                           margin={{
                              left: 0,
                              right: 10,
                           }}
                        >
                           <CartesianGrid vertical={false} />
                           <XAxis
                              dataKey="month"
                              tickLine={false}
                              axisLine={false}
                              tickMargin={8}
                              tickFormatter={(value) => value.slice(0, 3)}
                              hide
                           />
                           <ChartTooltip
                              cursor={false}
                              content={<ChartTooltipContent indicator="dot" />}
                           />
                           <Area
                              dataKey="mobile"
                              type="natural"
                              fill="var(--color-mobile)"
                              fillOpacity={0.6}
                              stroke="var(--color-mobile)"
                              stackId="a"
                           />
                           <Area
                              dataKey="desktop"
                              type="natural"
                              fill="var(--color-desktop)"
                              fillOpacity={0.4}
                              stroke="var(--color-desktop)"
                              stackId="a"
                           />
                        </AreaChart>
                     </ChartContainer>
                     <Separator />
                     <div className="grid gap-2">
                        <div className="flex gap-2 leading-none font-medium">
                           Trending up by 5.2% this month{' '}
                           <IconTrendingUp className="size-4" />
                        </div>
                        <div className="text-muted-foreground">
                           Showing delivery performance for the last 6 months.
                        </div>
                     </div>
                     <Separator />
                  </>
               )}
               <form className="flex flex-col gap-4">
                  <div className="flex flex-col gap-3">
                     <Label htmlFor="parcelType">Parcel Type</Label>
                     <Input id="parcelType" defaultValue={item.parcelType} />
                  </div>
                  <div className="flex flex-col gap-3">
                     <Label htmlFor="trackingNumber">Tracking Number</Label>
                     <Input
                        id="trackingNumber"
                        defaultValue={item.trackingNumber}
                     />
                  </div>
                  <div className="flex flex-col gap-3">
                     <Label htmlFor="status">Status</Label>
                     <Select defaultValue={item.status}>
                        <SelectTrigger id="status" className="w-full">
                           <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="PENDING">Pending</SelectItem>
                           <SelectItem value="PICKED_UP">Picked Up</SelectItem>
                           <SelectItem value="IN_TRANSIT">
                              In Transit
                           </SelectItem>
                           <SelectItem value="DELIVERING">
                              Delivering
                           </SelectItem>
                           <SelectItem value="DELIVERED">Delivered</SelectItem>
                           <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="flex flex-col gap-3">
                        <Label htmlFor="senderName">Sender Name</Label>
                        <Input
                           id="senderName"
                           defaultValue={item.sender.name}
                        />
                     </div>
                     <div className="flex flex-col gap-3">
                        <Label htmlFor="senderPhone">Sender Phone</Label>
                        <Input
                           id="senderPhone"
                           defaultValue={item.sender.phone}
                        />
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="flex flex-col gap-3">
                        <Label htmlFor="recipientName">Recipient Name</Label>
                        <Input
                           id="recipientName"
                           defaultValue={item.recipient.name}
                        />
                     </div>
                     <div className="flex flex-col gap-3">
                        <Label htmlFor="recipientPhone">Recipient Phone</Label>
                        <Input
                           id="recipientPhone"
                           defaultValue={item.recipient.phone}
                        />
                     </div>
                  </div>
                  <div className="flex flex-col gap-3">
                     <Label htmlFor="estimatedDelivery">
                        Estimated Delivery
                     </Label>
                     <Input
                        id="estimatedDelivery"
                        type="datetime-local"
                        defaultValue={
                           item?.estimatedDelivery
                              ? new Date(item.estimatedDelivery)
                                   .toISOString()
                                   .slice(0, 16)
                              : ''
                        }
                     />
                  </div>
               </form>
            </div>
            <DrawerFooter>
               <Button>Update</Button>
               <DrawerClose asChild>
                  <Button variant="outline">Close</Button>
               </DrawerClose>
            </DrawerFooter>
         </DrawerContent>
      </Drawer>
   );
}
