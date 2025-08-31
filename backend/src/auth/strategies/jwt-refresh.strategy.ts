import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import jwtRefreshConfig from 'src/config/jwt-refresh.config';
import { AuthJwtPayload } from '../types/jwt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
   Strategy,
   'jwt-refresh',
) {
   constructor(
      @Inject(jwtRefreshConfig.KEY)
      private config: ConfigType<typeof jwtRefreshConfig>,
      private authService: AuthService,
   ) {
      if (!config.secret) {
         throw new Error('JWT secret is not defined in the configuration.');
      }
      super({
         jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
         secretOrKey: config.secret,
         ignoreExpiration: false,
         passReqToCallback: true,
      });
   }

   async validate(req: Request, payload: AuthJwtPayload) {
      const refreshToken = req
         .get('authorization')
         ?.replace('Bearer', '')
         .trim();
      if (!refreshToken) {
         throw new UnauthorizedException('Unauthorized');
      }

      const userId = payload.sub;

      return await this.authService.validateRefreshToken(userId, refreshToken);
   }
}
