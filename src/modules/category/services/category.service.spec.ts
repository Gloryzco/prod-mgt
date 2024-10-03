// import { Test, TestingModule } from '@nestjs/testing';
// import { CategoryService } from './category.service';
// import { getModelToken } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { CreateCategoryDto, UpdateCategoryDto } from '../dtos';
// import AppError from 'src/utils/app-error.utils';
// import { RedisService } from 'src/modules/redis';
// import { LoggerService } from 'src/logger/logger.service';
// import { ICategory } from 'src/shared';

// const mockCategoryModel = {
//   create: jest.fn() as jest.Mock,
//   findOne: jest.fn().mockReturnValue({ exec: jest.fn() }),
//   findById: jest.fn().mockReturnValue({ exec: jest.fn() }),
//   findByIdAndUpdate: jest.fn().mockReturnValue({ exec: jest.fn() }),
//   findByIdAndDelete: jest.fn().mockReturnValue({ exec: jest.fn() }),
// };

// const mockRedisService = {
//   get: jest.fn() as jest.Mock,
//   set: jest.fn() as jest.Mock,
// };

// const mockLoggerService = {
//   log: jest.fn(),
//   error: jest.fn(),
// };

// describe('CategoryService', () => {
//   let service: CategoryService;
//   let categoryModel: Model<ICategory>;
//   let redisService: RedisService;
//   let loggerService: LoggerService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         CategoryService,
//         { provide: getModelToken('categories'), useValue: mockCategoryModel },
//         { provide: RedisService, useValue: mockRedisService },
//         { provide: LoggerService, useValue: mockLoggerService },
//       ],
//     }).compile();

