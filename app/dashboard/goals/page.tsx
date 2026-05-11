"use client"

import { useState } from 'react'
import { 
  Target, 
  TrendingUp, 
  Sparkles, 
  ArrowRight,
  CheckCircle2,
  Clock,
  Star,
  ChevronRight,
  Briefcase,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScoreRing } from '@/components/score-ring'
import { PageHeader } from '@/components/page-header'
import { careerService, CareerGoals } from '@/services/career-service'
import { useToast } from '@/components/ui/use-toast'

import Link from 'next/link'

export default function GoalsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleUpdateGoals = async () => {
    setIsLoading(true)
    try {
      // Mock data for update - in a real app, this would come from a form
      const mockGoals: CareerGoals = {
        targetRoles: ['Engineering Manager', 'Senior Developer'],
        targetIndustries: ['Technology', 'Fintech'],
        salaryMin: 120000,
        salaryMax: 180000,
        preferredLocations: ['Remote', 'Dubai'],
        remotePreference: 'remote',
        timeline: '12 months'
      }
      await careerService.updateGoals(mockGoals)
      toast({
        title: "Goals Updated",
        description: "Your career objectives have been saved."
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update goals",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Career Goals"
        description="Track your progress toward your career objectives"
        action={
          <Button onClick={handleUpdateGoals} disabled={isLoading} className="gap-2">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Target className="h-4 w-4" />}
            Update Goals
          </Button>
        }
      />

      {/* Career Readiness Overview */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Career Readiness
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ScoreRing score={78} size={140} strokeWidth={10} />
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                You&apos;re on track to reach your career goals
              </p>
            </div>
            <Link href="/dashboard/interviews" className="w-full">
              <Button variant="outline" className="mt-4 gap-2 w-full">
                View Full Analysis
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Career Path</CardTitle>
            <CardDescription>Your journey from current role to target position</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Current Status</p>
                <p className="font-semibold text-foreground">Senior Software Engineer</p>
                <p className="text-xs text-muted-foreground">3 years experience</p>
              </div>
              <div className="flex items-center gap-2 text-primary">
                <TrendingUp className="h-5 w-5" />
                <ArrowRight className="h-5 w-5" />
              </div>
              <div className="flex-1 p-4 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm text-muted-foreground">Target Goal</p>
                <p className="font-semibold text-foreground">Engineering Manager</p>
                <p className="text-xs text-primary">12-18 months timeline</p>
              </div>
            </div>

            <h4 className="font-medium mb-3">Key Milestones</h4>
            <div className="space-y-3">
              {[
                { title: 'Project Leadership', status: 'completed' },
                { title: 'Management Training', status: 'in-progress', progress: 65 },
                { title: 'Team Mentorship', status: 'in-progress', progress: 40 },
              ].map((milestone, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    milestone.status === 'completed' 
                      ? 'bg-success text-success-foreground'
                      : 'bg-primary text-primary-foreground'
                  }`}>
                    {milestone.status === 'completed' ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <span className="text-xs font-medium">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${milestone.status === 'completed' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                      {milestone.title}
                    </p>
                    {milestone.progress !== undefined && (
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={milestone.progress} className="h-1 flex-1 max-w-[100px]" />
                        <span className="text-xs text-muted-foreground">{milestone.progress}%</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Goals & Skill Gaps */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Goals */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Action Plan
                </CardTitle>
                <CardDescription>
                  Tasks for this week
                </CardDescription>
              </div>
              <Badge variant="secondary" className="gap-1">
                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                7 day streak
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={40} className="h-2 mb-4" />
            <div className="space-y-3">
              {[
                { title: 'Complete system design case study', completed: true },
                { title: 'Review leadership modules', completed: true },
                { title: 'Apply to 3 target roles', completed: false },
                { title: 'Practice mock management interview', completed: false },
              ].map((goal, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                    goal.completed ? 'bg-success text-success-foreground' : 'border-2 border-border'
                  }`}>
                    {goal.completed && <CheckCircle2 className="h-3 w-3" />}
                  </div>
                  <span className={`text-sm ${goal.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {goal.title}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Skill Gaps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Skill Gap Analysis
            </CardTitle>
            <CardDescription>Skills to develop for your target role</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { skill: 'System Design', current: 3, required: 5, priority: 'high' },
              { skill: 'Management', current: 2, required: 4, priority: 'high' },
              { skill: 'Public Speaking', current: 2, required: 3, priority: 'medium' },
            ].map((gap) => (
              <div key={gap.skill} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{gap.skill}</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs capitalize ${
                      gap.priority === 'high' ? 'border-destructive text-destructive' : 'border-warning text-warning'
                    }`}
                  >
                    {gap.priority}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Progress value={(gap.current / gap.required) * 100} className="h-2" />
                  </div>
                  <span className="text-xs text-muted-foreground w-12 text-right">
                    {gap.current}/{gap.required}
                  </span>
                </div>
              </div>
            ))}
            <Link href="/dashboard/learning" className="w-full">
              <Button variant="outline" className="w-full mt-2 gap-2">
                <Briefcase className="h-4 w-4" />
                View Recommendations
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
