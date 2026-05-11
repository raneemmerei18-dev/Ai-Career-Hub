// User & Auth Types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  role: 'user' | 'admin'
  isVerified: boolean
  onboardingCompleted: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresAt: number
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
}

// Profile Types
export interface Profile {
  id: string
  userId: string
  headline?: string
  summary?: string
  location?: string
  phone?: string
  linkedin?: string
  github?: string
  portfolio?: string
  avatarUrl?: string
  createdAt: string
  updatedAt: string
}

// Skills Types
export interface Skill {
  id: string
  name: string
  category: string
  description?: string
}

export interface UserSkill {
  id: string
  userId: string
  skillId: string
  skill: Skill
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  yearsOfExperience?: number
}

// Experience Types
export interface Experience {
  id: string
  userId: string
  company: string
  title: string
  location?: string
  startDate: string
  endDate?: string
  isCurrent: boolean
  description?: string
  achievements: string[]
  createdAt: string
  updatedAt: string
}

// Education Types
export interface Education {
  id: string
  userId: string
  institution: string
  degree: string
  fieldOfStudy: string
  startDate: string
  endDate?: string
  isCurrent: boolean
  gpa?: number
  achievements: string[]
  createdAt: string
  updatedAt: string
}

// Project Types
export interface Project {
  id: string
  userId: string
  title: string
  description?: string
  url?: string
  githubUrl?: string
  technologies: string[]
  startDate?: string
  endDate?: string
  highlights: string[]
  createdAt: string
  updatedAt: string
}

// Certification Types
export interface Certification {
  id: string
  userId: string
  name: string
  issuingOrganization: string
  issueDate: string
  expirationDate?: string
  credentialId?: string
  credentialUrl?: string
  createdAt: string
  updatedAt: string
}

// Language Types
export interface Language {
  id: string
  userId: string
  language: string
  proficiency: 'basic' | 'conversational' | 'professional' | 'native'
}

// Target Career Types
export interface TargetCareer {
  id: string
  userId: string
  targetRole: string
  targetIndustry?: string
  targetSalaryMin?: number
  targetSalaryMax?: number
  preferredLocations: string[]
  remotePreference: 'remote' | 'hybrid' | 'onsite' | 'any'
  createdAt: string
  updatedAt: string
}

// Resume Types
export interface Resume {
  id: string
  userId: string
  name: string
  templateId: string
  content: ResumeContent
  atsScore?: number
  version: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ResumeContent {
  profile: Partial<Profile>
  experiences: Experience[]
  education: Education[]
  skills: UserSkill[]
  projects: Project[]
  certifications: Certification[]
  languages: Language[]
  customSections?: CustomSection[]
}

export interface CustomSection {
  id: string
  title: string
  items: string[]
}

// Cover Letter Types
export interface CoverLetter {
  id: string
  userId: string
  jobId?: string
  name: string
  content: string
  createdAt: string
  updatedAt: string
}

// Job Types
export interface Job {
  id: string
  title: string
  company: string
  location: string
  description: string
  requirements: string[]
  responsibilities: string[]
  salaryMin?: number
  salaryMax?: number
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship'
  remoteType: 'remote' | 'hybrid' | 'onsite'
  postedAt: string
  expiresAt?: string
  sourceUrl?: string
  source: string
}

export interface JobMatch {
  id: string
  userId: string
  jobId: string
  job: Job
  matchScore: number
  matchedSkills: string[]
  missingSkills: string[]
  status: 'new' | 'saved' | 'applied' | 'interviewing' | 'rejected' | 'offered'
  appliedAt?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

// Interview Types
export interface InterviewSession {
  id: string
  userId: string
  jobId?: string
  type: 'technical' | 'behavioral' | 'hr' | 'system-design' | 'mixed'
  difficulty: 'easy' | 'medium' | 'hard'
  status: 'pending' | 'in-progress' | 'completed'
  score?: number
  feedback?: string
  startedAt?: string
  completedAt?: string
  createdAt: string
  updatedAt: string
}

export interface InterviewQuestion {
  id: string
  sessionId: string
  question: string
  type: 'technical' | 'behavioral' | 'hr' | 'system-design'
  difficulty: 'easy' | 'medium' | 'hard'
  expectedAnswer?: string
  hints?: string[]
}

export interface InterviewAnswer {
  id: string
  sessionId: string
  questionId: string
  answer: string
  score?: number
  feedback?: string
  strengths?: string[]
  improvements?: string[]
  createdAt: string
}

// Learning Path Types
export interface LearningPath {
  id: string
  userId: string
  targetRole: string
  currentLevel: 'beginner' | 'intermediate' | 'advanced'
  estimatedDuration: string
  progress: number
  milestones: LearningMilestone[]
  createdAt: string
  updatedAt: string
}

export interface LearningMilestone {
  id: string
  pathId: string
  title: string
  description: string
  skills: string[]
  resources: LearningResource[]
  isCompleted: boolean
  order: number
}

export interface LearningResource {
  id: string
  title: string
  type: 'course' | 'article' | 'video' | 'book' | 'project'
  url: string
  provider?: string
  duration?: string
  isFree: boolean
}

// Notification Types
export interface Notification {
  id: string
  userId: string
  type: 'job_match' | 'interview_reminder' | 'learning' | 'system' | 'achievement'
  title: string
  message: string
  isRead: boolean
  actionUrl?: string
  createdAt: string
}

// Subscription Types
export interface Subscription {
  id: string
  userId: string
  plan: 'free' | 'pro' | 'enterprise'
  status: 'active' | 'cancelled' | 'past_due' | 'trialing'
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  features: SubscriptionFeature[]
}

export interface SubscriptionFeature {
  name: string
  limit?: number
  unlimited: boolean
}

// AI Analysis Types
export interface ATSAnalysis {
  score: number
  breakdown: {
    formatting: number
    keywords: number
    experience: number
    education: number
    skills: number
  }
  suggestions: string[]
  missingKeywords: string[]
  strengths: string[]
}

export interface CareerReadiness {
  overallScore: number
  dimensions: {
    skills: number
    experience: number
    education: number
    portfolio: number
    networking: number
  }
  recommendations: string[]
  nextSteps: string[]
}

// Dashboard Types
export interface DashboardStats {
  atsScore: number
  matchScore: number
  interviewReadiness: number
  profileCompleteness: number
  activeApplications: number
  savedJobs: number
  completedInterviews: number
  learningProgress: number
}

// API Response Types
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ApiError {
  message: string
  code: string
  details?: Record<string, string[]>
}

// Onboarding Types
export interface OnboardingState {
  currentStep: number
  completedSteps: number[]
  data: {
    profile?: Partial<Profile>
    skills?: string[]
    experiences?: Partial<Experience>[]
    education?: Partial<Education>[]
    projects?: Partial<Project>[]
    certifications?: Partial<Certification>[]
    languages?: Partial<Language>[]
    targetCareer?: Partial<TargetCareer>
  }
}

// Admin Types
export interface AdminUser extends User {
  subscriptionStatus: string
  lastLoginAt?: string
  totalResumes: number
  totalApplications: number
}

export interface AuditLog {
  id: string
  userId: string
  action: string
  resourceType: string
  resourceId: string
  details?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
  createdAt: string
}

export interface SystemMetrics {
  totalUsers: number
  activeUsers: number
  totalResumes: number
  totalApplications: number
  aiRequestsToday: number
  aiRequestsMonth: number
}
