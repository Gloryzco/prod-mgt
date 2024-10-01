import { ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/modules';
import AppError from 'src/utils/app-error.utils';

@Injectable()
export class accessTokenGuard extends AuthGuard('jwt') {
  constructor(
    private userService: UserService,
    private reflector: Reflector,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw new AppError(
        'Access token is missing or invalid.',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return user;
  }
}
