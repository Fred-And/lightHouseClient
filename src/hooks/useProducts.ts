import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

interface Product {
  id: number;
  name: string;
  sku: string;
  description: string;
  rawPrice: number;
  totalPrice: number;
  printCost?: number;
  packagingCost?: number;
  shippingCost?: number;
  laborCost?: number;
  marginPercentage?: number;
  provider: {
    id: number;
    name: string;
  };
  category: {
    id: number;
    name: string;
  };
}

interface ProductFormData {
  name: string;
  sku: string;
  description: string;
  baseCost: number;
  printCost?: number;
  packagingCost?: number;
  shippingCost?: number;
  laborCost?: number;
  marginPercentage?: number;
  providerId: number;
  categoryId: number;
}

export function useProducts() {
  const queryClient = useQueryClient();

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: () => api.get("/products").then((res) => res.data),
  });

  const createProduct = useMutation({
    mutationFn: (data: ProductFormData) =>
      api.post("/products", data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const updateProduct = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductFormData }) =>
      api.put(`/products/${id}`, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: (id: number) =>
      api.delete(`/products/${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return {
    products,
    isLoading,
    createProduct: createProduct.mutate,
    updateProduct: updateProduct.mutate,
    deleteProduct: deleteProduct.mutate,
  };
}
