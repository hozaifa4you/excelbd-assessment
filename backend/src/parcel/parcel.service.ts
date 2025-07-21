import {
   BadRequestException,
   Injectable,
   NotFoundException,
} from '@nestjs/common';
import { BookingParcelDto } from './dto/booking-parcel.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeliveryType, PaymentMethod, Role } from 'generated/prisma';
import { UploaderService } from 'src/uploader/uploader.service';

@Injectable()
export class ParcelService {
   constructor(
      private readonly prisma: PrismaService,
      private readonly uploaderService: UploaderService,
   ) {}

   public async bookParcel(userId: string, bookingParcelDto: BookingParcelDto) {
      const {
         deliveryAddress,
         pickupAddress,
         recipient,
         fees,
         paymentStatus,
         sender,
         ...rest
      } = bookingParcelDto;

      const trackingNumber = this.trackingNumberGenerator();
      const estimatedDelivery = this.deliveryTimeGenerator(
         bookingParcelDto.deliveryType,
      );

      let paymentMethod: PaymentMethod | null = bookingParcelDto.paymentMethod;
      if (paymentStatus === 'COD') {
         paymentMethod = null;
      }

      const newBooking = await this.prisma.parcel.create({
         data: {
            ...rest,
            deliveryAddress,
            fees,
            pickupAddress,
            trackingNumber,
            creatorId: userId,
            recipient,
            estimatedDelivery,
            paymentMethod,
            paymentStatus,
            sender,
         },
      });

      const qrCode = await this.uploaderService.qrCodeUploader(
         newBooking.trackingNumber,
         newBooking.trackingNumber,
      );

      await this.prisma.parcel.update({
         where: { id: newBooking.id },
         data: { trackingQrCode: qrCode },
      });

      const cost =
         (newBooking.fees.price ?? 0) +
         (newBooking.fees.deliveryFee ?? 0) +
         (newBooking.fees.handlingFee ?? 0) +
         (newBooking.fees.insuranceFee ?? 0) +
         (newBooking.fees.signatureFee ?? 0);

      return {
         trackingNumber: newBooking.trackingNumber,
         parcelId: newBooking.id,
         cost,
         qrCode,
      };
   }

   public async getBookings(role: Role, userId: string, page = 1, limit = 10) {
      switch (role) {
         case Role.ADMIN:
            return this.getAdminBookings(page, limit);
         case Role.USER:
            return this.getUserBookings(userId, page, limit);
         case Role.DELIVERY_AGENT:
            return this.getAgentBookings(userId, page, limit);
         default:
            throw new BadRequestException();
      }
   }

   public async bookingDetails(parcelId: string) {
      const parcel = await this.prisma.parcel.findUnique({
         where: { id: parcelId },
         include: {
            creator: {
               select: {
                  avatar: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  phone: true,
               },
            },
            deliveryAgent: {
               select: {
                  avatar: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  phone: true,
               },
            },
         },
      });

      if (!parcel)
         throw new NotFoundException(`Parcel with ID ${parcelId} not found`);

      return parcel;
   }

   private trackingNumberGenerator() {
      const trackingNumber = Math.random().toString(36).substring(2, 15);

      return trackingNumber;
   }

   private deliveryTimeGenerator(deliveryType: DeliveryType) {
      const now = new Date();

      switch (deliveryType) {
         case DeliveryType.STANDARD:
            return new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
         case DeliveryType.EXPRESS:
            return new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
         case DeliveryType.OVERNIGHT:
            return new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);
         case DeliveryType.SAME_DAY:
            return new Date(now.getTime() + 12 * 60 * 60 * 1000);
         default:
            return new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
      }
   }

   private async getAdminBookings(page = 1, limit = 10) {
      const bookings = await this.prisma.parcel.findMany({
         skip: (page - 1) * limit,
         take: limit,
         orderBy: { createdAt: 'desc' },
         select: {
            id: true,
            parcelType: true,
            trackingNumber: true,
            status: true,
            estimatedDelivery: true,
            createdAt: true,
            pickupAddress: {
               select: {
                  city: true,
               },
            },
            deliveryAddress: {
               select: {
                  city: true,
               },
            },
            recipient: {
               select: {
                  name: true,
                  phone: true,
               },
            },
            sender: {
               select: {
                  name: true,
                  phone: true,
               },
            },
            fees: true,
         },
      });

      const total = await this.prisma.parcel.count();

      return {
         bookings,
         meta: {
            page,
            total,
            pages: Math.ceil(total / limit),
         },
      };
   }

   private async getUserBookings(userId: string, page = 1, limit = 10) {
      const bookings = await this.prisma.parcel.findMany({
         where: { creatorId: userId },
         skip: (page - 1) * limit,
         take: limit,
         orderBy: { createdAt: 'desc' },
         select: {
            id: true,
            parcelType: true,
            trackingNumber: true,
            status: true,
            estimatedDelivery: true,
            createdAt: true,
            pickupAddress: {
               select: {
                  city: true,
               },
            },
            deliveryAddress: {
               select: {
                  city: true,
               },
            },
            recipient: {
               select: {
                  name: true,
                  phone: true,
               },
            },
            sender: {
               select: {
                  name: true,
                  phone: true,
               },
            },
            fees: true,
         },
      });

      const total = await this.prisma.parcel.count();

      return {
         bookings,
         meta: {
            page,
            total,
            pages: Math.ceil(total / limit),
         },
      };
   }

   private async getAgentBookings(userId: string, page = 1, limit = 10) {
      const bookings = await this.prisma.parcel.findMany({
         where: { deliveryAgentId: userId },
         skip: (page - 1) * limit,
         take: limit,
         orderBy: { createdAt: 'desc' },
         select: {
            id: true,
            parcelType: true,
            trackingNumber: true,
            status: true,
            estimatedDelivery: true,
            createdAt: true,
            pickupAddress: {
               select: {
                  city: true,
               },
            },
            deliveryAddress: {
               select: {
                  city: true,
               },
            },
            recipient: {
               select: {
                  name: true,
                  phone: true,
               },
            },
            sender: {
               select: {
                  name: true,
                  phone: true,
               },
            },
            fees: true,
         },
      });

      const total = await this.prisma.parcel.count();

      return {
         bookings,
         meta: {
            page,
            total,
            pages: Math.ceil(total / limit),
         },
      };
   }
}
