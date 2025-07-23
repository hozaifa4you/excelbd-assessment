// import { refreshToken } from './auth';
import { appEnv } from '@/config/env.config';
import { getSession } from '@/lib/sessions';
import { refreshToken } from './auth';

export interface FetchOptions extends RequestInit {
   headers?: Record<string, string>;
}

export const authFetch = async (
   url: string | URL,
   options: FetchOptions = {},
) => {
   const session = await getSession();

   const baseUrl = appEnv.API_URL!;
   const fullUrl = `${baseUrl}/api${url}`;

   options.headers = {
      ...options.headers,
      Authorization: `Bearer ${session?.accessToken}`,
      'Content-Type': 'application/json',
   };
   let response = await fetch(fullUrl, options);

   if (response.status === 401) {
      if (!session?.refreshToken) throw new Error('refresh token not found!');

      const newAccessToken = await refreshToken(session.refreshToken);

      if (newAccessToken) {
         options.headers.Authorization = `Bearer ${newAccessToken}`;
         response = await fetch(url, options);
      }
   }
   return response;
};
