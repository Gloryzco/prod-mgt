import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../services';
import { CreateProductDto, UpdateProductDto } from '../dtos';
import { PaginationDto } from 'src/shared';
import { HttpStatus } from '@nestjs/common';
import { ProductController } from '../controllers';
import { ResponseFormat } from 'src/utils';

describe('ProductController', () => {
  let productController: ProductController;
  let productService: ProductService;

  const mockProductService = {
    getAllProducts: jest.fn(),
    getProductById: jest.fn(),
    createProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
  };

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
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

    productController = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(productController).toBeDefined();
  });

  describe('getAllProducts', () => {
    it('should return all products', async () => {
      const paginationDto: PaginationDto = { page: 1, limit: 10 };
      const products = [
        { id: '1', name: 'Product 1' },
        { id: '2', name: 'Product 2' },
      ];

      mockProductService.getAllProducts.mockResolvedValue(products);
      const responseSpy = jest.spyOn(ResponseFormat, 'successResponse');

      await productController.getAllProducts(mockResponse, paginationDto);

      expect(productService.getAllProducts).toHaveBeenCalledWith(paginationDto);
      expect(responseSpy).toHaveBeenCalledWith(
        mockResponse,
        products,
        'Products fetched successfully',
        HttpStatus.OK,
      );
    });
  });

  describe('getProductById', () => {
    it('should return a product by ID', async () => {
      const product = { id: '1', name: 'Product 1' };
      const productId = '1';

      mockProductService.getProductById.mockResolvedValue(product);
      const responseSpy = jest.spyOn(ResponseFormat, 'successResponse');

      await productController.getProductById(productId, mockResponse);

      expect(productService.getProductById).toHaveBeenCalledWith(productId);
      expect(responseSpy).toHaveBeenCalledWith(
        mockResponse,
        product,
        'Product fetched successfully',
        HttpStatus.OK,
      );
    });
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Product 1',
        description: 'Description 1',
        sku: 'pdr1',
        available: true,
        stockQuantity: 50,
        categoryId: '66feb59dfc313b7fe18ed0a5',
        price: 4000,
      };
      const createdProduct = { id: '1', ...createProductDto };

      mockProductService.createProduct.mockResolvedValue(createdProduct);
      const responseSpy = jest.spyOn(ResponseFormat, 'successResponse');

      await productController.createProduct(createProductDto, mockResponse);

      expect(productService.createProduct).toHaveBeenCalledWith(
        createProductDto,
      );
      expect(responseSpy).toHaveBeenCalledWith(
        mockResponse,
        createdProduct,
        'Product created successfully',
        HttpStatus.CREATED,
      );
    });
  });

  describe('updateProduct', () => {
    it('should update a product by ID', async () => {
      const updateProductDto: UpdateProductDto = { name: 'Updated Product' };
      const updatedProduct = { id: '1', ...updateProductDto };
      const productId = '1';

      mockProductService.updateProduct.mockResolvedValue(updatedProduct);
      const responseSpy = jest.spyOn(ResponseFormat, 'successResponse');

      await productController.updateProduct(
        productId,
        updateProductDto,
        mockResponse,
      );

      expect(productService.updateProduct).toHaveBeenCalledWith(
        productId,
        updateProductDto,
      );
      expect(responseSpy).toHaveBeenCalledWith(
        mockResponse,
        updatedProduct,
        'Product updated successfully',
        HttpStatus.OK,
      );
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product by ID', async () => {
      const productId = '1';

      mockProductService.deleteProduct.mockResolvedValue(null);
      const responseSpy = jest.spyOn(ResponseFormat, 'successResponse');

      await productController.deleteProduct(productId, mockResponse);

      expect(productService.deleteProduct).toHaveBeenCalledWith(productId);
      expect(responseSpy).toHaveBeenCalledWith(
        mockResponse,
        null,
        'Product deleted successfully',
        HttpStatus.OK,
      );
    });
  });
});
