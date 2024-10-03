import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ICategory,
  ICategoryService,
  IPaginatedResponse,
  PaginationDto,
} from 'src/shared';
import { Model, Types } from 'mongoose';
import AppError from 'src/utils/app-error.utils';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos';
import { sanitizeInput } from 'src/utils/sanitize.utils';
import { PaginateAndFilter } from 'src/utils';
import { RedisService } from 'src/modules/redis';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class CategoryService implements ICategoryService {
  constructor(
    @InjectModel('categories')
    private readonly categoryModel: Model<ICategory>,
    private readonly loggerService: LoggerService,
    private readonly redisService: RedisService,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Partial<ICategory>> {
    const sanitizedData = sanitizeInput(createCategoryDto);
    const { name, description } = sanitizedData;

    const nameExists = await this.getCategoriesByName(name);
    if (nameExists) {
      throw new AppError('Category already exists', HttpStatus.CONFLICT);
    }

    const category = await this.categoryModel.create({ name, description });
    return category.toPayload();
  }

  async getAllCategories(
    paginationDto: PaginationDto,
  ): Promise<IPaginatedResponse<ICategory>> {
    const paginateAndFilter = new PaginateAndFilter<ICategory>(
      paginationDto,
      this.categoryModel,
      ['name', 'description', 'createdAt'],
    );
    const cacheKey: string = `categories:${paginationDto}`;

    const resultFromCache: string = await this.redisService.get(cacheKey);
    if (resultFromCache) {
      return JSON.parse(resultFromCache);
    }

    const paginatedResult = paginateAndFilter.paginateAndFilter();

    await this.redisService.set(cacheKey, JSON.stringify(paginatedResult));

    return paginatedResult;
  }

  async getCategoriesByName(name: string): Promise<ICategory | null> {
    const sanitizedName = sanitizeInput(name);
    return this.categoryModel.findOne({ name: sanitizedName }).exec();
  }

  async getCategoriesById(id: string): Promise<Partial<ICategory>> {
    const sanitizedId = sanitizeInput(id);
    if (!Types.ObjectId.isValid(sanitizedId)) {
      throw new AppError('Invalid category ID', HttpStatus.BAD_REQUEST);
    }
    const cacheKey: string = `categories:${id}`;
    const resultFromCache: string = await this.redisService.get(cacheKey);

    if (resultFromCache) {
      return JSON.parse(resultFromCache);
    }
    const category = (
      await this.categoryModel.findById(sanitizedId).exec()
    ).toPayload();

    if (!category) {
      throw new AppError('Category not found', HttpStatus.NOT_FOUND);
    }
    await this.redisService.set(cacheKey, JSON.stringify(category));

    return category;
  }

  async updateCategory(
    categoryId: string,
    updateData: UpdateCategoryDto,
  ): Promise<Partial<ICategory> | null> {
    const sanitizedId = sanitizeInput(categoryId);
    if (!Types.ObjectId.isValid(sanitizedId)) {
      throw new AppError('Invalid category ID', HttpStatus.BAD_REQUEST);
    }

    const sanitizedUpdateData = sanitizeInput(updateData);
    const category = await this.categoryModel
      .findByIdAndUpdate(sanitizedId, sanitizedUpdateData, { new: true })
      .exec();

    if (!category) {
      throw new AppError('Category not found', HttpStatus.NOT_FOUND);
    }

    return category.toPayload();
  }

  async deleteCategory(id: string): Promise<void> {
    const sanitizedId = sanitizeInput(id);
    if (!Types.ObjectId.isValid(sanitizedId)) {
      throw new AppError('Invalid category ID', HttpStatus.BAD_REQUEST);
    }

    const category = await this.categoryModel
      .findByIdAndDelete(sanitizedId)
      .exec();
    if (!category) {
      throw new AppError('Category not found', HttpStatus.NOT_FOUND);
    }
  }
}
