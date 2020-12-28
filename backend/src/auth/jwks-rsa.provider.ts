import { FactoryProvider } from '@nestjs/common';
import { JWKS_RSA } from './auth.constants';
import * as jwksRsa from 'jwks-rsa';
import { env } from 'process';

// Dynamically provide a signing key based on the kid in the header and the signing keys provided by the JWKS endpoint
export const JwksRsaProvider: FactoryProvider = {
  provide: JWKS_RSA,
  useFactory: () =>
    jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `${env.AUTH0_ISSUER_URL}.well-known/jwks.json`,
    }),
};
