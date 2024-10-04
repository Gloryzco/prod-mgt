import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from '../services/category.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos';
import { PaginationDto } from 'src/shared';
import { CanActivate, ExecutionContext, HttpStatus } from '@nestjs/common';
import { ResponseFormat } from 'src/shared/utils';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from 'src/shared//guards';

class MockAccessTokenGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    return true; // Always allow access for unit tests
  }
}

describe('CategoryController', () => {
  let controller: CategoryController;
  let service: CategoryService;

  const mockCategoryService = {
    createCategory: jest.fn(),
    getAllCategories: jest.fn(),
    getCategoriesById: jest.fn(),
    updateCategory: jest.fn(),
    deleteCategory: jest.fn(),
  };

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: mockCategoryService,
        },
      ],
    })
      .overrideGuard(AccessTokenGuard)
      .useClass(MockAccessTokenGuard)
      .compile();

    controller = module.get<CategoryController>(CategoryController);
    service = module.get<CategoryService>(CategoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCategory', () => {
    it('should create a category', async () => {
      const createCategoryDto: CreateCategoryDto = { name: 'Test Category' };
      const createdCategory = {
        id: '66feb59dfc313b7fe18ed0a5',
        ...createCategoryDto,
      };
      mockCategoryService.createCategory.mockResolvedValue(createdCategory);

      await controller.createCategory(mockResponse, createCategoryDto);

      expect(mockCategoryService.createCategory).toHaveBeenCalledWith(
        createCategoryDto,
      );
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Category created successfully',
        data: createdCategory,
      });
    });
  });

  describe('getAllCategories', () => {
    it('should return all categories', async () => {
      const paginationDto: PaginationDto = { limit: 10 };
      const categories = [
        { id: '66feb59dfc313b7fe18ed0a5', name: 'Category 1' },
      ];
      mockCategoryService.getAllCategories.mockResolvedValue(categories);

      await controller.getAllCategories(mockResponse, paginationDto);

      expect(mockCategoryService.getAllCategories).toHaveBeenCalledWith(
        paginationDto,
      );
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Categories fetched successfully',
        data: categories,
      });
    });
  });

  describe('getCategoryById', () => {
    it('should return a category by id', async () => {
      const categoryId = '66feb59dfc313b7fe18ed0a5';
      const category = {
        id: categoryId,
        name: 'Test Category',
      };
      mockCategoryService.getCategoriesById.mockResolvedValue(category);

      await controller.getCategoryById(categoryId, mockResponse);

      expect(mockCategoryService.getCategoriesById).toHaveBeenCalledWith(
        categoryId,
      );
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Category fetched successfully',
        data: category,
      });
    });
  });

  describe('updateCategory', () => {
    it('should update a category', async () => {
      const categoryId = '66feb59dfc313b7fe18ed0a5';
      const updateCategoryDto: UpdateCategoryDto = { name: 'Updated Category' };
      const updatedCategory = {
        id: categoryId,
        ...updateCategoryDto,
      };
      mockCategoryService.updateCategory.mockResolvedValue(updatedCategory);

      await controller.updateCategory(
        categoryId,
        updateCategoryDto,
        mockResponse,
      );

      expect(mockCategoryService.updateCategory).toHaveBeenCalledWith(
        categoryId,
        updateCategoryDto,
      );
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Category updated successfully',
        data: updatedCategory,
      });
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category', async () => {
      const categoryId = '66feb59dfc313b7fe18ed0a5';
      mockCategoryService.deleteCategory.mockResolvedValue(undefined);

      await controller.deleteCategory(categoryId, mockResponse);

      expect(mockCategoryService.deleteCategory).toHaveBeenCalledWith(
        categoryId,
      );
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Category deleted successfully',
      });
    });
  });
});
