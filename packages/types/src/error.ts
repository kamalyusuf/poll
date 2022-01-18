export interface ErrorProps {
  message: string;
  field?: string;
}

export interface ApiError {
  errors: ErrorProps[];
}
