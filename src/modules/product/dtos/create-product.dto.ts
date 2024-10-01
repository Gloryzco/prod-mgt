import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'category name is required.' })
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsNumber()
  @IsNotEmpty({ message: 'price is required.' })
  readonly price: number;

  @IsNumber()
  @IsOptional()
  readonly stockQuantity?: number;

  @IsString()
  @IsNotEmpty({ message: 'category id is required.' })
  readonly categoryId: string;
}
