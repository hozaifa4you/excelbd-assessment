import { Injectable } from '@nestjs/common';
import { BookingParcelDto } from './dto/booking-parcel.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeliveryType, PaymentMethod } from 'generated/prisma';

@Injectable()
export class ParcelService {
   constructor(private readonly prisma: PrismaService) {}

   async bookParcel(userId: string, bookingParcelDto: BookingParcelDto) {
      const {
         deliveryAddress,
         pickupAddress,
         recipient,
         fees,
         paymentStatus,
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
            senderId: userId,
            recipient,
            estimatedDelivery,
            paymentMethod,
            paymentStatus,
         },
      });

      const cost = newBooking.fees;
      // FIXME: QR code generator should be implemented here
      const qrCode = 'https://placehold.co/250/png';

      return {
         trackingNumber: newBooking.trackingNumber,
         parcelId: newBooking.id,
         cost,
         qrCode,
      };
   }

   trackingNumberGenerator() {
      const trackingNumber = Math.random().toString(36).substring(2, 15);

      return trackingNumber;
   }

   public deliveryTimeGenerator(deliveryType: DeliveryType) {
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
}
