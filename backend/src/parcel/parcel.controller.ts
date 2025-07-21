import {
   Body,
   Controller,
   Get,
   HttpCode,
   HttpStatus,
   Param,
   Post,
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
import { Role } from 'generated/prisma';
import { PaginationPipe } from '../pipes/pagination.pipe';
import { AccessGuard } from 'src/auth/guards/access.guard';
import { MongoIdValidationPipe } from './pipes/mongo-id-validation.pipe';

@Controller('parcels')
export class ParcelController {
   constructor(private readonly parcelService: ParcelService) {}

   @HttpCode(HttpStatus.OK)
   @Roles(Role.ADMIN, Role.USER, Role.DELIVERY_AGENT)
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
      );
   }

   @HttpCode(HttpStatus.CREATED)
   @Roles('USER')
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
   @UseGuards(AccessGuard)
   @UseGuards(JwtGuard)
   @Get('/:parcelId')
   async parcelDetails(
      @Param('parcelId', MongoIdValidationPipe) parcelId: string,
   ) {
      return this.parcelService.bookingDetails(parcelId);
   }
}
