export interface ApiError {
  message: string;
  statusCode?: number;
  digest?: string;
}