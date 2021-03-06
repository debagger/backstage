import { Controller, Get, Req, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';
import { User } from './auth/user.decorator';

@Controller()
@UseGuards(AuthGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Req() req: Request): string {
    return 'Hello!';
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
  async userprofile(@User() userData: any) {
    return userData;
  }
}
