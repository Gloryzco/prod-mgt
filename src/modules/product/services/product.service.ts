import { HttpStatus, Injectable, LoggerService } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import {
  ICategory,
  IPaginatedResponse,
  IProduct,
  IProductService,
  PaginationDto,
} from 'src/shared';
import AppError from 'src/utils/app-error.utils';
import { CreateProductDto, UpdateProductDto } from '../dtos';
import { InjectModel } from '@nestjs/mongoose';
import { sanitizeInput } from 'src/utils/sanitize.utils';
import { PaginateAndFilter } from 'src/utils';
import { RedisService } from 'src/modules/redis';

@Injectable()
export class ProductService implements IProductService {
  constructor(
    @InjectModel('products')
    private readonly productModel: Model<IProduct>,
    @InjectModel('categories')
    private readonly categoryModel: Model<ICategory>,
    private readonly redisService: RedisService,
    private readonly loggerService: LoggerService,
  ) {}

  async getAllProducts(
    paginationDto: PaginationDto,
  ): Promise<IPaginatedResponse<IProduct>> {
    const paginateAndFilter = new PaginateAndFilter<IProduct>(
      paginationDto,
      this.productModel,
      ['name', 'price', 'categoryId', 'description', 'createdAt'],
    );
    const cacheKey: string = `products:${paginationDto}`;
    const resultFromCache: string = await this.redisService.get(cacheKey);
    if (resultFromCache) {
      return JSON.parse(resultFromCache);
    }

    const paginatedResult = paginateAndFilter.paginateAndFilter();

    await this.redisService.set(cacheKey, JSON.stringify(paginatedResult));

    return paginatedResult;
  }

  async getProductById(id: string): Promise<IProduct | null> {
    const sanitizedId = sanitizeInput(id);
    if (!Types.ObjectId.isValid(sanitizedId)) {
      throw new AppError('Invalid product ID', HttpStatus.BAD_REQUEST);
    }
    const cacheKey: string = `products:${id}`;
    const resultFromCache: string = await this.redisService.get(cacheKey);
    if (resultFromCache) {
      return JSON.parse(resultFromCache);
    }

    const product = await this.productModel.findById(sanitizedId).exec();
    if (!product) {
      throw new AppError('Product not found', HttpStatus.NOT_FOUND);
    }
    await this.redisService.set(cacheKey, JSON.stringify(product));
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
