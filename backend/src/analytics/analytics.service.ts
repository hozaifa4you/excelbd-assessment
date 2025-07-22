import { BadRequestException, Injectable } from '@nestjs/common';
import { Role } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { format, subMonths } from 'date-fns';
import { format as csvFormat } from '@fast-csv/format';
import Stream from 'stream';

@Injectable()
export class AnalyticsService {
   constructor(private readonly prisma: PrismaService) {}

   public async getBookingsAnalytics(role: Role, userId: string) {
      const summary = await this.summaryData(role, userId);

      switch (role) {
         case Role.ADMIN: {
            const bookings = await this.getAdminBookingsAnalytics();
            return { bookings, summary };
         }
         case Role.CUSTOMER: {
            const bookings = await this.getUserBookingsAnalytics(userId);
            return { bookings, summary };
         }
         case Role.DELIVERY_AGENT: {
            const bookings = await this.getAgentBookingsAnalytics(userId);
            return { bookings, summary };
         }
         default:
            throw new BadRequestException();
      }
   }

   public async generateBookingReportCsv(role: Role) {
      switch (role) {
         case 'ADMIN':
            return this.getBookingReportAdmin();
         case 'DELIVERY_AGENT':
            return this.getBookingReportAgent();
         case 'CUSTOMER':
            return this.getBookingReportCustomer();
         default:
            return this.getBookingReportCustomer();
      }
   }

   private async getAdminBookingsAnalytics() {
      return this.getBookingsByRole('admin');
   }

   private async getUserBookingsAnalytics(userId: string) {
      return this.getBookingsByRole('user', userId);
   }

   private async getAgentBookingsAnalytics(userId: string) {
      return this.getBookingsByRole('agent', userId);
   }

   private async getBookingsByRole(
      role: 'admin' | 'user' | 'agent',
      userId?: string,
   ) {
      const threeMonthsAgo = subMonths(new Date(), 3);
      const baseWhere = {
         status: { in: ['DELIVERED', 'CANCELLED'] as const },
         createdAt: { gte: threeMonthsAgo },
      };

      let where: any = baseWhere;
      if (role === 'user') {
         where = { ...baseWhere, creatorId: userId };
      } else if (role === 'agent') {
         where = { ...baseWhere, deliveryAgentId: userId };
      }

      const bookings = await this.prisma.parcel.findMany({
         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
         where,
         select: { createdAt: true, status: true },
      });
      return this.formatBookings(bookings);
   }

   private formatBookings(bookings: { createdAt: Date; status: string }[]) {
      const grouped: Record<string, { delivered: number; canceled: number }> =
         {};

      bookings.forEach((parcel) => {
         const dateKey = format(parcel.createdAt, 'yyyy-MM-dd');

         if (!grouped[dateKey]) {
            grouped[dateKey] = { delivered: 0, canceled: 0 };
         }

         if (parcel.status === 'DELIVERED') {
            grouped[dateKey].delivered += 1;
         } else if (parcel.status === 'CANCELLED') {
            grouped[dateKey].canceled += 1;
         }
      });

      return Object.entries(grouped)
         .map(([date, counts]) => ({ date, ...counts }))
         .sort((a, b) => a.date.localeCompare(b.date));
   }

   private async summaryData(role: Role, userId?: string) {
      const date = new Date();
      const startOfLastMonth = new Date(
         date.getFullYear(),
         date.getMonth() - 1,
         1,
      );
      const endOfLastMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const dateFilter = { gte: startOfLastMonth, lt: endOfLastMonth };

      switch (role) {
         case Role.ADMIN:
            return this.getAdminSummary(dateFilter);
         case Role.DELIVERY_AGENT:
            if (!userId)
               throw new BadRequestException(
                  'User ID is required for delivery agents',
               );
            return this.getRoleSummary({ deliveryAgentId: userId }, dateFilter);
         case Role.CUSTOMER:
            if (!userId)
               throw new BadRequestException('User ID is required for users');
            return this.getRoleSummary({ creatorId: userId }, dateFilter);
         default:
            throw new BadRequestException('Invalid role');
      }
   }

