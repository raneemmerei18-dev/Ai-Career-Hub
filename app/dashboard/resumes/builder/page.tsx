"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft,
  Download,
  Eye,
  FileText,
  Sparkles,
  Plus,
  Trash2,
  GripVertical,
  Check,
  Loader2,
  Palette,
  Layout,
  Type,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface ResumeSection {
  id: string
  type: 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications'
  title: string
  content: Record<string, unknown>
}

const templates = [
  { id: 'modern', name: 'Modern', description: 'Clean, minimalist design' },
  { id: 'professional', name: 'Professional', description: 'Traditional corporate style' },
  { id: 'creative', name: 'Creative', description: 'Bold and unique layout' },
  { id: 'technical', name: 'Technical', description: 'Optimized for tech roles' },
]

const colorSchemes = [
  { id: 'blue', name: 'Ocean Blue', primary: '#3B82F6', secondary: '#1E40AF' },
  { id: 'green', name: 'Forest Green', primary: '#22C55E', secondary: '#166534' },
  { id: 'purple', name: 'Royal Purple', primary: '#8B5CF6', secondary: '#5B21B6' },
  { id: 'slate', name: 'Slate Gray', primary: '#64748B', secondary: '#334155' },
]

export default function ResumeBuilderPage() {
  const [activeTab, setActiveTab] = useState('content')
  const [selectedTemplate, setSelectedTemplate] = useState('modern')
  const [selectedColor, setSelectedColor] = useState('blue')
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: '',
    },
    summary: '',
    experience: [
      {
        id: '1',
        company: '',
        title: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        achievements: [''],
      }
    ],
    education: [
      {
        id: '1',
        institution: '',
        degree: '',
        field: '',
        graduationDate: '',
        gpa: '',
      }
    ],
    skills: {
      technical: [''],
      soft: [''],
      languages: [''],
    },
    certifications: [
      {
        id: '1',
        name: '',
        issuer: '',
        date: '',
        expiry: '',
      }
    ],
    projects: [
      {
        id: '1',
        name: '',
        description: '',
        technologies: [''],
        link: '',
      }
    ],
  })

  const completionScore = 65 // Calculate based on filled fields

  const handleGenerateWithAI = async (section: string) => {
    setIsGenerating(true)
    // Simulate AI generation
    setTimeout(() => {
      setAiSuggestions([
        'Consider adding specific metrics to your achievements',
        'Use more action verbs like "spearheaded", "implemented", "optimized"',
        'Include keywords relevant to your target role',
      ])
      setIsGenerating(false)
    }, 2000)
  }

  const handleExportPDF = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card sticky top-0 z-10 no-print">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/resumes">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="font-semibold">Resume Builder</h1>
              <p className="text-sm text-muted-foreground">
                Create an ATS-optimized resume
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Completion:</span>
              <Progress value={completionScore} className="w-24 h-2" />
              <span className="font-medium">{completionScore}%</span>
            </div>
            <Button size="sm" onClick={handleExportPDF}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-0 min-h-[calc(100vh-73px)]">
        {/* Editor Panel */}
        <div className="border-r no-print">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="border-b px-4">
              <TabsList className="h-12 w-full justify-start rounded-none border-b-0 bg-transparent p-0">
                <TabsTrigger
                  value="content"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Content
                </TabsTrigger>
                <TabsTrigger
                  value="ai"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Assist
                </TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="h-[calc(100vh-145px)]">
              <TabsContent value="content" className="p-4 space-y-6 mt-0">
                {/* Personal Information */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          placeholder="John Doe"
                          value={resumeData.personalInfo.fullName}
                          onChange={(e) => setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, fullName: e.target.value }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={resumeData.personalInfo.email}
                          onChange={(e) => setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, email: e.target.value }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          placeholder="+1 (555) 123-4567"
                          value={resumeData.personalInfo.phone}
                          onChange={(e) => setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, phone: e.target.value }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          placeholder="San Francisco, CA"
                          value={resumeData.personalInfo.location}
                          onChange={(e) => setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, location: e.target.value }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          placeholder="linkedin.com/in/johndoe"
                          value={resumeData.personalInfo.linkedin}
                          onChange={(e) => setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, linkedin: e.target.value }
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          placeholder="johndoe.com"
                          value={resumeData.personalInfo.website}
                          onChange={(e) => setResumeData({
                            ...resumeData,
                            personalInfo: { ...resumeData.personalInfo, website: e.target.value }
                          })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Professional Summary */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Professional Summary</CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGenerateWithAI('summary')}
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Sparkles className="h-4 w-4 mr-2" />
                        )}
                        Generate with AI
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Write a compelling 2-3 sentence summary..."
                      className="min-h-[120px]"
                      value={resumeData.summary}
                      onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                    />
                  </CardContent>
                </Card>

                {/* Experience */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Work Experience</CardTitle>
                      <Button variant="outline" size="sm" onClick={() => {
                        const newExp = {
                          id: Math.random().toString(36).substr(2, 9),
                          company: '',
                          title: '',
                          location: '',
                          startDate: '',
                          endDate: '',
                          current: false,
                          description: '',
                          achievements: [''],
                        }
                        setResumeData({ ...resumeData, experience: [...resumeData.experience, newExp] })
                      }}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Experience
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {resumeData.experience.map((exp, index) => (
                      <div key={exp.id} className="border rounded-lg p-4 space-y-4">
                        <div className="flex items-start gap-2">
                          <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                          <div className="flex-1 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Job Title</Label>
                                <Input 
                                  value={exp.title}
                                  onChange={(e) => {
                                    const newExp = [...resumeData.experience]
                                    newExp[index].title = e.target.value
                                    setResumeData({ ...resumeData, experience: newExp })
                                  }}
                                  placeholder="Senior Software Engineer" 
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Company</Label>
                                <Input 
                                  value={exp.company}
                                  onChange={(e) => {
                                    const newExp = [...resumeData.experience]
                                    newExp[index].company = e.target.value
                                    setResumeData({ ...resumeData, experience: newExp })
                                  }}
                                  placeholder="Tech Company Inc." 
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Start Date</Label>
                                <Input 
                                  type="month"
                                  value={exp.startDate}
                                  onChange={(e) => {
                                    const newExp = [...resumeData.experience]
                                    newExp[index].startDate = e.target.value
                                    setResumeData({ ...resumeData, experience: newExp })
                                  }}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>End Date</Label>
                                <Input 
                                  type="month" 
                                  value={exp.endDate}
                                  onChange={(e) => {
                                    const newExp = [...resumeData.experience]
                                    newExp[index].endDate = e.target.value
                                    setResumeData({ ...resumeData, experience: newExp })
                                  }}
                                  placeholder="Present" 
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Description</Label>
                              <Textarea
                                value={exp.description}
                                onChange={(e) => {
                                  const newExp = [...resumeData.experience]
                                  newExp[index].description = e.target.value
                                  setResumeData({ ...resumeData, experience: newExp })
                                }}
                                placeholder="Describe your responsibilities..."
                                className="min-h-[100px]"
                              />
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => {
                            setResumeData({ 
                              ...resumeData, 
                              experience: resumeData.experience.filter((_, i) => i !== index) 
                            })
                          }}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Education */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Education</CardTitle>
                      <Button variant="outline" size="sm" onClick={() => {
                        const newEdu = {
                          id: Math.random().toString(36).substr(2, 9),
                          institution: '',
                          degree: '',
                          field: '',
                          graduationDate: '',
                          gpa: '',
                        }
                        setResumeData({ ...resumeData, education: [...resumeData.education, newEdu] })
                      }}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Education
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {resumeData.education.map((edu, index) => (
                      <div key={edu.id} className="border rounded-lg p-4 space-y-4 relative">
                        <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-destructive" onClick={() => {
                          setResumeData({ 
                            ...resumeData, 
                            education: resumeData.education.filter((_, i) => i !== index) 
                          })
                        }}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="grid grid-cols-2 gap-4 pt-2">
                          <div className="space-y-2">
                            <Label>Institution</Label>
                            <Input 
                              value={edu.institution}
                              onChange={(e) => {
                                const newEdu = [...resumeData.education]
                                newEdu[index].institution = e.target.value
                                setResumeData({ ...resumeData, education: newEdu })
                              }}
                              placeholder="University Name" 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Degree</Label>
                            <Input 
                              value={edu.degree}
                              onChange={(e) => {
                                const newEdu = [...resumeData.education]
                                newEdu[index].degree = e.target.value
                                setResumeData({ ...resumeData, education: newEdu })
                              }}
                              placeholder="Bachelor of Science" 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Field of Study</Label>
                            <Input 
                              value={edu.field}
                              onChange={(e) => {
                                const newEdu = [...resumeData.education]
                                newEdu[index].field = e.target.value
                                setResumeData({ ...resumeData, education: newEdu })
                              }}
                              placeholder="Computer Science" 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Graduation Date</Label>
                            <Input 
                              type="month"
                              value={edu.graduationDate}
                              onChange={(e) => {
                                const newEdu = [...resumeData.education]
                                newEdu[index].graduationDate = e.target.value
                                setResumeData({ ...resumeData, education: newEdu })
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Skills */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Skills</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Technical Skills</Label>
                      <Input 
                        value={resumeData.skills.technical.join(', ')}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          skills: { ...resumeData.skills, technical: e.target.value.split(',').map(s => s.trim()) }
                        })}
                        placeholder="React, TypeScript, Node.js, Python..." 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Soft Skills</Label>
                      <Input 
                        value={resumeData.skills.soft.join(', ')}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          skills: { ...resumeData.skills, soft: e.target.value.split(',').map(s => s.trim()) }
                        })}
                        placeholder="Leadership, Communication, Problem-solving..." 
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ai" className="p-4 space-y-6 mt-0">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">AI Resume Assistant</CardTitle>
                    <CardDescription>
                      Get intelligent suggestions to improve your resume
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full" onClick={() => handleGenerateWithAI('full')}>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Analyze Full Resume
                    </Button>
                    
                    {aiSuggestions.length > 0 && (
                      <div className="space-y-3 pt-4">
                        <h4 className="font-medium text-sm">Suggestions</h4>
                        {aiSuggestions.map((suggestion, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                            <Check className="h-4 w-4 text-green-500 mt-0.5" />
                            <span className="text-sm">{suggestion}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>

        {/* Preview Panel */}
        <div className="bg-muted/50 p-6 overflow-auto no-print">
          <div className="resume-preview bg-white rounded-lg shadow-lg aspect-[8.5/11] w-full max-w-[600px] mx-auto p-8 text-black min-h-[842px] print:fixed print:inset-0 print:m-0 print:p-8 print:shadow-none print:w-full print:max-w-none print:z-[9999] print:bg-white">
            {/* Resume Preview */}
            <div className="space-y-4">
              <div className="text-center border-b pb-4">
                <h2 className="text-2xl font-bold uppercase tracking-wider">
                  {resumeData.personalInfo.fullName || 'YOUR NAME'}
                </h2>
                <div className="text-[10px] text-gray-600 mt-1 flex justify-center gap-2">
                  <span>{resumeData.personalInfo.email}</span>
                  {resumeData.personalInfo.phone && <span>• {resumeData.personalInfo.phone}</span>}
                  {resumeData.personalInfo.location && <span>• {resumeData.personalInfo.location}</span>}
                </div>
                <div className="text-[10px] text-blue-600 mt-0.5 flex justify-center gap-2">
                  {resumeData.personalInfo.linkedin && <span>{resumeData.personalInfo.linkedin}</span>}
                  {resumeData.personalInfo.website && <span>{resumeData.personalInfo.website}</span>}
                </div>
              </div>
              
              {resumeData.summary && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wide border-b border-gray-200 mb-1.5">
                    Summary
                  </h3>
                  <p className="text-[10px] text-gray-700 leading-normal text-justify">
                    {resumeData.summary}
                  </p>
                </div>
              )}

              {resumeData.experience.some(exp => exp.title || exp.company) && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wide border-b border-gray-200 mb-1.5">
                    Experience
                  </h3>
                  <div className="space-y-3">
                    {resumeData.experience.filter(exp => exp.title || exp.company).map(exp => (
                      <div key={exp.id}>
                        <div className="flex justify-between items-baseline">
                          <span className="font-bold text-[11px]">{exp.title}</span>
                          <span className="text-[9px] text-gray-600">{exp.startDate} - {exp.endDate || 'Present'}</span>
                        </div>
                        <div className="flex justify-between items-baseline italic mb-1">
                          <span className="text-[10px]">{exp.company}</span>
                          <span className="text-[9px] text-gray-600">{exp.location}</span>
                        </div>
                        <p className="text-[10px] text-gray-700 leading-snug whitespace-pre-line">
                          {exp.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {resumeData.education.some(edu => edu.institution) && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wide border-b border-gray-200 mb-1.5">
                    Education
                  </h3>
                  <div className="space-y-2">
                    {resumeData.education.filter(edu => edu.institution).map(edu => (
                      <div key={edu.id} className="flex justify-between items-baseline">
                        <div>
                          <span className="font-bold text-[10px]">{edu.institution}</span>
                          <span className="text-[10px]"> — {edu.degree} in {edu.field}</span>
                        </div>
                        <span className="text-[9px] text-gray-600">{edu.graduationDate}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(resumeData.skills.technical.length > 0 || resumeData.skills.soft.length > 0) && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wide border-b border-gray-200 mb-1.5">
                    Skills
                  </h3>
                  <div className="space-y-1">
                    {resumeData.skills.technical.some(s => s) && (
                      <div className="text-[10px]">
                        <span className="font-bold">Technical: </span>
                        {resumeData.skills.technical.join(', ')}
                      </div>
                    )}
                    {resumeData.skills.soft.some(s => s) && (
                      <div className="text-[10px]">
                        <span className="font-bold">Soft Skills: </span>
                        {resumeData.skills.soft.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
