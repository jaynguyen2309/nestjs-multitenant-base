import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { UserService } from './user.service';
import { CreateUserDto, ReadUserDto } from './dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<ReadUserDto[]> {
    return this.userService.findAll();
  }

  @Post()
  async create(@Body() user: CreateUserDto): Promise<ReadUserDto> {
    return this.userService.create(user);
  }

  // Test only
  @Get('/:username')
  async findByUsername(@Param('username') username: string) {
    return this.userService.findOne(username);
  }
}
