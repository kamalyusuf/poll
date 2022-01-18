import { QueryClient, QueryFunction } from "react-query";
import { api } from "./api";

export const defaultQueryFn: QueryFunction = async ({ queryKey }) => {
  try {
    const { data } = await api.get(`${queryKey}`);
    return data;
  } catch (e) {
    throw e;
  }
};

export const queryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 60 * 1000 * 5,
        queryFn: defaultQueryFn,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false
      },
      mutations: {}
    }
  });
};
