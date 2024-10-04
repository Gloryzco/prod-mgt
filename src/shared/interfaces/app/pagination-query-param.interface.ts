export interface IQueryParams {
  page?: number;
  limit?: number;
  price?: string;
  operator?: string;
}

export interface IPaginatedResponse<T> {
  totalRecords: number;
  currentPage: number;
  totalPages: number;
  data: T[];
}
