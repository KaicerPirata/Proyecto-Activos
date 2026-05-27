import { api } from "@/lib/api.client";
import { MaintenanceList } from "@/types/maintenance.type";
import { PaginatedResponse } from "@/types/paginate.type";

export const maintenanceService = {
    list: (id: number, params?: {page?: number}) => api.get<PaginatedResponse<MaintenanceList>>(`/assets/maintenances/${id}`, params),

    create: (assetId: number, data: Partial<MaintenanceList>) =>
        api.post<Partial<MaintenanceList>>(`/assets/maintenances/${assetId}`, data),
};