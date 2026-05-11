"use client"

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useOnboardingStore } from '@/store/onboarding-store'
import { MapPin, Phone, Linkedin, Github, Globe } from 'lucide-react'

export function PersonalInfoStep() {
  const { data, updatePersonalInfo } = useOnboardingStore()
  const { personalInfo } = data

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={personalInfo.firstName}
            onChange={(e) => updatePersonalInfo({ firstName: e.target.value })}
            placeholder="John"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={personalInfo.lastName}
            onChange={(e) => updatePersonalInfo({ lastName: e.target.value })}
            placeholder="Doe"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="headline">Professional Headline *</Label>
        <Input
          id="headline"
          value={personalInfo.headline}
          onChange={(e) => updatePersonalInfo({ headline: e.target.value })}
          placeholder="Senior Software Engineer | Full Stack Developer | AI Enthusiast"
          required
        />
        <p className="text-xs text-muted-foreground">
          A short description that appears below your name
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Professional Summary</Label>
        <Textarea
          id="bio"
          value={personalInfo.bio}
          onChange={(e) => updatePersonalInfo({ bio: e.target.value })}
          placeholder="Write a brief summary about yourself, your experience, and what you're looking for..."
          rows={4}
        />
        <p className="text-xs text-muted-foreground">
          {personalInfo.bio.length}/500 characters
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="location"
              value={personalInfo.location}
              onChange={(e) => updatePersonalInfo({ location: e.target.value })}
              placeholder="San Francisco, CA"
              className="pl-10"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              value={personalInfo.phone}
              onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-foreground">Social Links</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <div className="relative">
              <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="linkedin"
                value={personalInfo.linkedin}
                onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
                placeholder="linkedin.com/in/johndoe"
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="github">GitHub</Label>
            <div className="relative">
              <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="github"
                value={personalInfo.github}
                onChange={(e) => updatePersonalInfo({ github: e.target.value })}
                placeholder="github.com/johndoe"
                className="pl-10"
              />
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="portfolio">Portfolio / Website</Label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="portfolio"
              value={personalInfo.portfolio}
              onChange={(e) => updatePersonalInfo({ portfolio: e.target.value })}
              placeholder="johndoe.dev"
              className="pl-10"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
