import { BookingsAreaChart } from '@/components/charts/three-month-charts';
import { SectionCards } from '@/components/section-cards';
import { authFetch } from '@/lib/authFetch';

const Dashboard = async () => {
   const response = await authFetch('/analytics/bookings-3-months');
   const data = await response.json();
   if (!response.ok) {
      throw new Error(data.message);
   }

   return (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
         <SectionCards />
         <div className="px-4 lg:px-6">
            <BookingsAreaChart data={data.bookings} />
         </div>
      </div>
   );
};

export default Dashboard;
