export const API_CONFIG = {
  BASE_URL: (process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000').replace(/\/$/, '') + '/api/v1',
  TIMEOUT: 10000,
}
