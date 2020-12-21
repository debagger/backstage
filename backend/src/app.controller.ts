import { Controller, Get, Req, Request } from '@nestjs/common';
import type { OpenidRequest, claimCheck } from 'express-openid-connect';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Req() req: OpenidRequest): string {
    if (req.oidc.user) {
      return `Hello ${req.oidc.user['name']}
  ${JSON.stringify(req.oidc.user, undefined, 2)}`;
    }
  }

  @Get('ping')
  async ping(@Req() request: Request): Promise<string> {
    const pingId = await this.appService.ping(request.headers);
    return `Ping id is ${pingId}`;
  }

  @Get('ping/count')
  async pingCount(): Promise<number> {
    const count = await this.appService.pingCount();
    return count;
  }
  @Get('userprofile')
  async userprofile(@Req() req: OpenidRequest) {
    return {
      ...(await req.oidc.fetchUserInfo()),
      idTokenClaims: req.oidc.idTokenClaims,
      accessToken: req.oidc.accessToken,
      idToken: req.oidc.idToken
    };
  }
}
