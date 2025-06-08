import useSWR from "swr";
import api from "@/lib/axios";
import { DecorCategory } from "@/types/types";

// Axios returns the actual data inside .data
const fetcher = async (url: string): Promise<DecorCategory[]> => {
  const res = await api.get<DecorCategory[]>(url);
  console.log("Fetched categories:", res.data);
  return res.data;
};

export function useDecorCategories() {
  const { data, error, isLoading } = useSWR<DecorCategory[]>(
    "/api/decor-categories",
    fetcher
  );

  return { data, error, isLoading };
}
