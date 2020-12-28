import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext, ObjectType } from '@nestjs/graphql';
import { RequestHandler, SecretCallbackLong, secretType } from 'express-jwt';
import { JWT, JWKS_RSA } from './auth.constants';
import * as jsonwebtoken from 'jsonwebtoken';
import { exception } from 'console';
import { AuthUtils } from './auth.utils';

type DecodedToken = { header: any; payload: any };

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private utils: AuthUtils,
    private reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
    //   context.getHandler(),
    //   context.getClass(),
    // ]);
    const req = this.utils.getRequestFromContext(context);
    const userAuthData = await this.utils.getUserData(req);
    req.user = userAuthData;
    return !!userAuthData;
  }


}
