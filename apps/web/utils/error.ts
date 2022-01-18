import { AxiosError } from "axios";
import { ApiError } from "types";

export const parseApiError = (error: AxiosError<ApiError>): string[] => {
  const errors = error?.response?.data.errors;
  if (!errors) {
    return [];
  }

  return errors.map((error) => error.message);
};
