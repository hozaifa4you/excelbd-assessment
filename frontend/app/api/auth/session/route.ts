import { getSession } from '@/lib/sessions';
import { NextRequest, NextResponse } from 'next/server';
import { updateTokens } from '@/lib/sessions';

export const GET = async () => {
   const session = await getSession();

   return NextResponse.json(session);
};

export async function POST(req: NextRequest) {
   const body = await req.json();
   const { accessToken, refreshToken } = body;

   if (!accessToken || !refreshToken)
      return new Response('Provide Tokens', { status: 401 });

   await updateTokens({ accessToken, refreshToken });

   return new Response('OK', { status: 200 });
}
