import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

interface Provider {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface ProviderFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export function useProviders() {
  const queryClient = useQueryClient();

  const { data: providers, isLoading } = useQuery<Provider[]>({
    queryKey: ["providers"],
    queryFn: () => api.get("/providers").then((res) => res.data),
  });

  const createProvider = useMutation({
    mutationFn: (data: ProviderFormData) =>
      api.post("/providers", data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providers"] });
    },
  });

  const updateProvider = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProviderFormData }) =>
      api.put(`/providers/${id}`, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providers"] });
    },
  });

  const deleteProvider = useMutation({
    mutationFn: (id: number) =>
      api.delete(`/providers/${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providers"] });
    },
  });

  return {
    providers,
    isLoading,
    createProvider: createProvider.mutate,
    updateProvider: updateProvider.mutate,
    deleteProvider: deleteProvider.mutate,
  };
}
