import { Document, Schema, model } from 'mongoose';
import * as argon from 'argon2';
import { IUser } from 'src/shared';

const userSchema: Schema<IUser> = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, index: true, unique: true },
    password: { type: String, required: true },
    refresh_token: { type: String },
    role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
  },
  {
    collection: 'users',
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

userSchema.methods.toPayload = function(): Partial<IUser> {
  return {
    id: this._id,
    email: this.email,
    created_at: this.created_at,
  };
};

userSchema.methods.verifyPassword = async function(password: string): Promise<boolean> {
  return await argon.verify(this.password, password);
};

const User = model('User', userSchema);

export { User, userSchema };
