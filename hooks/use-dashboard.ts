'use client'

import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api-client'
import type { DashboardStats, Notification, JobMatch, LearningPath } from '@/types'

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => api.get<DashboardStats>('/dashboard/stats'),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useRecentNotifications(limit = 5) {
  return useQuery({
    queryKey: ['recentNotifications', limit],
    queryFn: () => api.get<Notification[]>('/notifications/recent', { limit }),
    staleTime: 60 * 1000, // 1 minute
  })
}

export function useTopJobMatches(limit = 5) {
  return useQuery({
    queryKey: ['topJobMatches', limit],
    queryFn: () => api.get<JobMatch[]>('/jobs/matches/top', { limit }),
    staleTime: 5 * 60 * 1000,
  })
}

export function useActiveLearningPath() {
  return useQuery({
    queryKey: ['activeLearningPath'],
    queryFn: () => api.get<LearningPath | null>('/learning-paths/active'),
    staleTime: 5 * 60 * 1000,
  })
}

export function useQuickActions() {
  return useQuery({
    queryKey: ['quickActions'],
    queryFn: () => api.get<{
      missingSkills: string[]
      pendingInterviews: number
      unreadNotifications: number
      resumeSuggestions: string[]
    }>('/dashboard/quick-actions'),
    staleTime: 5 * 60 * 1000,
  })
}

export function useCareerInsights() {
  return useQuery({
    queryKey: ['careerInsights'],
    queryFn: () => api.get<{
      insights: { title: string; description: string; type: 'tip' | 'warning' | 'success' }[]
      trendingSkills: string[]
      recommendedActions: string[]
    }>('/dashboard/insights'),
    staleTime: 30 * 60 * 1000, // 30 minutes
  })
}
