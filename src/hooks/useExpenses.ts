import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";

interface Expense {
  id: number;
  description: string;
  rawValue: number;
  movementType: "expense" | "income";
  date: string;
}

interface BalanceSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export function useExpenses() {
  const queryClient = useQueryClient();

  const { data: expenses, isLoading: expensesLoading } = useQuery({
    queryKey: ["expenses"],
    queryFn: () => api.get<Expense[]>("/expenses").then((res) => res.data),
  });

  const { data: balance, isLoading: balanceLoading } = useQuery({
    queryKey: ["expenses-balance"],
    queryFn: () =>
      api.get<BalanceSummary>("/expenses/balance").then((res) => res.data),
  });

  const createExpense = useMutation({
    mutationFn: (data: Omit<Expense, "id">) =>
      api.post<Expense>("/expenses", data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expenses-balance"] });
    },
  });

  const updateExpense = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Expense> }) =>
      api.put<Expense>(`/expenses/${id}`, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expenses-balance"] });
    },
  });

  const deleteExpense = useMutation({
    mutationFn: (id: number) =>
      api.delete(`/expenses/${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expenses-balance"] });
    },
  });

  return {
    expenses,
    balance: balance || { totalIncome: 0, totalExpenses: 0, balance: 0 },
    isLoading: expensesLoading || balanceLoading,
    createExpense,
    updateExpense,
    deleteExpense,
  };
}
