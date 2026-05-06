import { api } from '@/shared/api/axiosInstance';
import type {
    Task,
    TaskListResponse,
    CreateTaskRequest,
    ReplaceTaskRequest,
} from '@/shared/types';

export const tasksApi = {
    getAll: (params: URLSearchParams) =>
        api.get<TaskListResponse>('/tasks', { params }),

    getById: (id: string) =>
        api.get<Task>(`/tasks/${id}`),

    create: (data: CreateTaskRequest) =>
        api.post<Task>('/tasks', data),

    update: (id: string, data: ReplaceTaskRequest) =>
        api.put<Task>(`/tasks/${id}`, data),

    delete: (id: string) =>
        api.delete<{ ok: boolean }>(`/tasks/${id}`),
};