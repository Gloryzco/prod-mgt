import { Module } from '@nestjs/common';
import { productSchema } from 'src/schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Schema } from 'mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Product',
        schema: productSchema,
      },
    ]),
  ],
  providers: [],
  controllers: [],
  exports: [],
})
export class ProductModule {}
