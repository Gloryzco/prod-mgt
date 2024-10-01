import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsNotEmpty({ message: 'refresh token is required.' })
  @IsString()
  refreshToken: string;
}
