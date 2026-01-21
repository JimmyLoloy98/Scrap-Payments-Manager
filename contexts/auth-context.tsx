'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { User } from '@/lib/types'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user for demonstration
const mockUser: User = {
  id: 'user-1',
  email: 'admin@scrapflow.com',
  name: 'John Admin',
  companyId: 'company-1',
  company: {
    id: 'company-1',
    name: 'Metro Scrap Solutions',
    createdAt: new Date('2023-01-01'),
  },
  avatar: undefined,
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock authentication - accept any email/password for demo
    if (email && password) {
      setUser({
        ...mockUser,
        email,
        name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      })
      setIsLoading(false)
      return true
    }
    
    setIsLoading(false)
    return false
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
