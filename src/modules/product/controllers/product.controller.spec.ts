import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '../controllers';
import { ProductService } from '../services';
import { ResponseFormat } from 'src/shared/utils';
import { CreateProductDto, UpdateProductDto } from '../dtos';
import { PaginationDto } from 'src/shared';
import { HttpStatus } from '@nestjs/common';

describe('ProductController', () => {
  let controller: ProductController;
  let productService: ProductService;

  const mockProductService = {
    getAllProducts: jest.fn(),
    getProductById: jest.fn(),
    createProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
  };

  const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService,
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllProducts', () => {
    it('should return all products', async () => {
      const products = [{ name: 'Product 1' }];
      const paginationDto: PaginationDto = { limit: 10, page: 1 };
      mockProductService.getAllProducts.mockResolvedValue(products);
      const res = mockResponse();

      await controller.getAllProducts(res, paginationDto);
      expect(mockProductService.getAllProducts).toHaveBeenCalledWith(
        paginationDto,
      );
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Products fetched successfully',
        data: products,
      });
    });
  });

  describe('getProductById', () => {
    it('should return a product by id', async () => {
      const product = { id: '1', name: 'Product 1' };
      mockProductService.getProductById.mockResolvedValue(product);
      const res = mockResponse();

      await controller.getProductById('1', res);
      expect(mockProductService.getProductById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Product fetched successfully',
        data: product,
      });
    });
  });

  describe('createProduct', () => {
    it('should create a product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Product 1',
        description: 'Description',
        price: 100,
        sku: 'just a sku',
        categoryId: 'CategoryID',
      };
      const createdProduct = { id: '1', ...createProductDto };
      mockProductService.createProduct.mockResolvedValue(createdProduct);
      const res = mockResponse();

      await controller.createProduct(createProductDto, res);
      expect(mockProductService.createProduct).toHaveBeenCalledWith(
        createProductDto,
      );
      expect(res.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Product created successfully',
        data: createdProduct,
      });
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      const updateProductDto: UpdateProductDto = { name: 'Updated Product' };
      const updatedProduct = { id: '1', ...updateProductDto };
      mockProductService.updateProduct.mockResolvedValue(updatedProduct);
      const res = mockResponse();

      await controller.updateProduct('1', updateProductDto, res);
      expect(mockProductService.updateProduct).toHaveBeenCalledWith(
        '1',
        updateProductDto,
      );
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Product updated successfully',
        data: updatedProduct,
      });
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      mockProductService.deleteProduct.mockResolvedValue(undefined);
      const res = mockResponse();

      await controller.deleteProduct('1', res);
      expect(mockProductService.deleteProduct).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Product deleted successfully',
      });
    });
  });
});
