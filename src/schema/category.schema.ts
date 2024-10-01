import { Document, Schema, model } from 'mongoose';
import { ICategory, IUser } from 'src/shared';

const categorySchema: Schema<ICategory> = new Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  {
    collection: 'categories',
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

const Category = model('Category', categorySchema);

export { Category, categorySchema };
