import 'dotenv/config';
import { PrismaClient } from '../generated/prisma';
import { faker } from '@faker-js/faker';
import { log } from 'console';
import { UploaderService } from '../src/uploader/uploader.service';

const client = new PrismaClient();
const uploadService = new UploaderService();

async function main() {
   const parcelCount = 500;
   const agentCount = 50;
   const parcel = true;
   const agent = false;
   const customer = false;

   if (parcel) {
      log('Deleting existing parcels...');
      await client.parcel.deleteMany();
      log('Seeding parcels...');
      for (let i = 0; i < parcelCount; i++) {
         const trackingNumber = Math.random().toString(36).substring(2, 15);

         const qrCode = await uploadService.qrCodeUploader(
            trackingNumber,
            trackingNumber,
         );

         const paymentStatus = faker.helpers.arrayElement(['PAID', 'COD']);
         const paymentMethod = paymentStatus === 'PAID' ? 'ONLINE' : null;

         const _parcel = await client.parcel.create({
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

         const barcode = await uploadService.barcodeUploader(
            _parcel.id,
            trackingNumber,
         );

         await client.parcel.update({
            where: { id: _parcel.id },
            data: { barcode },
         });
      }
   }

   if (agent) {
      log('Deleting existing seeds...');
      await client.user.deleteMany({ where: { role: 'DELIVERY_AGENT' } });
      log('Seeding agents...');
      for (let i = 0; i < agentCount; i++) {
         await client.user.create({
            data: {
               email: faker.internet.email(),
               firstName: faker.person.firstName(),
               lastName: faker.person.lastName(),
               phone: faker.phone.number(),
               password: faker.internet.password(),
               role: 'DELIVERY_AGENT',
               username: faker.internet.username(),
               avatar: faker.image.avatar(),
               Address: {
                  city: faker.location.city(),
                  country: faker.location.country(),
                  state: faker.location.state(),
                  street: faker.location.street(),
                  zip: faker.location.zipCode(),
               },
            },
         });
      }
   }

   if (customer) {
      log('Deleting existing customers...');
      await client.user.deleteMany({ where: { role: 'CUSTOMER' } });
      log('Seeding customers...');
      for (let i = 0; i < agentCount; i++) {
         await client.user.create({
            data: {
               email: faker.internet.email(),
               firstName: faker.person.firstName(),
               lastName: faker.person.lastName(),
               phone: faker.phone.number(),
               password: faker.internet.password(),
               role: 'CUSTOMER',
               username: faker.internet.username(),
               avatar: faker.image.avatar(),
            },
         });
      }
   }
}

main().catch(log);
