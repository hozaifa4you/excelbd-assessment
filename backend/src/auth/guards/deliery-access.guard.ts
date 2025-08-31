import {
   CanActivate,
   ExecutionContext,
   Injectable,
   NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthRequest } from '../types/auth-user';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DeliveryAccessGuard implements CanActivate {
   constructor(
      private readonly reflector: Reflector,
      private readonly prisma: PrismaService,
   ) {}

   async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest<AuthRequest>();

      const user = request.user;
      const parcelId = request.params.parcelId;

      if (user.role === 'ADMIN') return true;
      const parcel = await this.prisma.parcel.findUnique({
         where: { id: parcelId, deliveryAgentId: user.id },
         select: { creatorId: true, id: true },
      });
      if (!parcel)
         throw new NotFoundException(`Parcel with ID ${parcelId} not found`);
      if (parcel) return true;
      return false;
   }
}
