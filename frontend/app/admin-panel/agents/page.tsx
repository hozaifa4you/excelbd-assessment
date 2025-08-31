import { DataTableAgents } from '@/components/dashboard/data-table-agents';
import { authFetch } from '@/lib/authFetch';

const AgentsPage = async ({
   searchParams,
}: {
   searchParams: Promise<{ page?: string; limit?: string }>;
}) => {
   const { page, limit } = await searchParams;

   const pageNumber = Math.max(1, parseInt(page || '1', 10) || 1);
   const limitNumber = Math.max(1, parseInt(limit || '10', 10) || 10);

   const response = await authFetch(
      `/admin/agents?page=${pageNumber}&limit=${limitNumber}`,
   );
   const data = await response.json();

   if (!response.ok) {
      throw new Error(data.message);
   }

   return (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
         <DataTableAgents data={data.agents} paginationInfo={data.meta} />
      </div>
   );
};

export default AgentsPage;
