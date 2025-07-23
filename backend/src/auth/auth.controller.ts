import {
   Body,
   Controller,
   Delete,
   HttpCode,
   HttpStatus,
   Post,
   Req,
   UseGuards,
} from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { AuthRequest, AuthUser } from './types/auth-user';
import { JwtGuard } from './guards/jwt.guard';
import { AuthUser as DAuth } from './decorators/auth-user.decorator';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

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

   @HttpCode(HttpStatus.NO_CONTENT)
   @UseGuards(JwtGuard)
   @Delete('signout')
   signout(@Req() req: AuthRequest) {
      const userId = req.user.id;
      return this.authService.signout(userId);
   }

   @HttpCode(HttpStatus.OK)
   @UseGuards(JwtRefreshGuard)
   @Post('refresh-token')
   async refresh(@DAuth() user: AuthUser) {
      console.log({ 'hit-refresh-token': user });

      return this.authService.refreshToken(user);
   }
}
