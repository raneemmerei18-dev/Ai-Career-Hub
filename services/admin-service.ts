import { api } from '@/lib/api-client'
import type { AdminUser, AuditLog, SystemMetrics, PaginatedResponse, Subscription } from '@/types'

export interface UserFilters {
  search?: string
  role?: 'user' | 'admin'
  subscriptionStatus?: string
  page?: number
  pageSize?: number
}

export interface AuditLogFilters {
  userId?: string
  action?: string
  resourceType?: string
  startDate?: string
  endDate?: string
  page?: number
  pageSize?: number
}

export const adminService = {
  // System Metrics
  async getSystemMetrics(): Promise<SystemMetrics> {
    return api.get<SystemMetrics>('/admin/metrics')
  },

  async getDetailedMetrics(period: 'day' | 'week' | 'month' | 'year'): Promise<{
    users: { date: string; count: number }[]
    resumes: { date: string; count: number }[]
    applications: { date: string; count: number }[]
    aiRequests: { date: string; count: number }[]
  }> {
    return api.get('/admin/metrics/detailed', { period })
  },

  // User Management
  async getUsers(filters?: UserFilters): Promise<PaginatedResponse<AdminUser>> {
    return api.get<PaginatedResponse<AdminUser>>('/admin/users', filters)
  },

  async getUser(id: string): Promise<AdminUser> {
    return api.get<AdminUser>(`/admin/users/${id}`)
  },

  async updateUser(id: string, data: Partial<AdminUser>): Promise<AdminUser> {
    return api.patch<AdminUser>(`/admin/users/${id}`, data)
  },

  async updateUserRole(id: string, role: 'user' | 'admin'): Promise<AdminUser> {
    return api.patch<AdminUser>(`/admin/users/${id}/role`, { role })
  },

  async suspendUser(id: string, reason: string): Promise<AdminUser> {
    return api.post<AdminUser>(`/admin/users/${id}/suspend`, { reason })
  },

  async unsuspendUser(id: string): Promise<AdminUser> {
    return api.post<AdminUser>(`/admin/users/${id}/unsuspend`)
  },

  async deleteUser(id: string): Promise<void> {
    return api.delete(`/admin/users/${id}`)
  },

  async impersonateUser(id: string): Promise<{ token: string }> {
    return api.post<{ token: string }>(`/admin/users/${id}/impersonate`)
  },

  // Subscription Management
  async getSubscriptions(filters?: {
    status?: string
    plan?: string
    page?: number
    pageSize?: number
  }): Promise<PaginatedResponse<Subscription & { user: AdminUser }>> {
    return api.get('/admin/subscriptions', filters)
  },

  async updateSubscription(userId: string, data: Partial<Subscription>): Promise<Subscription> {
    return api.patch<Subscription>(`/admin/subscriptions/${userId}`, data)
  },

  async grantTrialExtension(userId: string, days: number): Promise<Subscription> {
    return api.post<Subscription>(`/admin/subscriptions/${userId}/extend-trial`, { days })
  },

  // AI Usage Tracking
  async getAIUsage(filters?: {
    userId?: string
    provider?: string
    startDate?: string
    endDate?: string
    page?: number
    pageSize?: number
  }): Promise<PaginatedResponse<{
    id: string
    userId: string
    provider: string
    model: string
    tokens: number
    cost: number
    endpoint: string
    createdAt: string
  }>> {
    return api.get('/admin/ai-usage', filters)
  },

  async getAIUsageSummary(period: 'day' | 'week' | 'month'): Promise<{
    totalRequests: number
    totalTokens: number
    totalCost: number
    byProvider: { provider: string; requests: number; tokens: number; cost: number }[]
    byEndpoint: { endpoint: string; requests: number }[]
  }> {
    return api.get('/admin/ai-usage/summary', { period })
  },

  // Audit Logs
  async getAuditLogs(filters?: AuditLogFilters): Promise<PaginatedResponse<AuditLog>> {
    return api.get<PaginatedResponse<AuditLog>>('/admin/audit-logs', filters)
  },

  async getAuditLog(id: string): Promise<AuditLog> {
    return api.get<AuditLog>(`/admin/audit-logs/${id}`)
  },

  // Content Moderation
  async getFlaggedContent(page?: number, pageSize?: number): Promise<PaginatedResponse<{
    id: string
    type: 'resume' | 'cover_letter' | 'profile'
    userId: string
    reason: string
    content: string
    status: 'pending' | 'approved' | 'rejected'
    createdAt: string
  }>> {
    return api.get('/admin/moderation/flagged', { page, pageSize })
  },

  async approveContent(id: string): Promise<void> {
    return api.post(`/admin/moderation/${id}/approve`)
  },

  async rejectContent(id: string, reason: string): Promise<void> {
    return api.post(`/admin/moderation/${id}/reject`, { reason })
  },

  // System Monitoring
  async getSystemHealth(): Promise<{
    status: 'healthy' | 'degraded' | 'down'
    services: { name: string; status: 'up' | 'down'; latency: number }[]
    uptime: number
    lastChecked: string
  }> {
    return api.get('/admin/health')
  },

  async getQueueStatus(): Promise<{
    queues: { name: string; pending: number; processing: number; failed: number }[]
  }> {
    return api.get('/admin/queues')
  },

  async retryFailedJobs(queueName: string): Promise<{ retried: number }> {
    return api.post(`/admin/queues/${queueName}/retry`)
  },
}
