import {
   Controller,
   Get,
   HttpCode,
   HttpStatus,
   Res,
   UseGuards,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'generated/prisma';
import { AuthUser as DAuthUser } from 'src/auth/decorators/auth-user.decorator';
import { AuthUser } from 'src/auth/types/auth-user';
import { Response } from 'express';

@Controller('analytics')
export class AnalyticsController {
   constructor(private readonly analyticsService: AnalyticsService) {}

   @HttpCode(HttpStatus.OK)
   @Roles(Role.ADMIN, Role.CUSTOMER, Role.DELIVERY_AGENT)
   @UseGuards(RolesGuard)
   @UseGuards(JwtGuard)
   @Get('bookings-3-months')
   async bookingsAnalytics(@DAuthUser() user: AuthUser) {
      return this.analyticsService.getBookingsAnalytics(user.role, user.id);
   }

   @HttpCode(HttpStatus.OK)
   @Roles(Role.ADMIN, Role.CUSTOMER, Role.DELIVERY_AGENT)
   @UseGuards(RolesGuard)
   @UseGuards(JwtGuard)
   @Get('booking-export')
   async exportCSV(@Res() res: Response, @DAuthUser() user: AuthUser) {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
         'Content-Disposition',
         'attachment; filename="parcels.csv"',
      );

      const csvStream = await this.analyticsService.generateBookingReportCsv(
         user.role,
         user.id,
      );

      csvStream.pipe(res);
   }
}
