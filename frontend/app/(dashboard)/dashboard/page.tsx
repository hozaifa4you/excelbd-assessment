import { BookingsAreaChart } from '@/components/charts/chart-area-interactive';
import { SectionCards } from '@/components/section-cards';

const Dashboard = () => {
   return (
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
         <SectionCards />
         <div className="px-4 lg:px-6">
            <BookingsAreaChart />
         </div>
      </div>
   );
};

export default Dashboard;
