import {
   Body,
   Controller,
   Get,
   HttpCode,
   HttpStatus,
   Param,
   Post,
   Put,
   Query,
   UseGuards,
} from '@nestjs/common';
import { ParcelService } from './parcel.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { BookingParcelDto } from './dto/booking-parcel.dto';
import { AuthUser as DAuthUser } from 'src/auth/decorators/auth-user.decorator';
import { AuthUser } from 'src/auth/types/auth-user';
import { ParcelStatus, Role } from 'generated/prisma';
import { PaginationPipe } from '../pipes/pagination.pipe';
import { AccessGuard } from 'src/auth/guards/access.guard';
import { MongoIdValidationPipe } from './pipes/mongo-id-validation.pipe';
import { DeliveryAccessGuard } from 'src/auth/guards/deliery-access.guard';

@Controller('parcels')
export class ParcelController {
   constructor(private readonly parcelService: ParcelService) {}

   @HttpCode(HttpStatus.OK)
   @Roles(Role.ADMIN, Role.CUSTOMER, Role.DELIVERY_AGENT)
   @UseGuards(RolesGuard)
   @UseGuards(JwtGuard)
   @Get('/')
   async getBookings(
      @DAuthUser() user: AuthUser,
      @Query() pagination: PaginationPipe,
   ) {
      return this.parcelService.getBookings(
         user.role,
         user.id,
         pagination.page,
         pagination.limit,
         pagination.s,
      );
   }

   @HttpCode(HttpStatus.CREATED)
   @Roles(Role.CUSTOMER)
   @UseGuards(RolesGuard)
   @UseGuards(JwtGuard)
   @Post('/booking')
   async bookParcel(
      @Body() bookingParcelDto: BookingParcelDto,
      @DAuthUser() user: AuthUser,
   ) {
      return this.parcelService.bookParcel(user.id, bookingParcelDto);
   }

   @HttpCode(HttpStatus.OK)
   @Roles(Role.DELIVERY_AGENT)
   @UseGuards(RolesGuard)
   @UseGuards(JwtGuard)
   @Get('/options')
   async getParcelOptions(
      @DAuthUser() user: AuthUser,
      @Query('barcode') barcode: string,
   ) {
      return this.parcelService.getParcelOptions(user.id, barcode);
   }

   @HttpCode(HttpStatus.OK)
   @UseGuards(AccessGuard)
   @UseGuards(JwtGuard)
   @Get('/:parcelId')
   async parcelDetails(
      @Param('parcelId', MongoIdValidationPipe) parcelId: string,
   ) {
      return this.parcelService.bookingDetails(parcelId);
   }

   @HttpCode(HttpStatus.OK)
   @Roles(Role.DELIVERY_AGENT)
   @UseGuards(DeliveryAccessGuard)
   @UseGuards(RolesGuard)
   @UseGuards(JwtGuard)
   @Put(':parcelId/delivery-update')
   async updateParcelOptions(
      @Param('parcelId', MongoIdValidationPipe) parcelId: string,
      @Query('target') target: ParcelStatus,
   ) {
      return this.parcelService.deliveryUpdate(parcelId, target);
   }
}
