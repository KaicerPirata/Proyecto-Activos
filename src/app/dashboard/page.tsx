
'use client';

// import { api } from '@/lib/api.client';
import type { UpcomingMaintenance as ApiUpcomingMaintenance } from '@/types/dashboard.types';
import type { DashboardResponse } from '@/types/dashboard.types';
import { companiesService } from '@/services/companies.service';
import type { Company } from '@/types/company.types';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard-layout';
import Header from '@/components/dashboard/header';
import SummaryCards from '@/components/dashboard/summary-cards';
import AssetsChart from '@/components/dashboard/assets-chart';
import UpcomingMaintenance from '@/components/dashboard/upcoming-maintenance';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { dashboardService } from '@/services/dashboard.service';
import { getAuthToken } from '@/lib/session';
import { useCompanies } from '@/hooks/useCompanies';


interface MaintenanceTask {
  id: string;
  name: string;
  nextMaintenanceDate: Date;
  daysUntilMaintenance: number;
  isOverdue: boolean;
  [key: string]: any;
}

function mapUpcomingMaintenances(apiData: ApiUpcomingMaintenance []) : MaintenanceTask[] {
  const today = new Date();

  return apiData.map(item => {
    const nextDate = new Date(item.nextMaintenance);
    const diffTime = nextDate.getTime() - today.getTime();
    const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      id: item.internalId,
      name: `${item.assetType} ${item.model}`,
      nextMaintenanceDate: nextDate,
      daysUntilMaintenance: daysUntil,
      isOverdue: daysUntil < 0,
    };
  });
}


export default function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const { companies, companiesLoading } = useCompanies();
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);
  const [upcomingMaintenanceList, setUpcomingMaintenanceList] = useState<MaintenanceTask[] | null>(null);

  // Get dashboard data from API
  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;

    const loadDashboard = async () => {
      setLoading(true);
      try {
        const data = await dashboardService.get({
          companyId: selectedCompany !== "all" ? Number(selectedCompany) : undefined,
          status: selectedStatus !== "all" ? selectedStatus : undefined
        });
        setDashboard(data);
      } catch (e) {
        console.error('error al cargar dashboard', e)
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [selectedCompany, selectedStatus]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className='p-8'>cargando dashboard...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full min-w-[600px]">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <h1 className="text-2xl font-bold font-headline tracking-tight">Inicio</h1>
              <div className="ml-auto flex gap-3 w-full sm:w-auto">
                <div className='w-full sm:w-64'>
                  <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar empresa" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las Empresas</SelectItem>
                      {companies.map((company) => (
                        <SelectItem key={company.companyId} value={String(company.companyId)}>
                          {company.company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className='w-full sm:w-64'>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="active">Operativos</SelectItem> 
                      <SelectItem value='inactive'>En baja</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            {dashboard && (
            <SummaryCards 
              totals={dashboard.totals}
            />
            )}
            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
              <div className="xl:col-span-2">
                {dashboard && (
                <AssetsChart data={dashboard.assetsByArea} />
                )}
              </div>
              <div className="flex flex-col gap-4 md:gap-8">
                {dashboard && (
                 <UpcomingMaintenance maintenanceList={mapUpcomingMaintenances(dashboard.upcomingMaintenances)} />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}
