import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async findAll(): Promise<any> {
    return await this.appService.findAll();
  }

  @Get('one')
  async one(): Promise<any> {
    const data = await this.appService.findById('64c77e1e815d9d3bbbff22e5');

    return {
      full: data,
      simple: data.group_name,
    };
  }
}
