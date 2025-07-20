import { DataTable } from '@/components/data-table';
import { authFetch } from '@/lib/authFetch';
import data from '@/lib/data.json';

const UserBookings = async () => {
   const response = await authFetch('/parcels');
   if (!response.ok) {
      throw new Error('Failed to fetch bookings');
   }

   const data = await response.json();
   console.log(data);

   return (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
         <DataTable data={data.bookings} />
      </div>
   );
};

export default UserBookings;
