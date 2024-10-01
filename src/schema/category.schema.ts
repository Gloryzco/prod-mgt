import { Document, Schema, model } from 'mongoose';
import { ICategory, IUser } from 'src/shared';

const categorySchema: Schema<ICategory> = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
  },
  {
    collection: 'categories',
    timestamps: true,
  },
);
categorySchema.index({ name: 1 });

categorySchema.methods.toPayload = function (): Partial<ICategory> {
  return {
    id: this._id,
    name: this.name,
    description: this.description,
    createdAt: this.createdAt,
  };
};

const Category = model('Category', categorySchema);

export { Category, categorySchema };
