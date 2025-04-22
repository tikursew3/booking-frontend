// src/hooks/useServices.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PhotographyService } from "@/types/types";

export const useServices = () => {
  return useQuery<PhotographyService[]>({
    queryKey: ["photography-services"],
    queryFn: async () => {
      const res = await axios.get<PhotographyService[]>("http://localhost:8080/api/photography-services");
      return res.data;
    },
  });
};
