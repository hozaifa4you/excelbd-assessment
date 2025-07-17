import { Features } from '@/components/home/features';
import { Hero } from '@/components/home/hero';
import { HowItWorks } from '@/components/home/how-it-works';
import { Stats } from '@/components/home/stats';
import { Testimonials } from '@/components/home/testimonials';

const Home = () => {
   return (
      <>
         <main>
            <Hero />
            <Features />
            <HowItWorks />
            <Stats />
            <Testimonials />
         </main>
      </>
   );
};

export default Home;
