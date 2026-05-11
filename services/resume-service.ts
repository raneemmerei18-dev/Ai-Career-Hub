import { api } from '@/lib/api-client'
import type { Resume, CoverLetter, PaginatedResponse } from '@/types'

export interface CreateResumeRequest {
  name: string
  templateId: string
}

export interface UpdateResumeRequest {
  name?: string
  content?: Partial<Resume['content']>
  templateId?: string
}

export const resumeService = {
  // Resumes
  async getResumes(): Promise<Resume[]> {
    return api.get<Resume[]>('/resumes')
  },

  async getResume(id: string): Promise<Resume> {
    return api.get<Resume>(`/resumes/${id}`)
  },

  async createResume(request: CreateResumeRequest): Promise<Resume> {
    return api.post<Resume>('/resumes', request)
  },

  async updateResume(id: string, request: UpdateResumeRequest): Promise<Resume> {
    return api.patch<Resume>(`/resumes/${id}`, request)
  },

  async deleteResume(id: string): Promise<void> {
    return api.delete(`/resumes/${id}`)
  },

  async duplicateResume(id: string, name?: string): Promise<Resume> {
    return api.post<Resume>(`/resumes/${id}/duplicate`, { name })
  },

  async setActiveResume(id: string): Promise<Resume> {
    return api.post<Resume>(`/resumes/${id}/set-active`)
  },

  // Resume Versions
  async getResumeVersions(id: string): Promise<{ versions: { version: number; createdAt: string }[] }> {
    return api.get(`/resumes/${id}/versions`)
  },

  async restoreResumeVersion(id: string, version: number): Promise<Resume> {
    return api.post<Resume>(`/resumes/${id}/versions/${version}/restore`)
  },

  // PDF Export
  async exportResumePdf(id: string): Promise<Blob> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resumes/${id}/export/pdf`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
    return response.blob()
  },

  async exportResumeDocx(id: string): Promise<Blob> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resumes/${id}/export/docx`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
    return response.blob()
  },

  // Templates
  async getTemplates(): Promise<{ id: string; name: string; preview: string; category: string }[]> {
    return api.get('/resumes/templates')
  },

  // Cover Letters
  async getCoverLetters(page?: number, pageSize?: number): Promise<PaginatedResponse<CoverLetter>> {
    return api.get<PaginatedResponse<CoverLetter>>('/cover-letters', { page, pageSize })
  },

  async getCoverLetter(id: string): Promise<CoverLetter> {
    return api.get<CoverLetter>(`/cover-letters/${id}`)
  },

  async createCoverLetter(data: { name: string; content: string; jobId?: string }): Promise<CoverLetter> {
    return api.post<CoverLetter>('/cover-letters', data)
  },

  async updateCoverLetter(id: string, data: { name?: string; content?: string }): Promise<CoverLetter> {
    return api.patch<CoverLetter>(`/cover-letters/${id}`, data)
  },

  async deleteCoverLetter(id: string): Promise<void> {
    return api.delete(`/cover-letters/${id}`)
  },

  async exportCoverLetterPdf(id: string): Promise<Blob> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cover-letters/${id}/export/pdf`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
    return response.blob()
  },
}
