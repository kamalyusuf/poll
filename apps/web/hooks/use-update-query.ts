import { useQueryClient } from "@tanstack/react-query";
import produce, { Draft } from "immer";
import { useCallback } from "react";

export const useUpdateQuery = () => {
  const client = useQueryClient();

  const fn = <T>({
    key,
    updater
  }: {
    key: string[];
    updater: (draft: Draft<T>) => void;
  }) => {
    client.setQueryData<T>(key, (cached) => {
      if (!cached) return;

      return produce(cached, (draft) => {
        updater(draft);
      });
    });
  };

  return useCallback(fn, [client]);
};
