"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Plus, 
  FileText, 
  Download, 
  Copy, 
  Trash2, 
  MoreVertical,
  Eye,
  Edit,
  Sparkles,
  Calendar,
  Star,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScoreRing } from '@/components/score-ring'
import { PageHeader } from '@/components/page-header'
import { resumeService } from '@/services/resume-service'
import { useToast } from '@/components/ui/use-toast'
import { formatDistanceToNow } from 'date-fns'
import type { Resume } from '@/types'

const templates = [
  { id: 'modern', name: 'Modern', description: 'Clean, contemporary design', popular: true },
  { id: 'minimal', name: 'Minimal', description: 'Simple and elegant', popular: false },
  { id: 'professional', name: 'Professional', description: 'Traditional corporate style', popular: true },
  { id: 'creative', name: 'Creative', description: 'Stand out from the crowd', popular: false },
]

export default function ResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchResumes = async () => {
    try {
      const data = await resumeService.getResumes()
      setResumes(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch resumes",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchResumes()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await resumeService.deleteResume(id)
      setResumes(resumes.filter(r => r.id !== id))
      toast({ title: "Success", description: "Resume deleted successfully" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete resume", variant: "destructive" })
    }
  }

  const handleSetDefault = async (id: string) => {
    try {
      await resumeService.setActiveResume(id)
      setResumes(resumes.map(r => ({ ...r, isActive: r.id === id })))
      toast({ title: "Success", description: "Default resume updated" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to set default resume", variant: "destructive" })
    }
  }

  const handleDuplicate = async (id: string, name: string) => {
    try {
      const newResume = await resumeService.duplicateResume(id, `${name} (Copy)`)
      setResumes([newResume, ...resumes])
      toast({ title: "Success", description: "Resume duplicated" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to duplicate resume", variant: "destructive" })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Resume Builder"
        description="Create ATS-optimized resumes tailored for specific roles"
        action={
          <Link href="/dashboard/resumes/builder">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Resume
            </Button>
          </Link>
        }
      />

      {/* AI Optimization Banner */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-foreground">AI Resume Optimization</h3>
            <p className="text-sm text-muted-foreground">
              Our AI analyzes your resume against job descriptions to maximize your ATS score and interview chances.
            </p>
          </div>
          <Button variant="outline" className="gap-2 flex-shrink-0">
            <Sparkles className="h-4 w-4" />
            Optimize All
          </Button>
        </CardContent>
      </Card>

      {/* Resumes Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {resumes.length === 0 ? (
          <div className="col-span-full text-center py-12 border-2 border-dashed rounded-lg">
            <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">No resumes found</p>
            <p className="text-sm text-muted-foreground mb-6">Create your first professional resume to get started</p>
            <Link href="/dashboard/resumes/builder">
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Create First Resume
              </Button>
            </Link>
          </div>
        ) : (
          resumes.map((resume, index) => (
            <motion.div
              key={resume.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group hover:border-primary/50 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base truncate">{resume.name}</CardTitle>
                        <CardDescription className="text-xs truncate">
                          {resume.templateId} Template
                        </CardDescription>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/resumes/${resume.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/resumes/${resume.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(resume.id, resume.name)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        {!resume.isActive && (
                          <DropdownMenuItem onClick={() => handleSetDefault(resume.id)}>
                            <Star className="mr-2 h-4 w-4" />
                            Set as Default
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => handleDelete(resume.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs capitalize">{resume.templateId}</Badge>
                      {resume.isActive && (
                        <Badge variant="secondary" className="text-xs gap-1">
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                          Default
                        </Badge>
                      )}
                    </div>
                    <ScoreRing score={resume.atsScore || 0} size={48} strokeWidth={3} />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDistanceToNow(new Date(resume.updatedAt), { addSuffix: true })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      0 views
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/dashboard/resumes/${resume.id}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full gap-2 text-xs">
                        <Edit className="h-3 w-3" />
                        Edit
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}

        {/* Create New Card */}
        <Link href="/dashboard/resumes/builder">
          <Card className="h-full border-dashed hover:border-primary/50 hover:bg-muted/50 transition-colors cursor-pointer group">
            <CardContent className="flex flex-col items-center justify-center h-full min-h-[280px] text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-foreground">Create New Resume</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Start from scratch or use a template
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Templates Section */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Resume Templates</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {templates.map((template) => (
            <Card key={template.id} className="hover:border-primary/50 transition-colors cursor-pointer group">
              <CardContent className="p-4">
                <div className="aspect-[8.5/11] bg-muted rounded-lg mb-4 flex items-center justify-center group-hover:bg-muted/80 transition-colors">
                  <FileText className="h-12 w-12 text-muted-foreground/50" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">{template.name}</h3>
                    <p className="text-xs text-muted-foreground">{template.description}</p>
                  </div>
                  {template.popular && (
                    <Badge variant="secondary" className="text-xs">Popular</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
