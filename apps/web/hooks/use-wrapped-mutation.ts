import { ApiError } from "types";
import { AxiosError } from "axios";
import {
  MutationFunction,
  useMutation,
  UseMutationOptions
} from "@tanstack/react-query";

export const useWrappedMutation = <TData, TVariables>(
  fn: MutationFunction<TData, TVariables>,
  options?: Omit<
    UseMutationOptions<TData, AxiosError<ApiError>, TVariables>,
    "mutationFn"
  >
) => useMutation<TData, AxiosError<ApiError>, TVariables>(fn, options);
