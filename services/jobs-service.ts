import { api } from '@/lib/api-client'
import type { Job, JobMatch, PaginatedResponse } from '@/types'

export interface JobSearchParams {
  query?: string
  location?: string
  remote?: boolean
  employmentType?: string
  salaryMin?: number
  salaryMax?: number
  page?: number
  pageSize?: number
  sortBy?: 'relevance' | 'date' | 'salary'
}

export interface JobMatchFilters {
  status?: JobMatch['status']
  minScore?: number
  page?: number
  pageSize?: number
}

export const jobsService = {
  // Job Search
  async searchJobs(params: JobSearchParams): Promise<PaginatedResponse<Job>> {
    return api.get<PaginatedResponse<Job>>('/jobs/search', params)
  },

  async getJob(id: string): Promise<Job> {
    return api.get<Job>(`/jobs/${id}`)
  },

  async getRecommendedJobs(page?: number, pageSize?: number): Promise<PaginatedResponse<Job>> {
    return api.get<PaginatedResponse<Job>>('/jobs/recommended', { page, pageSize })
  },

  // Job Matches
  async getJobMatches(filters?: JobMatchFilters): Promise<PaginatedResponse<JobMatch>> {
    return api.get<PaginatedResponse<JobMatch>>('/jobs/matches', filters)
  },

  async getJobMatch(jobId: string): Promise<JobMatch> {
    return api.get<JobMatch>(`/jobs/matches/${jobId}`)
  },

  async saveJob(jobId: string): Promise<JobMatch> {
    return api.post<JobMatch>('/jobs/save', { jobId })
  },

  async unsaveJob(jobId: string): Promise<void> {
    return api.delete(`/jobs/save/${jobId}`)
  },

  async updateJobMatchStatus(jobId: string, status: JobMatch['status']): Promise<JobMatch> {
    return api.patch<JobMatch>(`/jobs/matches/${jobId}`, { status })
  },

  async addJobNote(jobId: string, note: string): Promise<JobMatch> {
    return api.post<JobMatch>(`/jobs/matches/${jobId}/notes`, { note })
  },

  async markAsApplied(jobId: string, appliedAt?: string): Promise<JobMatch> {
    return api.post<JobMatch>(`/jobs/matches/${jobId}/applied`, { appliedAt })
  },

  // Job Statistics
  async getJobStats(): Promise<{
    totalSaved: number
    totalApplied: number
    totalInterviewing: number
    totalOffered: number
    totalRejected: number
  }> {
    return api.get('/jobs/stats')
  },

  // External Job Sources (prepared for future integrations)
  async syncLinkedInJobs(): Promise<{ synced: number }> {
    return api.post('/jobs/sync/linkedin')
  },

  async syncAdzunaJobs(params: { keywords: string; location: string }): Promise<{ synced: number }> {
    return api.post('/jobs/sync/adzuna', params)
  },

  async syncJSearchJobs(params: { query: string; location?: string }): Promise<{ synced: number }> {
    return api.post('/jobs/sync/jsearch', params)
  },
}
