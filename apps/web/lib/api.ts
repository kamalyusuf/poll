import axios, { AxiosError } from "axios";
import { parseApiError } from "../utils/error";
import { toast } from "react-toastify";
import { ApiError } from "types";

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
  timeout: 15000,
  withCredentials: true
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
    const messages = parseApiError(error);

    if (messages.length === 0) messages.push("something went wrong");

    messages.forEach((message) => toast.error(message));

    return Promise.reject(error);
  }
);
