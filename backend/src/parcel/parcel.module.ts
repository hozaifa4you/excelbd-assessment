import { Module } from '@nestjs/common';
import { ParcelController } from './parcel.controller';
import { ParcelService } from './parcel.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
   controllers: [ParcelController],
   providers: [ParcelService, PrismaService],
})
export class ParcelModule {}
