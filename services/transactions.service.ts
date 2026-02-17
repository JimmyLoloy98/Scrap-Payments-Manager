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

  getByClient: (clientId: string | number, params: { page?: number, limit?: number } = {}) => {
    const query = new URLSearchParams()
    if (params.page) query.append('page', String(params.page))
    if (params.limit) query.append('limit', String(params.limit))
    return apiClient.get<import('@/lib/types').CreditsResponse>(`/clients/${clientId}/credits?${query.toString()}`)
  },

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
  getAll: (params: { clientId?: string | number, page?: number, limit?: number } = {}) => {
    const query = new URLSearchParams()
    if (params.clientId) query.append('clientId', String(params.clientId))
    if (params.page) query.append('page', String(params.page))
    if (params.limit) query.append('limit', String(params.limit))
    return apiClient.get<import('@/lib/types').PaymentsResponse>(`/payments?${query.toString()}`)
  },

  getById: (id: string | number) =>
    apiClient.get<ScrapPayment>(`/payments/${id}`),

  getByClient: (clientId: string | number, params: { page?: number, limit?: number } = {}) => {
    const query = new URLSearchParams()
    if (params.page) query.append('page', String(params.page))
    if (params.limit) query.append('limit', String(params.limit))
    return apiClient.get<import('@/lib/types').PaymentsResponse>(`/clients/${clientId}/payments?${query.toString()}`)
  },

  create: (data: Partial<ScrapPayment>) =>
    apiClient.post<ScrapPayment>('/payments', data),

  update: (id: string | number, data: Partial<ScrapPayment>) =>
    apiClient.put<ScrapPayment>(`/payments/${id}`, data),

  delete: (id: string | number) =>
    apiClient.delete(`/payments/${id}`),
};
