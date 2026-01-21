'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Origin } from '@/lib/types'
import { mockOrigins } from '@/lib/mock-data'

interface OriginsContextType {
  origins: Origin[]
  addOrigin: (data: Partial<Origin>) => Promise<void>
  updateOrigin: (id: string, data: Partial<Origin>) => Promise<void>
  deleteOrigin: (id: string) => Promise<void>
  getOriginNames: () => string[]
}

const OriginsContext = createContext<OriginsContextType | undefined>(undefined)

export function OriginsProvider({ children }: { children: ReactNode }) {
  const [origins, setOrigins] = useState<Origin[]>(mockOrigins)

  const addOrigin = useCallback(async (data: Partial<Origin>) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newOrigin: Origin = {
      id: String(Date.now()),
      companyId: 'company-1',
      name: data.name || '',
      description: data.description || '',
      createdAt: new Date(),
    }
    setOrigins((prev) => [...prev, newOrigin])
  }, [])

  const updateOrigin = useCallback(async (id: string, data: Partial<Origin>) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    setOrigins((prev) =>
      prev.map((origin) => (origin.id === id ? { ...origin, ...data } : origin))
    )
  }, [])

  const deleteOrigin = useCallback(async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    setOrigins((prev) => prev.filter((origin) => origin.id !== id))
  }, [])

  const getOriginNames = useCallback(() => {
    return origins.map((origin) => origin.name)
  }, [origins])

  return (
    <OriginsContext.Provider
      value={{
        origins,
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
