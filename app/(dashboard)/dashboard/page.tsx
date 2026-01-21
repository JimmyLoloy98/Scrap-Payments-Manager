import { DashboardHeader } from '@/components/dashboard-header'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { RecentActivityTable } from '@/components/dashboard/recent-activity'
import { OverviewChart } from '@/components/dashboard/overview-chart'
import { mockDashboardStats, mockRecentActivity } from '@/lib/mock-data'

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader title="Dashboard" />
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of your credit and payment operations
            </p>
          </div>
          
          <StatsCards stats={mockDashboardStats} />
          
          <div className="grid gap-6 lg:grid-cols-2">
            <OverviewChart />
            <RecentActivityTable activities={mockRecentActivity.slice(0, 6)} />
          </div>
        </div>
      </div>
    </>
  )
}
