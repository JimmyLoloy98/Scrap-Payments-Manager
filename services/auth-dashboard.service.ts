import { apiClient } from './api-client';
import { DashboardStats, RecentActivity, User, MonthlyOverviewResponse } from '@/lib/types';

export const dashboardService = {
  getStats: () => apiClient.get<DashboardStats>('/dashboard/stats'),

  getChartData: (months = 6) =>
    apiClient.get<MonthlyOverviewResponse>(`/dashboard/monthly-overview?months=${months}`),

  getRecentActivity: (limit = 5) =>
    apiClient.get<{ activities: RecentActivity[] }>(`/dashboard/recent-activity?limit=${limit}`),
};

export const authService = {
  login: (credentials: any) => apiClient.post<{ user: User, token: string }>('/auth/login', credentials),
  // me: () => apiClient.get<User>('/auth/me'),
};
