import { apiClient } from './api-client';
import { Origin, OriginsResponse } from '@/lib/types';

export const originsService = {
  getAll: (page = 1, limit = 10) =>
    apiClient.get<OriginsResponse>(`/origins?page=${page}&limit=${limit}`),

  create: (data: Partial<Origin>) =>
    apiClient.post<Origin>('/origins', data),

  update: (id: string | number, data: Partial<Origin>) =>
    apiClient.patch<Origin>(`/origins/${id}`, data),

  delete: (id: string | number) =>
    apiClient.delete(`/origins/${id}`),
};
