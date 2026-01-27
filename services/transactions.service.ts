import { apiClient } from './api-client';
import { Credit, ScrapPayment } from '@/lib/types';

export const creditsService = {
  getAll: (params: { clientId?: string | number, page?: number, limit?: number } = {}) => {
    const query = new URLSearchParams()
    if (params.clientId) query.append('clientId', String(params.clientId))
    if (params.page) query.append('page', String(params.page))
    if (params.limit) query.append('limit', String(params.limit))
    return apiClient.get<import('@/lib/types').CreditsResponse>(`/credits?${query.toString()}`)
  },

  getById: (id: string | number) =>
    apiClient.get<Credit>(`/credits/${id}`),

  getByClient: (clientId: string | number) =>
    apiClient.get<Credit[]>(`/clients/${clientId}/credits`),

  create: (data: Partial<Credit>) =>
    apiClient.post<Credit>('/credits', data),

  update: (id: string | number, data: Partial<Credit>) =>
    apiClient.put<Credit>(`/credits/${id}`, data),

  updateStatus: (id: string | number, status: Credit['status']) =>
    apiClient.patch<Credit>(`/credits/${id}/status`, { status }),

  delete: (id: string | number) =>
    apiClient.delete(`/credits/${id}`),
};

export const paymentsService = {
  getAll: (clientId?: string) =>
    apiClient.get<ScrapPayment[]>(`/payments${clientId ? `?clientId=${clientId}` : ''}`),

  create: (data: Partial<ScrapPayment>) => apiClient.post<ScrapPayment>('/payments', data),

  update: (id: string, data: Partial<ScrapPayment>) =>
    apiClient.put<ScrapPayment>(`/payments/${id}`, data),

  delete: (id: string) => apiClient.delete(`/payments/${id}`),
};
