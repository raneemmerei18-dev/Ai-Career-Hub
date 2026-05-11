"use client"

import { useState } from 'react'
import { Plus, Trash2, Building2, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
import { useOnboardingStore, type Experience } from '@/store/onboarding-store'

const emptyExperience: Omit<Experience, 'id'> = {
  company: '',
  title: '',
  location: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
  description: '',
  achievements: [],
}

export function ExperienceStep() {
  const { data, addExperience, updateExperience, removeExperience } = useOnboardingStore()
  const { experiences } = data
  const [newAchievement, setNewAchievement] = useState<Record<string, string>>({})

  const handleAddExperience = () => {
    addExperience({
      ...emptyExperience,
      id: `exp-${Date.now()}`,
    })
  }

  const handleAddAchievement = (expId: string) => {
    const achievement = newAchievement[expId]?.trim()
    if (!achievement) return

    const exp = experiences.find(e => e.id === expId)
    if (exp) {
      updateExperience(expId, {
        achievements: [...exp.achievements, achievement],
      })
      setNewAchievement(prev => ({ ...prev, [expId]: '' }))
    }
  }

  const handleRemoveAchievement = (expId: string, index: number) => {
    const exp = experiences.find(e => e.id === expId)
    if (exp) {
      updateExperience(expId, {
        achievements: exp.achievements.filter((_, i) => i !== index),
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Add your work experience, starting with the most recent
        </p>
        <Button onClick={handleAddExperience} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Experience
        </Button>
      </div>

      {experiences.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-center">
              No work experience added yet.
              <br />
              <button
                onClick={handleAddExperience}
                className="text-primary hover:underline"
              >
                Add your first experience
              </button>
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp, index) => (
            <Card key={exp.id}>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Experience {index + 1}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExperience(exp.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Job Title *</Label>
                    <Input
                      value={exp.title}
                      onChange={(e) => updateExperience(exp.id, { title: e.target.value })}
                      placeholder="Senior Software Engineer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Company *</Label>
                    <Input
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                      placeholder="Google"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={exp.location}
                    onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                    placeholder="San Francisco, CA"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Start Date *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
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
                        value={exp.endDate}
                        onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                        className="pl-10"
                        disabled={exp.isCurrent}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`current-${exp.id}`}
                    checked={exp.isCurrent}
                    onCheckedChange={(checked) =>
                      updateExperience(exp.id, { isCurrent: checked as boolean, endDate: '' })
                    }
                  />
                  <Label htmlFor={`current-${exp.id}`} className="text-sm font-normal cursor-pointer">
                    I currently work here
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                    placeholder="Describe your responsibilities and impact..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Key Achievements</Label>
                  <div className="space-y-2">
                    {exp.achievements.map((achievement, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm bg-muted/50 rounded-md px-3 py-2">
                        <span className="flex-1">{achievement}</span>
                        <button
                          onClick={() => handleRemoveAchievement(exp.id, i)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        value={newAchievement[exp.id] || ''}
                        onChange={(e) => setNewAchievement(prev => ({ ...prev, [exp.id]: e.target.value }))}
                        placeholder="Add an achievement (e.g., Increased revenue by 25%)"
                        onKeyDown={(e) => e.key === 'Enter' && handleAddAchievement(exp.id)}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddAchievement(exp.id)}
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
