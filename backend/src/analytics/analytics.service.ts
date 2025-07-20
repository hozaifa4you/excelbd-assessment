import { BadRequestException, Injectable } from '@nestjs/common';
import { Role } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { format, subMonths } from 'date-fns';

@Injectable()
export class AnalyticsService {
   constructor(private readonly prisma: PrismaService) {}

   public async getBookingsAnalytics(role: Role, userId: string) {
      const summary = await this.summaryData(role, userId);

      switch (role) {
         case Role.ADMIN: {
            const bookings = await this.getAdminBookings();
            return { bookings, summary };
         }
         case Role.USER: {
            const bookings = await this.getUserBookings(userId);
            return { bookings, summary };
         }
         case Role.DELIVERY_AGENT: {
            const bookings = this.getAgentBookings(userId);
            return { bookings, summary };
         }
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

   private async summaryData(role: Role, userId?: string) {
      const date = new Date();
      const startOfLastMonth = new Date(
         date.getFullYear(),
         date.getMonth() - 1,
         1,
      );
      const endOfLastMonth = new Date(date.getFullYear(), date.getMonth(), 1);

      switch (role) {
         case Role.ADMIN: {
            const total = await this.prisma.parcel.count();
            const totalPrev = await this.prisma.parcel.count({
               where: {
                  createdAt: {
                     gte: startOfLastMonth,
                     lt: endOfLastMonth,
                  },
               },
            });
            const totalGrowth = ((total - totalPrev) / total) * 100;

            const delivered = await this.prisma.parcel.count({
               where: { status: 'DELIVERED' },
            });

            const deliPrev = await this.prisma.parcel.count({
               where: {
                  status: 'DELIVERED',
                  createdAt: {
                     gte: startOfLastMonth,
                     lt: endOfLastMonth,
                  },
               },
            });
            const deliveryGrowth = ((delivered - deliPrev) / deliPrev) * 100;

            const canceled = await this.prisma.parcel.count({
               where: { status: 'CANCELLED' },
            });
            const canceledPrev = await this.prisma.parcel.count({
               where: {
                  status: 'CANCELLED',
                  createdAt: {
                     gte: startOfLastMonth,
                     lt: endOfLastMonth,
                  },
               },
            });
            const canceledGrowth =
               ((canceled - canceledPrev) / canceledPrev) * 100;

            const pending = await this.prisma.parcel.count({
               where: { status: { notIn: ['DELIVERED', 'CANCELLED'] } },
            });

            return {
               total: { total, totalGrowth },
               delivery: { delivered, deliveryGrowth },
               cancel: { canceled, canceledGrowth },
               pending,
            };
         }
         case Role.DELIVERY_AGENT: {
            if (!userId) {
               throw new BadRequestException(
                  'User ID is required for delivery agents',
               );
            }
            const total = await this.prisma.parcel.count({
               where: { deliveryAgentId: userId },
            });
            const totalPrev = await this.prisma.parcel.count({
               where: {
                  deliveryAgentId: userId,
                  createdAt: {
                     gte: startOfLastMonth,
                     lt: endOfLastMonth,
                  },
               },
            });
            const totalGrowth =
               totalPrev > 0 ? ((total - totalPrev) / totalPrev) * 100 : 0;

            const delivered = await this.prisma.parcel.count({
               where: { deliveryAgentId: userId, status: 'DELIVERED' },
            });
            const deliPrev = await this.prisma.parcel.count({
               where: {
                  deliveryAgentId: userId,
                  status: 'DELIVERED',
                  createdAt: {
                     gte: startOfLastMonth,
                     lt: endOfLastMonth,
                  },
               },
            });
            const deliveryGrowth =
               deliPrev > 0 ? ((delivered - deliPrev) / deliPrev) * 100 : 0;

            const canceled = await this.prisma.parcel.count({
               where: { deliveryAgentId: userId, status: 'CANCELLED' },
            });
            const canceledPrev = await this.prisma.parcel.count({
               where: {
                  deliveryAgentId: userId,
                  status: 'CANCELLED',
                  createdAt: {
                     gte: startOfLastMonth,
                     lt: endOfLastMonth,
                  },
               },
            });
            const canceledGrowth =
               canceledPrev > 0
                  ? ((canceled - canceledPrev) / canceledPrev) * 100
                  : 0;

            const pending = await this.prisma.parcel.count({
               where: {
                  deliveryAgentId: userId,
                  status: { notIn: ['DELIVERED', 'CANCELLED'] },
               },
            });

            return {
               total: { total, totalGrowth },
               delivery: { delivered, deliveryGrowth },
               cancel: { canceled, canceledGrowth },
               pending,
            };
         }
         case Role.USER: {
            if (!userId) {
               throw new BadRequestException('User ID is required for users');
            }
            const total = await this.prisma.parcel.count({
               where: { creatorId: userId },
            });
            const totalPrev = await this.prisma.parcel.count({
               where: {
                  creatorId: userId,
                  createdAt: {
                     gte: startOfLastMonth,
                     lt: endOfLastMonth,
                  },
               },
            });
            const totalGrowth =
               totalPrev > 0 ? ((total - totalPrev) / totalPrev) * 100 : 0;

            const delivered = await this.prisma.parcel.count({
               where: { creatorId: userId, status: 'DELIVERED' },
            });
            const deliPrev = await this.prisma.parcel.count({
               where: {
                  creatorId: userId,
                  status: 'DELIVERED',
                  createdAt: {
                     gte: startOfLastMonth,
                     lt: endOfLastMonth,
                  },
               },
            });
            const deliveryGrowth =
               deliPrev > 0 ? ((delivered - deliPrev) / deliPrev) * 100 : 0;

            const canceled = await this.prisma.parcel.count({
               where: { creatorId: userId, status: 'CANCELLED' },
            });
            const canceledPrev = await this.prisma.parcel.count({
               where: {
                  creatorId: userId,
                  status: 'CANCELLED',
                  createdAt: {
                     gte: startOfLastMonth,
                     lt: endOfLastMonth,
                  },
               },
            });
            const canceledGrowth =
               canceledPrev > 0
                  ? ((canceled - canceledPrev) / canceledPrev) * 100
                  : 0;

            const pending = await this.prisma.parcel.count({
               where: {
                  creatorId: userId,
                  status: { notIn: ['DELIVERED', 'CANCELLED'] },
               },
            });

            return {
               total: { total, totalGrowth },
               delivery: { delivered, deliveryGrowth },
               cancel: { canceled, canceledGrowth },
               pending,
            };
         }
         default:
            throw new BadRequestException('Invalid role');
      }
   }
}
