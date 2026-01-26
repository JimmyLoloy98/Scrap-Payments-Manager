import { apiClient } from './api-client';
import { DashboardStats, RecentActivity, User } from '@/lib/types';

export const dashboardService = {
  getStats: () => apiClient.get<DashboardStats>('/dashboard/stats'),
  getRecentActivity: () => apiClient.get<RecentActivity[]>('/dashboard/recent-activity'),
};

export const authService = {
  login: (credentials: any) => apiClient.post<{ user: User, token: string }>('/auth/login', credentials),
  me: () => apiClient.get<User>('/auth/me'),
};
