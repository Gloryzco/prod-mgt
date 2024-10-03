import { CreateProductDto, UpdateProductDto } from "src/modules";
import { IProduct } from "../schema";

export interface IProductService {
    getAllProducts(): Promise<IProduct[]>;
  
    getProductById(id: string): Promise<IProduct | null>;
  
    createProduct(createProductDto: CreateProductDto): Promise<IProduct>;
  
    updateProduct(id: string, updateProductDto: UpdateProductDto): Promise<IProduct | null>;
  
    deleteProduct(id: string): Promise<void>;
  }
  