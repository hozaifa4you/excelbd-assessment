import { DataTableCustomers } from '@/components/dashboard/data-table-customers';
import { DataTable } from '@/components/data-table';
import { authFetch } from '@/lib/authFetch';

const CustomersPage = async ({
   searchParams,
}: {
   searchParams: Promise<{ page?: string; limit?: string }>;
}) => {
   const { page, limit } = await searchParams;

   const pageNumber = Math.max(1, parseInt(page || '1', 10) || 1);
   const limitNumber = Math.max(1, parseInt(limit || '10', 10) || 10);

   const response = await authFetch(
      `/admin/customers?page=${pageNumber}&limit=${limitNumber}`,
   );
   const data = await response.json();

   if (!response.ok) {
      throw new Error(data.message);
   }

   return (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
         <DataTableCustomers data={data.bookings} paginationInfo={data.meta} />
      </div>
   );
};

export default CustomersPage;
