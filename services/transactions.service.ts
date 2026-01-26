import { apiClient } from './api-client';
import { Credit, ScrapPayment } from '@/lib/types';

export const creditsService = {
  getAll: (clientId?: string) =>
    apiClient.get<Credit[]>(`/credits${clientId ? `?clientId=${clientId}` : ''}`),

  create: (data: Partial<Credit>) => apiClient.post<Credit>('/credits', data),

  update: (id: string, data: Partial<Credit>) => apiClient.put<Credit>(`/credits/${id}`, data),

  updateStatus: (id: string, status: Credit['status']) =>
    apiClient.patch<Credit>(`/credits/${id}/status`, { status }),

  delete: (id: string) => apiClient.delete(`/credits/${id}`),
};

export const paymentsService = {
  getAll: (clientId?: string) =>
    apiClient.get<ScrapPayment[]>(`/payments${clientId ? `?clientId=${clientId}` : ''}`),

  create: (data: Partial<ScrapPayment>) => apiClient.post<ScrapPayment>('/payments', data),

  update: (id: string, data: Partial<ScrapPayment>) =>
    apiClient.put<ScrapPayment>(`/payments/${id}`, data),

  delete: (id: string) => apiClient.delete(`/payments/${id}`),
};
