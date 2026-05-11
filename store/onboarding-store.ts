import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface Experience {
  id: string
  company: string
  title: string
  location: string
  startDate: string
  endDate: string
  isCurrent: boolean
  description: string
  achievements: string[]
}

export interface Education {
  id: string
  institution: string
  degree: string
  fieldOfStudy: string
  startDate: string
  endDate: string
  gpa: string
  achievements: string[]
}

export interface Skill {
  id: string
  name: string
  category: 'technical' | 'soft' | 'tools' | 'domain'
  level: number
  yearsOfExperience: number
}

export interface CareerGoals {
  targetRoles: string[]
  targetIndustries: string[]
  salaryRange: {
    min: number
    max: number
  }
  preferredLocations: string[]
  remotePreference: string
  timeline: string
}

export interface PersonalInfo {
  firstName: string
  lastName: string
  headline: string
  bio: string
  location: string
  phone: string
  linkedin: string
  github: string
  portfolio: string
}

export interface OnboardingData {
  personalInfo: PersonalInfo
  experiences: Experience[]
  education: Education[]
  skills: Skill[]
  careerGoals: CareerGoals
  resumeFile: File | null
  resumeAnalysis: any | null
}

interface OnboardingStore {
  currentStep: number
  data: OnboardingData
  
  // Actions
  setCurrentStep: (step: number) => void
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void
  addExperience: (exp: Experience) => void
  updateExperience: (id: string, exp: Partial<Experience>) => void
  removeExperience: (id: string) => void
  addEducation: (edu: Education) => void
  updateEducation: (id: string, edu: Partial<Education>) => void
  removeEducation: (id: string) => void
  addSkill: (skill: Skill) => void
  updateSkill: (id: string, skill: Partial<Skill>) => void
  removeSkill: (id: string) => void
  updateCareerGoals: (goals: Partial<CareerGoals>) => void
  setResumeFile: (file: File | null) => void
  setResumeAnalysis: (analysis: any) => void
  isStepValid: (step: number) => boolean
  reset: () => void
}

const initialData: OnboardingData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    headline: '',
    bio: '',
    location: '',
    phone: '',
    linkedin: '',
    github: '',
    portfolio: '',
  },
  experiences: [],
  education: [],
  skills: [],
  careerGoals: {
    targetRoles: [],
    targetIndustries: [],
    salaryRange: { min: 50, max: 150 },
    preferredLocations: [],
    remotePreference: 'flexible',
    timeline: 'immediately',
  },
  resumeFile: null,
  resumeAnalysis: null,
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, get) => ({
      currentStep: 0,
      data: initialData,

      setCurrentStep: (step) => set({ currentStep: step }),

      updatePersonalInfo: (info) =>
        set((state) => ({
          data: {
            ...state.data,
            personalInfo: { ...state.data.personalInfo, ...info },
          },
        })),

      addExperience: (exp) =>
        set((state) => ({
          data: {
            ...state.data,
            experiences: [...state.data.experiences, exp],
          },
        })),

      updateExperience: (id, updatedExp) =>
        set((state) => ({
          data: {
            ...state.data,
            experiences: state.data.experiences.map((exp) =>
              exp.id === id ? { ...exp, ...updatedExp } : exp
            ),
          },
        })),

      removeExperience: (id) =>
        set((state) => ({
          data: {
            ...state.data,
            experiences: state.data.experiences.filter((exp) => exp.id !== id),
          },
        })),

      addEducation: (edu) =>
        set((state) => ({
          data: {
            ...state.data,
            education: [...state.data.education, edu],
          },
        })),

      updateEducation: (id, updatedEdu) =>
        set((state) => ({
          data: {
            ...state.data,
            education: state.data.education.map((edu) =>
              edu.id === id ? { ...edu, ...updatedEdu } : edu
            ),
          },
        })),

      removeEducation: (id) =>
        set((state) => ({
          data: {
            ...state.data,
            education: state.data.education.filter((edu) => edu.id !== id),
          },
        })),

      addSkill: (skill) =>
        set((state) => ({
          data: {
            ...state.data,
            skills: [...state.data.skills, skill],
          },
        })),

      updateSkill: (id, updatedSkill) =>
        set((state) => ({
          data: {
            ...state.data,
            skills: state.data.skills.map((skill) =>
              skill.id === id ? { ...skill, ...updatedSkill } : skill
            ),
          },
        })),

      removeSkill: (id) =>
        set((state) => ({
          data: {
            ...state.data,
            skills: state.data.skills.filter((skill) => skill.id !== id),
          },
        })),

      updateCareerGoals: (goals) =>
        set((state) => ({
          data: {
            ...state.data,
            careerGoals: { ...state.data.careerGoals, ...goals },
          },
        })),

      setResumeFile: (file) =>
        set((state) => ({
          data: { ...state.data, resumeFile: file },
        })),

      setResumeAnalysis: (analysis) =>
        set((state) => ({
          data: { ...state.data, resumeAnalysis: analysis },
        })),

      isStepValid: (step) => {
        const { data } = get()
        switch (step) {
          case 0: // Personal Info
            return !!(
              data.personalInfo.firstName &&
              data.personalInfo.lastName &&
              data.personalInfo.headline
            )
          case 1: // Experience
            // Optional but if adding one, must be valid
            return true
          case 2: // Education
            // Optional but if adding one, must be valid
            return true
          case 3: // Skills
            return data.skills.length >= 3
          case 4: // Career Goals
            return data.careerGoals.targetRoles.length > 0
          case 5: // Resume
            return true // Optional
          case 6: // Review
            return true
          default:
            return false
        }
      },

      reset: () => set({ currentStep: 0, data: initialData }),
    }),
    {
      name: 'ai-career-hub-onboarding-v2',
      storage: createJSONStorage(() => localStorage),
      // Skip persisting files as they can't be JSON serialized easily
      partialize: (state) => ({
        currentStep: state.currentStep,
        data: {
          ...state.data,
          resumeFile: null,
          resumeAnalysis: state.data.resumeAnalysis,
        },
      }),
    }
  )
)
