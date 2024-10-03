import { CreateProductDto, UpdateProductDto } from "src/modules";
import { IProduct } from "../schema";
import { PaginationDto } from "src/shared/dtos";
import { IPaginatedResponse } from "../app";

export interface IProductService {
    getAllProducts(paginationDto: PaginationDto): Promise<IPaginatedResponse<IProduct>>;
  
    getProductById(id: string): Promise<IProduct | null>;
  
    createProduct(createProductDto: CreateProductDto): Promise<IProduct>;
  
    updateProduct(id: string, updateProductDto: UpdateProductDto): Promise<IProduct | null>;
  
    deleteProduct(id: string): Promise<void>;
  }
  