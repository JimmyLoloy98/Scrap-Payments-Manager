'use client'

import { createContext, useContext, useState, useCallback, type ReactNode, useEffect } from 'react'
import type { Client } from '@/lib/types'
import { clientsService } from '@/services/clients.service'

interface ClientsContextType {
  clients: Client[]
  isLoading: boolean
  total: number
  refreshClients: () => Promise<void>
  addClient: (data: Partial<Client>) => Promise<void>
  updateClient: (id: string | number, data: Partial<Client>) => Promise<void>
  deleteClient: (id: string | number) => Promise<void>
  getClientById: (id: string | number) => Promise<Client | null>
}

const ClientsContext = createContext<ClientsContextType | undefined>(undefined)

export function ClientsProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [total, setTotal] = useState(0)

  const refreshClients = useCallback(async () => {
    if (clients.length === 0) {
      setIsLoading(true)
    }
    try {
      const response = await clientsService.getAll()
      // ... same logic as before but with the loading optimization
      if (Array.isArray(response)) {
        setClients(response)
        setTotal(response.length)
      } else if (response && (response as any).data) {
        setClients((response as any).data)
        setTotal((response as any).total || (response as any).data.length)
      } else {
        const data = (response as any).clients || response
        setClients(Array.isArray(data) ? data : [])
        setTotal((response as any).total || (Array.isArray(data) ? data.length : 0))
      }
    } catch (error) {
      console.error('Error fetching clients:', error)
    } finally {
      setIsLoading(false)
    }
  }, [clients.length])

  useEffect(() => {
    refreshClients()
  }, [refreshClients])

  const addClient = useCallback(async (data: Partial<Client>) => {
    try {
      await clientsService.create(data)
      await refreshClients()
    } catch (error) {
      console.error('Error adding client:', error)
      throw error
    }
  }, [refreshClients])

  const updateClient = useCallback(async (id: string | number, data: Partial<Client>) => {
    try {
      await clientsService.update(String(id), data)
      await refreshClients()
    } catch (error) {
      console.error('Error updating client:', error)
      throw error
    }
  }, [refreshClients])

  const deleteClient = useCallback(async (id: string | number) => {
    try {
      await clientsService.delete(String(id))
      await refreshClients()
    } catch (error) {
      console.error('Error deleting client:', error)
      throw error
    }
  }, [refreshClients])

  const getClientById = useCallback(async (id: string | number) => {
    try {
      return await clientsService.getById(String(id))
    } catch (error) {
      console.error('Error fetching client by id:', error)
      return null
    }
  }, [])

  return (
    <ClientsContext.Provider
      value={{
        clients,
        isLoading,
        total,
        refreshClients,
        addClient,
        updateClient,
        deleteClient,
        getClientById,
      }}
    >
      {children}
    </ClientsContext.Provider>
  )
}

export function useClients() {
  const context = useContext(ClientsContext)
  if (context === undefined) {
    throw new Error('useClients must be used within a ClientsProvider')
  }
  return context
}
