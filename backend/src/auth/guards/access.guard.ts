import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthRequest } from '../types/auth-user';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AccessGuard implements CanActivate {
   constructor(
      private readonly reflector: Reflector,
      private readonly prisma: PrismaService,
   ) {}

   async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest<AuthRequest>();

      const user = request.user;
      const parcelId = request.params.parcelId;

      if (user.role === 'ADMIN' || user.role === 'DELIVERY_AGENT') return true;
      const parcel = await this.prisma.parcel.findUnique({
         where: { id: parcelId },
      });
      if (!parcel) return false;
      if (parcel.creatorId === user.id) return true;
      return false;
   }
}
