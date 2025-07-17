import { Role } from 'generated/prisma';
import { Request } from 'express';

export type AuthUser = {
   id: string;
   role: Role;
};

export interface AuthRequest extends Request {
   user: AuthUser;
}
