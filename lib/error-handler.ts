import { toast } from 'sonner'

/**
 * Helper reutilizable para manejar errores de API y mostrarlos en un Toaster.
 * Sigue el principio DRY para evitar repetir la configuración del toast en cada vista.
 */
export function handleApiError(error: any) {
  // Extraemos el mensaje principal (generalmente el filtrado por api-client)
  const message = error.message || 'Ocurrió un error inesperado'

  // Extraemos detalles adicionales si existen (ej: validaciones de Laravel)
  const detail = error.data?.message || null

  toast.error(message, {
    description: detail !== message ? detail : null,
    duration: 5000,
  })

  // Retornamos el mensaje por si el componente también quiere usarlo localmente
  return message
}

/**
 * Éxito reutilizable para estandarizar las notificaciones positivas
 */
export function showSuccess(message: string) {
  toast.success(message, {
    duration: 3000,
  })
}
