import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface AuthUser {
  id: number
  email: string
}

interface AuthState {
  user: AuthUser | null
  token: string | null
  isLoading: boolean
}

interface AuthContextValue extends AuthState {
  login: (token: string, user: AuthUser) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const TOKEN_KEY = 'chatpm_token'
const USER_KEY  = 'chatpm_user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<AuthUser | null>(null)
  const [token, setToken]     = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Restore session from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY)
    const storedUser  = localStorage.getItem(USER_KEY)
    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser) as AuthUser)
      } catch {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  const clearChatData = () => {
    localStorage.removeItem('chatpm_sessions')
    localStorage.removeItem('chatpm_session_id')
    Object.keys(localStorage)
      .filter(k => k.startsWith('chatpm_msgs_'))
      .forEach(k => localStorage.removeItem(k))
  }

  const login = (newToken: string, newUser: AuthUser) => {
    // If a different user is logging in, wipe the previous user's chat data
    try {
      const prevUser = JSON.parse(localStorage.getItem(USER_KEY) || 'null') as AuthUser | null
      if (prevUser && prevUser.id !== newUser.id) clearChatData()
    } catch { /* ignore */ }

    localStorage.setItem(TOKEN_KEY, newToken)
    localStorage.setItem(USER_KEY, JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    clearChatData()
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
