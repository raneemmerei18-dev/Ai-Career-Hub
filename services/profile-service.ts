import { api } from '@/lib/api-client'
import type {
  Profile,
  UserSkill,
  Experience,
  Education,
  Project,
  Certification,
  Language,
  TargetCareer,
} from '@/types'

export const profileService = {
  // Profile
  async getProfile(): Promise<Profile> {
    return api.get<Profile>('/profile')
  },

  async updateProfile(data: Partial<Profile>): Promise<Profile> {
    return api.patch<Profile>('/profile', data)
  },

  async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    const formData = new FormData()
    formData.append('avatar', file)
    return api.post<{ avatarUrl: string }>('/profile/avatar', formData)
  },

  // Skills
  async getSkills(): Promise<UserSkill[]> {
    return api.get<UserSkill[]>('/profile/skills')
  },

  async addSkill(data: { skillId: string; proficiencyLevel: string; yearsOfExperience?: number }): Promise<UserSkill> {
    return api.post<UserSkill>('/profile/skills', data)
  },

  async updateSkill(id: string, data: Partial<UserSkill>): Promise<UserSkill> {
    return api.patch<UserSkill>(`/profile/skills/${id}`, data)
  },

  async removeSkill(id: string): Promise<void> {
    return api.delete(`/profile/skills/${id}`)
  },

  // Experience
  async getExperiences(): Promise<Experience[]> {
    return api.get<Experience[]>('/profile/experiences')
  },

  async addExperience(data: Partial<Experience>): Promise<Experience> {
    return api.post<Experience>('/profile/experiences', data)
  },

  async updateExperience(id: string, data: Partial<Experience>): Promise<Experience> {
    return api.patch<Experience>(`/profile/experiences/${id}`, data)
  },

  async removeExperience(id: string): Promise<void> {
    return api.delete(`/profile/experiences/${id}`)
  },

  // Education
  async getEducation(): Promise<Education[]> {
    return api.get<Education[]>('/profile/education')
  },

  async addEducation(data: Partial<Education>): Promise<Education> {
    return api.post<Education>('/profile/education', data)
  },

  async updateEducation(id: string, data: Partial<Education>): Promise<Education> {
    return api.patch<Education>(`/profile/education/${id}`, data)
  },

  async removeEducation(id: string): Promise<void> {
    return api.delete(`/profile/education/${id}`)
  },

  // Projects
  async getProjects(): Promise<Project[]> {
    return api.get<Project[]>('/profile/projects')
  },

  async addProject(data: Partial<Project>): Promise<Project> {
    return api.post<Project>('/profile/projects', data)
  },

  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    return api.patch<Project>(`/profile/projects/${id}`, data)
  },

  async removeProject(id: string): Promise<void> {
    return api.delete(`/profile/projects/${id}`)
  },

  // Certifications
  async getCertifications(): Promise<Certification[]> {
    return api.get<Certification[]>('/profile/certifications')
  },

  async addCertification(data: Partial<Certification>): Promise<Certification> {
    return api.post<Certification>('/profile/certifications', data)
  },

  async updateCertification(id: string, data: Partial<Certification>): Promise<Certification> {
    return api.patch<Certification>(`/profile/certifications/${id}`, data)
  },

  async removeCertification(id: string): Promise<void> {
    return api.delete(`/profile/certifications/${id}`)
  },

  // Languages
  async getLanguages(): Promise<Language[]> {
    return api.get<Language[]>('/profile/languages')
  },

  async addLanguage(data: Partial<Language>): Promise<Language> {
    return api.post<Language>('/profile/languages', data)
  },

  async updateLanguage(id: string, data: Partial<Language>): Promise<Language> {
    return api.patch<Language>(`/profile/languages/${id}`, data)
  },

  async removeLanguage(id: string): Promise<void> {
    return api.delete(`/profile/languages/${id}`)
  },

  // Target Career
  async getTargetCareer(): Promise<TargetCareer | null> {
    return api.get<TargetCareer | null>('/profile/target-career')
  },

  async setTargetCareer(data: Partial<TargetCareer>): Promise<TargetCareer> {
    return api.post<TargetCareer>('/profile/target-career', data)
  },

  async updateCareerGoals(data: any): Promise<void> {
    return api.post('/profile/target-career', data)
  },

  async completeOnboarding(): Promise<void> {
    return api.post('/onboarding/complete')
  },
}
