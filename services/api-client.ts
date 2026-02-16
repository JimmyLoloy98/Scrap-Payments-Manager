import { API_CONFIG } from '@/lib/api-config';

class ApiError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;

  // En Next.js cliente, podemos obtener el token de localStorage o cookies
  // Por ahora asumo localStorage por simplicidad si no hay middleware de sesion complejo
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

  const headers = new Headers(options.headers);

  // Only set Content-Type to json if it's not FormData (browser sets boundary for FormData)
  // We check if the body in options is FormData, but body is passed in options.
  // Actually, the body handling happens in the helper methods below, but we need to know here.
  // The 'body' is passed into 'options' by the helper methods.
  const isFormData = options.body instanceof FormData;

  if (!isFormData) {
    headers.set('Content-Type', 'application/json');
  }
  headers.set('Accept', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const config: RequestInit = {
    cache: 'no-store', // Disable caching to ensure fresh data after mutations
    ...options,
    headers,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText };
    }

    // Si es un error de validación de Laravel (422), extraemos los detalles
    let finalMessage = errorData.message || 'Error en la petición';
    if (response.status === 422 && errorData.errors) {
      const firstError = Object.values(errorData.errors)[0] as string[];
      if (firstError && firstError.length > 0) {
        finalMessage = firstError[0];
      }
    }

    // Log error for debugging
    console.error(`API Error [${response.status}] ${url}:`, errorData);

    throw new ApiError(response.status, finalMessage, errorData);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body: any, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body)
    }),

  put: <T>(endpoint: string, body: any, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body)
    }),

  patch: <T>(endpoint: string, body: any, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body)
    }),

  delete: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};
