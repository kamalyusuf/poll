import { AxiosError } from "axios";
import { ApiError as ApiTypeError } from "types";
import { NextPage } from "next";

export type AxiosApiError = AxiosError<ApiTypeError>;

export type PageComponent<T = {}> = NextPage<T>;
