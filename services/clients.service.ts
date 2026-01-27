import { apiClient } from './api-client';
import { Client, ClientsResponse } from '@/lib/types';

export const clientsService = {
  getAll: (page = 1, limit = 10) =>
    apiClient.get<ClientsResponse>(`/clients?page=${page}&limit=${limit}`),

  getById: (id: string | number) =>
    apiClient.get<Client>(`/clients/${id}`),

  getSummary: (id: string | number) =>
    apiClient.get<any>(`/clients/${id}/summary`),

  create: (data: Partial<Client>) =>
    apiClient.post<Client>('/clients', data),

  update: (id: string | number, data: Partial<Client>) =>
    apiClient.put<Client>(`/clients/${id}`, data),

  delete: (id: string | number) =>
    apiClient.delete(`/clients/${id}`),
};
