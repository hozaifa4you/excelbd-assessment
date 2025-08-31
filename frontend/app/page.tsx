import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Features } from '@/components/home/features';
import { Hero } from '@/components/home/hero';
import { HowItWorks } from '@/components/home/how-it-works';
import { Stats } from '@/components/home/stats';
import { Testimonials } from '@/components/home/testimonials';
import { getSession } from '@/lib/sessions';

const Home = async () => {
   const session = await getSession();

   return (
      <>
         <Header session={session} />
         <main>
            <Hero />
            <Features />
            <HowItWorks />
            <Stats />
            <Testimonials />
         </main>

         <Footer />
      </>
   );
};

export default Home;
