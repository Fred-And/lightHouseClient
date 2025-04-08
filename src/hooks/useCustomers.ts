import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

interface Customer {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
}

interface CustomerFormData {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
}

export function useCustomers() {
  const queryClient = useQueryClient();

  const { data: customers, isLoading } = useQuery<Customer[]>({
    queryKey: ["customers"],
    queryFn: () => api.get("/customers").then((res) => res.data),
  });

  const createCustomer = useMutation({
    mutationFn: (data: CustomerFormData) =>
      api.post("/customers", data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });

  const updateCustomer = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CustomerFormData }) =>
      api.put(`/customers/${id}`, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });

  const deleteCustomer = useMutation({
    mutationFn: (id: number) =>
      api.delete(`/customers/${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });

  return {
    customers,
    isLoading,
    createCustomer: createCustomer.mutate,
    updateCustomer: updateCustomer.mutate,
    deleteCustomer: deleteCustomer.mutate,
  };
}
