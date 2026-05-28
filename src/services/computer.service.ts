import { ApiComputer, ComputerList, formComputer, RemovedComputer } from "@/types/computer.type";
import { api } from "@/lib/api.client";
import { DataResponse2, PaginatedResponse } from "@/types/paginate.type";

export const computerService = {
   list: (params?: {
    companyId?: number;
    areaId?: number;
    search?: string;
    status?: string;
    page?: number;
   }) => api.get<PaginatedResponse<ComputerList>>('/assets/computers/', params),

   listRemoved: () => api.get<PaginatedResponse<RemovedComputer>>('/assets/removed/computers'),

   get: (id: number) => api.get<DataResponse2<ApiComputer>>(`/assets/computers/${id}`),
   
   create: (data: Partial<formComputer>) => 
    api.post<formComputer>('/assets/', data),
   
   update: (id: number, data: Partial<formComputer>) => 
    api.patch<formComputer>(`/assets/computers/${id}`, data),

   delete: (id: number, removalReason: string) =>
    api.delete(`/assets/computers/${id}`, { removalReason }),
};