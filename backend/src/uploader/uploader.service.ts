import { BadRequestException, Injectable } from '@nestjs/common';
import { bucket } from '../config/gcp.config';
import { toDataURL } from 'qrcode';
import * as BwipJs from '@bwip-js/node';

@Injectable()
export class UploaderService {
   public async qrCodeUploader(payload: string, trackingNumber: string) {
      const qrCodeBase64 = await this.QRCodeGenerator(payload);
      const qrCodeBuffer = this.base64toBuffer(qrCodeBase64);

      const fileName = `tracking-qr-code/qr-code-${trackingNumber}.jpg`;
      const file = bucket.file(fileName);

      await file.save(qrCodeBuffer, {
         metadata: {
            contentType: 'image/jpeg',
         },
         public: true,
      });

      const qrCodeUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

      return qrCodeUrl;
   }

   public async barcodeUploader(payload: string, trackingNumber: string) {
      const barcodeBuffer = await this.barcodeGenerator(payload);

      const fileName = `booking-barcode/barcode-${trackingNumber}.jpg`;
      const file = bucket.file(fileName);

      await file.save(barcodeBuffer, {
         metadata: { contentType: 'image/jpg' },
         public: true,
      });

      return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
   }

   public async QRCodeGenerator(payload: string) {
      const base64Code = await toDataURL(payload, {
         width: 400,
         margin: 2,
      });

      return base64Code;
   }

   public base64toBuffer(base64: string) {
      const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      return buffer;
   }

   private async barcodeGenerator(payload: string) {
      try {
         const barcodeBuffer = await BwipJs.toBuffer({
            bcid: 'code128',
            text: payload,
            scale: 3,
            height: 10,
            width: 10,
            paddingtop: 5,
            paddingleft: 5,
            paddingright: 5,
            includetext: true,
            textxalign: 'center',
         });

         if (!barcodeBuffer) {
            throw new Error('Failed to generate barcode buffer');
         }

         return barcodeBuffer;
      } catch (err: unknown) {
         const message =
            err instanceof Error ? err.message : 'An unknown error occurred';
         throw new BadRequestException(message);
      }
   }
}
