// src/hooks/useServices.ts
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { PhotographyService } from "@/types/types";

export const useServices = () => {
  return useQuery<PhotographyService[]>({
    queryKey: ["photography-services"],
    queryFn: async () => {
      const res = await api.get<PhotographyService[]>('/api/photography-services');
      return res.data;
    },
  });
};
