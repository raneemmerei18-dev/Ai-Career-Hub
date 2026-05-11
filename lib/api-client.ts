import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import type { ApiError, ApiResponse } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Token management
let accessToken: string | null = null
let refreshToken: string | null = null

export const setTokens = (access: string | null, refresh: string | null) => {
  accessToken = access
  refreshToken = refresh
}

export const getAccessToken = () => accessToken
export const getRefreshToken = () => refreshToken

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // If accessToken is null (e.g. after refresh), try to get it from localStorage
    if (!accessToken && typeof window !== 'undefined') {
      try {
        const authStorage = localStorage.getItem('ai-career-hub-auth')
        if (authStorage) {
          const parsed = JSON.parse(authStorage)
          const tokens = parsed.state?.tokens
          if (tokens?.accessToken) {
            accessToken = tokens.accessToken
            refreshToken = tokens.refreshToken
          }
        }
      } catch (e) {
        console.error('Failed to parse auth tokens from localStorage', e)
      }
    }

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor with token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Handle token refresh on 401
    if (error.response?.status === 401 && !originalRequest._retry && refreshToken) {
      originalRequest._retry = true

      try {
        const response = await axios.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken }
        )

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data
        setTokens(newAccessToken, newRefreshToken)

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        setTokens(null, null)
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login'
        }
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient

// Generic API methods
export const api = {
  get: async <T>(url: string, params?: Record<string, unknown>): Promise<T> => {
    const response = await apiClient.get<ApiResponse<T>>(url, { params })
    return response.data.data
  },

  post: async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await apiClient.post<ApiResponse<T>>(url, data)
    return response.data.data
  },

  put: async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await apiClient.put<ApiResponse<T>>(url, data)
    return response.data.data
  },

  patch: async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await apiClient.patch<ApiResponse<T>>(url, data)
    return response.data.data
  },

  delete: async <T>(url: string): Promise<T> => {
    const response = await apiClient.delete<ApiResponse<T>>(url)
    return response.data.data
  },
}
