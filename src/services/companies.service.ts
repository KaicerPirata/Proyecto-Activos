import { api } from "@/lib/api.client";
import { Company } from "@/types/company.types";

export const companiesService = {
    list: () => api.get<Company[]>('/companies'),
 
    create: (data: Partial<Company>) =>
        api.post<Company>('/companies', data),

    update: (companyId: number, data: Partial<Company>) =>
        api.patch<Company>(`/companies/${companyId}`, data),
    
    delete: (companyId: number) =>
        api.delete(`/companies/${companyId}`),
};