import { Document } from 'mongoose';

export interface IUser extends Document {
  readonly username: string;
  readonly email: string;
  readonly password: string;
  readonly role: string;
  readonly refresh_token: string;
  readonly created_at: Date;
  toPayload(): Partial<IUser>;
  verifyPassword(password: string): Promise<boolean>;
}
