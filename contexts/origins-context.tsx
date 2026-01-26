import { createContext, useContext, useState, useCallback, type ReactNode, useEffect } from 'react'
import type { Origin } from '@/lib/types'
import { originsService } from '@/services/origins.service'

interface OriginsContextType {
  origins: Origin[]
  isLoading: boolean
  total: number
  refreshOrigins: () => Promise<void>
  addOrigin: (data: Partial<Origin>) => Promise<void>
  updateOrigin: (id: string | number, data: Partial<Origin>) => Promise<void>
  deleteOrigin: (id: string | number) => Promise<void>
  getOriginNames: () => string[]
}

const OriginsContext = createContext<OriginsContextType | undefined>(undefined)

export function OriginsProvider({ children }: { children: ReactNode }) {
  const [origins, setOrigins] = useState<Origin[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [total, setTotal] = useState(0)

  const refreshOrigins = useCallback(async () => {
    // Only show global loading if we have no data yet
    if (origins.length === 0) {
      setIsLoading(true)
    }
    try {
      const response = await originsService.getAll()
      setOrigins(response.origins)
      setTotal(response.total)
    } catch (error) {
      console.error('Error fetching origins:', error)
    } finally {
      setIsLoading(false)
    }
  }, [origins.length])

  useEffect(() => {
    refreshOrigins()
  }, [refreshOrigins])

  const addOrigin = useCallback(async (data: Partial<Origin>) => {
    try {
      await originsService.create(data)
      await refreshOrigins()
    } catch (error) {
      console.error('Error adding origin:', error)
      throw error
    }
  }, [refreshOrigins])

  const updateOrigin = useCallback(async (id: string | number, data: Partial<Origin>) => {
    try {
      await originsService.update(id, data)
      await refreshOrigins()
    } catch (error) {
      console.error('Error updating origin:', error)
      throw error
    }
  }, [refreshOrigins])

  const deleteOrigin = useCallback(async (id: string | number) => {
    try {
      await originsService.delete(id)
      await refreshOrigins()
    } catch (error) {
      console.error('Error deleting origin:', error)
      throw error
    }
  }, [refreshOrigins])

  const getOriginNames = useCallback(() => {
    return origins.map((origin) => origin.name)
  }, [origins])

  return (
    <OriginsContext.Provider
      value={{
        origins,
        isLoading,
        total,
        refreshOrigins,
        addOrigin,
        updateOrigin,
        deleteOrigin,
        getOriginNames,
      }}
    >
      {children}
    </OriginsContext.Provider>
  )
}

export function useOrigins() {
  const context = useContext(OriginsContext)
  if (context === undefined) {
    throw new Error('useOrigins must be used within an OriginsProvider')
  }
  return context
}
