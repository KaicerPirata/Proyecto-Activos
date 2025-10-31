
'use client';

import { useMemo, useState, useEffect } from 'react';
import { addMonths, differenceInDays } from 'date-fns';
import DashboardLayout from '@/components/dashboard-layout';
import Header from '@/components/dashboard/header';
import SummaryCards from '@/components/dashboard/summary-cards';
import AssetsChart from '@/components/dashboard/assets-chart';
import UpcomingMaintenance from '@/components/dashboard/upcoming-maintenance';
import { assets, assetHistory, companies, users } from '@/lib/mock-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const MAINTENANCE_INTERVAL_MONTHS = 6;

interface MaintenanceTask {
  id: string;
  name: string;
  nextMaintenanceDate: Date;
  daysUntilMaintenance: number;
  isOverdue: boolean;
  [key: string]: any;
}


export default function Home() {
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [upcomingMaintenanceList, setUpcomingMaintenanceList] = useState<MaintenanceTask[] | null>(null);

  const filteredAssets = useMemo(() => {
    if (selectedCompany === 'all') {
      return assets;
    }
    return assets.filter(asset => asset.company === selectedCompany);
  }, [selectedCompany]);

  const filteredUsers = useMemo(() => {
    if (selectedCompany === 'all') {
      return users;
    }
    return users.filter(user => user.company === selectedCompany);
  }, [selectedCompany]);

  useEffect(() => {
    const maintenanceTasks = filteredAssets
      .filter(asset => asset.category === 'Equipo de cómputo' || asset.category === 'UPS')
      .map(asset => {
        const history = (assetHistory as Record<string, any[]>)[asset.id] || [];
        const lastMaintenance = history
          .filter(entry => entry.type === 'Mantenimiento')
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

        const lastMaintenanceDate = lastMaintenance ? new Date(lastMaintenance.date) : new Date(asset.purchaseDate);
        const nextMaintenanceDate = addMonths(lastMaintenanceDate, MAINTENANCE_INTERVAL_MONTHS);
        const daysUntilMaintenance = differenceInDays(nextMaintenanceDate, new Date());

        return {
          ...asset,
          nextMaintenanceDate,
          daysUntilMaintenance,
          isOverdue: daysUntilMaintenance < 0,
        };
      })
      .filter(asset => asset.daysUntilMaintenance <= (30 * MAINTENANCE_INTERVAL_MONTHS))
      .sort((a, b) => a.daysUntilMaintenance - b.daysUntilMaintenance);
      
    setUpcomingMaintenanceList(maintenanceTasks);
  }, [filteredAssets]);

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full min-w-[600px]">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-2xl font-bold font-headline tracking-tight">Inicio</h1>
              <div className='w-full sm:w-64'>
                <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las Empresas</SelectItem>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.name}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <SummaryCards 
              totalAssets={filteredAssets.length}
              totalUsers={filteredUsers.length}
              openTasks={upcomingMaintenanceList?.length ?? 0} 
            />
            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
              <div className="xl:col-span-2">
                <AssetsChart assets={filteredAssets} />
              </div>
              <div className="flex flex-col gap-4 md:gap-8">
                 <UpcomingMaintenance maintenanceList={upcomingMaintenanceList} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}
