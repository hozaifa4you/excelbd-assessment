import { route } from '@/lib/routes';
import Image from 'next/image';
import Link from 'next/link';

const Logo = () => {
   return (
      <Link href={route('home')} className="flex items-center space-x-1.5">
         <div className="flex items-center justify-center rounded-xl">
            <Image
               src="/logo-2.svg"
               alt="Quicko"
               width={24}
               height={24}
               className="h-6 w-6"
            />
         </div>
         <span className="text-foreground text-2xl font-bold">Quicko</span>
      </Link>
   );
};

export { Logo };
