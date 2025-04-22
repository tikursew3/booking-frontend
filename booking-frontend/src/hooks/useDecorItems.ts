import { useQuery } from "@tanstack/react-query";
import api from '../lib/axios';
import { DecorItem } from "@/types/types";

export const useDecorItems = () => {
  return useQuery<DecorItem[]>({
    queryKey: ["decor-items"],
    queryFn: async () => {
      const response = await api.get<DecorItem[]>('/decor-items');
      // ✅ Only return active items
      return response.data.filter((item) => item.active);
    },
  });
};


