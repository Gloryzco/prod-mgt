import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICategory, IProduct } from 'src/shared';
import AppError from 'src/utils/app-error';
import { CreateProductDto, UpdateProductDto } from '../dtos';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('products') private readonly productModel: Model<IProduct>,
    @InjectModel('categories') private readonly categoryModel: Model<ICategory>,
  ) {}

  async getAllProducts(): Promise<IProduct[]> {
    return this.productModel.find().exec();
  }

  async getProductById(id: string): Promise<IProduct> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new AppError('Product not found', HttpStatus.NOT_FOUND);
    }
    return product;
  }

  async createProduct(createProductDto: CreateProductDto): Promise<IProduct> {
    const categoryExists = await this.categoryModel.exists({
      _id: createProductDto.categoryId,
    });
    if (!categoryExists) {
      throw new AppError('Category not found', HttpStatus.NOT_FOUND);
    }
    const product = new this.productModel(createProductDto);
    return product.save();
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<IProduct> {
    if (updateProductDto.categoryId) {
      const categoryExists = await this.categoryModel.exists({
        _id: updateProductDto.categoryId,
      });
      if (!categoryExists) {
        throw new AppError('Category not found', HttpStatus.NOT_FOUND);
      }
    }

    const product = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();
    if (!product) {
      throw new AppError('Product not found', HttpStatus.NOT_FOUND);
    }
    return product;
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await this.productModel.findByIdAndDelete(id).exec();
    if (!product) {
      throw new AppError('Product not found', HttpStatus.NOT_FOUND);
    }
  }
}
