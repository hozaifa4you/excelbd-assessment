'use server';
import 'server-only';
import { appEnv } from '@/config/env.config';
import { redirect } from 'next/navigation';
import { LoginState } from '@/types/auth';
import { LoginFormSchema } from '@/schema/auth.schema';
import { zodErrorFormat } from '@/lib/utils';
import { createSession } from '@/lib/sessions';

export async function signIn(
   initialState: unknown,
   formData: FormData,
): Promise<LoginState> {
   const validatedFields = LoginFormSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
   });

   if (!validatedFields.success) {
      return {
         error: zodErrorFormat(validatedFields.error),
      };
   }

   const response = await fetch(`${appEnv.API_URL}/api/auth/signin`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify(validatedFields.data),
   });

   if (response.ok) {
      const result = await response.json();

      const payload = {
         user: result.user,
         accessToken: result.accessToken,
         refreshToken: result.refreshToken,
      };

      await createSession(payload);
      redirect('/');
   } else {
      return {
         message:
            response.status === 401
               ? 'Invalid Credentials!'
               : response.statusText,
      };
   }
}
