import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

export interface OrderItem {
  id: number;
  productId: number;
  printId?: number;
  quantity: number;
  productUnitPrice: number;
  printUnitPrice: number;
  product?: {
    id: number;
    name: string;
  };
  print?: {
    id: number;
    name: string;
  };
}

export interface GetOrderItem {
  id: number;
  quantity: number;
  unitPrice: number;
  total: number;
  confirmed: boolean;
  createdAt: string;
  updatedAt: string;
  orderId: number;
  productId: number;
  printId: number;

  // Pricing components snapshot
  baseCost: number;
  printCost?: number;
  packagingCost?: number;
  shippingCost?: number;
  laborCost?: number;
  marginPercentage?: number;

  product?: {
    id: number;
    name: string;
  };
  print?: {
    id: number;
    name: string;
  };
}

export interface Order {
  id: number;
  customerId: number;
  orderNumber: string;
  productionStatus: string;
  description?: string;
  orderDate: string;
  totalCost: number;
  finalCustomerPrice: number;
  createdAt: string;
  updatedAt: string;
  customer?: {
    name: string;
  };
  orderItems?: GetOrderItem[];
}

export interface OrderFormData {
  customerId: number;
  orderNumber: string;
  productionStatus: string;
  description?: string;
  orderDate: string;
  items: OrderItem[];
}

export function useOrders() {
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => api.get<Order[]>("/orders").then((res) => res.data),
  });

  const createOrder = useMutation({
    mutationFn: (data: OrderFormData) =>
      api.post<Order>("/orders", data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const updateOrder = useMutation({
    mutationFn: ({ id, data }: { id: number; data: OrderFormData }) =>
      api.put<Order>(`/orders/${id}`, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const deleteOrder = useMutation({
    mutationFn: (id: number) =>
      api.delete(`/orders/${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  return {
    orders,
    isLoading,
    createOrder,
    updateOrder,
    deleteOrder,
  };
}
