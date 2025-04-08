import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../services/api";

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
  confirmPassword: string;
}

interface User {
  id: number;
  username: string;
}

interface AuthResponse {
  message: string;
  userId: number;
}

export function useAuth() {
  const register = useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await api.post<AuthResponse>("/auth/register", data);
      return response.data;
    },
  });

  const login = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await api.post<AuthResponse>("/auth/login", credentials);
      return response.data;
    },
  });

  const logout = useMutation({
    mutationFn: async () => {
      const response = await api.post<{ message: string }>("/auth/logout");
      return response.data;
    },
  });

  const { data: authData, isLoading: isCheckingAuth } = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const response = await api.get<{ authenticated: boolean; user?: User }>(
        "/auth/check"
      );
      return response.data;
    },
  });

  return {
    register,
    login,
    logout,
    isAuthenticated: authData?.authenticated ?? false,
    user: authData?.user,
    isLoggingIn: login.isPending,
    isCheckingAuth,
  };
}
