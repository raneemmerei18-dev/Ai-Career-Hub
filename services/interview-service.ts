import { api } from '@/lib/api-client'

export interface InterviewSession {
  id: string
  type: string
  difficulty: string
  status: string
  target_role?: string
  score?: number
  created_at: string
}

export interface CreateSessionRequest {
  jobId?: string
  type?: string
  difficulty?: string
  targetRole?: string
}

export const interviewService = {
  async getSessions(): Promise<{ data: InterviewSession[], total: number }> {
    return api.get('/interviews/sessions')
  },

  async getSession(sessionId: string): Promise<any> {
    return api.get(`/interviews/sessions/${sessionId}`)
  },

  async createSession(request: CreateSessionRequest): Promise<{ id: string, questions: any[], target_role: string }> {
    return api.post('/interviews/sessions', request)
  },

  async submitAnswer(sessionId: string, data: { question_id: string, answer: string, time_taken_seconds?: number }): Promise<any> {
    return api.post(`/interviews/sessions/${sessionId}/answers`, data)
  },

  async getStats(): Promise<any> {
    return api.get('/interviews/stats')
  }
}
