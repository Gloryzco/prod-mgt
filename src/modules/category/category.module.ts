import { Module } from '@nestjs/common';
import { categorySchema, productSchema } from 'src/schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryController } from './controllers';
import { CategoryService } from './services';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'categories', schema: categorySchema }]),
  ],
  providers: [CategoryService],
  controllers: [CategoryController],
  exports: [],
})
export class CategoryModule {}
