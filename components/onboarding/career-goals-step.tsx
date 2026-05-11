"use client"

import { useState } from 'react'
import { Plus, X, Target, DollarSign, MapPin, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useOnboardingStore } from '@/store/onboarding-store'

const suggestedRoles = [
  'Software Engineer', 'Senior Software Engineer', 'Staff Engineer',
  'Engineering Manager', 'Product Manager', 'Data Scientist',
  'DevOps Engineer', 'Frontend Developer', 'Backend Developer',
  'Full Stack Developer', 'Tech Lead', 'Solution Architect'
]

const suggestedIndustries = [
  'Technology', 'Finance', 'Healthcare', 'E-commerce', 'Education',
  'Media & Entertainment', 'Automotive', 'Consulting', 'Startups',
  'Government', 'Non-profit', 'Manufacturing'
]

const timelineOptions = [
  { value: 'immediately', label: 'Immediately' },
  { value: '1-3_months', label: '1-3 months' },
  { value: '3-6_months', label: '3-6 months' },
  { value: '6-12_months', label: '6-12 months' },
  { value: 'not_looking', label: 'Not actively looking' },
]

const remoteOptions = [
  { value: 'remote_only', label: 'Remote Only', description: 'I only want fully remote positions' },
  { value: 'hybrid', label: 'Hybrid', description: 'Open to a mix of remote and in-office' },
  { value: 'on_site', label: 'On-site', description: 'Prefer working in an office' },
  { value: 'flexible', label: 'Flexible', description: 'Open to any work arrangement' },
]

