import { Controller, Body, Response, Post, UseGuards } from '@nestjs/common';
import { LoginDto, RefreshTokenDto } from '../dtos';
import { AuthService } from '../services';
import { access_tokenGuard } from 'src/shared/guards';
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

  @UseGuards(access_tokenGuard)
  @Post('logout')
  async logout(
    @Response() res,
    @GetCurrentUserId() userId: string,
  ): Promise<any> {
    const user_logout = await this.authService.logout(userId);
    ResponseFormat.successResponse(res, user_logout, 'User logged out');
  }

  @UseGuards(access_tokenGuard)
  @Post('refresh-token')
  async refresh_token(
    @Response() res,
    @Body() refresh_token: RefreshTokenDto,
  ): Promise<any> {
    const access_token = await this.authService.refresh_token(refresh_token);
    ResponseFormat.successResponse(
      res,
      access_token,
      'Token Refreshed Successfully',
    );
  }
}
