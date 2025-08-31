import {
   Body,
   Controller,
   Get,
   HttpCode,
   HttpStatus,
   Put,
   Query,
   UseGuards,
} from '@nestjs/common';
import { Role } from 'generated/prisma';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AdminService } from './admin.service';
import { PaginationPipe } from 'src/pipes/pagination.pipe';
import { AssignAgentDto } from './dto/assign-agent.dto';

@Roles(Role.ADMIN)
@UseGuards(JwtGuard, RolesGuard)
@Controller('admin')
export class AdminController {
   constructor(private readonly adminService: AdminService) {}

   @HttpCode(HttpStatus.OK)
   @Get('available-agents')
   async getAvailableAgents(@Query() pagination: PaginationPipe) {
      return this.adminService.getAvailableAgents(
         pagination.page,
         pagination.limit,
      );
   }

   @HttpCode(HttpStatus.OK)
   @Get('customers')
   async getCustomers(@Query() pagination: PaginationPipe) {
      return this.adminService.getCustomers(pagination.page, pagination.limit);
   }

   @HttpCode(HttpStatus.OK)
   @Get('agents')
   async getAgents(@Query() pagination: PaginationPipe) {
      return this.adminService.getAgents(pagination.page, pagination.limit);
   }

   @HttpCode(HttpStatus.OK)
   @Get('assignable-parcels')
   async getAssignableParcels(@Query() pagination: PaginationPipe) {
      return this.adminService.getAssignableParcels(
         pagination.page,
         pagination.limit,
      );
   }

   @HttpCode(HttpStatus.OK)
   @Put('assign-agent')
   async assignAgent(@Body() assignAgentDto: AssignAgentDto) {
      return this.adminService.setAssignAgent(assignAgentDto);
   }
}
