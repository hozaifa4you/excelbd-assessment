import 'dotenv/config';
import { PrismaClient } from '../generated/prisma';
import { faker } from '@faker-js/faker';
import { log } from 'console';
import { UploaderService } from '../src/uploader/uploader.service';

const client = new PrismaClient();
const uploadService = new UploaderService();

async function main() {
   const seedCount = 500;
   const parcel = true;

   log('Deleting existing parcels...');
   await client.parcel.deleteMany();
   log('Seeding parcels...');
   for (let i = 0; i < seedCount; i++) {
      if (!parcel) break;
      const trackingNumber = Math.random().toString(36).substring(2, 15);

      const qrCode = await uploadService.qrCodeUploader(
         trackingNumber,
         trackingNumber,
      );

      const paymentStatus = faker.helpers.arrayElement(['PAID', 'COD']);
      const paymentMethod = paymentStatus === 'PAID' ? 'ONLINE' : null;

      await client.parcel.create({
         data: {
            creatorId: '687916eb6a5be35de22a11a2',
            deliveryAddress: {
               city: faker.location.city(),
               country: faker.location.country(),
               street: faker.location.streetAddress(),
               zip: faker.location.zipCode(),
               state: faker.location.state(),
            },
            fees: {
               deliveryFee: faker.number.int({ min: 150, max: 350 }),
               handlingFee: faker.number.int({ min: 0, max: 200 }),
               insuranceFee: faker.number.int({ min: 0, max: 100 }),
               price: faker.number.int({ min: 0, max: 2000 }),
               signatureFee: faker.number.int({ min: 0, max: 50 }),
            },
            parcelType: faker.helpers.arrayElement([
               'DOCUMENT',
               'PACKAGE',
               'LARGE_PACKAGE',
            ]),
            weight: faker.number.int({ min: 1, max: 50 }),
            paymentStatus,
            pickupAddress: {
               city: faker.location.city(),
               country: faker.location.country(),
               street: faker.location.streetAddress(),
               zip: faker.location.zipCode(),
               state: faker.location.state(),
            },
            recipient: {
               email: faker.internet.email(),
               name: faker.person.fullName(),
               phone: faker.phone.number(),
            },
            sender: {
               email: faker.internet.email(),
               name: faker.person.fullName(),
               phone: faker.phone.number(),
            },
            trackingNumber: trackingNumber,
            status: faker.helpers.arrayElement([
               'PENDING',
               'PICKED_UP',
               'IN_TRANSIT',
               'DELIVERING',
               'DELIVERED',
               'CANCELLED',
            ]),
            createdAt: faker.date.recent({ days: 90 }),
            estimatedDelivery: faker.date.soon({ days: 5 }),
            trackingQrCode: qrCode,
            dimensions:
               faker.commerce.productAdjective() +
               ' ' +
               faker.number.int({ min: 10, max: 100 }) +
               'cm',
            deliveryType: faker.helpers.arrayElement([
               'STANDARD',
               'EXPRESS',
               'OVERNIGHT',
               'SAME_DAY',
            ]),
            notes: faker.lorem.sentence(),
            deliveryAgentId: '687a1ecf8f2e3894f2dec0f5',
            paymentMethod: paymentMethod,
         },
      });
   }
}

main().catch(log);
