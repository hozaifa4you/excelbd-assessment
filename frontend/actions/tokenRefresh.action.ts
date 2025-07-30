'use server';
import { appEnv } from '@/config/env.config';
import { getSession, updateTokens, deleteSession } from '@/lib/sessions';
import { TokenRefreshResult } from '@/lib/tokenRefresh';

/**
 * Server action to refresh the access token using the refresh token
 * @returns Promise<TokenRefreshResult> - Object containing success status and optional error
 */
export const refreshAccessTokenAction =
   async (): Promise<TokenRefreshResult> => {
      try {
         const session = await getSession();

         if (!session?.refreshToken) {
            return {
               success: false,
               error: 'No refresh token available',
            };
         }

         const baseUrl = appEnv.API_URL!;
         const response = await fetch(`${baseUrl}/api/auth/refresh-token`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${session.refreshToken}`,
            },
         });

         if (response.ok) {
            const result = await response.json();

            // Validate the response structure
            if (!result.accessToken || !result.refreshToken) {
               return {
                  success: false,
                  error: 'Invalid response structure from refresh endpoint',
               };
            }

            // Update the session with new tokens
            await updateTokens({
               accessToken: result.accessToken,
               refreshToken: result.refreshToken,
            });

            return { success: true };
         } else {
            // Handle different error status codes
            let errorMessage = 'Token refresh failed';

            if (response.status === 401) {
               errorMessage = 'Refresh token expired or invalid';
            } else if (response.status >= 500) {
               errorMessage = 'Server error during token refresh';
            }

            // Clean up invalid session
            await deleteSession();

            return {
               success: false,
               error: errorMessage,
            };
         }
      } catch (error) {
         console.error('Token refresh error:', error);

         // Clean up session on any error
         try {
            await deleteSession();
         } catch (deleteError) {
            console.error('Error deleting session:', deleteError);
         }

         return {
            success: false,
            error:
               error instanceof Error
                  ? error.message
                  : 'Unknown error during token refresh',
         };
      }
   };

/**
 * Server action to handle logout and cleanup when authentication fails permanently
 */
export const handleAuthenticationFailureAction = async (): Promise<void> => {
   try {
      await deleteSession();
   } catch (error) {
      console.error('Error during authentication failure cleanup:', error);
   }
};
