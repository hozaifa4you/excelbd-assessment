import {
   Controller,
   Get,
   HttpCode,
   HttpStatus,
   UseGuards,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '../../generated/prisma';
import { AuthUser as DAuthUser } from 'src/auth/decorators/auth-user.decorator';
import { AuthUser } from 'src/auth/types/auth-user';

@Controller('analytics')
export class AnalyticsController {
   constructor(private readonly analyticsService: AnalyticsService) {}

   @HttpCode(HttpStatus.OK)
   @Roles(Role.ADMIN, Role.USER, Role.DELIVERY_AGENT)
   @UseGuards(RolesGuard)
   @UseGuards(JwtGuard)
   @Get('bookings')
   async bookingsAnalytics(@DAuthUser() user: AuthUser) {
      return this.analyticsService.getBookingsAnalytics(user.role, user.id);
   }
}
