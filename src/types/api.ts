export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    message: string;
    details?: any;
  };
}

export interface PaginatedApiResponse<T = any[]> extends ApiResponse<T> {
  pagination?: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}

export interface ValidationErrorDetail {
  path: (string | number)[];
  message: string;
  code?: string;
  expected?: string;
  received?: string;
  unionErrors?: any[];
}
