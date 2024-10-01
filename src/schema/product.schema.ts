import { HttpStatus } from '@nestjs/common';
import { model, Schema } from 'mongoose';
import { IProduct } from 'src/shared';
import AppError from 'src/utils/app-error.utils';
import { Category } from './category.schema';

const productSchema: Schema<IProduct> = new Schema(
  {
    name: { type: String, index: true, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stockQuantity: { type: Number, default: 0 },
    categoryId: { type: Schema.Types.ObjectId, index: true, ref: 'Category' },
  },
  {
    collection: 'products',
    timestamp: true,
  },
);
productSchema.index({ name: 1 });
productSchema.index({ category: 1 });
productSchema.index({ createdAt: -1 });

// productSchema.pre('save', async function(next) {
//   if (this.categoryId) {
//     const categoryExists = await Category.exists(this.categoryId);
//     if (!categoryExists) {
//       throw new AppError('Category not found', HttpStatus.NOT_FOUND);
//     }
//   }
//   next();
// });

const Product = model('Product', productSchema);
export { Product, productSchema };
