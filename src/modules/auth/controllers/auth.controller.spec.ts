import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../controllers';
import { AuthService } from '../services';
import { ResponseFormat } from 'src/shared/utils';
import { LoginDto, RefreshTokenDto } from '../dtos';
import { CanActivate, ExecutionContext, HttpStatus } from '@nestjs/common';
import { AccessTokenGuard } from 'src/shared';

class MockAccessTokenGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    return true;
  }
}

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    refreshToken: jest.fn(),
  };

  const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    })
      .overrideGuard(AccessTokenGuard)
      .useClass(MockAccessTokenGuard)
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should log in the user', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const userLoginData = { accessToken: 'sample_access_token' };
      mockAuthService.login.mockResolvedValue(userLoginData);
      const res = mockResponse();

      await controller.login(res, loginDto);
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'User logged in',
        data: userLoginData,
      });
    });
  });

  describe('refreshToken', () => {
    it('should refresh the access token', async () => {
      const refreshTokenDto: RefreshTokenDto = {
        refreshToken: 'sample_refresh_token',
      };
      const refreshedToken = { accessToken: 'new_access_token' };
      mockAuthService.refreshToken.mockResolvedValue(refreshedToken);
      const res = mockResponse();

      await controller.refreshToken(res, refreshTokenDto);
      expect(mockAuthService.refreshToken).toHaveBeenCalledWith(refreshTokenDto);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Token Refreshed Successfully',
        data: refreshedToken,
      });
    });
  });
});
