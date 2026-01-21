'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { ScrapType } from '@/lib/types'
import { mockScrapTypes } from '@/lib/mock-data'

interface ScrapsContextType {
  scraps: ScrapType[]
  addScrap: (data: Partial<ScrapType>) => Promise<void>
  updateScrap: (id: string, data: Partial<ScrapType>) => Promise<void>
  deleteScrap: (id: string) => Promise<void>
}

const ScrapsContext = createContext<ScrapsContextType | undefined>(undefined)

export function ScrapsProvider({ children }: { children: ReactNode }) {
  const [scraps, setScraps] = useState<ScrapType[]>(mockScrapTypes)

  const addScrap = useCallback(async (data: Partial<ScrapType>) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newScrap: ScrapType = {
      id: String(Date.now()),
      companyId: 'company-1',
      name: data.name || '',
      description: data.description || '',
      // pricePerUnit: data.pricePerUnit || 0,
      // unit: data.unit || 'kg',
      createdAt: new Date(),
    }
    setScraps((prev) => [...prev, newScrap])
  }, [])

  const updateScrap = useCallback(async (id: string, data: Partial<ScrapType>) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    setScraps((prev) =>
      prev.map((scrap) => (scrap.id === id ? { ...scrap, ...data } : scrap))
    )
  }, [])

  const deleteScrap = useCallback(async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    setScraps((prev) => prev.filter((scrap) => scrap.id !== id))
  }, [])

  return (
    <ScrapsContext.Provider
      value={{
        scraps,
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
