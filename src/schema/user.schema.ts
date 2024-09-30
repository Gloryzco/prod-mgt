import { Document, Schema, model } from 'mongoose';
import { IUSer } from 'src/shared';

const userSchema: Schema<IUSer> = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, index: true, unique: true },
    password: { type: String, required: true },
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

const User = model('User', userSchema);

export { User, userSchema };
