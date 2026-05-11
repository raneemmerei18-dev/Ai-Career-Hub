import { api } from '@/lib/api-client'

export interface LearningPath {
  id: string
  target_role: string
  current_level: string
  progress: number
  estimated_duration: string
  is_active: boolean
  focus_areas?: string[]
}

export const learningService = {
  async getLearningPaths(): Promise<{ data: LearningPath[] }> {
    return api.get('/learning-paths')
  },

  async getActivePath(): Promise<LearningPath | null> {
    return api.get('/learning-paths/active')
  },

  async generatePath(): Promise<{ id: string }> {
    return api.post('/learning-paths/generate', {})
  }
}
