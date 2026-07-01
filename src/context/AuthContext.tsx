import type { Session, User } from '@supabase/supabase-js'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../services/supabase'

type AuthContextValue = {
  user: User | null
  session: Session | null
  isLoading: boolean
  isConfigured: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

type AuthProviderProps = {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setIsLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession)
    })

    return () => subscription.unsubscribe()
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      isLoading,
      isConfigured: isSupabaseConfigured,
      async signIn(email, password) {
        if (!isSupabaseConfigured) {
          throw new Error('Supabase is not configured yet. Add your keys to .env first.')
        }

        const { error } = await supabase.auth.signInWithPassword({ email, password })

        if (error) {
          throw error
        }
      },
      async signUp(email, password) {
        if (!isSupabaseConfigured) {
          throw new Error('Supabase is not configured yet. Add your keys to .env first.')
        }

        const { error } = await supabase.auth.signUp({ email, password })

        if (error) {
          throw error
        }
      },
      async signOut() {
        if (!isSupabaseConfigured) {
          setSession(null)
          return
        }

        const { error } = await supabase.auth.signOut()

        if (error) {
          throw error
        }
      },
    }),
    [isLoading, session],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
