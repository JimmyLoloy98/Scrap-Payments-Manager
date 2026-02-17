'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { User } from '@/lib/types'

import { authService } from '@/services'
import { useEffect } from 'react'
import { handleApiError, showSuccess } from '@/lib/error-handler'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Persist session on load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token')
      const storedUser = localStorage.getItem('auth_user')

      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch (err) {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('auth_user')
        }
      }
      setIsLoading(false)
    }
    checkAuth()
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await authService.login({ email, password })

      if (response && response.token) {
        localStorage.setItem('auth_token', response.token)
        localStorage.setItem('auth_user', JSON.stringify(response.user))
        setUser(response.user)
        showSuccess(`Bienvenido de nuevo, ${response.user.name}`)
        setIsLoading(false)
        return true
      }
      throw new Error('No se recibió el token de autenticación')
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión')
      setIsLoading(false)
      return false
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
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
