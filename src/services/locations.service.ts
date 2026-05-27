import { Location } from "@/types/location.type";
import { api } from "@/lib/api.client";
import { DataResponse } from "@/types/paginate.type";

export const locationService = {
   list: (companyId: number, cityId: string) => api.get<DataResponse<Location>>(`/companies/${companyId}/locations`, {city: cityId }),

   get: (companyId: number) => api.get<Location>(`/companies/${companyId}/locations`),
   
   create: (companyId: number, data: Partial<Location>) => 
    api.post<Location>(`/companies/${companyId}/locations`, data),
   
   update: (id: number, data: Partial<Location>) => 
    api.patch<Location>(`/companies/locations/${id}`, data),

   delete: (id: number) =>
    api.delete(`/companies/locations/${id}`),
};