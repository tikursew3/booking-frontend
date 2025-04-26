import { useQuery } from "@tanstack/react-query";
import api from '@/lib/axios';
import { DecorItem } from "@/types/types";

export const useDecorItems = () => {
  return useQuery<DecorItem[]>({
    queryKey: ["decor-items"],
    queryFn: async () => {
      const response = await api.get<DecorItem[]>('/api/decor-items');
      // ✅ Only return active items
      return response.data.filter((item) => item.active);
    },
    staleTime: 2 * 60 * 1000, //Optional: cache for 2 minutes to avoid refetching too often
    retry: 1, //Optional: retry once if fetch fails
  });
};


