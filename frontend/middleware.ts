import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/sessions';

export default async function middleware(req: NextRequest) {
   const session = await getSession();
   const pathname = req.nextUrl.pathname;

   if (pathname === '/dashboard' && !session) {
      return NextResponse.redirect(new URL('/signin', req.nextUrl));
   }

   if (pathname === '/signup' && session) {
      return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
   }

   if (pathname === '/signin' && session) {
      return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
   }

   return NextResponse.next();
}

export const config = {
   matcher: ['/signup', '/signin', '/dashboard'],
};
