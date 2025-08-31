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

   public async barcodeUploader(trackingNumber: string) {
      const { barcode, buffer } = await this.barcodeGenerator();

      const fileName = `booking-barcode/barcode-${trackingNumber}.jpg`;
      const file = bucket.file(fileName);

      await file.save(buffer, {
         metadata: { contentType: 'image/jpg' },
         public: true,
      });

      return {
         barcode,
         url: `https://storage.googleapis.com/${bucket.name}/${fileName}`,
      };
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

   private async barcodeGenerator() {
      const barcode = Math.ceil(Math.random() * 1000000000).toString();

      try {
         const buffer = await BwipJs.toBuffer({
            bcid: 'code128',
            text: barcode,
            scale: 3,
            height: 10,
            paddingleft: 5,
            paddingright: 5,
            paddingbottom: 3,
            includetext: true,
            textxalign: 'center',
            textsize: 12,
         });

         if (!buffer) {
            throw new Error('Failed to generate barcode buffer');
         }

         return { barcode, buffer };
      } catch (err: unknown) {
         const message =
            err instanceof Error ? err.message : 'An unknown error occurred';
         throw new BadRequestException(message);
      }
   }
}
