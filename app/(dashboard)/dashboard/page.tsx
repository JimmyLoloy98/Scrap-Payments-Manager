"use client";

import { useEffect, useState } from 'react';
import { DashboardHeader } from '@/components/dashboard-header';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { RecentActivityTable } from '@/components/dashboard/recent-activity';
import { OverviewChart } from '@/components/dashboard/overview-chart';
import { dashboardService } from '@/services';
import type { DashboardStats, RecentActivity, MonthlyOverviewItem } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { handleApiError } from '@/lib/error-handler';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyOverviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Ejecutamos por separado para que si uno falla el otro cargue (Resiliencia)
        const statsTask = dashboardService.getStats().catch(e => { console.error('Stats failed:', e); return null; });
        const activityTask = dashboardService.getRecentActivity(10).catch(e => { console.error('Activity failed:', e); return { activities: [] }; });
        const chartTask = dashboardService.getChartData(6).catch(e => { console.error('Chart failed:', e); return { data: [] }; });

        const [statsData, activitiesRes, chartRes] = await Promise.all([statsTask, activityTask, chartTask]);

        console.log('Dashboard Data Received:', { statsData, activitiesRes, chartRes });

        setStats(statsData);
        setActivities(activitiesRes?.activities || activitiesRes || []);

        // Obtenemos los datos del gráfico tipados correctamente desde la respuesta del API
        const normalizedChartData: MonthlyOverviewItem[] = Array.isArray(chartRes?.data)
          ? chartRes.data
          : [];

        setMonthlyData(normalizedChartData);
      } catch (error) {
        handleApiError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <DashboardHeader title="Dashboard" />
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">
              Vista general de tus operaciones de crédito y cobros en tiempo real.
            </p>
          </div>

          {stats && <StatsCards stats={stats} />}

          <div className="grid gap-6 lg:grid-cols-2">
            <OverviewChart data={monthlyData} />
            <RecentActivityTable activities={activities.slice(0, 10)} />
          </div>
        </div>
      </div>
    </>
  );
}
