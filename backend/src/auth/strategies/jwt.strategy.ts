import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import jwtConfig from 'src/config/jwt.config';
import { AuthService } from '../auth.service';
import { AuthJwtPayload } from '../types/jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
   constructor(
      @Inject(jwtConfig.KEY)
      private readonly config: ConfigType<typeof jwtConfig>,
      private readonly authService: AuthService,
   ) {
      if (!config.secret) {
         throw new HttpException('JWT secret is not defined', 500);
      }

      console.log({ secret: config.secret });

      super({
         jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
         secretOrKey: config.secret,
         ignoreExpiration: false,
      });
   }

   async validate(payload: AuthJwtPayload) {
      const userId = payload.sub;
      console.log({ userId });

      return this.authService.validateJwtUser(userId);
   }
}
