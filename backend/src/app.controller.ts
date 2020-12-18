import { Controller, Get, Req, Request } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
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
}
