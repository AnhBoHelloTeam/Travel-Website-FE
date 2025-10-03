import React from 'react'
import axios from 'axios'

export type AuthUser = {
  _id: string
  email: string
  role: 'customer' | 'business' | 'admin'
  profile?: {
    firstName?: string
    lastName?: string
    phone?: string
    address?: string
  }
}

type AuthState = {
  user: AuthUser | null
  accessToken: string | null
}

type AuthContextType = AuthState & {
  login: (email: string, password: string) => Promise<void>
  register: (payload: any) => Promise<void>
  logout: () => void
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = 'travel_auth'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = React.useState<AuthState>(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { user: null, accessToken: null }
    try {
      return JSON.parse(raw)
    } catch {
      return { user: null, accessToken: null }
    }
  })

  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

  const persist = (next: AuthState) => {
    setState(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }

  const login = async (email: string, password: string) => {
    const res = await axios.post(`${apiBase}/api/auth/login`, { email, password })
    const { user, accessToken } = res.data.data
    persist({ user, accessToken })
  }

  const register = async (payload: any) => {
    const res = await axios.post(`${apiBase}/api/auth/register`, payload)
    const { user, accessToken } = res.data.data
    persist({ user, accessToken })
  }

  const logout = () => {
    persist({ user: null, accessToken: null })
  }

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

