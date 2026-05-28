export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface DataResponse<T> {
  data: T[];
}
export interface DataResponse2<T> {
  data: T;
}