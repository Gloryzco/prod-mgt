import { Controller, Body, Response, Post, UseGuards } from '@nestjs/common';
import { LoginDto, RefreshTokenDto } from '../dtos';
import { AuthService } from '../services';
import { accessTokenGuard } from 'src/shared/guards';
import { ResponseFormat } from 'src/utils';
import { GetCurrentUserId } from 'src/shared';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Response() res, @Body() loginDto: LoginDto) {
    const user_login = await this.authService.login(loginDto);
    ResponseFormat.successResponse(res, user_login, 'User logged in');
  }

  @UseGuards(accessTokenGuard)
  @Post('logout')
  async logout(
    @Response() res,
    @GetCurrentUserId() userId: string,
  ): Promise<any> {
    const userLogout = await this.authService.logout(userId);
    ResponseFormat.successResponse(res, userLogout, 'User logged out');
  }

  @UseGuards(accessTokenGuard)
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
