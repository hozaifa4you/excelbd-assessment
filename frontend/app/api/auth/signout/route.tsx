import { appEnv } from '@/config/env.config';
import { authFetch } from '@/lib/authFetch';
import { deleteSession } from '@/lib/sessions';
import { NextResponse } from 'next/server';

export async function DELETE() {
   await authFetch(`${appEnv.API_URL}/api/auth/signout`, {
      method: 'DELETE',
   });

   await deleteSession();
   return NextResponse.json({ success: true });
}
