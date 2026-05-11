import { api } from '@/lib/api-client'
import type { Notification, PaginatedResponse } from '@/types'

export const notificationService = {
  async getNotifications(params?: {
    unreadOnly?: boolean
    page?: number
    pageSize?: number
  }): Promise<PaginatedResponse<Notification>> {
    return api.get<PaginatedResponse<Notification>>('/notifications', params)
  },

  async getUnreadCount(): Promise<{ count: number }> {
    return api.get<{ count: number }>('/notifications/unread-count')
  },

  async markAsRead(id: string): Promise<Notification> {
    return api.patch<Notification>(`/notifications/${id}/read`)
  },

  async markAllAsRead(): Promise<void> {
    return api.post('/notifications/mark-all-read')
  },

  async deleteNotification(id: string): Promise<void> {
    return api.delete(`/notifications/${id}`)
  },

  async deleteAllRead(): Promise<void> {
    return api.delete('/notifications/read')
  },

  // Notification Preferences
  async getPreferences(): Promise<{
    email: boolean
    push: boolean
    jobAlerts: boolean
    interviewReminders: boolean
    learningReminders: boolean
    systemUpdates: boolean
  }> {
    return api.get('/notifications/preferences')
  },

  async updatePreferences(preferences: Partial<{
    email: boolean
    push: boolean
    jobAlerts: boolean
    interviewReminders: boolean
    learningReminders: boolean
    systemUpdates: boolean
  }>): Promise<void> {
    return api.patch('/notifications/preferences', preferences)
  },
}
