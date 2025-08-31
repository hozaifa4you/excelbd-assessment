import {
   refreshAccessTokenAction,
   handleAuthenticationFailureAction,
} from '@/actions/tokenRefresh.action';

export interface TokenRefreshResult {
   success: boolean;
   error?: string;
}

/**
 * Refreshes the access token using the refresh token
 * @returns Promise<TokenRefreshResult> - Object containing success status and optional error
 */
export const refreshAccessToken = async (): Promise<TokenRefreshResult> => {
   return await refreshAccessTokenAction();
};

/**
 * Checks if a token is likely expired based on the error response
 * @param response - The fetch response object
 * @returns boolean - true if token appears to be expired
 */
export const isTokenExpiredError = (response: Response): boolean => {
   return response.status === 401;
};

/**
 * Handles logout and cleanup when authentication fails permanently
 */
export const handleAuthenticationFailure = async (): Promise<void> => {
   await handleAuthenticationFailureAction();
};
