import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RefreshTokenDto } from '../dtos';
import * as argon from 'argon2';
import {
  AccessToken,
  IAuthService,
  JwtPayload,
  RefreshToken,
} from 'src/shared';
import configuration from 'src/config/configuration';
import { UserService } from 'src/modules';
import AppError from 'src/shared/utils/app-error.utils';
import { User } from 'src/schema';

const config = configuration();

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async generateAccessToken(
    userId: string,
    email: string,
  ): Promise<AccessToken> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
    };

    const accessToken = await this.jwtService.signAsync(jwtPayload, {
      secret: config.jwt.accessTokenSecret,
      expiresIn: config.jwt.accessTokenExpiration,
    });

    return {
      accessToken: accessToken,
      accessTokenExpiresIn: config.jwt.accessTokenExpiration,
    };
  }

  async generateRefreshTokens(
    userId: string,
    email: string,
  ): Promise<RefreshToken> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email: email,
    };

    const refreshToken = await this.jwtService.signAsync(jwtPayload, {
      secret: config.jwt.refreshTokenSecret,
      expiresIn: config.jwt.refreshTokenExpiration,
    });

    return {
      refreshToken: refreshToken,
      refreshTokenExpiresIn: config.jwt.refreshTokenExpiration,
    };
  }

  async refreshToken(payload: RefreshTokenDto) {
    const { sub, email } = await this.jwtService.verifyAsync<JwtPayload>(
      payload.refreshToken,
      { secret: config.jwt.refreshTokenSecret },
    );

    const user = await this.userService.findById(sub);

    if (!user) {
      throw new AppError('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }
    const accessToken = await this.generateAccessToken(sub, email);
    return accessToken;
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashed_refreshToken = await argon.hash(refreshToken);
    await this.userService.update(userId, {
      refreshToken: hashed_refreshToken,
    });
  }

  async login(loginDto: LoginDto): Promise<AccessToken & RefreshToken> {
    const { email, password } = loginDto;
    const user = await this.userService.findByEmail(email);

    if (!user || !(await user.verifyPassword(password))) {
      throw new AppError('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const [accessTokenDetails, refreshTokenDetails] = await Promise.all([
      this.generateAccessToken(user.id, user.email),
      this.generateRefreshTokens(user.id, user.email),
    ]);

    const tokens: AccessToken & RefreshToken = {
      ...accessTokenDetails,
      ...refreshTokenDetails,
    };
    await this.updateRefreshToken(user.id, refreshTokenDetails.refreshToken);
    return tokens;
  }
}
