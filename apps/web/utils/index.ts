import type { AxiosError } from "axios";
import type { ApiError } from "types";

export const parseapierror = (error: AxiosError<ApiError>) => {
  if (error.response)
    return error.response.data.errors.map((error) => error.message);

  return [error.message];
};

export const sleep = (ms = 2500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const noop = () => {};
