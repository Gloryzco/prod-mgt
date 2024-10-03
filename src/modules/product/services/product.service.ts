import { HttpStatus, Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { ICategory, IProduct, IProductService } from 'src/shared';
import AppError from 'src/utils/app-error.utils';
import { CreateProductDto, UpdateProductDto } from '../dtos';
import { InjectModel } from '@nestjs/mongoose';
import { sanitizeInput } from 'src/utils/sanitize.utils';

@Injectable()
export class ProductService implements IProductService {
  @InjectModel('products')
  private readonly productModel: Model<IProduct>;
  @InjectModel('categories')
  private readonly categoryModel: Model<ICategory>;

  async getAllProducts(): Promise<IProduct[]> {
    return this.productModel.find().exec();
  }

  async getProductById(id: string): Promise<IProduct | null> {
    const sanitizedId = sanitizeInput(id);
    if (!Types.ObjectId.isValid(sanitizedId)) {
      throw new AppError('Invalid product ID', HttpStatus.BAD_REQUEST);
    }

    const product = await this.productModel.findById(sanitizedId).exec();
    if (!product) {
      throw new AppError('Product not found', HttpStatus.NOT_FOUND);
    }
    return product;
  }

  async createProduct(createProductDto: CreateProductDto): Promise<IProduct> {
    const sanitizedProductDto = sanitizeInput(createProductDto);

    if (!Types.ObjectId.isValid(sanitizedProductDto.categoryId)) {
      throw new AppError('Invalid category ID', HttpStatus.BAD_REQUEST);
    }

    const categoryExists = await this.categoryModel.exists({
      _id: sanitizedProductDto.categoryId,
    });
    if (!categoryExists) {
      throw new AppError('Category not found', HttpStatus.NOT_FOUND);
    }

    const product = new this.productModel(sanitizedProductDto);
    return product.save();
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<IProduct | null> {
    const sanitizedId = sanitizeInput(id);
    const sanitizedProductDto = sanitizeInput(updateProductDto);

    if (!Types.ObjectId.isValid(sanitizedId)) {
      throw new AppError('Invalid product ID', HttpStatus.BAD_REQUEST);
    }

    if (
      sanitizedProductDto.categoryId &&
      !Types.ObjectId.isValid(sanitizedProductDto.categoryId)
    ) {
      throw new AppError('Invalid category ID', HttpStatus.BAD_REQUEST);
    }

    if (sanitizedProductDto.categoryId) {
      const categoryExists = await this.categoryModel.exists({
        _id: sanitizedProductDto.categoryId,
      });
      if (!categoryExists) {
        throw new AppError('Category not found', HttpStatus.NOT_FOUND);
      }
    }

    const product = await this.productModel.findByIdAndUpdate(
      sanitizedId,
      sanitizedProductDto,
      { new: true },
    );
    if (!product) {
      throw new AppError('Product not found', HttpStatus.NOT_FOUND);
    }
    return product;
  }

  async deleteProduct(id: string): Promise<void> {
    const sanitizedId = sanitizeInput(id);

    if (!Types.ObjectId.isValid(sanitizedId)) {
      throw new AppError('Invalid product ID', HttpStatus.BAD_REQUEST);
    }

    await this.productModel.findByIdAndDelete(sanitizedId).exec();
  }
}
