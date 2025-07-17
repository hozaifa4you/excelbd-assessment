import { Role } from 'generated/prisma';

export type AuthUser = {
   id: string;
   role: Role;
};
