import { HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';
import { IPaginatedResponse, PaginationDto } from 'src/shared';
import { FilterOperators } from 'src/shared/enums';
import AppError from 'src/utils/app-error.utils';

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
    const filters: any = {};

    if (this.paginationDto.amount) {
      const amount = parseFloat(this.paginationDto.amount);
      const operator = this.paginationDto.operator || '$eq';

      if (!Object.values(FilterOperators).includes(operator as FilterOperators)) {
        throw new AppError(`Unsupported filter operator: ${operator}`, HttpStatus.BAD_REQUEST);
      }

      filters['$expr'] = {
        [operator]: [{ $toDouble: '$amount' }, amount],
      };
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
