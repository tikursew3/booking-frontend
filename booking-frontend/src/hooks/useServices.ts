import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { PhotographyService } from '../types/types';


export const useServices = () => {
  return useQuery<PhotographyService[]>({
    queryKey: ['services'],
    queryFn: async () => {
      const response = await api.get<PhotographyService[]>('api/photography-services');
      // ✅ Filter only active services
      return response.data.filter((service) => service.active);
    },
  });
};
