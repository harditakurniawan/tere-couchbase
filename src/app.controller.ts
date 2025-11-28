import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateLovDto } from './dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async create(@Body() dto: CreateLovDto): Promise<any> {
    return await this.appService.create(dto);
  }

  @Get()
  async findAll(): Promise<any> {
    return await this.appService.findAll();
  }

  @Get(':id')
  async one(@Param('id') id: string): Promise<any> {
    const data = await this.appService.findById(id);

    return {
      full: data,
      simple: data.group_name,
    };
  }
}
