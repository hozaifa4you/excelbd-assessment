import { Role } from 'generated/prisma';
import { Request } from 'express';

export type AuthUser = {
   id: string;
   firstName: string;
   lastName: string;
   email: string;
   role: Role;
};

export interface AuthRequest extends Request {
   user: AuthUser;
}
