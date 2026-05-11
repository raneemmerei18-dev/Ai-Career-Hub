"use client"

import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Code, 
  Target,
  CheckCircle2,
  Edit2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useOnboardingStore } from '@/store/onboarding-store'

export function ReviewStep() {
  const { data, setCurrentStep } = useOnboardingStore()
  const { personalInfo, experiences, education, skills, careerGoals } = data

  const formatSalary = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value * 1000)
  }

  const sections = [
    {
      title: 'Personal Information',
      icon: User,
      step: 0,
      content: (
        <div className="space-y-2 text-sm">
          <p><strong>Name:</strong> {personalInfo.firstName} {personalInfo.lastName}</p>
          <p><strong>Headline:</strong> {personalInfo.headline || 'Not provided'}</p>
          <p><strong>Location:</strong> {personalInfo.location || 'Not provided'}</p>
          {personalInfo.bio && <p><strong>Bio:</strong> {personalInfo.bio.substring(0, 100)}...</p>}
        </div>
      ),
      isComplete: personalInfo.firstName && personalInfo.lastName && personalInfo.headline,
    },
    {
      title: 'Work Experience',
      icon: Briefcase,
      step: 1,
      content: (
        <div className="space-y-2">
          {experiences.length === 0 ? (
            <p className="text-sm text-muted-foreground">No experience added</p>
          ) : (
            experiences.slice(0, 3).map((exp) => (
              <div key={exp.id} className="text-sm">
                <p className="font-medium">{exp.title}</p>
                <p className="text-muted-foreground">{exp.company} • {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}</p>
              </div>
            ))
          )}
          {experiences.length > 3 && (
            <p className="text-sm text-muted-foreground">+{experiences.length - 3} more</p>
          )}
        </div>
      ),
      isComplete: experiences.length > 0,
    },
    {
      title: 'Education',
      icon: GraduationCap,
      step: 2,
      content: (
        <div className="space-y-2">
          {education.length === 0 ? (
            <p className="text-sm text-muted-foreground">No education added</p>
          ) : (
            education.slice(0, 2).map((edu) => (
              <div key={edu.id} className="text-sm">
                <p className="font-medium">{edu.degree} in {edu.fieldOfStudy}</p>
                <p className="text-muted-foreground">{edu.institution}</p>
              </div>
            ))
          )}
        </div>
      ),
      isComplete: education.length > 0,
    },
    {
      title: 'Skills',
      icon: Code,
      step: 3,
      content: (
        <div className="flex flex-wrap gap-1.5">
          {skills.length === 0 ? (
            <p className="text-sm text-muted-foreground">No skills added</p>
          ) : (
            <>
              {skills.slice(0, 8).map((skill) => (
                <Badge key={skill.id} variant="secondary" className="text-xs">
                  {skill.name}
                </Badge>
              ))}
              {skills.length > 8 && (
                <Badge variant="outline" className="text-xs">
                  +{skills.length - 8} more
                </Badge>
              )}
            </>
          )}
        </div>
      ),
      isComplete: skills.length >= 3,
    },
    {
      title: 'Career Goals',
      icon: Target,
      step: 4,
      content: (
        <div className="space-y-2 text-sm">
          <div>
            <strong>Target Roles:</strong>{' '}
            {careerGoals.targetRoles.length > 0 
              ? careerGoals.targetRoles.join(', ') 
              : 'Not specified'}
          </div>
          <div>
            <strong>Salary Range:</strong>{' '}
            {formatSalary(careerGoals.salaryRange.min)} - {formatSalary(careerGoals.salaryRange.max)}
          </div>
          <div>
            <strong>Work Preference:</strong>{' '}
            {careerGoals.remotePreference.replace('_', ' ') || 'Not specified'}
          </div>
        </div>
      ),
      isComplete: careerGoals.targetRoles.length > 0,
    },
  ]

  const completedSections = sections.filter(s => s.isComplete).length
  const totalSections = sections.length

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
          <CheckCircle2 className="h-4 w-4" />
          {completedSections}/{totalSections} sections complete
        </div>
        <p className="text-muted-foreground">
          Review your profile information before completing setup
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <Card key={section.title} className={section.isComplete ? '' : 'border-warning/50'}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    {section.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {section.isComplete ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : (
                      <span className="text-xs text-warning">Incomplete</span>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentStep(section.step)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                {section.content}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {data.resumeFile && (
        <Card className="border-success/20 bg-success/5">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-success" />
            <div>
              <p className="font-medium text-foreground">Resume Uploaded</p>
              <p className="text-sm text-muted-foreground">{data.resumeFile.name}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-muted/50 rounded-lg p-4 text-center">
        <p className="text-sm text-muted-foreground">
          By completing setup, you agree to our Terms of Service and Privacy Policy.
          You can update your profile information anytime from your dashboard.
        </p>
      </div>
    </div>
  )
}
