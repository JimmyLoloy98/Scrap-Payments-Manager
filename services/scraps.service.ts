import { apiClient } from './api-client';
import { ScrapType } from '@/lib/types';

export const scrapsService = {
  getAll: () => apiClient.get<ScrapType[]>('/scrap-types'),

  create: (data: Partial<ScrapType>) => apiClient.post<ScrapType>('/scrap-types', data),

  update: (id: string, data: Partial<ScrapType>) => apiClient.put<ScrapType>(`/scrap-types/${id}`, data),

  delete: (id: string) => apiClient.delete(`/scrap-types/${id}`),
};