   private async getAdminSummary(dateFilter: { gte: Date; lt: Date }) {
      const [
         total,
         totalPrev,
         delivered,
         deliPrev,
         canceled,
         canceledPrev,
         pending,
      ] = await Promise.all([
         this.prisma.parcel.count(),
         this.prisma.parcel.count({ where: { createdAt: dateFilter } }),
         this.prisma.parcel.count({ where: { status: 'DELIVERED' } }),
         this.prisma.parcel.count({
            where: { status: 'DELIVERED', createdAt: dateFilter },
         }),
         this.prisma.parcel.count({ where: { status: 'CANCELLED' } }),
         this.prisma.parcel.count({
            where: { status: 'CANCELLED', createdAt: dateFilter },
         }),
         this.prisma.parcel.count({
            where: { status: { notIn: ['DELIVERED', 'CANCELLED'] } },
         }),
      ]);

      const totalGrowth = ((total - totalPrev) / total) * 100;
      const deliveryGrowth =
         deliPrev > 0 ? ((delivered - deliPrev) / deliPrev) * 100 : 0;
      const canceledGrowth =
         canceledPrev > 0
            ? ((canceled - canceledPrev) / canceledPrev) * 100
            : 0;

      return {
         total: { total, totalGrowth },
         delivery: { delivered, deliveryGrowth },
         cancel: { canceled, canceledGrowth },
         pending,
      };
   }

   private async getRoleSummary(
      roleFilter: { deliveryAgentId: string } | { creatorId: string },
      dateFilter: { gte: Date; lt: Date },
   ) {
      const [
         total,
         totalPrev,
         delivered,
         deliPrev,
         canceled,
         canceledPrev,
         pending,
      ] = await Promise.all([
         this.prisma.parcel.count({ where: roleFilter }),
         this.prisma.parcel.count({
            where: { ...roleFilter, createdAt: dateFilter },
         }),
         this.prisma.parcel.count({
            where: { ...roleFilter, status: 'DELIVERED' },
         }),
         this.prisma.parcel.count({
            where: {
               ...roleFilter,
               status: 'DELIVERED',
               createdAt: dateFilter,
            },
         }),
         this.prisma.parcel.count({
            where: { ...roleFilter, status: 'CANCELLED' },
         }),
         this.prisma.parcel.count({
            where: {
               ...roleFilter,
               status: 'CANCELLED',
               createdAt: dateFilter,
            },
         }),
         this.prisma.parcel.count({
            where: {
               ...roleFilter,
               status: { notIn: ['DELIVERED', 'CANCELLED'] },
            },
         }),
      ]);

      const totalGrowth =
         totalPrev > 0 ? ((total - totalPrev) / totalPrev) * 100 : 0;
      const deliveryGrowth =
         deliPrev > 0 ? ((delivered - deliPrev) / deliPrev) * 100 : 0;
      const canceledGrowth =
         canceledPrev > 0
            ? ((canceled - canceledPrev) / canceledPrev) * 100
            : 0;

      return {
         total: { total, totalGrowth },
         delivery: { delivered, deliveryGrowth },
         cancel: { canceled, canceledGrowth },
         pending,
      };
   }

   private async getBookingReportAdmin(): Promise<Stream> {
      const parcels = await this.prisma.parcel.findMany({
         select: {
            trackingNumber: true,
            status: true,
            parcelType: true,
            weight: true,
            createdAt: true,
            paymentMethod: true,
            paymentStatus: true,
            creator: { select: { lastName: true, firstName: true } },
            deliveryAgent: {
               select: { lastName: true, firstName: true, phone: true },
            },
            deliveryType: true,
            deliveryAddress: {
               select: { city: true },
            },
            pickupAddress: {
               select: { city: true },
            },
            estimatedDelivery: true,
            fees: true,
            recipient: { select: { name: true, phone: true } },
            sender: { select: { name: true, phone: true } },
         },
      });

      const plainParcels = parcels.map((parcel) => ({
         ...parcel.fees,
         trackingNumber: parcel.trackingNumber,
         status: parcel.status,
         parcelType: parcel.parcelType,
         weight: parcel.weight,
         deliveryType: parcel.deliveryType,
         estimatedDelivery: parcel.estimatedDelivery,
         deliveryAgentName: parcel.creator
            ? `${parcel.creator.firstName ?? ''} ${parcel.creator.lastName ?? ''}`.trim()
            : '',
         deliveryAgentPhone: parcel.deliveryAgent?.phone ?? '',
         deliveryCity: parcel.deliveryAddress?.city ?? '',
         pickupCity: parcel.pickupAddress?.city ?? '',
         recipientName: parcel.recipient?.name ?? '',
         recipientPhone: parcel.recipient?.phone ?? '',
         senderName: parcel.sender?.name ?? '',
         senderPhone: parcel.sender?.phone ?? '',
         createdAt: parcel.createdAt,
      }));

      const csvStream = csvFormat({ headers: true });

      csvStream.write(plainParcels);
      csvStream.end();
      return csvStream;
   }

