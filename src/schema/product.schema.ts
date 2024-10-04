import { HttpStatus } from '@nestjs/common';
import { model, Schema } from 'mongoose';
import { IProduct } from 'src/shared';
import AppError from 'src/shared/utils/app-error.utils';
import { Category } from './category.schema';

const productSchema: Schema<IProduct> = new Schema(
  {
    name: { type: String, index: true, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stockQuantity: { type: Number, default: 0 },
    categoryId: { type: Schema.Types.ObjectId, index: true, ref: 'Category' },
    available: { type: Boolean, default: true },
    sku: { type: String, unique: true, required: true },
  },
  {
    collection: 'products',
    timestamps: true,
  },
);
productSchema.index({ name: 1 });
productSchema.index({ category: 1 });
productSchema.index({ createdAt: -1 });

productSchema.methods.toPayload = function (): Partial<IProduct> {
  return {
    id: this._id,
    name: this.name,
    sku: this.sku,
    price: this.price,
    stockQuantity: this.stockQuantity,
    categoryId: this.categoryId,
    available: this.available,
    description: this.description,
    createdAt: this.createdAt,
  };
};

const Product = model('Product', productSchema);
export { Product, productSchema };
