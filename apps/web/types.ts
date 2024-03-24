import { type AxiosError } from "axios";
import { type ApiError as ApiTypeError } from "types";
import { type NextPage } from "next";

export type AxiosApiError = AxiosError<ApiTypeError>;

export type PageComponent<T = {}> = NextPage<T>;
