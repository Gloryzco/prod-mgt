import { Type } from 'class-transformer';
import { IsNumber, Min, Max, IsOptional, IsIn } from 'class-validator';
import { FilterOperators } from '../enums';

export class PaginationDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  readonly page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  readonly limit?: number;

  @IsOptional()
  readonly amount?: string;

  @IsOptional()
  @IsIn(Object.keys(FilterOperators))
  readonly operator?: string;
}