//     service = module.get<CategoryService>(CategoryService);
//     categoryModel = module.get(getModelToken('categories'));
//     redisService = module.get(RedisService);
//     loggerService = module.get(LoggerService);
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   describe('createCategory', () => {
//     it('should create a category', async () => {
//       const createCategoryDto: CreateCategoryDto = {
//         name: 'New Category',
//         description: 'A description',
//       };
//       const savedCategory = {
//         ...createCategoryDto,
//         _id: '66feb59dfc313b7fe18ed0a5',
//         toPayload: jest.fn().mockReturnValue(createCategoryDto),
//       };

//       categoryModel.findOne.mockReturnValue({
//         exec: jest.fn().mockResolvedValue(null),
//       });
//       categoryModel.create.mockResolvedValue(savedCategory);

//       const result = await service.createCategory(createCategoryDto);
//       expect(result).toEqual(createCategoryDto);
//       expect(categoryModel.create).toHaveBeenCalledWith(createCategoryDto);
//     });

//     it('should throw an error if category already exists', async () => {
//       const createCategoryDto: CreateCategoryDto = {
//         name: 'Existing Category',
//         description: 'A description',
//       };
//       categoryModel.findOne.mockReturnValue({
//         exec: jest.fn().mockResolvedValue({}),
//       });

//       await expect(service.createCategory(createCategoryDto)).rejects.toThrow(
//         AppError,
//       );
//       expect(categoryModel.findOne).toHaveBeenCalledWith({
//         name: createCategoryDto.name,
//       });
//     });
//   });

//   describe('getAllCategories', () => {
//     it('should return paginated categories from cache', async () => {
//       const paginationDto = { page: 1, limit: 10 };
//       const paginatedResponse = { data: [], total: 0, page: 1, limit: 10 };

//       redisService.get.mockResolvedValue(JSON.stringify(paginatedResponse));

//       const result = await service.getAllCategories(paginationDto);
//       expect(result).toEqual(paginatedResponse);
//       expect(redisService.get).toHaveBeenCalledWith(
//         `categories:${paginationDto}`,
//       );
//     });

//     it('should return paginated categories from DB and cache it', async () => {
//       const paginationDto = { page: 1, limit: 10 };
//       const paginatedResponse = {
//         data: [{ name: 'Category' }],
//         total: 1,
//         page: 1,
//         limit: 10,
//       };

//       redisService.get.mockResolvedValue(null);
//       const paginateAndFilter = jest.fn().mockReturnValue(paginatedResponse);
//       service['paginateAndFilter'] = paginateAndFilter;

//       const result = await service.getAllCategories(paginationDto);
//       expect(result).toEqual(paginatedResponse);
//       expect(redisService.set).toHaveBeenCalledWith(
//         `categories:${paginationDto}`,
//         JSON.stringify(paginatedResponse),
//       );
//     });
//   });

//   describe('getCategoriesById', () => {
//     it('should return a category by ID from cache', async () => {
//       const categoryId = '66feb59dfc313b7fe18ed0a5';
//       const category = {
//         _id: categoryId,
//         name: 'Category',
//         toPayload: jest.fn().mockReturnValue({ name: 'Category' }),
//       };

//       redisService.get.mockResolvedValue(JSON.stringify(category));

//       const result = await service.getCategoriesById(categoryId);
//       expect(result).toEqual(category);
//       expect(redisService.get).toHaveBeenCalledWith(`categories:${categoryId}`);
//     });

//     it('should return a category by ID from DB and cache it', async () => {
//       const categoryId = '66feb59dfc313b7fe18ed0a5';
//       const category = {
//         _id: categoryId,
//         name: 'Category',
//         toPayload: jest.fn().mockReturnValue({ name: 'Category' }),
//       };

//       redisService.get.mockResolvedValue(null);
//       categoryModel.findById.mockReturnValue({
//         exec: jest.fn().mockResolvedValue(category),
//       });

//       const result = await service.getCategoriesById(categoryId);
//       expect(result).toEqual({ name: 'Category' });
//       expect(redisService.set).toHaveBeenCalledWith(
//         `categories:${categoryId}`,
//         JSON.stringify({ name: 'Category' }),
//       );
//     });

//     it('should throw an error if category not found', async () => {
//       const categoryId = '66feb59dfc313b7fe18ed0a5';
//       redisService.get.mockResolvedValue(null);
//       categoryModel.findById.mockReturnValue({
//         exec: jest.fn().mockResolvedValue(null),
//       });

//       await expect(service.getCategoriesById(categoryId)).rejects.toThrow(
//         AppError,
//       );
//     });
//   });

//   describe('updateCategory', () => {
//     it('should update a category', async () => {
//       const categoryId = '66feb59dfc313b7fe18ed0a5';
//       const updateData: UpdateCategoryDto = { name: 'Updated Category' };

//       const expectedUpdatedCategory = {
//         _id: categoryId,
//         ...updateData,
//         toPayload: jest.fn().mockReturnValue({ ...updateData }),
//       };

//       categoryModel.findByIdAndUpdate.mockReturnValue({
//         exec: jest.fn().mockResolvedValue(expectedUpdatedCategory),
//       });

//       const result = await service.updateCategory(categoryId, updateData);
//       expect(result).toEqual({ name: 'Updated Category' });
//       expect(categoryModel.findByIdAndUpdate).toHaveBeenCalledWith(
//         categoryId,
//         updateData,
//         { new: true },
//       );
//     });

//     it('should throw an error if category not found for update', async () => {
//       const categoryId = '66feb59dfc313b7fe18ed0a5';
//       const updateData: UpdateCategoryDto = { name: 'Updated Category' };

//       categoryModel.findByIdAndUpdate.mockReturnValue({
//         exec: jest.fn().mockResolvedValue(null),
//       });

//       await expect(
//         service.updateCategory(categoryId, updateData),
//       ).rejects.toThrow(AppError);
//     });
//   });

//   describe('deleteCategory', () => {
//     it('should delete a category', async () => {
//       const categoryId = '66feb59dfc313b7fe18ed0a5';
//       categoryModel.findByIdAndDelete.mockReturnValue({
//         exec: jest.fn().mockResolvedValue({}),
//       });

//       await service.deleteCategory(categoryId);
//       expect(categoryModel.findByIdAndDelete).toHaveBeenCalledWith(categoryId);
//     });

//     it('should throw an error if category not found for delete', async () => {
//       const categoryId = '66feb59dfc313b7fe18ed0a5';
//       categoryModel.findByIdAndDelete.mockReturnValue({
//         exec: jest.fn().mockResolvedValue(null),
//       });

//       await expect(service.deleteCategory(categoryId)).rejects.toThrow(
//         AppError,
//       );
//     });
//   });
// });
