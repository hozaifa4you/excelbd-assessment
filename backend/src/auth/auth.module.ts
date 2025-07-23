import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from 'src/config/jwt.config';
import jwtRefreshConfig from 'src/config/jwt-refresh.config';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { EmailModule } from '../email/email.module';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

@Module({
   imports: [
      JwtModule.registerAsync(jwtConfig.asProvider()),
      ConfigModule.forFeature(jwtConfig),
      ConfigModule.forFeature(jwtRefreshConfig),
      EmailModule,
   ],
   providers: [
      AuthService,
      UserService,
      PrismaService,
      LocalStrategy,
      JwtStrategy,
      JwtRefreshStrategy,
   ],
   controllers: [AuthController],
})
export class AuthModule {}
