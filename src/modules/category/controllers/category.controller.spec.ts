import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryService } from '../services/category.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos';
import { PaginationDto } from 'src/shared';
import { HttpStatus } from '@nestjs/common';
import { ResponseFormat } from 'src/utils';

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
    }).compile();

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

      expect(service.createCategory).toHaveBeenCalledWith(createCategoryDto);
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

      expect(service.getAllCategories).toHaveBeenCalledWith(paginationDto);
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
      const category = {
        id: '66feb59dfc313b7fe18ed0a5',
        name: 'Test Category',
      };
      mockCategoryService.getCategoriesById.mockResolvedValue(category);

      await controller.getCategoryById(
        '66feb59dfc313b7fe18ed0a5',
        mockResponse,
      );

      expect(service.getCategoriesById).toHaveBeenCalledWith('66feb59dfc313b7fe18ed0a5');
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Category fetched successfully',
        data: category,
      });
    });
  });

  describe('updateCategory', () => {
    it('should update a category', async () => {
      const updateCategoryDto: UpdateCategoryDto = { name: 'Updated Category' };
      const updatedCategory = {
        id: '66feb59dfc313b7fe18ed0a5',
        ...updateCategoryDto,
      };
      mockCategoryService.updateCategory.mockResolvedValue(updatedCategory);

      await controller.updateCategory(
        '66feb59dfc313b7fe18ed0a5',
        updateCategoryDto,
        mockResponse,
      );

      expect(service.updateCategory).toHaveBeenCalledWith(
        '66feb59dfc313b7fe18ed0a5',
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
      mockCategoryService.deleteCategory.mockResolvedValue(undefined);

      await controller.deleteCategory('66feb59dfc313b7fe18ed0a5', mockResponse);

      expect(service.deleteCategory).toHaveBeenCalledWith('66feb59dfc313b7fe18ed0a5');
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Category deleted successfully',
      });
    });
  });
});
