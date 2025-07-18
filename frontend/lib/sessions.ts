'use server';
import { appEnv } from '@/config/env.config';
import { Role } from '@/types/auth';
import { jwtVerify, SignJWT } from 'jose';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export type Session = {
   user: {
      id: string;
      firstName: string;
      lastName: string;
      role: Role;
   };
   accessToken: string;
   refreshToken: string;
};

const encodedKey = new TextEncoder().encode(appEnv.SESSION_SECRET_KEY);

export async function createSession(payload: Session) {
   const expiredAt = new Date(Date.now() + appEnv.SESSION_SECRET_EXP);

   const session = await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(appEnv.SESSION_SECRET_EXP_WITH_UNITS)
      .sign(encodedKey);

   (await cookies()).set('session', session, {
      httpOnly: true,
      secure: true,
      expires: expiredAt,
      sameSite: 'lax',
      path: '/',
   });
}

export async function getSession() {
   const cookie = (await cookies()).get('session')?.value;
   if (!cookie) return null;

   try {
      const { payload } = await jwtVerify(cookie, encodedKey, {
         algorithms: ['HS256'],
      });

      return payload as Session;
   } catch (err) {
      console.error('Failed to verify the session', err);
      redirect('/auth/signin');
   }
}

export async function deleteSession() {
   (await cookies()).delete('session');
}

export async function updateTokens({
   accessToken,
   refreshToken,
}: {
   accessToken: string;
   refreshToken: string;
}) {
   const cookie = (await cookies()).get('session')?.value;
   if (!cookie) return null;

   const { payload } = await jwtVerify<Session>(cookie, encodedKey);

   if (!payload) throw new Error('Session not found');

   const newPayload: Session = {
      user: {
         ...payload.user,
      },
      accessToken,
      refreshToken,
   };

   await createSession(newPayload);
}
