import { appEnv } from '@/config/env.config';
import { authFetch } from '@/lib/authFetch';
import { deleteSession } from '@/lib/sessions';
import { NextResponse } from 'next/server';

export async function DELETE() {
   const response = await authFetch(`${appEnv.API_URL}/api/auth/signout`, {
      method: 'DELETE',
   });

   if (response.ok) {
      await deleteSession();
   }

   return NextResponse.json({ success: true });
}
