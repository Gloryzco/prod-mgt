import { Module } from '@nestjs/common';
import { categorySchema } from 'src/schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryController } from './controllers';
import { CategoryService } from './services';
import { LoggerService } from 'src/logger';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'categories', schema: categorySchema }]),
  ],
  providers: [CategoryService, LoggerService],
  controllers: [CategoryController],
  exports: [],
})
export class CategoryModule {}
