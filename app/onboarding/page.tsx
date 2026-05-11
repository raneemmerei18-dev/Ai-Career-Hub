"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  User, 
  Briefcase, 
  GraduationCap, 
  Code, 
  Target,
  FileText,
  Sparkles,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useOnboardingStore } from '@/store/onboarding-store'
import { useAuthStore } from '@/store/auth-store'
import { profileService } from '@/services/profile-service'

// Step Components
import { PersonalInfoStep } from '@/components/onboarding/personal-info-step'
import { ExperienceStep } from '@/components/onboarding/experience-step'
import { EducationStep } from '@/components/onboarding/education-step'
import { SkillsStep } from '@/components/onboarding/skills-step'
import { CareerGoalsStep } from '@/components/onboarding/career-goals-step'
import { ResumeUploadStep } from '@/components/onboarding/resume-upload-step'
import { ReviewStep } from '@/components/onboarding/review-step'

const steps = [
  { id: 'personal', title: 'Personal Info', icon: User, description: 'Basic information about you' },
  { id: 'experience', title: 'Experience', icon: Briefcase, description: 'Your work history' },
  { id: 'education', title: 'Education', icon: GraduationCap, description: 'Academic background' },
  { id: 'skills', title: 'Skills', icon: Code, description: 'Technical & soft skills' },
  { id: 'goals', title: 'Career Goals', icon: Target, description: 'Where you want to go' },
  { id: 'resume', title: 'Resume', icon: FileText, description: 'Upload existing resume' },
  { id: 'review', title: 'Review', icon: Sparkles, description: 'Confirm your profile' },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { currentStep, setCurrentStep, data, isStepValid } = useOnboardingStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const progress = ((currentStep + 1) / steps.length) * 100
  const currentStepData = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1
  const isFirstStep = currentStep === 0

  useEffect(() => {
    // Redirect if user already completed onboarding
    if (user?.onboarding_completed) {
      router.push('/dashboard')
    }
  }, [user, router])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError('')

    try {
      // Save profile data
      await profileService.updateProfile({
        firstName: data.personalInfo.firstName,
        lastName: data.personalInfo.lastName,
        headline: data.personalInfo.headline,
        bio: data.personalInfo.bio,
        location: data.personalInfo.location,
        phone: data.personalInfo.phone,
        linkedinUrl: data.personalInfo.linkedin,
        githubUrl: data.personalInfo.github,
        portfolioUrl: data.personalInfo.portfolio,
      })

      // Save experiences
      for (const exp of data.experiences) {
        await profileService.addExperience({
          company: exp.company,
          title: exp.title,
          location: exp.location,
          startDate: exp.startDate,
          endDate: exp.endDate || undefined,
          isCurrent: exp.isCurrent,
          description: exp.description,
          achievements: exp.achievements,
        })
      }

      // Save education
      for (const edu of data.education) {
        await profileService.addEducation({
          institution: edu.institution,
          degree: edu.degree,
          fieldOfStudy: edu.fieldOfStudy,
          startDate: edu.startDate,
          endDate: edu.endDate || undefined,
          gpa: edu.gpa,
          achievements: edu.achievements,
        })
      }

      // Save skills
      for (const skill of data.skills) {
        await profileService.addSkill({
          name: skill.name,
          category: skill.category,
          level: skill.level,
          yearsOfExperience: skill.yearsOfExperience,
        })
      }

      // Save career goals
      await profileService.updateCareerGoals({
        targetRoles: data.careerGoals.targetRoles,
        targetIndustries: data.careerGoals.targetIndustries,
        salaryMin: data.careerGoals.salaryRange.min,
        salaryMax: data.careerGoals.salaryRange.max,
        preferredLocations: data.careerGoals.preferredLocations,
        remotePreference: data.careerGoals.remotePreference,
        timeline: data.careerGoals.timeline,
      })

      // Mark onboarding as complete
      await profileService.completeOnboarding()

      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfoStep />
      case 1:
        return <ExperienceStep />
      case 2:
        return <EducationStep />
      case 3:
        return <SkillsStep />
      case 4:
        return <CareerGoalsStep />
      case 5:
        return <ResumeUploadStep />
      case 6:
        return <ReviewStep />
      default:
        return null
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round(progress)}% complete
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Indicators */}
      <div className="mb-8 overflow-x-auto pb-2">
        <div className="flex gap-2 min-w-max">
          {steps.map((step, index) => {
            const isComplete = index < currentStep
            const isCurrent = index === currentStep
            const Icon = step.icon

            return (
              <button
                key={step.id}
                onClick={() => index <= currentStep && setCurrentStep(index)}
                disabled={index > currentStep}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isCurrent
                    ? 'bg-primary text-primary-foreground'
                    : isComplete
                    ? 'bg-primary/10 text-primary hover:bg-primary/20'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                  isComplete ? 'bg-primary text-primary-foreground' : ''
                }`}>
                  {isComplete ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Icon className="h-3 w-3" />
                  )}
                </div>
                <span className="hidden sm:inline">{step.title}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-card rounded-xl border border-border shadow-sm">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <currentStepData.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{currentStepData.title}</h2>
              <p className="text-sm text-muted-foreground">{currentStepData.description}</p>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {error && (
          <div className="mx-6 mb-4 rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="p-6 border-t border-border flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={isFirstStep || isSubmitting}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>

          {isLastStep ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !isStepValid(currentStep)}
              className="gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Completing setup...
                </>
              ) : (
                <>
                  Complete Setup
                  <Sparkles className="h-4 w-4" />
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!isStepValid(currentStep)}
              className="gap-2"
            >
              Continue
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
