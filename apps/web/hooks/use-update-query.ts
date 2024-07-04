import { useQueryClient } from "@tanstack/react-query";
import { type Draft, produce } from "immer";
import { useCallback } from "react";

export const useUpdateQuery = () => {
  const client = useQueryClient();

  return useCallback(
    <T>(key: string[], updater: (draft: Draft<T>) => void) => {
      client.setQueryData<T>(key, (cached) => {
        if (!cached) return undefined;

        return produce(cached, (draft) => {
          updater(draft);
        });
      });
    },
    [client]
  );
};
