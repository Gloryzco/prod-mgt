import {
    IsOptional,
    IsInt,
    IsString,
    IsArray,
    ValidateNested,
    IsEnum,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  
  export class FilterDto {
    @IsString()
    field: string;
  
    @IsEnum([
      '$eq',
      '$ne',
      '$contains',
      '$startsWith',
      '$endsWith',
      '$gt',
      '$lt',
      '$gte',
      '$lte',
    ])
    operator:
      | '$eq'
      | '$ne'
      | '$contains'
      | '$startsWith'
      | '$endsWith'
      | '$gt'
      | '$lt'
      | '$gte'
      | '$lte';
  
    value: any;
  }
  
  export class PaginationDto {
    @IsOptional()
    @IsInt()
    page: number = 1; 
  
    @IsOptional()
    @IsInt()
    limit: number = 10;
  
    @IsOptional()
    @IsString()
    sortBy: string;
  
    @IsOptional()
    @IsEnum(['asc', 'desc'])
    sortOrder: 'asc' | 'desc' = 'asc';
  
    @IsOptional()
    @ValidateNested()
    @Type(() => FilterDto)
    filter?: FilterDto;
  }
  