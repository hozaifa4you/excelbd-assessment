'use server';
import 'server-only';
import { appEnv } from '@/config/env.config';
import { redirect } from 'next/navigation';
import { LoginState, SignUpState } from '@/types/auth';
import { LoginFormSchema, SignupFormSchema } from '@/schema/auth.schema';
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

export async function signUp(
   initialState: unknown,
   formData: FormData,
): Promise<SignUpState> {
   const validatedFields = SignupFormSchema.safeParse({
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
   });

   if (!validatedFields.success) {
      return {
         error: zodErrorFormat(validatedFields.error),
         success: false,
      };
   }

   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   const { confirmPassword, ...data } = validatedFields.data;

   const response = await fetch(`${appEnv.API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
   });
   const result = await response.json();

   if (response.ok) {
      return { success: true, message: result.message };
   } else {
      return {
         message: result.message,
         success: false,
      };
   }
}
