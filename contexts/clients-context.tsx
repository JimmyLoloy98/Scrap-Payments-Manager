'use client'

import { createContext, useContext, useState, useCallback, type ReactNode, useEffect } from 'react'
import type { Client } from '@/lib/types'
import { clientsService } from '@/services/clients.service'
import { handleApiError, showSuccess } from '@/lib/error-handler'

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
    // Only show loading if we really have no data
    if (clients.length === 0) {
      setIsLoading(true)
    }
    try {
      const response = await clientsService.getAll(1, 100)
      if (response && response.clients) {
        setClients(response.clients)
        setTotal(response.total)
      } else if (Array.isArray(response)) {
        setClients(response)
        setTotal(response.length)
      }
    } catch (error) {
      handleApiError(error)
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
      showSuccess('Negocio registrado correctamente')
      await refreshClients()
    } catch (error) {
      handleApiError(error)
      throw error
    }
  }, [refreshClients])

  const updateClient = useCallback(async (id: string | number, data: Partial<Client>) => {
    try {
      await clientsService.update(String(id), data)
      showSuccess('Negocio actualizado correctamente')
      await refreshClients()
    } catch (error) {
      handleApiError(error)
      throw error
    }
  }, [refreshClients])

  const deleteClient = useCallback(async (id: string | number) => {
    try {
      await clientsService.delete(String(id))
      showSuccess('Negocio eliminado correctamente')
      await refreshClients()
    } catch (error) {
      handleApiError(error)
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