export function CareerGoalsStep() {
  const { data, updateCareerGoals } = useOnboardingStore()
  const { careerGoals } = data
  const [newRole, setNewRole] = useState('')
  const [newIndustry, setNewIndustry] = useState('')
  const [newLocation, setNewLocation] = useState('')

  const handleAddRole = (role: string) => {
    if (!role.trim() || careerGoals.targetRoles.includes(role)) return
    updateCareerGoals({ targetRoles: [...careerGoals.targetRoles, role.trim()] })
    setNewRole('')
  }

  const handleRemoveRole = (role: string) => {
    updateCareerGoals({ targetRoles: careerGoals.targetRoles.filter(r => r !== role) })
  }

  const handleAddIndustry = (industry: string) => {
    if (!industry.trim() || careerGoals.targetIndustries.includes(industry)) return
    updateCareerGoals({ targetIndustries: [...careerGoals.targetIndustries, industry.trim()] })
    setNewIndustry('')
  }

  const handleRemoveIndustry = (industry: string) => {
    updateCareerGoals({ targetIndustries: careerGoals.targetIndustries.filter(i => i !== industry) })
  }

  const handleAddLocation = () => {
    if (!newLocation.trim() || careerGoals.preferredLocations.includes(newLocation)) return
    updateCareerGoals({ preferredLocations: [...careerGoals.preferredLocations, newLocation.trim()] })
    setNewLocation('')
  }

  const handleRemoveLocation = (location: string) => {
    updateCareerGoals({ preferredLocations: careerGoals.preferredLocations.filter(l => l !== location) })
  }

  const formatSalary = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value * 1000)
  }

  return (
    <div className="space-y-8">
      {/* Target Roles */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <Label className="text-base font-semibold">Target Roles</Label>
        </div>
        <p className="text-sm text-muted-foreground">
          What positions are you targeting?
        </p>
        
        <div className="flex flex-wrap gap-2">
          {suggestedRoles
            .filter(role => !careerGoals.targetRoles.includes(role))
            .slice(0, 6)
            .map((role) => (
              <Button
                key={role}
                variant="outline"
                size="sm"
                onClick={() => handleAddRole(role)}
                className="gap-1"
              >
                <Plus className="h-3 w-3" />
                {role}
              </Button>
            ))}
        </div>

        <div className="flex gap-2">
          <Input
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            placeholder="Add a custom role..."
            onKeyDown={(e) => e.key === 'Enter' && handleAddRole(newRole)}
          />
          <Button onClick={() => handleAddRole(newRole)} size="sm">Add</Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {careerGoals.targetRoles.map((role) => (
            <Badge key={role} variant="secondary" className="gap-1 px-3 py-1">
              {role}
              <button onClick={() => handleRemoveRole(role)} className="ml-1 hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Target Industries */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">Target Industries</Label>
        <p className="text-sm text-muted-foreground">
          Which industries interest you?
        </p>
        
        <div className="flex flex-wrap gap-2">
          {suggestedIndustries
            .filter(industry => !careerGoals.targetIndustries.includes(industry))
            .slice(0, 6)
            .map((industry) => (
              <Button
                key={industry}
                variant="outline"
                size="sm"
                onClick={() => handleAddIndustry(industry)}
                className="gap-1"
              >
                <Plus className="h-3 w-3" />
                {industry}
              </Button>
            ))}
        </div>

        <div className="flex gap-2">
          <Input
            value={newIndustry}
            onChange={(e) => setNewIndustry(e.target.value)}
            placeholder="Add a custom industry..."
            onKeyDown={(e) => e.key === 'Enter' && handleAddIndustry(newIndustry)}
          />
          <Button onClick={() => handleAddIndustry(newIndustry)} size="sm">Add</Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {careerGoals.targetIndustries.map((industry) => (
            <Badge key={industry} variant="secondary" className="gap-1 px-3 py-1">
              {industry}
              <button onClick={() => handleRemoveIndustry(industry)} className="ml-1 hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Salary Expectations */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          <Label className="text-base font-semibold">Salary Expectations</Label>
        </div>
        <p className="text-sm text-muted-foreground">
          What&apos;s your expected salary range? (Annual, USD)
        </p>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span>{formatSalary(careerGoals.salaryRange.min)}</span>
            <span className="text-muted-foreground">to</span>
            <span>{formatSalary(careerGoals.salaryRange.max)}</span>
          </div>
          <Slider
            value={[careerGoals.salaryRange.min, careerGoals.salaryRange.max]}
            onValueChange={([min, max]) => updateCareerGoals({ salaryRange: { min, max } })}
            min={30}
            max={500}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>$30K</span>
            <span>$500K+</span>
          </div>
        </div>
      </div>

      {/* Preferred Locations */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          <Label className="text-base font-semibold">Preferred Locations</Label>
        </div>
        <p className="text-sm text-muted-foreground">
          Where would you like to work?
        </p>
        
        <div className="flex gap-2">
          <Input
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            placeholder="Add a location (e.g., San Francisco, CA)"
            onKeyDown={(e) => e.key === 'Enter' && handleAddLocation()}
          />
          <Button onClick={handleAddLocation} size="sm">Add</Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {careerGoals.preferredLocations.map((location) => (
            <Badge key={location} variant="secondary" className="gap-1 px-3 py-1">
              {location}
              <button onClick={() => handleRemoveLocation(location)} className="ml-1 hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Remote Preference */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">Work Arrangement</Label>
        <RadioGroup
          value={careerGoals.remotePreference}
          onValueChange={(value) => updateCareerGoals({ remotePreference: value })}
          className="grid gap-3 sm:grid-cols-2"
        >
          {remoteOptions.map((option) => (
            <div key={option.value}>
              <RadioGroupItem
                value={option.value}
                id={option.value}
                className="peer sr-only"
              />
              <Label
                htmlFor={option.value}
                className="flex flex-col items-start rounded-lg border-2 border-border p-4 cursor-pointer hover:bg-muted/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-colors"
              >
                <span className="font-medium">{option.label}</span>
                <span className="text-sm text-muted-foreground">{option.description}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Job Search Timeline */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <Label className="text-base font-semibold">Job Search Timeline</Label>
        </div>
        <p className="text-sm text-muted-foreground">
          When are you looking to start a new role?
        </p>
        
        <Select
          value={careerGoals.timeline}
          onValueChange={(value) => updateCareerGoals({ timeline: value })}
        >
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Select timeline" />
          </SelectTrigger>
          <SelectContent>
            {timelineOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
