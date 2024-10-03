import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Response,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from '../dtos';
import { ProductService } from '../services';
import { PaginationDto } from 'src/shared';
import { ResponseFormat } from 'src/utils';
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAllProducts(
    @Response() res,
    @Query() paginationDto?: PaginationDto,
  ) {
    const products = await this.productService.getAllProducts(paginationDto);
    return ResponseFormat.successResponse(
      res,
      products,
      'Products fetched successfully',
      HttpStatus.OK,
    );
  }

  @Get(':id')
  async getProductById(@Param('id') id: string, @Response() res): Promise<any> {
    const product = await this.productService.getProductById(id);
    return ResponseFormat.successResponse(
      res,
      product,
      'Product fetched successfully',
      HttpStatus.OK,
    );
  }

  @Post()
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @Response() res,
  ): Promise<any> {
    const product = await this.productService.createProduct(createProductDto);
    return ResponseFormat.successResponse(
      res,
      product,
      'Product created successfully',
      HttpStatus.CREATED,
    );
  }

  @Patch(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Response() res,
  ): Promise<any> {
    const product = await this.productService.updateProduct(
      id,
      updateProductDto,
    );
    return ResponseFormat.successResponse(
      res,
      product,
      'Product updated successfully',
      HttpStatus.OK,
    );
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string, @Response() res): Promise<any> {
    await this.productService.deleteProduct(id);
    return ResponseFormat.successResponse(
      res,
      null,
      'Product deleted successfully',
      HttpStatus.OK,
    );
  }
}
