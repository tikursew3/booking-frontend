import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { DecorItem, DecorItemCreateDTO } from "@/types/types";

// ✅ 1. All items (admin panel)
export const useAllDecorItems = () => {
  return useQuery<DecorItem[]>({
    queryKey: ["decor-items-all"],
    queryFn: async (): Promise<DecorItem[]> => {
      const res = await api.get("/api/decor-items");

      if (!Array.isArray(res.data)) {
        console.error("Expected an array, got:", res.data);
        return []; // fallback to empty array to prevent crashes
      }

      return res.data as DecorItem[];
    },
  });
};

// ✅ 2. Active items only (frontend)
export const useDecorItems = () => {
  return useQuery<DecorItem[]>({
    queryKey: ["decor-items"],
    queryFn: async (): Promise<DecorItem[]> => {
      const res = await api.get("/api/decor-items");
      console.log("Fetched decor items:", res.data);
      const allItems = res.data as DecorItem[];
      return allItems.filter((item) => item.active);
    },
  });
};

// ✅ 3. Add new decor item
export const useAddDecorItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: DecorItemCreateDTO) => {
      const response = await api.post("/api/decor-items", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decor-items"] });
      queryClient.invalidateQueries({ queryKey: ["decor-items-all"] });
    },
  });
};

// ✅ 4. Update decor item
export const useUpdateDecorItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: DecorItem) => {
      const response = await api.put(`/api/decor-items/${data.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decor-items"] });
      queryClient.invalidateQueries({ queryKey: ["decor-items-all"] });
    },
  });
};

// ✅ 5. Delete decor item
export const useDeleteDecorItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/api/decor-items/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decor-items"] });
      queryClient.invalidateQueries({ queryKey: ["decor-items-all"] });
    },
  });
};

// ✅ 6. Items by category with date-based availability check
export const useDecorItemsByCategory = (
  categoryId: number | undefined,
  start: string | undefined,
  end: string | undefined
) => {
  return useQuery<DecorItem[]>({
    queryKey: ["decor-items-by-category", categoryId, start, end],
    queryFn: async (): Promise<DecorItem[]> => {
      const res = await api.get(`/api/decor-items/by-category/${categoryId}`, {
        params: { start, end },
      });
      return res.data as DecorItem[];
    },
    enabled: !!categoryId && !!start && !!end, // ensures only runs when all are defined
  });
};


