import { api } from "../api";
import type { Login, LoginResponse, UseAuthService } from "./types";

export const useAuthService: UseAuthService = () => {
  const baseUrl = "/auth";

  const login: Login = async (body) => {
    const response = await api.post<LoginResponse>(`${baseUrl}/login`, body);

    return response.data.data;
  };

  return { login };
};
