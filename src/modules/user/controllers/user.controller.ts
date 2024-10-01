import { Controller, Body, Response, Post } from '@nestjs/common';
import { CreateUserDto } from '../dtos';
import { UserService } from '../services';
import { ResponseFormat } from 'src/utils';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async create(
    @Response() res,
    @Body() createUserDto: CreateUserDto,
  ): Promise<any> {
    const new_user = await this.userService.create(createUserDto);
    ResponseFormat.successResponse(
      res,
      new_user,
      'User created successfully',
      201,
    );
  }
}
