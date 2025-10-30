
import DashboardLayout from '@/components/dashboard-layout';
import Header from '@/components/dashboard/header';
import SummaryCards from '@/components/dashboard/summary-cards';
import AssetsChart from '@/components/dashboard/assets-chart';
import RecentNotifications from '@/components/dashboard/recent-notifications';

export default function Home() {
  return (
    <DashboardLayout>
      <div className="flex flex-col h-full min-w-[600px]">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
            <h1 className="text-2xl font-bold font-headline tracking-tight">Inicio</h1>
            <SummaryCards />
            <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
              <div className="xl:col-span-2">
                <AssetsChart />
              </div>
              <div className="flex flex-col gap-4 md:gap-8">
                 <RecentNotifications />
              </div>
            </div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}
