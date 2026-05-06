import { api } from "@/shared/api/axiosInstance";
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/shared/types';

export const authApi = {
    login: (data: LoginRequest) =>
        api.post<AuthResponse>('/auth/login', data),

    register: (data: RegisterRequest) =>
        api.post<AuthResponse>('/auth/register', data),
};