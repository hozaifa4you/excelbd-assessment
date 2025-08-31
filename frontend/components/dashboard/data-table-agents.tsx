'use client';
import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
   IconChevronDown,
   IconChevronLeft,
   IconChevronRight,
   IconChevronsLeft,
   IconChevronsRight,
   IconDotsVertical,
   IconLayoutColumns,
   IconPlus,
   IconUser,
   IconMail,
   IconPhone,
   IconCalendar,
   IconPackage,
   IconCircleCheck,
   IconCircleX,
   IconAlertTriangle,
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

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { route } from '@/lib/routes';

export const schema = z.object({
   id: z.string(),
   firstName: z.string(),
   lastName: z.string(),
   avatar: z.string().optional(),
   username: z.string(),
   email: z.string(),
   phone: z.string(),
   status: z.enum(['ACTIVE', 'DEACTIVATED', 'SUSPENDED']),
   createdAt: z.string(),
   parcelCount: z.number(),
   delivered: z.number(),
   deliveryFailed: z.number(),
   deliveryPending: z.number(),
});

type AgentData = z.infer<typeof schema>;

const columns: ColumnDef<AgentData>[] = [
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
      accessorKey: 'agent',
      header: 'Agent',
      cell: ({ row }) => {
         const agent = row.original;
         return (
            <div className="flex items-center gap-3">
               <Avatar className="h-8 w-8">
                  <AvatarImage src={agent.avatar} alt={agent.firstName} />
                  <AvatarFallback>
                     {agent.firstName.charAt(0)}
                     {agent.lastName.charAt(0)}
                  </AvatarFallback>
               </Avatar>
               <div>
                  <Link
                     href={route('admin.agents.details', {
                        username: agent.username,
                     })}
                     className="font-medium transition-all duration-200 hover:underline hover:underline-offset-4"
                  >
                     {agent.firstName} {agent.lastName}
                  </Link>
                  <div className="text-muted-foreground text-sm">
                     @{agent.username}
                  </div>
               </div>
            </div>
         );
      },
      enableHiding: false,
   },
   {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
         <div className="flex items-center gap-2">
            <IconMail className="text-muted-foreground h-4 w-4" />
            <span className="font-mono text-sm">{row.original.email}</span>
         </div>
      ),
   },
   {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => (
         <div className="flex items-center gap-2">
            <IconPhone className="text-muted-foreground h-4 w-4" />
            <span className="font-mono text-sm">{row.original.phone}</span>
         </div>
      ),
   },
   {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
         const status = row.original.status;
         let statusConfig = {
            color: 'text-gray-600',
            bgColor: 'bg-gray-100',
            icon: IconUser,
            label: status as string,
         };

         switch (status) {
            case 'ACTIVE':
               statusConfig = {
                  color: 'text-green-700',
                  bgColor: 'bg-green-100',
                  icon: IconCircleCheck,
                  label: 'Active',
               };
               break;
            case 'DEACTIVATED':
               statusConfig = {
                  color: 'text-red-700',
                  bgColor: 'bg-red-100',
                  icon: IconCircleX,
                  label: 'Deactivated',
               };
               break;
            case 'SUSPENDED':
               statusConfig = {
                  color: 'text-yellow-700',
                  bgColor: 'bg-yellow-100',
                  icon: IconAlertTriangle,
                  label: 'Suspended',
               };
               break;
         }

         const IconComponent = statusConfig.icon;

         return (
            <Badge
               variant="outline"
               className={`${statusConfig.color} ${statusConfig.bgColor} border-0 px-2 py-1`}
            >
               <IconComponent className="mr-1 h-3 w-3" />
               {statusConfig.label}
            </Badge>
         );
      },
   },
   {
      accessorKey: 'parcelCount',
      header: 'Total Parcels',
      cell: ({ row }) => (
         <div className="flex items-center gap-2">
            <IconPackage className="text-muted-foreground h-4 w-4" />
            <span className="font-medium">{row.original.parcelCount}</span>
         </div>
      ),
   },
   {
      accessorKey: 'delivered',
      header: 'Delivered',
      cell: ({ row }) => (
         <div className="flex items-center gap-2">
            <IconCircleCheck className="h-4 w-4 text-green-600" />
            <span className="font-medium text-green-700">
               {row.original.delivered}
            </span>
         </div>
      ),
   },
   {
      accessorKey: 'deliveryFailed',
      header: 'Failed',
      cell: ({ row }) => (
         <div className="flex items-center gap-2">
            <IconCircleX className="h-4 w-4 text-red-600" />
            <span className="font-medium text-red-700">
               {row.original.deliveryFailed}
            </span>
         </div>
      ),
   },
   {
      accessorKey: 'deliveryPending',
      header: 'Pending',
      cell: ({ row }) => (
         <div className="flex items-center gap-2">
            <IconAlertTriangle className="h-4 w-4 text-yellow-600" />
            <span className="font-medium text-yellow-700">
               {row.original.deliveryPending}
            </span>
         </div>
      ),
   },
   {
      accessorKey: 'createdAt',
      header: 'Joined',
      cell: ({ row }) => {
         const date = new Date(row.original.createdAt);
         const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
         });

         return (
            <div className="flex items-center gap-2 text-sm">
               <IconCalendar className="text-muted-foreground h-4 w-4" />
               <span>{formattedDate}</span>
            </div>
         );
      },
   },
   {
      id: 'actions',
      cell: ({ row }) => {
         const agent = row.original;
         const isActive = agent.status === 'ACTIVE';
         const isSuspended = agent.status === 'SUSPENDED';

         return (
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
               <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem>View Profile</DropdownMenuItem>
                  <DropdownMenuItem>Edit Agent</DropdownMenuItem>
                  {isActive && (
                     <>
                        <DropdownMenuItem variant="destructive">
                           Suspend
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive">
                           Deactivate
                        </DropdownMenuItem>
                     </>
                  )}
                  {isSuspended && <DropdownMenuItem>Activate</DropdownMenuItem>}
                  {agent.status === 'DEACTIVATED' && (
                     <DropdownMenuItem>Reactivate</DropdownMenuItem>
                  )}
               </DropdownMenuContent>
            </DropdownMenu>
         );
      },
   },
];

