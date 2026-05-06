import { create } from 'zustand';
import type { Task } from '@/shared/types';
import { tasksApi } from '@/features/tasks/api/tasksApi';
import { getApiErrorMessage } from '@/shared/api/axiosInstance';

interface TaskFilters {
    status?: string[];
    priority?: string[];
    q?: string;
    sort?: 'createdAt' | 'updatedAt' | 'title';
    order?: 'asc' | 'desc';
    mine?: 'all' | 'created' | 'assigned' | 'involved';
    tag?: string[];
}

interface TasksState {
    tasks: Task[];
    total: number;
    page: number;
    pageSize: number;
    isLoading: boolean;
    error: string | null;
    filters: TaskFilters;

    fetchTasks: () => Promise<void>;
    setFilters: (filters: Partial<TaskFilters>) => void;
    setPage: (page: number) => void;
    resetFilters: () => void;
}

const DEFAULT_FILTERS: TaskFilters = {
    sort: 'updatedAt',
    order: 'desc',
};

export const useTasksStore = create<TasksState>((set, get) => ({
    tasks: [],
    total: 0,
    page: 1,
    pageSize: 20,
    isLoading: false,
    error: null,
    filters: { ...DEFAULT_FILTERS },

    fetchTasks: async () => {
        const { page, pageSize, filters } = get();
        set({ isLoading: true, error: null });

        try {
            const params = new URLSearchParams();
            params.append('page', String(page));
            params.append('pageSize', String(pageSize));

            if (filters.sort) params.append('sort', filters.sort);
            if (filters.order) params.append('order', filters.order);
            if (filters.q) params.append('q', filters.q);
            if (filters.mine && filters.mine !== 'all') params.append('mine', filters.mine);

            filters.status?.forEach((s) => params.append('status', s));
            filters.priority?.forEach((p) => params.append('priority', p));
            filters.tag?.forEach((t) => params.append('tag', t));

            const response = await tasksApi.getAll(params);
            set({
                tasks: response.data.items,
                total: response.data.total,
                page: response.data.page,
                pageSize: response.data.pageSize,
            });
        } 
        catch (error) {
            set({ error: getApiErrorMessage(error) });
            } finally {
            set({ isLoading: false });
        }
    },

    setFilters: (newFilters) => {
        set((state) => ({
        filters: { ...state.filters, ...newFilters },
        page: 1,
        }));
        get().fetchTasks();
    },

    setPage: (page) => {
        set({ page });
        get().fetchTasks();
    },

    resetFilters: () => {
        set({ filters: { ...DEFAULT_FILTERS }, page: 1 });
        get().fetchTasks();
    },
}));
