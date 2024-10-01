import { Document, Schema, model } from 'mongoose';
import * as argon from 'argon2';
import { IUser } from 'src/shared';

const userSchema: Schema<IUser> = new Schema(
  {
    email: { type: String, required: true, index: true, unique: true },
    password: { type: String, required: true },
    refreshToken: { type: String },
    role: { type: String, enum: ['admin', 'customer', 'vendor'], default: 'customer' },
  },
  {
    collection: 'users',
    timestamps: true
  },
);

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ createdAt: -1 });
userSchema.index({ role: 1 });

userSchema.methods.toPayload = function (): Partial<IUser> {
  return {
    id: this._id,
    email: this.email,
    role: this.role,
    createdAt: this.createdAt,
  };
};

userSchema.methods.verifyPassword = async function (
  password: string,
): Promise<boolean> {
  return await argon.verify(this.password, password);
};

const User = model('User', userSchema);

export { User, userSchema };
