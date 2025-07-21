export type Role = 'CUSTOMER' | 'ADMIN' | 'DELIVERY_AGENT';

type LoginState =
   | {
        error?: {
           email?: string;
           password?: string;
        };
        message?: string;
     }
   | undefined;

type SignUpState =
   | {
        error?: {
           firstName?: string;
           lastName?: string;
           email?: string;
           phone?: string;
           password?: string;
           confirmPassword?: string;
        };
        message?: string;
        success: boolean;
     }
   | undefined;

export type { LoginState, SignUpState };
