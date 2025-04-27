import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

export const useTogglePhotographyService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) =>
      Promise.resolve(api.patch(`/api/services/${id}/active`, { active })),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
};
