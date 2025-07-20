import { BadRequestException, Injectable } from '@nestjs/common';
import { Role } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { format, subMonths } from 'date-fns';

@Injectable()
export class AnalyticsService {
   constructor(private readonly prisma: PrismaService) {}

   public async getBookingsAnalytics(role: Role, userId: string) {
      switch (role) {
         case Role.ADMIN:
            return this.getAdminBookings();
         case Role.USER:
            return this.getUserBookings(userId);
         case Role.DELIVERY_AGENT:
            return this.getAgentBookings(userId);
         default:
            throw new BadRequestException();
      }
   }

   private async getAdminBookings() {
      const threeMonthsAgo = subMonths(new Date(Date.now()), 3);

      const bookings = await this.prisma.parcel.findMany({
         where: {
            status: {
               in: ['DELIVERED', 'CANCELLED'],
            },
            createdAt: { gte: threeMonthsAgo },
         },
         select: { createdAt: true, status: true },
      });

      return await this.formatBookings(bookings);
   }

   private async getUserBookings(userId: string) {
      const threeMonthsAgo = subMonths(new Date(Date.now()), 3);

      const bookings = await this.prisma.parcel.findMany({
         where: {
            creatorId: userId,
            status: {
               in: ['DELIVERED', 'CANCELLED'],
            },
            createdAt: { gte: threeMonthsAgo },
         },
         select: { createdAt: true, status: true },
      });

      return await this.formatBookings(bookings);
   }

   private async getAgentBookings(userId: string) {
      const threeMonthsAgo = subMonths(new Date(Date.now()), 3);

      const bookings = await this.prisma.parcel.findMany({
         where: {
            deliveryAgentId: userId,
            status: {
               in: ['DELIVERED', 'CANCELLED'],
            },
            createdAt: { gte: threeMonthsAgo },
         },
         select: { createdAt: true, status: true },
      });

      return await this.formatBookings(bookings);
   }

   private async formatBookings(bookings: Record<string, string | Date>[]) {
      const grouped: Record<string, { delivered: number; canceled: number }> =
         {};

      await Promise.all(
         bookings.map((parcel) => {
            const dateKey = format(new Date(parcel.createdAt), 'yyyy-MM-dd');

            if (!grouped[dateKey]) {
               grouped[dateKey] = { delivered: 0, canceled: 0 };
            }

            if (parcel.status === 'DELIVERED') {
               grouped[dateKey].delivered += 1;
            } else if (parcel.status === 'CANCELLED') {
               grouped[dateKey].canceled += 1;
            }
         }),
      );

      const data = Object.entries(grouped)
         .map(([date, counts]) => ({
            date,
            ...counts,
         }))
         .sort((a, b) => a.date.localeCompare(b.date));

      return data;
   }
}
