import axios, { AxiosError } from "axios";
import { parseapierror } from "../utils/error";
import { toast } from "react-toastify";
import type { ApiError } from "types";

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  timeout: 15000
});

api.interceptors.request.use((config) => {
  const vid =
    typeof localStorage !== "undefined" && localStorage.getItem("vid");

  if (vid) config.headers["x-vid"] = vid;

  return config;
});

api.interceptors.response.use(
  (response) => {
    const vid = response.data.vid;

    if (vid && !localStorage.getItem("vid")) localStorage.setItem("vid", vid);

    return response;
  },
  (error: AxiosError<ApiError>) => {
    const errors = parseapierror(error);

    errors.forEach((error) => toast.error(error));

    return Promise.reject(error);
  }
);
