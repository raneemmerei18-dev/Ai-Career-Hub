import { api, setTokens } from '@/lib/api-client'
import type { User, AuthTokens, LoginCredentials, RegisterData } from '@/types'

export interface AuthResponse {
  user: User
  tokens: AuthTokens
}

export interface ForgotPasswordResponse {
  message: string
}

export interface ResetPasswordData {
  token: string
  password: string
  confirmPassword: string
}

export interface VerifyEmailData {
  token: string
}

export type SocialProvider = 'google' | 'github' | 'linkedin'

export interface SocialLoginResponse {
  url: string
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials)
    setTokens(response.tokens.accessToken, response.tokens.refreshToken)
    return response
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data)
    setTokens(response.tokens.accessToken, response.tokens.refreshToken)
    return response
  },

  async socialLogin(provider: SocialProvider): Promise<SocialLoginResponse> {
    try {
      return await api.post<SocialLoginResponse>('/auth/social-login', { provider })
    } catch {
      throw new Error('Social login is not configured on the backend yet. Please use email/password login for now.')
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout')
    } finally {
      setTokens(null, null)
    }
  },

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    const response = await api.post<AuthTokens>('/auth/refresh', { refreshToken })
    setTokens(response.accessToken, response.refreshToken)
    return response
  },

  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    return api.post<ForgotPasswordResponse>('/auth/forgot-password', { email })
  },

  async resetPassword(data: ResetPasswordData): Promise<void> {
    return api.post('/auth/reset-password', data)
  },

  async verifyEmail(data: VerifyEmailData): Promise<void> {
    return api.post('/auth/verify-email', data)
  },

  async resendVerificationEmail(): Promise<ForgotPasswordResponse> {
    return api.post<ForgotPasswordResponse>('/auth/resend-verification')
  },

  async getCurrentUser(): Promise<User> {
    return api.get<User>('/auth/me')
  },

  async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    return api.post('/auth/change-password', { currentPassword, newPassword })
  },
}
