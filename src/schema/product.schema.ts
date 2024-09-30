import { model, Schema } from 'mongoose';
import { IProduct } from 'src/shared';

const productSchema: Schema<IProduct> = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock_quantity: { type: Number, default: 0 },
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
  },
  {
    collection: 'products',
    timestamp: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

const Product = model('Product', productSchema);
export { Product, productSchema };
