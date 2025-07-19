import { UserService } from '../user/user.service';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtRefreshConfig from '../config/jwt-refresh.config';
import { ConfigType } from '@nestjs/config';
import * as argon2 from 'argon2';
import { AuthJwtPayload } from './types/jwt';
import { AuthUser } from './types/auth-user';
import { SignupDto } from './dto/signup.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
   constructor(
      private readonly userService: UserService,
      private readonly jwtService: JwtService,
      @Inject(jwtRefreshConfig.KEY)
      private readonly refreshJwtConfig: ConfigType<typeof jwtRefreshConfig>,
      private readonly prisma: PrismaService,
   ) {}

   async signup(createUserDto: SignupDto) {
      const user = await this.userService.findByEmail(createUserDto.email);
      if (user) throw new UnauthorizedException('Email already exists');

      const username = await this.userService.usernameGenerator(
         createUserDto.email,
      );

      const hashedPassword = await argon2.hash(createUserDto.password);

      await this.prisma.user.create({
         data: { ...createUserDto, username, password: hashedPassword },
      });

      return {
         message: `Welcome to Quicko! We&apos;ve sent a verification email to ${createUserDto.email}. Please check your inbox and click the verification link to activate your account.`,
      };
   }

   async signin(user: AuthUser) {
      const { accessToken, refreshToken } = await this.generateTokens(user.id);

      const hashedRememberToken = await argon2.hash(refreshToken);

      await this.updateRememberToken(user.id, hashedRememberToken);

      return {
         user,
         accessToken,
         refreshToken,
      };
   }

   async signout(userId: string) {
      await this.updateRememberToken(userId, null);
      return { message: 'User signed out successfully' };
   }

   async validateUser(email: string, password: string) {
      const user = await this.userService.findByEmail(email);
      if (!user) throw new UnauthorizedException('Invalid credentials');

      const isMatch = await argon2.verify(user.password, password);
      if (!isMatch) throw new UnauthorizedException('Invalid credentials');

      return {
         id: user.id,
         firstName: user.firstName,
         lastName: user.lastName,
         email: user.email,
         role: user.role,
      };
   }

   async generateTokens(userId: string) {
      const payload: AuthJwtPayload = { sub: userId };

      const [accessToken, refreshToken] = await Promise.all([
         this.jwtService.signAsync(payload),
         this.jwtService.signAsync(payload, this.refreshJwtConfig),
      ]);

      return { accessToken, refreshToken };
   }

   async refreshToken(userId: string) {
      const payload: AuthJwtPayload = { sub: userId };
      const token = await this.jwtService.signAsync(payload);

      return {
         id: userId,
         token,
      };
   }

   async validateRefreshToken(userId: string, refreshToken: string) {
      const user = await this.userService.findMe(userId);
      if (!user?.rememberToken) {
         throw new UnauthorizedException('Unauthorized');
      }

      const isMatch = await argon2.verify(user.rememberToken, refreshToken);
      if (!isMatch) {
         throw new UnauthorizedException('Unauthorized');
      }

      return { id: user.id };
   }

   async logout(userId: string) {
      await this.updateRememberToken(userId, null);

      return { message: 'User logged out successfully' };
   }

   async validateJwtUser(userId: string) {
      const user = await this.userService.findMe(userId);

      if (!user) throw new UnauthorizedException('Unauthorized');

      const currentUser: AuthUser = {
         id: user.id,
         firstName: user.firstName,
         lastName: user.lastName,
         email: user.email,
         role: user.role,
      };

      return currentUser;
   }

   async validateGoogleUser(createUserDto: SignupDto) {
      const user = await this.userService.findByEmail(createUserDto.email);
      if (user) return user;

      const username = await this.userService.usernameGenerator(
         createUserDto.email,
      );

      return await this.prisma.user.create({
         data: { ...createUserDto, username },
      });
   }

   async updateRememberToken(
      userId: string,
      hashedRememberToken: string | null,
   ) {
      return await this.prisma.user.update({
         where: { id: userId },
         data: { rememberToken: hashedRememberToken },
      });
   }
}
