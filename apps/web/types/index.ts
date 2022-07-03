import { AxiosError } from "axios";
import { ApiError as ApiTypeError } from "types";
import { NextPage } from "next";

export type Color =
  | "white"
  | "black"
  | "red"
  | "primary"
  | "dark"
  | "secondary"
  | "indigo"
  | "tertiary";

export type ApiError = AxiosError<ApiTypeError>;

export type PageComponent<T = {}> = NextPage<T>;
