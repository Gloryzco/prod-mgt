import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ICategory } from 'src/shared';
import { Model } from 'mongoose';
import AppError from 'src/utils/app-error';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel('categories') 
    private readonly categoryModel: Model<ICategory>,
  ) {}

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Partial<ICategory>> {
    const { name, description } = createCategoryDto;
    const nameExists = await this.getCategoriesByName(name);
    if (nameExists) {
      throw new AppError('Category already exists', HttpStatus.CONFLICT);
    }
    const category = await this.categoryModel.create({ name, description });
    return category.toPayload();
  }

  async getAllCategories(): Promise<Partial<ICategory>[]> {
    const categories = await this.categoryModel.find().exec();
    return categories.map(category => category.toPayload());
  }

  async getCategoriesByName(name: string): Promise<ICategory> {
    return this.categoryModel.findOne({ name });
  }

  async getCategoriesById(id: string): Promise<Partial<ICategory>> {
    const category = await this.categoryModel.findById(id);
    
    if (!category) {
      throw new AppError('Category not found', HttpStatus.NOT_FOUND);
    }
    
    return category.toPayload();
  }

  async updateCategory(
    categoryId: string, 
    updateData: UpdateCategoryDto,
  ): Promise<Partial<ICategory>> {
    const category = await this.categoryModel.findByIdAndUpdate(
      categoryId, 
      updateData, 
      { new: true },
    );
    return category ? category.toPayload() : null;
  }

  async deleteCategory(id: string): Promise<void> {
    const category = await this.categoryModel.findByIdAndDelete(id);
    
    if (!category) {
      throw new AppError('Category not found', HttpStatus.NOT_FOUND);
    }
  }
}