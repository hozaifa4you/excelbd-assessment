import {
   Body,
   Controller,
   HttpCode,
   HttpStatus,
   Post,
   Req,
} from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { Request } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
   constructor(private readonly authService: AuthService) {}

   @HttpCode(HttpStatus.CREATED)
   @Post('signup')
   async signup(@Body() signupDto: SignupDto) {
      return this.authService.signup(signupDto);
   }

   @HttpCode(HttpStatus.OK)
   @Post('signin')
   async signin(@Req() req: Request) {}
}
