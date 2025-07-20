import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { getSession } from '@/lib/sessions';
import { PropsWithChildren } from 'react';

const ParcelsLayout = async ({ children }: PropsWithChildren) => {
   const session = await getSession();

   return (
      <>
         <Header session={session} />
         {children}
         <Footer />
      </>
   );
};

export default ParcelsLayout;
