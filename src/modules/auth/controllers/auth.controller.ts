import { Controller, Body, Response, Post, UseGuards } from '@nestjs/common';
import { LoginDto, RefreshTokenDto } from '../dtos';
import { AuthService } from '../services';
import { AccessTokenGuard } from 'src/shared';
import { ResponseFormat } from 'src/shared/utils';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Response() res, @Body() loginDto: LoginDto) {
    const user_login = await this.authService.login(loginDto);
    ResponseFormat.successResponse(res, user_login, 'User logged in');
  }

  @UseGuards(AccessTokenGuard)
  @Post('refresh-token')
  async refreshToken(
    @Response() res,
    @Body() refreshToken: RefreshTokenDto,
  ): Promise<any> {
    const accessToken = await this.authService.refreshToken(refreshToken);
    ResponseFormat.successResponse(
      res,
      accessToken,
      'Token Refreshed Successfully',
    );
  }
}
