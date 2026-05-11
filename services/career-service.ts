import { api } from '@/lib/api-client'

export interface CareerGoals {
  targetRoles: string[]
  targetIndustries: string[]
  salaryMin: number
  salaryMax: number
  preferredLocations: string[]
  remotePreference: string
  timeline: string
}

export const careerService = {
  async updateGoals(goals: CareerGoals): Promise<any> {
    return api.post('/profile/target-career', goals)
  }
}
