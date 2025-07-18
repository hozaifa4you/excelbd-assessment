import {
   Body,
   Controller,
   HttpCode,
   HttpStatus,
   Post,
   Req,
   UseGuards,
} from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { AuthRequest } from './types/auth-user';

@Controller('auth')
export class AuthController {
   constructor(private readonly authService: AuthService) {}

   @HttpCode(HttpStatus.CREATED)
   @Post('signup')
   async signup(@Body() signupDto: SignupDto) {
      return this.authService.signup(signupDto);
   }

   @HttpCode(HttpStatus.OK)
   @UseGuards(LocalAuthGuard)
   @Post('signin')
   async signin(@Req() req: AuthRequest) {
      return this.authService.signin(req.user);
   }
}
