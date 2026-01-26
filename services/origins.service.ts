import { apiClient } from './api-client';
import { Origin } from '@/lib/types';

export const originsService = {
  getAll: () => apiClient.get<Origin[]>('/origins'),

  create: (data: Partial<Origin>) => apiClient.post<Origin>('/origins', data),

  update: (id: string, data: Partial<Origin>) => apiClient.put<Origin>(`/origins/${id}`, data),

  delete: (id: string) => apiClient.delete(`/origins/${id}`),
};
