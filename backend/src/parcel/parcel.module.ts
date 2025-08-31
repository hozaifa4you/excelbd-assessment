import { Module } from '@nestjs/common';
import { ParcelController } from './parcel.controller';
import { ParcelService } from './parcel.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploaderService } from 'src/uploader/uploader.service';

@Module({
   controllers: [ParcelController],
   providers: [ParcelService, PrismaService, UploaderService],
})
export class ParcelModule {}
