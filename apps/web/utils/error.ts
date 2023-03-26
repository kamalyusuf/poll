import { AxiosError } from "axios";
import { ApiError } from "types";

export const parseapierror = (error: AxiosError<ApiError>) => {
  if (error.response)
    return error.response.data.errors.map((error) => error.message);

  return [error.message ?? "something went wrong"];
};
