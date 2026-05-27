import { api } from "@/lib/api.client";
import { AssetList, DetailedAsset, RemovedList } from "@/types/asset.type";
import { Company } from "@/types/company.types";
import { DataResponse2, PaginatedResponse } from "@/types/paginate.type";
// import { RegistBy } from "@/types/user.types";

export const assetService = {
    list: (params?: {
        companyId?: number;
        areaId?: number;
        search?: string;
        status?: string;
        page?: number;
    }) => api.get<PaginatedResponse<AssetList>>('/assets', params),

    listRemoved: (params?: {
        search?: string;
        page?: number;
    }) => api.get<PaginatedResponse<RemovedList>>('/assets/removed', params),

    get: (id: number) => api.get<DataResponse2<DetailedAsset>>(`/assets/${id}`),
    
    create: (data: Partial<Company>) =>
        api.post<Company>('/companies', data),

    update: (companyId: number, data: Partial<Company>) =>
        api.patch<Company>(`/companies/${companyId}`, data),

    setResponsable: (assetId: number, user: number) =>
        api.post<Company>(`/assets/assign/${assetId}`, user),

    delete: (companyId: number) =>
        api.delete(`/companies/${companyId}`),
};