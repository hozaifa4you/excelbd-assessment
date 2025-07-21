import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AssignAgentDto } from './dto/assign-agent.dto';

@Injectable()
export class AdminService {
   constructor(private readonly prisma: PrismaService) {}

   public async getAvailableAgents(page = 1, limit = 10) {
      const skip = (page - 1) * limit;

      const agents = await this.prisma.user.findMany({
         where: { role: 'DELIVERY_AGENT' },
         omit: { password: true, updatedAt: true, rememberToken: true },
         skip,
         take: limit,
         orderBy: { createdAt: 'desc' },
      });

      return agents;
   }

   public async getCustomers(page = 1, limit = 10) {
      const skip = (page - 1) * limit;

      const customers = await this.prisma.user.findMany({
         where: { role: 'CUSTOMER' },
         omit: { password: true, updatedAt: true, rememberToken: true },
         skip,
         take: limit,
         orderBy: { createdAt: 'desc' },
      });

      return customers;
   }

   public async getAssignableParcels(page = 1, limit = 10) {
      const skip = (page - 1) * limit;

      const parcels = await this.prisma.parcel.findMany({
         where: {
            status: {
               notIn: ['CANCELLED', 'DELIVERED', 'DELIVERING'],
            },
            // FIXME: This condition is commented out in the original code, but it might be needed based on your requirements.
            // deliveryAgentId: { equals: null },
         },
         select: {
            id: true,
            trackingNumber: true,
            parcelType: true,
            deliveryType: true,
            deliveryAddress: true,
            recipient: true,
            weight: true,
            status: true,
            estimatedDelivery: true,
         },
         skip,
         take: limit,
         orderBy: { createdAt: 'desc' },
      });

      return parcels;
   }

   public async setAssignAgent(assignAgentDto: AssignAgentDto) {
      const { agentId, parcelIds } = assignAgentDto;

      const updatedParcels = await this.prisma.parcel.updateMany({
         where: { id: { in: parcelIds } },
         data: { deliveryAgentId: agentId },
      });

      if (updatedParcels.count === 0) {
         throw new BadRequestException(
            'No parcels were updated. Please check the parcel IDs.',
         );
      }

      return {
         success: true,
      };
   }
}
