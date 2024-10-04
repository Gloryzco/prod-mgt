import { Module } from '@nestjs/common';
import { categorySchema, productSchema } from 'src/schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductController } from './controllers';
import { ProductService } from './services';
import { LoggerService } from 'src/logger';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'products', schema: productSchema },
      { name: 'categories', schema: categorySchema },
    ]),
  ],
  providers: [LoggerService, ProductService],
  controllers: [ProductController],
  exports: [],
})
export class ProductModule {}
