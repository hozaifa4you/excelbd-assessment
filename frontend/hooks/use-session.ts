import { Session } from '@/lib/sessions';
import { useEffect, useState } from 'react';

export const useSession = () => {
   const [session, setSession] = useState<Session | null>(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchSession = async () => {
         setLoading(true);
         try {
            const res = await fetch('/api/auth/session', {
               headers: { 'Content-Type': 'application/json' },
            });
            if (res.ok) {
               const data = await res.json();
               setSession(data as Session);
            } else {
               setSession(null);
            }
         } catch {
            setSession(null);
         } finally {
            setLoading(false);
         }
      };
      fetchSession();
   }, []);

   const fullName = session
      ? `${session.user.firstName} ${session.user.lastName}`
      : undefined;

   return { session, loading, isAuthenticated: !!session, fullName };
};
