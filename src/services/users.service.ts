import { api } from "@/lib/api.client";
import { AuthUser, AuthResponse, logUser } from "@/types/auth.types";
import { DetailedUser, FormUser, ListUser } from "@/types/user.types";
import { DataResponse, DataResponse2, PaginatedResponse } from "@/types/paginate.type";


export const usersService = {
    login: (data: logUser) => api.post<AuthResponse>('/login', data),

    getMe: () => api.get<AuthUser>('/users/me'),

    list: (params?: {
        companyId?: number;
        areaId?: number;
        rolId?: string,
        locationId?: number;
        search?: string;
        status?: string;
        page?: number;
    }) => api.get<PaginatedResponse<ListUser>>('/users', params),

    listTechnicians: () => api.get<FormUser[]>('/users/technicians'),

    get: (id: number) => api.get<DataResponse2<DetailedUser>>(`/users/${id}`),

    search: (query: string) => api.get<DataResponse<FormUser>>('/users/search', { search: query}),

    getById: (userId: string) => api.get<AuthUser>(`/users/${userId}`),

    delete: (userId: number) => api.delete(`/users/${userId}`)
};