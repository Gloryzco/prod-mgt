import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers';
import { AuthService } from './services';
import { UserModule, UserService } from '../user';
import { AccessTokenStrategy, RefreshTokenStrategy } from 'src/shared';

@Module({
  imports: [JwtModule.register({}), UserModule],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
