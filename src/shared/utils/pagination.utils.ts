import { HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';
import { IPaginatedResponse, PaginationDto } from 'src/shared';
import { FilterOperators } from 'src/shared/enums';
import AppError from 'src/shared/utils/app-error.utils';

export class PaginateAndFilter<T> {
  private readonly paginationDto: PaginationDto;
  private readonly model: Model<T>;
  private readonly fields: string[];

  constructor(
    paginationDto: PaginationDto,
    model: Model<T>,
    fields: string[] = [],
  ) {
    this.paginationDto = paginationDto;
    this.model = model;
    this.fields = fields;
  }

  private buildFilters(): any {
    const { price, operator } = this.paginationDto;
    if (price && !operator) {
      throw new AppError(
        'Operator must be set for filtering with price',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!price && operator) {
      throw new AppError(
        'Operator can be used when filtering with price',
        HttpStatus.BAD_REQUEST,
      );
    }
    const filters: any = {};

    if (this.paginationDto.price) {
      const price = parseFloat(this.paginationDto.price);
      const operatorMap: Record<string, string> = {
        '=': '$eq',
        '>': '$gt',
        '<': '$lt',
        '>=': '$gte',
        '<=': '$lte',
      };

      const operator = operatorMap[this.paginationDto.operator] || '$eq';

      if (!operatorMap[this.paginationDto.operator]) {
        throw new AppError(
          `Unsupported filter operator: ${this.paginationDto.operator}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      filters['price'] = { [operator]: price };
    }

    return filters;
  }

  async paginateAndFilter(): Promise<IPaginatedResponse<T>> {
    const page = this.paginationDto?.page > 0 ? this.paginationDto.page : 1;
    const limit = this.paginationDto?.limit ?? 10;
    const skip = (page - 1) * limit;
    const filters = this.buildFilters();

    const totalRecords = await this.model.countDocuments(filters).exec();
    const query = this.model
      .find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (this.fields.length > 0) {
      query.select(this.fields.join(' '));
    }

    const data = await query.exec();

    return {
      totalRecords,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      data,
    };
  }
}
