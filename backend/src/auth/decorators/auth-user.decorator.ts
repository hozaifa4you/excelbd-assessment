import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AuthUser as AuthUserType } from '../types/auth-user';

export const AuthUser = createParamDecorator(
   (data: unknown, ctx: ExecutionContext): AuthUserType => {
      const request = ctx.switchToHttp().getRequest<Request>();
      return request?.user as AuthUserType;
   },
);
