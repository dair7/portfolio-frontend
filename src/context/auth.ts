import { createContext } from 'react'
import type { AuthResponse } from '../types'

export interface AuthContextType {
  user: AuthResponse | null
  token: string | null
  login: (data: AuthResponse) => void
  logout: () => void
  isAdmin: boolean
}

export const AuthContext = createContext<AuthContextType | null>(null)
