import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../services/auth.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RefreshTokenDto } from '../dtos';
import * as argon from 'argon2';
import { HttpStatus } from '@nestjs/common';
import AppError from 'src/shared/utils/app-error.utils';
import { UserService } from 'src/modules/user';

jest.mock('argon2');

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let userService: UserService;

  const mockUserService = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  } as unknown as jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateAccessToken', () => {
    it('should generate an access token', async () => {
      mockJwtService.signAsync.mockResolvedValue('sample_access_token');
      const result = await authService.generateAccessToken('user_id', 'test@example.com');
      expect(result).toEqual({
        accessToken: 'sample_access_token',
        accessTokenExpiresIn: expect.any(String),
      });
    });
  });

  describe('generateRefreshTokens', () => {
    it('should generate a refresh token', async () => {
      mockJwtService.signAsync.mockResolvedValue('sample_refresh_token');
      const result = await authService.generateRefreshTokens('user_id', 'test@example.com');
      expect(result).toEqual({
        refreshToken: 'sample_refresh_token',
        refreshTokenExpiresIn: expect.any(String),
      });
    });
  });

  describe('refreshToken', () => {
    it('should refresh the access token if the refresh token is valid', async () => {
      mockJwtService.verifyAsync.mockResolvedValue({ sub: 'user_id', email: 'test@example.com' });
      mockUserService.findById.mockResolvedValue({ id: 'user_id' });

      mockJwtService.signAsync.mockResolvedValue('new_access_token');

      const result = await authService.refreshToken({ refreshToken: 'valid_refresh_token' });
      expect(result).toEqual({
        accessToken: 'new_access_token',
        accessTokenExpiresIn: expect.any(String),
      });
    });

    it('should throw an error if the refresh token is invalid', async () => {
      mockJwtService.verifyAsync.mockRejectedValue(new Error("Invalid refresh token"));
      await expect(authService.refreshToken({ refreshToken: 'invalid_refresh_token' })).rejects.toThrow(
        new AppError('Invalid refresh token', HttpStatus.UNAUTHORIZED),
      );
    });

    it('should throw an error if user does not exist', async () => {
      mockJwtService.verifyAsync.mockResolvedValue({ sub: 'invalid_user_id', email: 'test@example.com' });
      mockUserService.findById.mockResolvedValue(null);

      await expect(authService.refreshToken({ refreshToken: 'valid_refresh_token' })).rejects.toThrow(
        new AppError('Invalid refresh token', HttpStatus.UNAUTHORIZED),
      );
    });
  });

  describe('login', () => {
    it('should log in the user with valid credentials', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const user = {
        id: 'user_id',
        email: 'test@example.com',
        verifyPassword: jest.fn().mockResolvedValue(true),
      };
      mockUserService.findByEmail.mockResolvedValue(user);
      mockJwtService.signAsync.mockResolvedValueOnce('sample_access_token');
      mockJwtService.signAsync.mockResolvedValueOnce('sample_refresh_token');
      (argon.hash as jest.Mock).mockResolvedValue('hashed_refresh_token');

      const result = await authService.login(loginDto);
      expect(result).toEqual({
        accessToken: 'sample_access_token',
        accessTokenExpiresIn: expect.any(String),
        refreshToken: 'sample_refresh_token',
        refreshTokenExpiresIn: expect.any(String),
      });
      expect(mockUserService.update).toHaveBeenCalledWith('user_id', {
        refreshToken: 'hashed_refresh_token',
      });
    });

    it('should throw an error if credentials are invalid', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };
      const user = {
        verifyPassword: jest.fn().mockResolvedValue(false),
      };
      mockUserService.findByEmail.mockResolvedValue(user);

      await expect(authService.login(loginDto)).rejects.toThrow(
        new AppError('Invalid credentials', HttpStatus.UNAUTHORIZED),
      );
    });

    it('should throw an error if user does not exist', async () => {
      mockUserService.findByEmail.mockResolvedValue(null);
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      await expect(authService.login(loginDto)).rejects.toThrow(
        new AppError('Invalid credentials', HttpStatus.UNAUTHORIZED),
      );
    });
  });
});
