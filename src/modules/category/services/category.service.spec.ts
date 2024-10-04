import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RedisService } from 'src/modules/redis';
import { LoggerService } from 'src/logger/logger.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos';
import { HttpStatus } from '@nestjs/common';
import AppError from 'src/shared/utils/app-error.utils';
import { ICategory, PaginateAndFilter } from 'src/shared';
import { Types } from 'mongoose';

const mockCategoryModel = () => ({
  create: jest.fn(),
  findOne: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  exec: jest.fn(),
});

const mockRedisService = () => ({
  get: jest.fn(),
  set: jest.fn(),
});

const mockLoggerService = () => ({
  log: jest.fn(),
  error: jest.fn(),
});

describe('CategoryService', () => {
  let service: CategoryService;
  let categoryModel: Model<ICategory>;
  let redisService;
  let loggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: getModelToken('categories'),
          useFactory: mockCategoryModel,
        },
        {
          provide: RedisService,
          useFactory: mockRedisService,
        },
        {
          provide: LoggerService,
          useFactory: mockLoggerService,
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    categoryModel = module.get<Model<ICategory>>(getModelToken('categories'));
    redisService = module.get<RedisService>(RedisService);
    loggerService = module.get<LoggerService>(LoggerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCategory', () => {
    it('should create a category successfully', async () => {
      const createCategoryDto: CreateCategoryDto = {
        name: 'A category',
        description: 'Test Description',
      };
  
      const createdCategory: any = {
        id: '66feb59dfc313b7fe18ed0a5',
        name: createCategoryDto.name,
        description: createCategoryDto.description,
        toPayload: () => ({
          id: '66feb59dfc313b7fe18ed0a5',
          name: createCategoryDto.name,
        }),
      };
  
      jest.spyOn(categoryModel, 'create').mockResolvedValue(createdCategory);
      jest.spyOn(service, 'getCategoriesByName').mockResolvedValue(null);
  
      const result = await service.createCategory(createCategoryDto);
      expect(categoryModel.create).toHaveBeenCalledWith(createCategoryDto);
      expect(result).toEqual({
        id: '66feb59dfc313b7fe18ed0a5',
        name: createCategoryDto.name,
      });
    });
  });
  

  describe('getAllCategories', () => {
    it('should return all categories from cache', async () => {
      const paginationDto = { limit: 10, page: 1 };
      const categories = { data: [{ name: 'Category 1' }] };

      redisService.get.mockResolvedValue(JSON.stringify(categories));

      const result = await service.getAllCategories(paginationDto);
      expect(redisService.get).toHaveBeenCalledWith(
        `categories:${JSON.stringify(paginationDto)}`,
      );
      expect(result).toEqual(categories);
    });

    it('should return all categories from the database if not found in cache', async () => {
      const paginationDto = { limit: 10, page: 1 };
      const paginatedResult: any = {
        data: [
          {
            name: 'Category 1',
            description: 'Category 1',
            totalRecords: 1,
            currentPage: 1,
            totalPages: 1,
          },
        ],
      };

      redisService.get.mockResolvedValue(null);
      jest
        .spyOn(PaginateAndFilter.prototype, 'paginateAndFilter')
        .mockResolvedValue(paginatedResult);

      const result = await service.getAllCategories(paginationDto);
      expect(result).toEqual(paginatedResult);
      expect(redisService.set).toHaveBeenCalledWith(
        `categories:${JSON.stringify(paginationDto)}`,
        JSON.stringify(paginatedResult),
      );
    });
  });

  describe('getCategoriesById', () => {
    it('should return category by ID from cache', async () => {
      const id = '66feb59dfc313b7fe18ed0a5';
      const category = { id, name: 'Category 1' };

      redisService.get.mockResolvedValue(JSON.stringify(category));

      const result = await service.getCategoriesById(id);
      expect(redisService.get).toHaveBeenCalledWith(`categories:${id}`);
      expect(result).toEqual(category);
    });

    it('should return category by ID from the database if not found in cache', async () => {
      const id = '66feb59dfc313b7fe18ed0a5';
      const category = { toPayload: () => ({ id, name: 'Category 1' }) };

      redisService.get.mockResolvedValue(null);
      jest.spyOn(categoryModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(category),
      } as any);

      const result = await service.getCategoriesById(id);
      expect(categoryModel.findById).toHaveBeenCalledWith(id);
      expect(redisService.set).toHaveBeenCalledWith(
        `categories:${id}`,
        JSON.stringify(category.toPayload()),
      );
      expect(result).toEqual(category.toPayload());
    });

    it('should throw an error if category ID is invalid', async () => {
      await expect(service.getCategoriesById('invalid-id')).rejects.toThrow(
        new AppError('Invalid category ID', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('updateCategory', () => {
    it('should update a category successfully', async () => {
      const id = '66feb59dfc313b7fe18ed0a5';
      const updateCategoryDto: UpdateCategoryDto = { name: 'Updated Category' };
      const updatedCategory = {
        toPayload: () => ({ id, name: 'Updated Category' }),
      };

      jest.spyOn(categoryModel, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedCategory),
      } as any);

      const result = await service.updateCategory(id, updateCategoryDto);
      expect(categoryModel.findByIdAndUpdate).toHaveBeenCalledWith(
        id,
        updateCategoryDto,
        { new: true },
      );
      expect(result).toEqual(updatedCategory.toPayload());
    });

    it('should throw an error if category ID is invalid', async () => {
      await expect(service.updateCategory('invalid-id', {})).rejects.toThrow(
        new AppError('Invalid category ID', HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw an error if category is not found', async () => {
      const id = '66feb59dfc313b7fe18ed0a5';

      jest.spyOn(categoryModel, 'findByIdAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.updateCategory(id, {})).rejects.toThrow(
        new AppError('Category not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category successfully', async () => {
      const id = '66feb59dfc313b7fe18ed0a5';

      jest.spyOn(categoryModel, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue({}),
      } as any);

      await service.deleteCategory(id);
      expect(categoryModel.findByIdAndDelete).toHaveBeenCalledWith(id);
    });

    it('should throw an error if category ID is invalid', async () => {
      await expect(service.deleteCategory('invalid-id')).rejects.toThrow(
        new AppError('Invalid category ID', HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw an error if category is not found', async () => {
      const id = '66feb59dfc313b7fe18ed0a5';

      jest.spyOn(categoryModel, 'findByIdAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      await expect(service.deleteCategory(id)).rejects.toThrow(
        new AppError('Category not found', HttpStatus.NOT_FOUND),
      );
    });
  });
});