export function DataTableAgents({
   data: initialData,
   paginationInfo,
}: {
   data: AgentData[];
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
   const [globalFilter, setGlobalFilter] = React.useState('');

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

   const table = useReactTable({
      data,
      columns,
      state: {
         sorting,
         columnVisibility,
         rowSelection,
         columnFilters,
         pagination,
         globalFilter,
      },
      getRowId: (row) => row.id,
      enableRowSelection: true,
      onRowSelectionChange: setRowSelection,
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      onColumnVisibilityChange: setColumnVisibility,
      onPaginationChange: setPagination,
      onGlobalFilterChange: setGlobalFilter,
      globalFilterFn: (row, columnId, filterValue) => {
         const agent = row.original;
         const searchValue = filterValue.toLowerCase();
         return (
            agent.firstName.toLowerCase().includes(searchValue) ||
            agent.lastName.toLowerCase().includes(searchValue) ||
            agent.username.toLowerCase().includes(searchValue) ||
            agent.email.toLowerCase().includes(searchValue) ||
            agent.phone.toLowerCase().includes(searchValue)
         );
      },
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFacetedRowModel: getFacetedRowModel(),
      getFacetedUniqueValues: getFacetedUniqueValues(),
      // Disable built-in pagination since we're handling it server-side
      manualPagination: true,
      pageCount: paginationInfo.pages,
   });

   return (
      <div className="w-full flex-col justify-start gap-6">
         <div className="mb-4 flex items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-4">
               <h2 className="text-2xl font-bold">Delivery Agents</h2>
               <Badge variant="secondary" className="font-mono">
                  {paginationInfo.total} total
               </Badge>
            </div>
            <div className="flex items-center gap-2">
               <Input
                  placeholder="Search agents..."
                  value={globalFilter ?? ''}
                  onChange={(event) => setGlobalFilter(event.target.value)}
                  className="max-w-sm"
               />
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
                  <span className="hidden lg:inline">New Agent</span>
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
                                 No agents found.
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
                  of {paginationInfo.total} total agents.
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
