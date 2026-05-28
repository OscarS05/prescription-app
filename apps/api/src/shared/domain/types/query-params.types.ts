export type Order = 'DESC' | 'ASC';

export type QueryParams = { query: string; limit: number; page: number; order: Order };

export type SearchResponse<T> = Pick<QueryParams, 'page' | 'limit'> & {
  data: T[];
  total: number;
  hasNextPage: boolean;
};
