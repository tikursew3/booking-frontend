import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { DecorItem } from "@/types/types";

// ✅ 1. All items (for admin panel)
export const useAllDecorItems = () => {
  return useQuery({
    queryKey: ["decor-items-all"],
    queryFn: async () => {
      const res = await api.get<DecorItem[]>("/decor-items");
      return res.data;
    },
  });
};

// ✅ 2. Only active items (for frontend display)
export const useDecorItems = () => {
  return useQuery({
    queryKey: ["decor-items"],
    queryFn: async () => {
      const res = await api.get<DecorItem[]>("/decor-items");
      return res.data.filter((item) => item.active);
    },
  });
};

export const useAddDecorItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<DecorItem, "id">) => {
      const response = await api.post("/decor-items", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decor-items"] });
      queryClient.invalidateQueries({ queryKey: ["decor-items-all"] });
    },
  });
};

export const useUpdateDecorItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: DecorItem) => {
      const response = await api.put(`/decor-items/${data.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decor-items"] });
      queryClient.invalidateQueries({ queryKey: ["decor-items-all"] });
    },
  });
};

export const useDeleteDecorItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await api.delete(`/decor-items/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decor-items"] });
      queryClient.invalidateQueries({ queryKey: ["decor-items-all"] });
    },
  });
};
