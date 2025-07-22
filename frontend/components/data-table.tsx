'use client';
import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
   IconChevronDown,
   IconChevronLeft,
   IconChevronRight,
   IconChevronsLeft,
   IconChevronsRight,
   IconCircleCheckFilled,
   IconCircleX,
   IconDotsVertical,
   IconLayoutColumns,
   IconLoader,
   IconReport,
   IconTransfer,
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
   SortingState,
   useReactTable,
   VisibilityState,
} from '@tanstack/react-table';
import { z } from 'zod';

import { Badge, badgeVariants } from '@/components/ui/badge';
import { downloadParcelCsv } from '@/lib/exportReport';
import { useSession } from '@/hooks/use-session';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
   DropdownMenu,
   DropdownMenuCheckboxItem,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table';
import {
   Tooltip,
   TooltipContent,
   TooltipTrigger,
} from '@/components/ui/tooltip';
import Link from 'next/link';
import { cn } from '@/lib/utils';

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
   fees: z.object({
      deliveryFee: z.number().nullable(),
      handlingFee: z.number().nullable(),
      insuranceFee: z.number().nullable(),
      price: z.number(),
      signatureFee: z.number().nullable(),
   }),
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
         return (
            <Button
               variant="link"
               className="text-foreground w-fit px-0 text-left"
            >
               {row.original.parcelType}
            </Button>
         );
      },
      enableHiding: false,
   },
   {
      accessorKey: 'trackingNumber',
      header: 'Track. Number',
      cell: ({ row }) => (
         <div className="w-32">
            <Link
               href={`/parcels/tracking?id=${row.original.trackingNumber}`}
               target="_blank"
               className={badgeVariants({
                  class: 'text-muted-foreground px-1.5 font-sans',
                  variant: 'outline',
               })}
            >
               <IconTransfer className="mr-1" />{' '}
               {row.original.trackingNumber.substring(0, 6) + '...'}
            </Link>
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
            ) : row.original.status === 'CANCELLED' ? (
               <IconCircleX className="text-red-500" />
            ) : (
               <IconLoader
                  className={cn({
                     'text-amber-500': row.original.status === 'DELIVERING',
                  })}
               />
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
            <div className="text-muted-foreground font-sans text-sm">
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
            <div className="text-muted-foreground font-sans text-sm">
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
      accessorKey: 'fees',
      header: 'Fees',
      cell: ({ row }) => {
         const fees = row.original.fees;
         const feeItems = [
            { label: 'Delivery Fee', value: fees.deliveryFee },
            { label: 'Handling Fee', value: fees.handlingFee },
            { label: 'Insurance Fee', value: fees.insuranceFee },
            { label: 'Signature Fee', value: fees.signatureFee },
            { label: 'Base Price', value: fees.price },
         ].filter((item) => item.value !== null && item.value !== undefined);

         const totalFees = feeItems.reduce(
            (sum, item) => sum + (item.value || 0),
            0,
         );
         const feeCount = feeItems.length;

         return (
            <div className="text-sm">
               <Tooltip>
                  <TooltipTrigger asChild>
                     <div className="cursor-help font-sans">
                        <div className="font-medium">
                           {totalFees.toFixed(2)}Tk
                        </div>
                        <div className="text-muted-foreground text-xs">
                           {feeCount} fee{feeCount !== 1 ? 's' : ''}
                        </div>
                     </div>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="max-w-48">
                     <div className="space-y-1">
                        <div className="mb-2 text-xs font-medium">
                           Fee Breakdown:
                        </div>
                        {feeItems.map((item, index) => (
                           <div
                              key={index}
                              className="flex justify-between text-xs"
                           >
                              <span>{item.label}:</span>
                              <span className="font-sans font-medium">
                                 {(item.value || 0).toFixed(2)}Tk
                              </span>
                           </div>
                        ))}
                        <div className="mt-2 border-t pt-1">
                           <div className="flex justify-between text-xs font-medium">
                              <span>Total:</span>
                              <span className="font-sans">
                                 {totalFees.toFixed(2)}Tk
                              </span>
                           </div>
                        </div>
                     </div>
                  </TooltipContent>
               </Tooltip>
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

export function DataTable({
   data: initialData,
   paginationInfo,
}: {
   data: ParcelData[];
   paginationInfo: { page: number; total: number; pages: number };
}) {
   const router = useRouter();
   const searchParams = useSearchParams();
   const { session } = useSession();
   const [data, setData] = React.useState(() => initialData);
   const [rowSelection, setRowSelection] = React.useState({});
   const [columnVisibility, setColumnVisibility] =
      React.useState<VisibilityState>({});
   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
      [],
   );
   const [sorting, setSorting] = React.useState<SortingState>([]);
   const [isExporting, setIsExporting] = React.useState(false);

   const [selectedTimeFilter, setSelectedTimeFilter] = React.useState(
      () => searchParams.get('s') || 'today',
   );

   const [pagination, setPagination] = React.useState({
      pageIndex: paginationInfo.page - 1,
      pageSize: Number(searchParams.get('limit')) || 10,
   });

   React.useEffect(() => {
      setPagination((prev) => ({
         ...prev,
         pageIndex: paginationInfo.page - 1,
      }));
   }, [paginationInfo.page]);

   React.useEffect(() => {
      setData(initialData);
   }, [initialData]);

   const updateURL = React.useCallback(
      (page: number, limit: number) => {
         const params = new URLSearchParams(searchParams.toString());
         params.set('page', page.toString());
         params.set('limit', limit.toString());
         router.push(`?${params.toString()}`);
      },
      [router, searchParams],
   );

   const handlePageSizeChange = React.useCallback(
      (newPageSize: number) => {
         const newPageIndex = 0;
         setPagination({
            pageIndex: newPageIndex,
            pageSize: newPageSize,
         });
         updateURL(1, newPageSize);
      },
      [updateURL],
   );

   const handlePageChange = React.useCallback(
      (newPageIndex: number) => {
         setPagination((prev) => ({
            ...prev,
            pageIndex: newPageIndex,
         }));
         updateURL(newPageIndex + 1, pagination.pageSize);
      },
      [updateURL, pagination.pageSize],
   );

   const handleTimeFilterChange = React.useCallback(
      (filter: string) => {
         setSelectedTimeFilter(filter);
         const params = new URLSearchParams(searchParams.toString());
         params.set('s', filter);
         params.set('page', '1');
         router.push(`?${params.toString()}`);
      },
      [router, searchParams],
   );

   const handleExportCsv = React.useCallback(async () => {
      if (!session?.accessToken) {
         console.error('No access token available');
         return;
      }

      setIsExporting(true);
      try {
         await downloadParcelCsv(session.accessToken);
      } catch (error) {
         console.error('Failed to export CSV:', error);
      } finally {
         setIsExporting(false);
      }
   }, [session?.accessToken]);

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
      manualPagination: true,
      pageCount: paginationInfo.pages,
   });

   return (
      <div className="w-full flex-col justify-start gap-6">
         <div className="mb-4 flex items-center justify-between px-4 lg:px-6">
            <div className="border-input bg-background inline-flex items-center rounded-lg border p-1">
               <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                     'rounded-md px-3 py-1.5 text-sm font-medium transition-all',
                     selectedTimeFilter === 'today'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                  onClick={() => handleTimeFilterChange('today')}
               >
                  Today
               </Button>
               <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                     'rounded-md px-3 py-1.5 text-sm font-medium transition-all',
                     selectedTimeFilter === 'week'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                  onClick={() => handleTimeFilterChange('week')}
               >
                  Last Week
               </Button>
               <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                     'rounded-md px-3 py-1.5 text-sm font-medium transition-all',
                     selectedTimeFilter === 'month'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                  onClick={() => handleTimeFilterChange('month')}
               >
                  Last Month
               </Button>
               <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                     'rounded-md px-3 py-1.5 text-sm font-medium transition-all',
                     selectedTimeFilter === 'quarter'
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                  onClick={() => handleTimeFilterChange('quarter')}
               >
                  3 Months
               </Button>
            </div>
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
               <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportCsv}
                  disabled={isExporting}
               >
                  <IconReport />
                  <span className="hidden lg:inline">
                     {isExporting ? 'Exporting...' : 'Export Report'}
                  </span>
               </Button>
            </div>
         </div>
         <div className="scrollbar-thin relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
            <div className="overflow-hidden rounded-lg border">
               <div className="scrollbar-thin max-h-[600px] overflow-auto">
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
                           table.getRowModel().rows.map((row) => (
                              <TableRow
                                 key={row.id}
                                 data-state={row.getIsSelected() && 'selected'}
                              >
                                 {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                       {flexRender(
                                          cell.column.columnDef.cell,
                                          cell.getContext(),
                                       )}
                                    </TableCell>
                                 ))}
                              </TableRow>
                           ))
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
               </div>
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
         </div>
      </div>
   );
}