   private async getBookingReportAgent() {
      const parcels = await this.prisma.parcel.findMany({
         select: {
            trackingNumber: true,
            status: true,
            parcelType: true,
            weight: true,
            createdAt: true,
            paymentMethod: true,
            paymentStatus: true,
            creator: { select: { lastName: true, firstName: true } },
            deliveryAgent: {
               select: { lastName: true, firstName: true, phone: true },
            },
            deliveryType: true,
            deliveryAddress: {
               select: { city: true },
            },
            pickupAddress: {
               select: { city: true },
            },
            estimatedDelivery: true,
            fees: true,
            recipient: { select: { name: true, phone: true } },
            sender: { select: { name: true, phone: true } },
         },
      });

      const plainParcels = parcels.map((parcel) => ({
         ...parcel.fees,
         trackingNumber: parcel.trackingNumber,
         status: parcel.status,
         parcelType: parcel.parcelType,
         weight: parcel.weight,
         deliveryType: parcel.deliveryType,
         estimatedDelivery: parcel.estimatedDelivery,
         deliveryAgentName: parcel.creator
            ? `${parcel.creator.firstName ?? ''} ${parcel.creator.lastName ?? ''}`.trim()
            : '',
         deliveryAgentPhone: parcel.deliveryAgent?.phone ?? '',
         deliveryCity: parcel.deliveryAddress?.city ?? '',
         pickupCity: parcel.pickupAddress?.city ?? '',
         recipientName: parcel.recipient?.name ?? '',
         recipientPhone: parcel.recipient?.phone ?? '',
         senderName: parcel.sender?.name ?? '',
         senderPhone: parcel.sender?.phone ?? '',
         createdAt: parcel.createdAt,
      }));

      const csvStream = csvFormat({ headers: true });

      csvStream.write(plainParcels);
      csvStream.end();
      return csvStream;
   }

   private async getBookingReportCustomer() {
      const parcels = await this.prisma.parcel.findMany({
         select: {
            trackingNumber: true,
            status: true,
            parcelType: true,
            weight: true,
            createdAt: true,
            paymentMethod: true,
            paymentStatus: true,
            creator: { select: { lastName: true, firstName: true } },
            deliveryAgent: {
               select: { lastName: true, firstName: true, phone: true },
            },
            deliveryType: true,
            deliveryAddress: {
               select: { city: true },
            },
            pickupAddress: {
               select: { city: true },
            },
            estimatedDelivery: true,
            fees: true,
            recipient: { select: { name: true, phone: true } },
            sender: { select: { name: true, phone: true } },
         },
      });

      const plainParcels = parcels.map((parcel) => ({
         ...parcel.fees,
         trackingNumber: parcel.trackingNumber,
         status: parcel.status,
         parcelType: parcel.parcelType,
         weight: parcel.weight,
         deliveryType: parcel.deliveryType,
         estimatedDelivery: parcel.estimatedDelivery,
         deliveryAgentName: parcel.creator
            ? `${parcel.creator.firstName ?? ''} ${parcel.creator.lastName ?? ''}`.trim()
            : '',
         deliveryAgentPhone: parcel.deliveryAgent?.phone ?? '',
         deliveryCity: parcel.deliveryAddress?.city ?? '',
         pickupCity: parcel.pickupAddress?.city ?? '',
         recipientName: parcel.recipient?.name ?? '',
         recipientPhone: parcel.recipient?.phone ?? '',
         senderName: parcel.sender?.name ?? '',
         senderPhone: parcel.sender?.phone ?? '',
         createdAt: parcel.createdAt,
      }));

      const csvStream = csvFormat({ headers: true });

      csvStream.write(plainParcels);
      csvStream.end();
      return csvStream;
   }
}
