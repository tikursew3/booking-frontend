import useSWR from "swr";
import api from "@/lib/axios";
import { DecorCategory } from "@/types/types";

export function useDecorCategories() {
  const { data, error, isLoading } = useSWR<DecorCategory[]>(
    "/api/decor-categories/active",
    (url: string) => api.get(url).then((res) => res.data)
  );

  return { data, error, isLoading };
}


