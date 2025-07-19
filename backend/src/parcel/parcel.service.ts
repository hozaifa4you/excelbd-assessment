import { Injectable } from '@nestjs/common';
import { BookingParcelDto } from './dto/booking-parcel.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeliveryType, PaymentMethod } from 'generated/prisma';
import { UploaderService } from 'src/uploader/uploader.service';

@Injectable()
export class ParcelService {
   constructor(
      private readonly prisma: PrismaService,
      private readonly uploaderService: UploaderService,
   ) {}

   async bookParcel(userId: string, bookingParcelDto: BookingParcelDto) {
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
