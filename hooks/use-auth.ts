'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/auth-service'
import { useAuthStore } from '@/store/auth-store'
import type { LoginCredentials, RegisterData } from '@/types'
import { toast } from 'sonner'

export function useAuth() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user, isAuthenticated, login: setAuth, logout: clearAuth, setLoading } = useAuthStore()

  const { isLoading: isLoadingUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        const user = await authService.getCurrentUser()
        setAuth(user, useAuthStore.getState().tokens!)
        return user
      } catch {
        clearAuth()
        return null
      }
    },
    enabled: isAuthenticated && !user,
    retry: false,
  })

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      setAuth(data.user, data.tokens)
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
      toast.success('Welcome back!')
      
      // Redirect based on onboarding status
      if (!data.user.onboardingCompleted) {
        router.push('/onboarding')
      } else {
        router.push('/dashboard')
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to login')
    },
  })

  const registerMutation = useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: (data) => {
      setAuth(data.user, data.tokens)
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
      toast.success('Account created successfully!')
      router.push('/onboarding')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create account')
    },
  })

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      clearAuth()
      queryClient.clear()
      router.push('/auth/login')
      toast.success('Logged out successfully')
    },
    onError: () => {
      // Still clear local state even if API call fails
      clearAuth()
      queryClient.clear()
      router.push('/auth/login')
    },
  })

  const forgotPasswordMutation = useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
    onSuccess: () => {
      toast.success('Password reset email sent. Check your inbox.')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to send reset email')
    },
  })

  const resetPasswordMutation = useMutation({
    mutationFn: authService.resetPassword,
    onSuccess: () => {
      toast.success('Password reset successfully. Please login.')
      router.push('/auth/login')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to reset password')
    },
  })

  const verifyEmailMutation = useMutation({
    mutationFn: authService.verifyEmail,
    onSuccess: () => {
      toast.success('Email verified successfully!')
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to verify email')
    },
  })

  return {
    user,
    isAuthenticated,
    isLoading: isLoadingUser,
    
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
    
    forgotPassword: forgotPasswordMutation.mutate,
    isSendingResetEmail: forgotPasswordMutation.isPending,
    
    resetPassword: resetPasswordMutation.mutate,
    isResettingPassword: resetPasswordMutation.isPending,
    
    verifyEmail: verifyEmailMutation.mutate,
    isVerifyingEmail: verifyEmailMutation.isPending,
  }
}
