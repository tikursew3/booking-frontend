// hooks/useDecorItemsByCategory.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { DecorItemWithAvailabilityDTO } from "@/types/types";


const formatToLocalDate = (date: Date) => {
  return date.toISOString().split("T")[0]; // yyyy-MM-dd
};

export const useDecorItemsByCategory = (
  categoryId: string | undefined,
  start: Date | undefined,
  end: Date | undefined
) => {
  return useQuery({
    queryKey: ["decor-items-by-category", categoryId, start, end],
    queryFn: async () => {
  
      if (!categoryId || !start || !end) return [];
      const res = await api.get<DecorItemWithAvailabilityDTO[]>(
        `/api/decor-items/by-category/${categoryId}`,
        {
          params: {
            start: formatToLocalDate(start),
            end: formatToLocalDate(end),
          },
        }
      );

      return res.data;
    },
    enabled: !!categoryId && !!start && !!end,
  });
};


