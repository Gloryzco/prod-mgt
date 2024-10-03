import {
  Controller,
  Body,
  Response,
  Post,
  Get,
  Param,
  Patch,
  HttpStatus,
  Delete,
  Query,
} from '@nestjs/common';
import { ResponseFormat } from 'src/utils';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos';
import { CategoryService } from '../services';
import { PaginationDto } from 'src/shared';

@Controller('product-categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async createCategory(
    @Response() res,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    const new_category =
      await this.categoryService.createCategory(createCategoryDto);
    ResponseFormat.successResponse(
      res,
      new_category,
      'Category created successfully',
      HttpStatus.CREATED,
    );
  }

  @Get()
  async getAllCategories(
    @Query() paginationDto: PaginationDto,
    @Response() res,
  ) {
    const categories =
      await this.categoryService.getAllCategories(paginationDto);
    ResponseFormat.successResponse(
      res,
      categories,
      'Categories fetched successfully',
      HttpStatus.OK,
    );
  }

  @Get(':id')
  async getCategoryById(@Param('id') id: string, @Response() res) {
    const category = await this.categoryService.getCategoriesById(id);
    ResponseFormat.successResponse(
      res,
      category,
      'Category fetched successfully',
      HttpStatus.OK,
    );
  }

  @Patch(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Response() res,
  ) {
    const updatedCategory = await this.categoryService.updateCategory(
      id,
      updateCategoryDto,
    );
    ResponseFormat.successResponse(
      res,
      updatedCategory,
      'Category updated successfully',
      HttpStatus.OK,
    );
  }

  @Delete(':id')
  async deleteCategory(
    @Param('id') id: string,
    @Response() res,
  ): Promise<void> {
    await this.categoryService.deleteCategory(id);
    ResponseFormat.successResponse(
      res,
      null,
      'Category deleted successfully',
      HttpStatus.OK,
    );
  }
}
