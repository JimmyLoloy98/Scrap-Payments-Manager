import { apiClient } from './api-client';
import { DashboardStats, RecentActivity, User, MonthlyOverviewResponse, ScrapCollectionResponse } from '@/lib/types';

export const dashboardService = {
  getStats: () => apiClient.get<DashboardStats>('/dashboard/stats'),

  getChartData: (months = 4) =>
    apiClient.get<MonthlyOverviewResponse>(`/dashboard/monthly-overview?months=${months}`),

  getRecentActivity: (limit = 5) =>
    apiClient.get<{ activities: RecentActivity[] }>(`/dashboard/recent-activity?limit=${limit}`),

  getScrapCollection: (startDate: string, endDate: string, scrapId?: string) => {
    let url = `/dashboard/scrap-collection?startDate=${startDate}&endDate=${endDate}`;
    if (scrapId) url += `&scrapId=${scrapId}`;
    return apiClient.get<ScrapCollectionResponse>(url);
  },
};

export const authService = {
  login: (credentials: any) => apiClient.post<{ user: User, token: string }>('/auth/login', credentials),
  // me: () => apiClient.get<User>('/auth/me'),
};
