import {
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SecretCallbackLong, secretType } from 'express-jwt';
import { JWKS_RSA } from './auth.constants';
import * as jsonwebtoken from 'jsonwebtoken';
import { GqlExecutionContext } from '@nestjs/graphql';
export type DecodedToken = { header: any; payload: any };

export const getRequestFromContext = (context: ExecutionContext) => {
  if (<string>context.getType() === 'graphql') {
    const gqlContext = GqlExecutionContext.create(context).getContext();
    return gqlContext.req;
  } else {
    const http = context.switchToHttp();
    return http.getRequest();
  }
};

@Injectable()
export class AuthUtils {
  constructor(@Inject(JWKS_RSA) private readonly jwks: SecretCallbackLong) {}

  public getRequestFromContext = getRequestFromContext;

  public async getUserData(req: any) {
    const token = this.extractToken(req);
    const decodedToken = this.decodeToken(token);
    const secret = await this.getSecret(req, decodedToken);
    return await this.verifyToken(token, secret);
  }

  private extractToken(req: any): string {
    const parts: string[] = req.headers.authorization?.split(' ');
    if (!parts)
      throw new UnauthorizedException('Authorization header not found');
    if (parts.length !== 2)
      throw new UnauthorizedException(
        'Authorization header wrong format, need Bearer type',
      );
    const scheme = parts[0];
    const token = parts[1];
    if (!/^Bearer$/i.test(scheme))
      throw new UnauthorizedException(
        `Authorization header scheme need to be Bearer type, found '${scheme}'`,
      );
    return token;
  }

  private decodeToken(token: string): DecodedToken {
    try {
      const decodedToken = <{ [key: string]: string }>(
        jsonwebtoken.decode(token, { complete: true })
      );
      if (!(decodedToken.header && decodedToken.payload)) {
        throw new Error(
          "Decoded token must contains 'header' and 'payload' fields. Wrong return from 'jsonwebtoken' lib?",
        );
      }
      return decodedToken as DecodedToken;
    } catch (error) {
      throw new UnauthorizedException('Invalid token', error);
    }
  }

  private async getSecret(req: any, token: DecodedToken) {
    return new Promise<secretType>((resolve, reject) => {
      this.jwks(req, token.header, token.payload, (err, secret) => {
        if (err) reject(err);
        resolve(secret);
      });
    });
  }

  private async verifyToken(token: string, secret: secretType) {
    return new Promise<object>((resolve, reject) => {
      jsonwebtoken.verify(token, secret, (err, decoded) => {
        if (err) reject(err);
        resolve(decoded);
      });
    });
  }
}
