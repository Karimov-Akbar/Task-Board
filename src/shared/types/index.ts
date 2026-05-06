export const TaskStatus = {
    TODO: 'TODO',
    IN_PROGRESS: 'IN_PROGRESS',
    DONE: "DONE",
} as const;
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export const TaskPriority = {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH'
} as const;
export type TaskPriority = (typeof TaskPriority)[keyof typeof TaskPriority];

export const TaskVisibility = {
    ONLY_ME: 'ONLY_ME',
    LIST: 'LIST',
    ANYONE: 'ANYONE'
} as const;
export type TaskVisibility = (typeof TaskVisibility)[keyof typeof TaskVisibility];

export const AssignmentStatus = {
    NONE: 'NONE',
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED'
} as const;
export type AssignmentStatus = (typeof AssignmentStatus)[keyof typeof AssignmentStatus];

export const UserRole = {
    USER: 'USER',
    ADMIN: 'ADMIN'
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface UserRef {
    id: string;
    nickname: string;
    email: string | null;
}

export interface Tag {
    id: string;
    name: string;
}

export interface Task {
    id: string;
    title: string;
    description: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    visibility: TaskVisibility;
    creator: UserRef;
    assignee: UserRef | null;
    assignmentStatus: AssignmentStatus;
    assignedById: string | null;
    viewerUserIds: string[];
    tags: Tag[];
    createdAt: string;
    updatedAt: string;
}

export interface TaskListResponse {
    items: Task[];
    total: number;
    page: number;
    pageSize: number;
}

export interface AuthUser {
    id: string;
    nickname: string;
    email: string | null;
    role: UserRole;
}

export interface AuthResponse {
    accessToken: string;
    user: AuthUser;
}

export interface CreateTaskRequest {
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    visibility?: TaskVisibility;
    viewerUserIds?: string[];
    assigneeId?: string;
}

export interface ReplaceTaskRequest {
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    visibility: TaskVisibility;
    viewerUserIds: string[];
}

export interface LoginRequest {
    nickname: string;
    password: string;
}

export interface RegisterRequest {
    nickname: string;
    password: string;
    email?: string;
}