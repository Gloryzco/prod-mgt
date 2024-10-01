import { HttpStatus, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { CreateUserDto } from '../dtos';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/shared';
import { Model } from 'mongoose';
import AppError from 'src/utils/app-error';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('users')
    private readonly userModel: Model<IUser>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Partial<IUser>> {
    const { email, password } = createUserDto;
    const userExists = await this.findByEmail(email);
    if (userExists) {
      throw new AppError('User with this email exists', HttpStatus.CONFLICT);
    }
    const hashPassword = await argon.hash(password);
    const user = await this.userModel.create({ email, password: hashPassword });
    return user.toPayload();
  }

  async findByEmail(email: string): Promise<IUser> {
    return this.userModel.findOne({ email });
  }

  async findById(id: string): Promise<IUser> {
    return this.userModel.findById(id);
  }

  async update(userId: string, updateData: Partial<IUser>): Promise<any> {
    return this.userModel.findByIdAndUpdate(userId, updateData, { new: true });
  }
}
