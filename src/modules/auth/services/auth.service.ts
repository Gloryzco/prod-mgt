import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RefreshTokenDto } from '../dtos';
import * as argon from 'argon2';
import { access_token, JwtPayload, refresh_token } from 'src/shared';
import configuration from 'src/config/configuration';
import { UserService } from 'src/modules';
import AppError from 'src/utils/app-error';

const config = configuration();

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async generateaccess_token(
    userId: string,
    email: string,
  ): Promise<access_token> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
    };

    const access_token = await this.jwtService.signAsync(jwtPayload, {
      secret: config.jwt.access_tokenSecret,
      expiresIn: config.jwt.access_tokenExpiration,
    });

    return {
      access_token: access_token,
      access_tokenExpiresIn: config.jwt.access_tokenExpiration,
    };
  }

  async generaterefresh_tokens(
    userId: string,
    email: string,
  ): Promise<refresh_token> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
    };

    const refresh_token = await this.jwtService.signAsync(jwtPayload, {
      secret: config.jwt.refresh_tokenSecret,
      expiresIn: config.jwt.refresh_tokenExpiration,
    });

    return {
      refresh_token: refresh_token,
      refresh_tokenExpiresIn: config.jwt.refresh_tokenExpiration,
    };
  }

  async refresh_token(payload: RefreshTokenDto) {
    const { sub, email } = await this.jwtService.verifyAsync<JwtPayload>(
      payload.refresh_token,
      { secret: config.jwt.refresh_tokenSecret },
    );

    const user = await this.userService.findById(sub);

    if (!user) {
      throw new AppError('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }
    const access_token = await this.generateaccess_token(sub, email);
    return access_token;
  }

  async updaterefresh_token(userId: string, refresh_token: string) {
    const hashedrefresh_token = await argon.hash(refresh_token);
    await this.userService.update(userId, {
      refresh_token: hashedrefresh_token,
    });
  }

  async login(loginDto: LoginDto): Promise<access_token | refresh_token> {
    const { email, password } = loginDto;
    const user = await this.userService.findByEmail(email);

    if (!user || !(await user.verifyPassword(password))) {
      throw new AppError('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const access_tokenDetails = await this.generateaccess_token(
      user.id,
      user.email,
    );
    const refresh_tokenDetails = await this.generaterefresh_tokens(
      user.id,
      user.email,
    );

    const tokens: access_token | refresh_token = {
      ...access_tokenDetails,
      ...refresh_tokenDetails,
    };
    await this.updaterefresh_token(user.id, refresh_tokenDetails.refresh_token);
    return tokens;
  }

  async logout(userId: string): Promise<boolean> {
    const user = await this.userService.findById(userId);
    if (!user || !user.refresh_token) {
      throw new AppError(
        'Access denied. Login required',
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.userService.update(userId, { refresh_token: null });

    return true;
  }
}
