import { createContext, useContext, useState, useCallback, type ReactNode, useEffect } from 'react'
import type { ScrapType } from '@/lib/types'
import { scrapsService } from '@/services/scraps.service'
import { handleApiError, showSuccess } from '@/lib/error-handler'

interface ScrapsContextType {
  scraps: ScrapType[]
  isLoading: boolean
  total: number
  refreshScraps: () => Promise<void>
  addScrap: (data: Partial<ScrapType>) => Promise<void>
  updateScrap: (id: string | number, data: Partial<ScrapType>) => Promise<void>
  deleteScrap: (id: string | number) => Promise<void>
}

const ScrapsContext = createContext<ScrapsContextType | undefined>(undefined)

export function ScrapsProvider({ children }: { children: ReactNode }) {
  const [scraps, setScraps] = useState<ScrapType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [total, setTotal] = useState(0)

  const refreshScraps = useCallback(async () => {
    // Only show global loading if we have no data yet
    if (scraps.length === 0) {
      setIsLoading(true)
    }
    try {
      const response = await scrapsService.getAll()
      setScraps(response.scraps)
      setTotal(response.total)
    } catch (error) {
      handleApiError(error)
    } finally {
      setIsLoading(false)
    }
  }, [scraps.length])

  useEffect(() => {
    refreshScraps()
  }, [refreshScraps])

  const addScrap = useCallback(async (data: Partial<ScrapType>) => {
    try {
      await scrapsService.create(data)
      showSuccess('Tipo de chatarra agregado correctamente')
      await refreshScraps()
    } catch (error) {
      handleApiError(error)
      throw error
    }
  }, [refreshScraps])

  const updateScrap = useCallback(async (id: string | number, data: Partial<ScrapType>) => {
    try {
      await scrapsService.update(id, data)
      showSuccess('Tipo de chatarra actualizado correctamente')
      await refreshScraps()
    } catch (error) {
      handleApiError(error)
      throw error
    }
  }, [refreshScraps])

  const deleteScrap = useCallback(async (id: string | number) => {
    try {
      await scrapsService.delete(id)
      showSuccess('Tipo de chatarra eliminado correctamente')
      await refreshScraps()
    } catch (error) {
      handleApiError(error)
      throw error
    }
  }, [refreshScraps])

  return (
    <ScrapsContext.Provider
      value={{
        scraps,
        isLoading,
        total,
        refreshScraps,
        addScrap,
        updateScrap,
        deleteScrap,
      }}
    >
      {children}
    </ScrapsContext.Provider>
  )
}

export function useScraps() {
  const context = useContext(ScrapsContext)
  if (context === undefined) {
    throw new Error('useScraps must be used within a ScrapsProvider')
  }
  return context
}
