import { CreateCategoryDto, UpdateCategoryDto } from 'src/modules/category';
import { ICategory } from '../schema';
import { PaginationDto } from 'src/shared/dtos';

export interface ICategoryService {
  createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Partial<ICategory>>;

  getAllCategories(paginationDto: PaginationDto): Promise<Partial<ICategory>[]>;

  getCategoriesByName(name: string): Promise<ICategory | null>;

  getCategoriesById(id: string): Promise<Partial<ICategory>>;

  updateCategory(
    categoryId: string,
    updateData: UpdateCategoryDto,
  ): Promise<Partial<ICategory> | null>;

  deleteCategory(id: string): Promise<void>;
}
