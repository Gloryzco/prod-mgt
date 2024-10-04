import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsString()
  @IsOptional()
  readonly sku?: string;

  @IsNumber()
  @IsOptional()
  readonly price?: number;

  @IsNumber()
  @IsOptional()
  readonly stockQuantity?: number;

  @IsString()
  @IsOptional()
  readonly categoryId?: string;
}
