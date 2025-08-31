'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
   id: string;
   firstName: string;
   lastName: string;
   email: string;
   role: string;
   username: string;
}

interface AuthState {
   isAuthenticated: boolean;
   isLoading: boolean;
   user: User | null;
}

/**
 * Custom hook to manage authentication state in React components
 * This hook provides authentication status and handles redirects
 */
export const useAuth = () => {
   const [authState, setAuthState] = useState<AuthState>({
      isAuthenticated: false,
      isLoading: true,
      user: null,
   });
   const router = useRouter();

   useEffect(() => {
      const checkAuth = async () => {
         try {
            // This would typically call your session endpoint or check local storage
            const response = await fetch('/api/auth/session', {
               method: 'GET',
               credentials: 'include',
            });

            if (response.ok) {
               const sessionData = await response.json();
               setAuthState({
                  isAuthenticated: true,
                  isLoading: false,
                  user: sessionData.user,
               });
            } else {
               setAuthState({
                  isAuthenticated: false,
                  isLoading: false,
                  user: null,
               });
            }
         } catch (error) {
            console.error('Auth check failed:', error);
            setAuthState({
               isAuthenticated: false,
               isLoading: false,
               user: null,
            });
         }
      };

      checkAuth();
   }, []);

   const logout = async () => {
      try {
         await fetch('/api/auth/signout', {
            method: 'DELETE',
            credentials: 'include',
         });

         setAuthState({
            isAuthenticated: false,
            isLoading: false,
            user: null,
         });

         router.push('/auth/signin');
      } catch (error) {
         console.error('Logout failed:', error);
      }
   };

   return {
      ...authState,
      logout,
   };
};

/**
 * Hook to handle API calls with automatic error handling
 * This is useful for components that need to make authenticated API calls
 */
export const useAuthenticatedApi = () => {
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const makeRequest = async <T>(
      requestFn: () => Promise<T>,
   ): Promise<T | null> => {
      setIsLoading(true);
      setError(null);

      try {
         const result = await requestFn();
         return result;
      } catch (err) {
         const errorMessage =
            err instanceof Error ? err.message : 'An error occurred';
         setError(errorMessage);
         console.error('API request failed:', err);
         return null;
      } finally {
         setIsLoading(false);
      }
   };

   return {
      makeRequest,
      isLoading,
      error,
      clearError: () => setError(null),
   };
};
