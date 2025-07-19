import { getSession } from '@/lib/sessions';
import { NextResponse } from 'next/server';

export const GET = async () => {
   const session = await getSession();

   return NextResponse.json(session);
};
