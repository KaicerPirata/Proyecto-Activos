import { api } from '@/lib/api.client';
import type { DashboardResponse } from '@/types/dashboard.types';

export const dashboardService = {
  get: (params?:{
    companyId?: number;
    status?: string;
  }) =>api.get<DashboardResponse>('/dashboard', params)
};