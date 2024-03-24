import type { AxiosError } from "axios";
import type { ApiError } from "types";

export const parseapierror = (error: AxiosError<ApiError>) => {
  if (error.response)
    return error.response.data.errors.map((error) => error.message);

  return [error.message];
};

export const sleep = (ms = 2500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {};

export const c = Object.freeze({
  colors: {
    white: "#fff",
    black: "#000",
    bg: "#101113",
    primary: "#4F46E5",
    indigo: "#4F46E5",
    red: "#DC2626",
    green: "#059669",
    blue: "#2563EB",
    teal: "#0D9488",
    lime: "#65A30D",
    orange: "#EA580C",
    cyan: "#0891B2",
    violet: "#7C3AED",
    pink: "#DB2777",
    purple: "#7C3AED",
    yellow: "#D97706",
    secondary: "#D97706",
    gray: "#4B5563",
    dark: "#25262b",
    stone: "#57534e",
    amber: "#d97706",
    emerald: "#059669",
    sky: "#0284c7",
    rose: "#e11d48",
    neutral: "#525252",
    zinc: "#52525b",
    shade: "#191b1e",
    info: "#4F46E5",
    success: "#059669",
    error: "#DC2626",
    warning: "#D97706"
  }
});
