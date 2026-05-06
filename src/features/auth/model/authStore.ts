import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser, LoginRequest, RegisterRequest } from '@/shared/types';
import { authApi } from '@/features/auth/api/authApi';

interface AuthState {
    token: string | null;
    user: AuthUser | null;

    login: (data: LoginRequest) => Promise<void>;
    register: (data: RegisterRequest) => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,

            login: async (data) => {
                const responce = await authApi.login(data);
                set({
                    token: responce.data.accessToken,
                    user: responce.data.user,
                });
            },

            register: async (data) => {
                const responce = await authApi.register(data);
                set({
                    token: responce.data.accessToken,
                    user: responce.data.user,
                });
            },

            logout: () => {
                set({ token: null, user: null});
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ token: state.token, user: state.user }),
        }
    )
);