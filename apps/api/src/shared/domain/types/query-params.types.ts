export type Order = 'DESC' | 'ASC';

export type QueryParams = { query: string; limit: number; page: number; order: Order };

// For repository
export type QueryFilters = Omit<QueryParams, 'page'> & {
  offset: number;
};

export type SearchResponse<T> = Pick<QueryParams, 'page' | 'limit'> & {
  data: T[];
  total: number;
  hasNextPage: boolean;
};
