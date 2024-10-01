import { AuthGuard } from '@nestjs/passport';

export class refresh_tokenGuard extends AuthGuard('jwt-refresh') {
  constructor() {
    super();
  }
}
