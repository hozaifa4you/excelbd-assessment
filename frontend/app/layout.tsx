import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Raleway } from 'next/font/google';
import { Toaster } from 'sonner';

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

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         <body className={`${raleway.className} antialiased`}>
            <Toaster richColors position="top-center" />
            <ThemeProvider defaultTheme="light" storageKey="quicko-ui-theme">
               <Header />
               {children}
               <Footer />
            </ThemeProvider>
         </body>
      </html>
   );
}
