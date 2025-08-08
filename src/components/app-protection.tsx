'use client'

import { useAuth } from '@/contexts/auth-context'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

interface AppProtectionProps {
  children: React.ReactNode
}

export function AppProtection({ children }: AppProtectionProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // List of public routes that don't require authentication
  const publicRoutes = ['/login', '/login/', '/']

  useEffect(() => {
    // Skip protection for public routes
    if (publicRoutes.includes(pathname)) {
      return
    }

    // If not loading and no user, redirect to login
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router, pathname])

  // For public routes, always render children
  if (publicRoutes.includes(pathname)) {
    return <>{children}</>
  }

  // For protected routes, render children immediately
  // Authentication will be handled in the background
  return <>{children}</>
} 