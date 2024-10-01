import { Document } from 'mongoose';

export interface IUser extends Document {
  readonly email: string;
  readonly password: string;
  readonly role: string;
  readonly refreshToken: string;
  readonly createdAt: Date;
  toPayload(): Partial<IUser>;
  verifyPassword(password: string): Promise<boolean>;
}
