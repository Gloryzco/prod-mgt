import { Model } from 'mongoose';
import { PaginationDto } from 'src/shared';

export class PaginationUtil {
  static async paginate(model: Model<any>, paginationDto: PaginationDto) {
    const { page, limit, sortBy, sortOrder, filter } = paginationDto;
    const skip = (page - 1) * limit;

    const query = model.find();

    if (filter) {
      const { field, operator, value } = filter;

      if (!field) {
        throw new Error('Filter field is required');
      }

      switch (operator) {
        case '$eq':
          query.where(field).equals(value);
          break;
        case '$ne':
          query.where(field).ne(value);
          break;
        case '$contains':
          query.where(field).regex(new RegExp(`.*${value}.*`, 'i'));
          break;
        case '$startsWith':
          query.where(field).regex(new RegExp(`^${value}`));
          break;
        case '$endsWith':
          query.where(field).regex(new RegExp(`${value}$`));
          break;
        case '$gt':
        case '$lt':
        case '$gte':
        case '$lte':
          query.where(field)[operator](value);
          break;
        default:
          throw new Error(`Unsupported filter operator: ${operator}`);
      }
    }

    if (sortBy) {
      query.sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 });
    }

    return query.skip(skip).limit(limit).exec();
  }
}
