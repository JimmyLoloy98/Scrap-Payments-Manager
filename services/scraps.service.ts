import { apiClient } from './api-client';
import { ScrapType, ScrapsResponse } from '@/lib/types';

export const scrapsService = {
  getAll: (page = 1, limit = 10) =>
    apiClient.get<ScrapsResponse>(`/scraps?page=${page}&limit=${limit}`),

  create: (data: Partial<ScrapType>) =>
    apiClient.post<ScrapType>('/scraps', data),

  update: (id: string | number, data: Partial<ScrapType>) =>
    apiClient.put<ScrapType>(`/scraps/${id}`, data),

  delete: (id: string | number) =>
    apiClient.delete(`/scraps/${id}`),
};
