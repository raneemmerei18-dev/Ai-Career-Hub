"use client"

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Briefcase, 
  Video, 
  TrendingUp, 
  Target,
  ArrowRight,
  Sparkles,
  Calendar,
  Clock,
  ChevronRight,
  Star,
  BookOpen,
  CheckCircle2
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScoreRing } from '@/components/score-ring'
import { StatCard } from '@/components/stat-card'
import { PageHeader } from '@/components/page-header'
import { useAuthStore } from '@/store/auth-store'
import { useJobStore } from '@/store/job-store'
import { useToast } from '@/components/ui/use-toast'

// Mock data for other stats
const mockStats = {
  careerReadinessScore: 78,
  profileCompletion: 85,
  resumeScore: 72,
  interviewsCompleted: 12,
  skillsToLearn: 5,
}

const mockUpcomingTasks = [
  { id: 1, title: 'Complete AWS certification course', progress: 65, dueDate: 'Mar 15' },
  { id: 2, title: 'Practice system design interview', progress: 30, dueDate: 'Mar 10' },
  { id: 3, title: 'Update resume for Google application', progress: 0, dueDate: 'Mar 8' },
]

export default function DashboardPage() {
  const { user } = useAuthStore()
  const { jobs, applyForJob, isLoading: isJobLoading } = useJobStore()
  const { toast } = useToast()
  const [applyingId, setApplyingId] = useState<string | null>(null)
  
  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }, [])

  const topMatches = useMemo(() => {
    return [...jobs]
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3)
  }, [jobs])

  const recentActivity = useMemo(() => {
    const staticActivity = [
      { id: 'sa1', type: 'resume', title: 'Resume updated', time: '2 hours ago', icon: FileText },
      { id: 'sa3', type: 'interview', title: 'Completed mock interview', time: '1 day ago', icon: Video },
      { id: 'sa4', type: 'learning', title: 'Completed AWS Fundamentals course', time: '2 days ago', icon: BookOpen },
    ]

    const applications = jobs
      .filter(j => j.status === 'applied')
      .map(j => ({
        id: `app-${j.id}`,
        type: 'job',
        title: `Applied to ${j.job.title} at ${j.job.company}`,
        time: j.appliedAt ? new Date(j.appliedAt).toLocaleDateString() : 'Recently',
        icon: Briefcase
      }))

    return [...applications, ...staticActivity].slice(0, 4)
  }, [jobs])

  const handleApply = async (e: React.MouseEvent, jobId: string, jobTitle: string) => {
    e.preventDefault()
    e.stopPropagation()
    setApplyingId(jobId)
    try {
      await applyForJob(jobId)
      toast({
        title: "Application Successful!",
        description: `You've successfully applied to ${jobTitle}.`,
      })
    } catch (error) {
      toast({
        title: "Application Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      })
    } finally {
      setApplyingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${greeting}, ${user?.firstName || 'there'}!`}
        description="Here's an overview of your career progress and opportunities."
      />

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Career Readiness"
          value={`${mockStats.careerReadinessScore}%`}
          description="Based on profile, skills & goals"
          icon={Target}
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Job Matches"
          value={jobs.length.toString()}
          description="Total matched roles"
          icon={Briefcase}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Resume Score"
          value={`${mockStats.resumeScore}/100`}
          description="ATS optimization score"
          icon={FileText}
          trend={{ value: 3, isPositive: true }}
        />
        <StatCard
          title="Skills to Learn"
          value={mockStats.skillsToLearn.toString()}
          description="Recommended for target roles"
          icon={TrendingUp}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Career Readiness Score */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Career Readiness
            </CardTitle>
            <CardDescription>Your overall career health score</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ScoreRing score={mockStats.careerReadinessScore} size={160} strokeWidth={12} />
            <div className="mt-4 w-full space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Profile Completion</span>
                <span className="font-medium">{mockStats.profileCompletion}%</span>
              </div>
              <Progress value={mockStats.profileCompletion} className="h-2" />
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Resume Score</span>
                <span className="font-medium">{mockStats.resumeScore}%</span>
              </div>
              <Progress value={mockStats.resumeScore} className="h-2" />
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Interview Readiness</span>
                <span className="font-medium">75%</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <Link href="/dashboard/goals" className="w-full mt-4">
              <Button variant="outline" className="w-full gap-2">
                View Full Analysis
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Top Job Matches */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Top Job Matches</CardTitle>
              <CardDescription>AI-matched opportunities for you</CardDescription>
            </div>
            <Link href="/dashboard/jobs">
              <Button variant="ghost" size="sm" className="gap-1">
                View All
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topMatches.map((match, index) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="flex-shrink-0">
                    <ScoreRing score={match.matchScore} size={48} strokeWidth={4} showLabel={false} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-foreground truncate">{match.job.title}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {match.matchScore}% match
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{match.job.company} • {match.job.location}</p>
                    <p className="text-sm text-primary font-medium">
                      {match.job.salaryMin ? `$${(match.job.salaryMin/1000).toFixed(0)}K - $${(match.job.salaryMax!/1000).toFixed(0)}K` : 'Competitive'}
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-xs text-muted-foreground">{new Date(match.job.postedAt).toLocaleDateString()}</p>
                    {match.status === 'applied' ? (
                      <Button size="sm" variant="outline" className="mt-2 gap-1 text-success border-success/50 bg-success/5" disabled>
                        <CheckCircle2 className="h-4 w-4" />
                        Applied
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        className="mt-2" 
                        onClick={(e) => handleApply(e, match.id, match.job.title)}
                        disabled={applyingId === match.id}
                      >
                        {applyingId === match.id ? "Applying..." : "Apply"}
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Upcoming Tasks
              </CardTitle>
              <CardDescription>Your learning & career goals</CardDescription>
            </div>
            <Link href="/dashboard/learning">
              <Button variant="ghost" size="sm" className="gap-1">
                View All
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockUpcomingTasks.map((task) => (
                <div key={task.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{task.title}</span>
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {task.dueDate}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={task.progress} className="h-2 flex-1" />
                    <span className="text-xs text-muted-foreground w-10">{task.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <activity.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
              {recentActivity.length === 0 && (
                <p className="text-center py-4 text-muted-foreground text-sm">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Jump to common tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Create Resume', description: 'Build an ATS-optimized resume', icon: FileText, href: '/dashboard/resumes/new', color: 'bg-blue-500' },
              { title: 'Find Jobs', description: 'Browse matched opportunities', icon: Briefcase, href: '/dashboard/jobs', color: 'bg-green-500' },
              { title: 'Practice Interview', description: 'AI-powered mock interviews', icon: Video, href: '/dashboard/interviews', color: 'bg-purple-500' },
              { title: 'Track Goals', description: 'Monitor your progress', icon: Target, href: '/dashboard/goals', color: 'bg-orange-500' },
            ].map((action) => (
              <Link key={action.title} href={action.href}>
                <div className="group p-4 rounded-lg border border-border bg-card hover:bg-muted/50 hover:border-primary/50 transition-all cursor-pointer h-full">
                  <div className={`h-10 w-10 rounded-lg ${action.color} bg-opacity-10 flex items-center justify-center mb-3`}>
                    <action.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">{action.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
