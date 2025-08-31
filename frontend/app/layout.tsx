import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { Raleway } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';
import { StoreProvider } from '@/redux/StoreProvider';

const raleway = Raleway({
   subsets: ['latin'],
   variable: '--font-raleway',
   weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
   title: 'Quicko - Your personal delivery assistant',
   description:
      'Quicko is a personal delivery assistant that helps you manage your deliveries efficiently.',
};

export default async function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <StoreProvider>
         <ThemeProvider defaultTheme="light" storageKey="quicko-ui-theme">
            <html lang="en">
               <body className={`${raleway.className} antialiased`}>
                  <Toaster richColors position="top-center" />
                  {children}
               </body>
            </html>
         </ThemeProvider>
      </StoreProvider>
   );
}
