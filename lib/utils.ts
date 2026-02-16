import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat('es-PE', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(value)
}

export function getAssetUrl(path?: string | null) {
  if (!path) return ''
  if (path.startsWith('http')) return path

  const baseUrl = (process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:8000')
    .replace(/\/$/, '')
    .replace(/\/api\/v\d+$/, '') // elimina /api/v1 si existe

  const cleanPath = path.replace(/^\/?(storage\/)?/, '')

  return `${baseUrl}/storage/${cleanPath}`
}