"use client"

import { useState } from 'react'
import { Plus, Trash2, GraduationCap, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useOnboardingStore, type Education } from '@/store/onboarding-store'

const degreeTypes = [
  'High School Diploma',
  'Associate Degree',
  'Bachelor\'s Degree',
  'Master\'s Degree',
  'Doctoral Degree (PhD)',
  'Professional Degree (MD, JD, etc.)',
  'Certificate',
  'Bootcamp',
  'Other',
]

const emptyEducation: Omit<Education, 'id'> = {
  institution: '',
  degree: '',
  fieldOfStudy: '',
  startDate: '',
  endDate: '',
  gpa: '',
  achievements: [],
}

export function EducationStep() {
  const { data, addEducation, updateEducation, removeEducation } = useOnboardingStore()
  const { education } = data
  const [newAchievement, setNewAchievement] = useState<Record<string, string>>({})

  const handleAddEducation = () => {
    addEducation({
      ...emptyEducation,
      id: `edu-${Date.now()}`,
    })
  }

  const handleAddAchievement = (eduId: string) => {
    const achievement = newAchievement[eduId]?.trim()
    if (!achievement) return

    const edu = education.find(e => e.id === eduId)
    if (edu) {
      updateEducation(eduId, {
        achievements: [...edu.achievements, achievement],
      })
      setNewAchievement(prev => ({ ...prev, [eduId]: '' }))
    }
  }

  const handleRemoveAchievement = (eduId: string, index: number) => {
    const edu = education.find(e => e.id === eduId)
    if (edu) {
      updateEducation(eduId, {
        achievements: edu.achievements.filter((_, i) => i !== index),
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Add your educational background
        </p>
        <Button onClick={handleAddEducation} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Education
        </Button>
      </div>

      {education.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <GraduationCap className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-center">
              No education added yet.
              <br />
              <button
                onClick={handleAddEducation}
                className="text-primary hover:underline"
              >
                Add your education
              </button>
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {education.map((edu, index) => (
            <Card key={edu.id}>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Education {index + 1}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEducation(edu.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Institution *</Label>
                  <Input
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                    placeholder="Stanford University"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Degree *</Label>
                    <Select
                      value={edu.degree}
                      onValueChange={(value) => updateEducation(edu.id, { degree: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select degree type" />
                      </SelectTrigger>
                      <SelectContent>
                        {degreeTypes.map((degree) => (
                          <SelectItem key={degree} value={degree}>
                            {degree}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Field of Study *</Label>
                    <Input
                      value={edu.fieldOfStudy}
                      onChange={(e) => updateEducation(edu.id, { fieldOfStudy: e.target.value })}
                      placeholder="Computer Science"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Start Date *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="month"
                        value={edu.startDate}
                        onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="month"
                        value={edu.endDate}
                        onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>GPA (Optional)</Label>
                    <Input
                      value={edu.gpa}
                      onChange={(e) => updateEducation(edu.id, { gpa: e.target.value })}
                      placeholder="3.8/4.0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Honors & Achievements</Label>
                  <div className="space-y-2">
                    {edu.achievements.map((achievement, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm bg-muted/50 rounded-md px-3 py-2">
                        <span className="flex-1">{achievement}</span>
                        <button
                          onClick={() => handleRemoveAchievement(edu.id, i)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        value={newAchievement[edu.id] || ''}
                        onChange={(e) => setNewAchievement(prev => ({ ...prev, [edu.id]: e.target.value }))}
                        placeholder="Add honors, awards, or activities"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddAchievement(edu.id)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddAchievement(edu.id)}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
