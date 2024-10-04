import { LoginDto, RefreshTokenDto } from 'src/modules/auth';
import { AccessToken, RefreshToken } from '../app';

export interface IAuthService {
  generateAccessToken(userId: string, email: string): Promise<AccessToken>;

  generateRefreshTokens(userId: string, email: string): Promise<RefreshToken>;

  refreshToken(payload: RefreshTokenDto): Promise<AccessToken>;

  updateRefreshToken(userId: string, refreshToken: string): Promise<void>;

  login(loginDto: LoginDto): Promise<AccessToken & RefreshToken>;

}
