import {
   Body,
   Controller,
   HttpCode,
   HttpStatus,
   Post,
   UseGuards,
} from '@nestjs/common';
import { ParcelService } from './parcel.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { BookingParcelDto } from './dto/booking-parcel.dto';
import { AuthUser as DAuthUser } from 'src/auth/decorators/auth-user.decorator';
import { AuthUser } from 'src/auth/types/auth-user';

@Controller('parcels')
export class ParcelController {
   constructor(private readonly parcelService: ParcelService) {}

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
}
