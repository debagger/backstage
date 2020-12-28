import {  Module } from '@nestjs/common';
import { JwksRsaProvider } from './jwks-rsa.provider';
import { AuthGuard } from './auth.guard';
import { AuthUtils } from './auth.utils';

@Module({
  providers: [JwksRsaProvider, AuthGuard, AuthUtils],
  exports:[AuthGuard, AuthUtils]
})
export class AuthModule {}
