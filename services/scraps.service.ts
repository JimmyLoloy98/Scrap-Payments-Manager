import { apiClient } from './api-client';
import { ScrapType, ScrapsResponse } from '@/lib/types';

export const scrapsService = {
  getAll: (page = 1, limit = 10, unitMeasure?: string, search?: string) => {
    let url = `/scraps?page=${page}&limit=${limit}`;
    if (unitMeasure && unitMeasure !== 'all') {
      url += `&unitMeasure=${unitMeasure}`;
    }
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    return apiClient.get<ScrapsResponse>(url);
  },

  create: (data: Partial<ScrapType>) =>
    apiClient.post<ScrapType>('/scraps', data),

  update: (id: string | number, data: Partial<ScrapType>) =>
    apiClient.put<ScrapType>(`/scraps/${id}`, data),

  delete: (id: string | number) =>
    apiClient.delete(`/scraps/${id}`),
};
