import { api } from '@/lib/api-client'
import type { ATSAnalysis, CareerReadiness, LearningPath, Resume, CoverLetter } from '@/types'

export interface GenerateResumeRequest {
  targetRole: string
  targetCompany?: string
  jobDescription?: string
  templateId?: string
}

export interface GenerateCoverLetterRequest {
  jobId?: string
  targetRole: string
  targetCompany: string
  jobDescription: string
  customNotes?: string
}

export interface GenerateLearningPathRequest {
  targetRole: string
  currentLevel: 'beginner' | 'intermediate' | 'advanced'
  focusAreas?: string[]
}

export interface InterviewQuestionRequest {
  targetRole: string
  type: 'technical' | 'behavioral' | 'hr' | 'system-design' | 'mixed'
  difficulty: 'easy' | 'medium' | 'hard'
  count?: number
  jobDescription?: string
}

export interface EvaluateAnswerRequest {
  questionId: string
  question: string
  answer: string
  expectedAnswer?: string
}

export interface EvaluateAnswerResponse {
  score: number
  feedback: string
  strengths: string[]
  improvements: string[]
}

export interface SkillGapAnalysis {
  matchedSkills: string[]
  missingSkills: string[]
  partialSkills: string[]
  recommendations: string[]
  learningPriority: { skill: string; priority: 'high' | 'medium' | 'low'; reason: string }[]
}

export const aiService = {
  // ATS Analysis
  async analyzeResume(resumeId: string, jobDescription?: string): Promise<ATSAnalysis> {
    return api.post<ATSAnalysis>('/ai/analyze-resume', { resumeId, jobDescription })
  },

  async analyzeResumeFromContent(content: string, jobDescription?: string): Promise<ATSAnalysis> {
    return api.post<ATSAnalysis>('/ai/analyze-resume-content', { content, jobDescription })
  },

  // Career Readiness
  async getCareerReadiness(targetRole?: string): Promise<CareerReadiness> {
    return api.get<CareerReadiness>('/ai/career-readiness', { targetRole })
  },

  // Resume Generation
  async generateResume(request: GenerateResumeRequest): Promise<Resume> {
    return api.post<Resume>('/ai/generate-resume', request)
  },

  async improveResumeBullet(bullet: string, context: string): Promise<string> {
    return api.post<string>('/ai/improve-bullet', { bullet, context })
  },

  async suggestResumeSummary(targetRole: string): Promise<string> {
    return api.post<string>('/ai/suggest-summary', { targetRole })
  },

  // Cover Letter Generation
  async generateCoverLetter(request: GenerateCoverLetterRequest): Promise<CoverLetter> {
    return api.post<CoverLetter>('/ai/generate-cover-letter', request)
  },

  async improveCoverLetter(content: string, feedback: string): Promise<string> {
    return api.post<string>('/ai/improve-cover-letter', { content, feedback })
  },

  // Learning Path
  async generateLearningPath(request: GenerateLearningPathRequest): Promise<LearningPath> {
    return api.post<LearningPath>('/ai/generate-learning-path', request)
  },

  async refreshLearningResources(pathId: string): Promise<LearningPath> {
    return api.post<LearningPath>(`/ai/learning-paths/${pathId}/refresh-resources`)
  },

  // Interview Preparation
  async generateInterviewQuestions(request: InterviewQuestionRequest): Promise<{ questions: { id: string; question: string; type: string; difficulty: string }[] }> {
    return api.post('/ai/generate-interview-questions', request)
  },

  async evaluateAnswer(request: EvaluateAnswerRequest): Promise<EvaluateAnswerResponse> {
    return api.post<EvaluateAnswerResponse>('/ai/evaluate-answer', request)
  },

  async getInterviewTips(targetRole: string, interviewType: string): Promise<string[]> {
    return api.post<string[]>('/ai/interview-tips', { targetRole, interviewType })
  },

  // Skill Analysis
  async analyzeSkillGap(targetRole: string, jobDescription?: string): Promise<SkillGapAnalysis> {
    return api.post<SkillGapAnalysis>('/ai/skill-gap-analysis', { targetRole, jobDescription })
  },

  // Job Matching
  async getJobMatchScore(jobId: string): Promise<{ score: number; matchedSkills: string[]; missingSkills: string[]; insights: string[] }> {
    return api.get(`/ai/job-match/${jobId}`)
  },

  async suggestJobImprovements(jobId: string): Promise<string[]> {
    return api.get<string[]>(`/ai/job-improvements/${jobId}`)
  },

  // Career Recommendations
  async getCareerRecommendations(): Promise<{ roles: { title: string; matchScore: number; reason: string }[] }> {
    return api.get('/ai/career-recommendations')
  },

  async exploreCareerPath(fromRole: string, toRole: string): Promise<{ steps: { role: string; skills: string[]; timeframe: string }[] }> {
    return api.post('/ai/explore-career-path', { fromRole, toRole })
  },
}
