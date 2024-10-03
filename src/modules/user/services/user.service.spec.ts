import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getModelToken } from '@nestjs/mongoose';
import { CreateUserDto } from '../dtos';
import { Model } from 'mongoose';
import { IUser } from 'src/shared';
import * as argon from 'argon2';
import AppError from 'src/utils/app-error.utils';
import { HttpStatus } from '@nestjs/common';

describe('UserService', () => {
  let userService: UserService;
  let userModel: Model<IUser>;

  const mockUserModel = {
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('users'),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userModel = module.get<Model<IUser>>(getModelToken('users'));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    it('should throw an error if user with email already exists', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@test.com',
        password: '12345',
      };

      mockUserModel.findOne.mockResolvedValue(true); // Mocking user exists scenario

      await expect(userService.create(createUserDto)).rejects.toThrow(
        new AppError('User with this email exists', HttpStatus.CONFLICT),
      );

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: createUserDto.email });
    });

    it('should hash the password and create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@test.com',
        password: '12345',
      };

      const hashedPassword = 'hashed_password';
      jest.spyOn(argon, 'hash').mockResolvedValue(hashedPassword);

      const createdUser = { email: createUserDto.email, password: hashedPassword, toPayload: jest.fn() };
      createdUser.toPayload.mockReturnValue({ email: createdUser.email });

      mockUserModel.findOne.mockResolvedValue(null);
      mockUserModel.create.mockResolvedValue(createdUser);

      const result = await userService.create(createUserDto);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: createUserDto.email });
      expect(argon.hash).toHaveBeenCalledWith(createUserDto.password);
      expect(mockUserModel.create).toHaveBeenCalledWith({
        email: createUserDto.email,
        password: hashedPassword,
      });
      expect(result).toEqual({ email: createUserDto.email });
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const email = 'test@test.com';
      const user = { email, password: 'hashed_password' };

      mockUserModel.findOne.mockResolvedValue(user);

      const result = await userService.findByEmail(email);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email });
      expect(result).toEqual(user);
    });

    it('should return null if user does not exist', async () => {
      const email = 'nonexistent@test.com';

      mockUserModel.findOne.mockResolvedValue(null);

      const result = await userService.findByEmail(email);

      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email });
      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return a user by ID', async () => {
      const userId = '12345';
      const user = { id: userId, email: 'test@test.com', password: 'hashed_password' };

      mockUserModel.findById.mockResolvedValue(user);

      const result = await userService.findById(userId);

      expect(mockUserModel.findById).toHaveBeenCalledWith(userId);
      expect(result).toEqual(user);
    });

    it('should return null if user does not exist', async () => {
      const userId = 'nonexistent_id';

      mockUserModel.findById.mockResolvedValue(null);

      const result = await userService.findById(userId);

      expect(mockUserModel.findById).toHaveBeenCalledWith(userId);
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a user by ID and return the updated user', async () => {
      const userId = '12345';
      const updateData = { email: 'updated@test.com' };
      const updatedUser = { id: userId, email: updateData.email, password: 'hashed_password' };

      mockUserModel.findByIdAndUpdate.mockResolvedValue(updatedUser);

      const result = await userService.update(userId, updateData);

      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(userId, updateData, { new: true });
      expect(result).toEqual(updatedUser);
    });

    it('should return null if user does not exist', async () => {
      const userId = 'nonexistent_id';
      const updateData = { email: 'updated@test.com' };

      mockUserModel.findByIdAndUpdate.mockResolvedValue(null);

      const result = await userService.update(userId, updateData);

      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(userId, updateData, { new: true });
      expect(result).toBeNull();
    });
  });
});
