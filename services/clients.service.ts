import { apiClient } from './api-client';
import { Client } from '@/lib/types';

export const clientsService = {
  getAll: () => apiClient.get<Client[]>('/clients'),

  getById: (id: string) => apiClient.get<Client>(`/clients/${id}`),

  create: (data: Partial<Client>) => apiClient.post<Client>('/clients', data),

  update: (id: string, data: Partial<Client>) => apiClient.put<Client>(`/clients/${id}`, data),

  delete: (id: string) => apiClient.delete(`/clients/${id}`),
};
