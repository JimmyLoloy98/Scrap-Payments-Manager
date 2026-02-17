import { apiClient } from './api-client';
import { Client, ClientsResponse } from '@/lib/types';

export const clientsService = {
  getAll: (page = 1, limit = 10, search?: string) => {
    let url = `/clients?page=${page}&limit=${limit}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    return apiClient.get<ClientsResponse>(url);
  },

  getById: (id: string | number) =>
    apiClient.get<Client>(`/clients/${id}`),

  getSummary: (id: string | number) =>
    apiClient.get<any>(`/clients/${id}/summary`),

  create: (data: Partial<Client>) =>
    apiClient.post<Client>('/clients', data),

  update: (id: string | number, data: any) => {
    if (data instanceof FormData) {
      // Laravel/PHP doesn't handle multipart/form-data with PUT natively
      // So we use POST with _method spoofing
      data.append('_method', 'PUT');
      return apiClient.post<Client>(`/clients/${id}`, data);
    }
    return apiClient.put<Client>(`/clients/${id}`, data);
  },

  uploadPhoto: (id: string | number, photo: File) => {
    const formData = new FormData();
    formData.append('photo', photo);
    return apiClient.post<Client>(`/clients/${id}/upload-photo`, formData);
  },

  deletePhoto: (id: string | number) =>
    apiClient.delete(`/clients/${id}/photo`),

  delete: (id: string | number) =>
    apiClient.delete(`/clients/${id}`),
};
