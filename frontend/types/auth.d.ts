export type Role = 'USER' | 'ADMIN' | 'DELIVERY_AGENT';

type LoginState =
   | {
        error?: {
           email?: string;
           password?: string;
        };
        message?: string;
     }
   | undefined;

export type { LoginState };
