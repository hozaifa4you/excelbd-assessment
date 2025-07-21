import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Role } from 'generated/prisma';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AdminService } from './admin.service';
import { PaginationPipe } from 'src/pipes/pagination.pipe';

@Roles(Role.ADMIN)
@UseGuards(JwtGuard, RolesGuard)
@Controller('admin')
export class AdminController {
   constructor(private readonly adminService: AdminService) {}

   @Get('available-agents')
   async getAgents(@Query() pagination: PaginationPipe) {
      return this.adminService.getAgents(pagination.page, pagination.limit);
   }

   @Get('customers')
   async getCustomers(@Query() pagination: PaginationPipe) {
      return this.adminService.getCustomers(pagination.page, pagination.limit);
   }

   @Get('assignable-parcels')
   async getNonDeliveryParcels(@Query() pagination: PaginationPipe) {
      return this.adminService.getNonDeliveryParcels(
         pagination.page,
         pagination.limit,
      );
   }
}
