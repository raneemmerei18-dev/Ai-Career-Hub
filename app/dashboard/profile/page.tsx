"use client"

import { useState, useEffect } from 'react'
import { 
  User, 
  Mail, 
  MapPin, 
  Phone, 
  Linkedin, 
  Github, 
  Globe,
  Camera,
  Save,
  Loader2,
  Plus,
  Trash2,
  Briefcase,
  GraduationCap,
  Star,
  Calendar,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/page-header'
import { useAuthStore } from '@/store/auth-store'
import { profileService } from '@/services/profile-service'
import { useToast } from '@/components/ui/use-toast'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import type { Experience, Education, UserSkill } from '@/types'

export default function ProfilePage() {
  const { user } = useAuthStore()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    headline: '',
    bio: '',
    location: '',
    phone: '',
    linkedin: '',
    github: '',
    portfolio: '',
  })

  // Tab Data State
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [education, setEducation] = useState<Education[]>([])
  const [skills, setSkills] = useState<UserSkill[]>([])

  // Modal State
  const [isExpModalOpen, setIsExpModalOpen] = useState(false)
  const [isEduModalOpen, setIsEduModalOpen] = useState(false)
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false)

  // Form State for new items
  const [newExp, setNewExp] = useState({
    company: '',
    title: '',
    location: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
  })

  const [newEdu, setNewEdu] = useState({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    gpa: '',
  })

  const [newSkill, setNewSkill] = useState({
    name: '',
    category: 'technical',
    level: 'intermediate',
    yearsOfExperience: 1,
  })

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        const [profile, exps, edus, sks] = await Promise.all([
          profileService.getProfile(),
          profileService.getExperiences(),
          profileService.getEducation(),
          profileService.getSkills(),
        ])

        if (!isMounted) return

        if (profile) {
          setFormData(prev => ({
              ...prev,
              firstName: user?.firstName || prev.firstName,
              lastName: user?.lastName || prev.lastName,
              email: user?.email || prev.email,
              headline: profile.headline || '',
              bio: profile.bio || profile.summary || '',
              location: profile.location || '',
              phone: profile.phone || '',
              linkedin: (profile as any).linkedinUrl || '',
              github: (profile as any).githubUrl || '',
              portfolio: (profile as any).portfolioUrl || '',
            }))
        }
        setExperiences(exps)
        setEducation(edus)
        setSkills(sks)
      } catch (error) {
        console.error('Failed to fetch profile data:', error)
      } finally {
        if (isMounted) setIsFetching(false)
      }
    }

    if (user) {
      // Immediate sync from user object
      setFormData(prev => ({
          ...prev,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          bio: user.bio || ''
        }))
      fetchData()
    }

    return () => {
      isMounted = false
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await profileService.updateProfile({
        headline: formData.headline,
        summary: formData.bio,
        location: formData.location,
        phone: formData.phone,
        linkedin_url: formData.linkedin,
        github_url: formData.github,
        portfolio_url: formData.portfolio,
      } as any)
      
      toast({
        title: "Profile Updated",
        description: "Your professional information has been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Something went wrong while saving your profile.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // --- Experience Handlers ---
  const handleAddExperience = async () => {
    setIsLoading(true)
    try {
      const experience = await profileService.addExperience(newExp as any)
      setExperiences([experience, ...experiences])
      setIsExpModalOpen(false)
      setNewExp({
        company: '',
        title: '',
        location: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        description: '',
      })
      toast({ title: "Experience Added" })
    } catch (error) {
      toast({ title: "Failed to add experience", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteExperience = async (id: string) => {
    try {
      await profileService.removeExperience(id)
      setExperiences(experiences.filter(e => e.id !== id))
      toast({ title: "Experience Removed" })
    } catch (error) {
      toast({ title: "Failed to remove experience", variant: "destructive" })
    }
  }

  // --- Education Handlers ---
  const handleAddEducation = async () => {
    setIsLoading(true)
    try {
      const edu = await profileService.addEducation(newEdu as any)
      setEducation([edu, ...education])
      setIsEduModalOpen(false)
      setNewEdu({
        institution: '',
        degree: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
        gpa: '',
      })
      toast({ title: "Education Added" })
    } catch (error) {
      toast({ title: "Failed to add education", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteEducation = async (id: string) => {
    try {
      await profileService.removeEducation(id)
      setEducation(education.filter(e => e.id !== id))
      toast({ title: "Education Removed" })
    } catch (error) {
      toast({ title: "Failed to remove education", variant: "destructive" })
    }
  }

  // --- Skill Handlers ---
  const handleAddSkill = async () => {
    setIsLoading(true)
    try {
      // Need to handle skill creation/fetching in backend as well
      const skill = await profileService.addSkill({
        name: newSkill.name,
        category: newSkill.category,
        level: newSkill.level === 'beginner' ? 1 : newSkill.level === 'intermediate' ? 3 : 5,
        yearsOfExperience: newSkill.yearsOfExperience
      } as any)
      setSkills([...skills, skill])
      setIsSkillModalOpen(false)
      setNewSkill({
        name: '',
        category: 'technical',
        level: 'intermediate',
        yearsOfExperience: 1,
      })
      toast({ title: "Skill Added" })
    } catch (error) {
      toast({ title: "Failed to add skill", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteSkill = async (id: string) => {
    try {
      await profileService.removeSkill(id)
      setSkills(skills.filter(s => s.id !== id))
      toast({ title: "Skill Removed" })
    } catch (error) {
      toast({ title: "Failed to remove skill", variant: "destructive" })
    }
  }

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Manage your personal information and settings"
      />

      <Tabs defaultValue="personal">
        <TabsList>
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Profile Picture */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>Update your photo</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="relative">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary text-3xl">
                      {formData.firstName?.[0]}{formData.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <Button 
                    size="icon" 
                    variant="outline"
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  Click to upload a new photo
                </p>
              </CardContent>
            </Card>

            {/* Personal Details */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Personal Details</CardTitle>
                <CardDescription>Your basic information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="firstName"
                        name="firstName"
                        value={user?.firstName || formData.firstName}
                        onChange={handleChange}
                        className="pl-10"
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={user?.lastName || formData.lastName}
                      onChange={handleChange}
                      readOnly
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={user?.email || formData.email}
                      onChange={handleChange}
                      className="pl-10"
                      readOnly
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="headline">Professional Headline</Label>
                  <Input
                    id="headline"
                    name="headline"
                    value={formData.headline}
                    onChange={handleChange}
                    placeholder="e.g., Senior Software Engineer | Full Stack Developer"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
                <CardDescription>Connect your professional profiles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <div className="relative">
                      <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="linkedin"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleChange}
                        className="pl-10"
                        placeholder="linkedin.com/in/username"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub</Label>
                    <div className="relative">
                      <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="github"
                        name="github"
                        value={formData.github}
                        onChange={handleChange}
                        className="pl-10"
                        placeholder="github.com/username"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="portfolio">Portfolio</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="portfolio"
                        name="portfolio"
                        value={formData.portfolio}
                        onChange={handleChange}
                        className="pl-10"
                        placeholder="yourwebsite.com"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end mt-6">
            <Button onClick={handleSave} disabled={isLoading} className="gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        {/* --- Experience Tab --- */}
        <TabsContent value="experience" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Work Experience</CardTitle>
                <CardDescription>Add and manage your work history</CardDescription>
              </div>
              <Dialog open={isExpModalOpen} onOpenChange={setIsExpModalOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Experience
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add Work Experience</DialogTitle>
                    <DialogDescription>Share your professional journey</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="exp-title">Job Title</Label>
                      <Input 
                        id="exp-title" 
                        placeholder="e.g. Senior Frontend Engineer" 
                        value={newExp.title}
                        onChange={(e) => setNewExp({...newExp, title: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="exp-company">Company</Label>
                      <Input 
                        id="exp-company" 
                        placeholder="e.g. Google" 
                        value={newExp.company}
                        onChange={(e) => setNewExp({...newExp, company: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="exp-start">Start Date</Label>
                        <Input 
                          id="exp-start" 
                          type="month" 
                          value={newExp.startDate}
                          onChange={(e) => setNewExp({...newExp, startDate: e.target.value})}
                        />
                      </div>
                      {!newExp.isCurrent && (
                        <div className="grid gap-2">
                          <Label htmlFor="exp-end">End Date</Label>
                          <Input 
                            id="exp-end" 
                            type="month" 
                            value={newExp.endDate}
                            onChange={(e) => setNewExp({...newExp, endDate: e.target.value})}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="exp-current" 
                        checked={newExp.isCurrent}
                        onCheckedChange={(checked) => setNewExp({...newExp, isCurrent: checked as boolean})}
                      />
                      <Label htmlFor="exp-current">I am currently working in this role</Label>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="exp-desc">Description</Label>
                      <Textarea 
                        id="exp-desc" 
                        placeholder="Describe your responsibilities and achievements..." 
                        value={newExp.description}
                        onChange={(e) => setNewExp({...newExp, description: e.target.value})}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddExperience} disabled={isLoading}>
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Add Experience
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-6">
              {experiences.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">No work experience added yet.</p>
                </div>
              ) : (
                experiences.map((exp) => (
                  <div key={exp.id} className="flex gap-4 p-4 border rounded-lg group relative">
                    <div className="h-12 w-12 rounded bg-muted flex items-center justify-center flex-shrink-0">
                      <Briefcase className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{exp.title}</h4>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="opacity-0 group-hover:opacity-100 text-destructive transition-opacity"
                          onClick={() => handleDeleteExperience(exp.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm font-medium">{exp.company}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(exp.startDate).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })} - 
                          {exp.isCurrent ? ' Present' : ` ${new Date(exp.endDate!).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}`}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{exp.description}</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Education Tab --- */}
        <TabsContent value="education" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Education</CardTitle>
                <CardDescription>Add your educational background</CardDescription>
              </div>
              <Dialog open={isEduModalOpen} onOpenChange={setIsEduModalOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Education
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add Education</DialogTitle>
                    <DialogDescription>Tell us about your studies</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edu-inst">Institution</Label>
                      <Input 
                        id="edu-inst" 
                        placeholder="e.g. Stanford University" 
                        value={newEdu.institution}
                        onChange={(e) => setNewEdu({...newEdu, institution: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edu-degree">Degree</Label>
                      <Input 
                        id="edu-degree" 
                        placeholder="e.g. Bachelor of Science" 
                        value={newEdu.degree}
                        onChange={(e) => setNewEdu({...newEdu, degree: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edu-field">Field of Study</Label>
                      <Input 
                        id="edu-field" 
                        placeholder="e.g. Computer Science" 
                        value={newEdu.fieldOfStudy}
                        onChange={(e) => setNewEdu({...newEdu, fieldOfStudy: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="edu-start">Start Date</Label>
                        <Input 
                          id="edu-start" 
                          type="month" 
                          value={newEdu.startDate}
                          onChange={(e) => setNewEdu({...newEdu, startDate: e.target.value})}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edu-end">End Date</Label>
                        <Input 
                          id="edu-end" 
                          type="month" 
                          value={newEdu.endDate}
                          onChange={(e) => setNewEdu({...newEdu, endDate: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edu-gpa">GPA (Optional)</Label>
                      <Input 
                        id="edu-gpa" 
                        placeholder="e.g. 3.8" 
                        value={newEdu.gpa}
                        onChange={(e) => setNewEdu({...newEdu, gpa: e.target.value})}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddEducation} disabled={isLoading}>
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Add Education
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="space-y-6">
              {education.length === 0 ? (
                <div className="text-center py-12">
                  <GraduationCap className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">No education history added yet.</p>
                </div>
              ) : (
                education.map((edu) => (
                  <div key={edu.id} className="flex gap-4 p-4 border rounded-lg group relative">
                    <div className="h-12 w-12 rounded bg-muted flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{edu.institution}</h4>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="opacity-0 group-hover:opacity-100 text-destructive transition-opacity"
                          onClick={() => handleDeleteEducation(edu.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm font-medium">{edu.degree} in {edu.fieldOfStudy}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(edu.startDate).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })} - 
                          {edu.endDate ? new Date(edu.endDate).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : 'Present'}
                        </span>
                      </div>
                      {edu.gpa && <p className="text-xs font-medium text-primary mt-1">GPA: {edu.gpa}</p>}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Skills Tab --- */}
        <TabsContent value="skills" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Skills</CardTitle>
                <CardDescription>Manage your skills and proficiency levels</CardDescription>
              </div>
              <Dialog open={isSkillModalOpen} onOpenChange={setIsSkillModalOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Skill
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[400px]">
                  <DialogHeader>
                    <DialogTitle>Add Skill</DialogTitle>
                    <DialogDescription>Add a new skill to your profile</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="skill-name">Skill Name</Label>
                      <Input 
                        id="skill-name" 
                        placeholder="e.g. React" 
                        value={newSkill.name}
                        onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="skill-cat">Category</Label>
                      <Select 
                        value={newSkill.category} 
                        onValueChange={(val) => setNewSkill({...newSkill, category: val})}
                      >
                        <SelectTrigger id="skill-cat">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">Technical</SelectItem>
                          <SelectItem value="soft">Soft Skill</SelectItem>
                          <SelectItem value="tool">Tool</SelectItem>
                          <SelectItem value="framework">Framework</SelectItem>
                          <SelectItem value="database">Database</SelectItem>
                          <SelectItem value="cloud">Cloud</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="skill-level">Proficiency</Label>
                      <Select 
                        value={newSkill.level} 
                        onValueChange={(val) => setNewSkill({...newSkill, level: val})}
                      >
                        <SelectTrigger id="skill-level">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                          <SelectItem value="expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="skill-exp">Years of Experience</Label>
                      <Input 
                        id="skill-exp" 
                        type="number" 
                        min="0"
                        value={newSkill.yearsOfExperience}
                        onChange={(e) => setNewSkill({...newSkill, yearsOfExperience: parseInt(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddSkill} disabled={isLoading}>
                      {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Add Skill
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {skills.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <Star className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground">No skills added yet.</p>
                  </div>
                ) : (
                  skills.map((s) => (
                    <div key={s.id} className="flex items-center justify-between p-3 border rounded-lg group">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                          <Star className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{s.skill.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{s.proficiencyLevel} • {s.yearsOfExperience}y</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="opacity-0 group-hover:opacity-100 text-destructive transition-opacity h-8 w-8"
                        onClick={() => handleDeleteSkill(s.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
