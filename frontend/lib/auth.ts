import 'server-only';
import { appEnv } from '@/config/env.config';
import { redirect } from 'next/navigation';
import { route } from './routes';

export const refreshToken = async (oldRefreshToken: string) => {
   try {
      const response = await fetch(`${appEnv.API_URL}/api/auth/refresh-token`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${oldRefreshToken}`,
         },
      });

      if (response.status === 401) {
         await fetch(`${appEnv.APP_URL}/api/auth/signout`, {
            method: 'DELETE',
         });
         redirect(route('signin'));
      }

      if (!response.ok) {
         throw new Error('Failed to refresh token' + response.statusText);
      }

      const { accessToken, refreshToken } = await response.json();
      const updateRes = await fetch(`${appEnv.APP_URL}/api/auth/session`, {
         method: 'POST',
         body: JSON.stringify({
            accessToken,
            refreshToken,
         }),
      });
      if (!updateRes.ok) {
         await fetch(`${appEnv.APP_URL}/api/auth/signout`, {
            method: 'DELETE',
         });
         throw new Error('Failed to update the tokens');
      }

      return accessToken;
   } catch (err) {
      console.error('Refresh Token failed:', err);
      return null;
   }
};
