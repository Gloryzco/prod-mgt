import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ICategory, ICategoryService, PaginationDto } from 'src/shared';
import { Model, Types } from 'mongoose';
import AppError from 'src/utils/app-error.utils';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos';
import { sanitizeInput } from 'src/utils/sanitize.utils';
import { BaseRepository } from 'src/database';

@Injectable()
export class CategoryService extends BaseRepository<ICategory> implements ICategoryService{
  constructor(
    @InjectModel('categories')
    private readonly categoryModel: Model<ICategory>,
  ) {
    super(categoryModel);
  }

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

  async getAllCategories(paginationDto: PaginationDto): Promise<Partial<ICategory>[]> {
    const page = paginationDto?.page ?? 1;
    const limit = paginationDto?.limit ?? 10;
  
    const categories = await this.categoryModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  
    return categories.map((category) => category.toPayload());
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

    const category = await this.categoryModel.findById(sanitizedId).exec();
    if (!category) {
      throw new AppError('Category not found', HttpStatus.NOT_FOUND);
    }

    return category.toPayload();
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
