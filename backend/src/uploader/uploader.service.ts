import { Injectable } from '@nestjs/common';
import { bucket } from '../config/gcp.config';
import { toDataURL } from 'qrcode';

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
}
