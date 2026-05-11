"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Video, 
  Play, 
  MessageSquare, 
  Code, 
  BrainCircuit,
  Clock,
  Star,
  Trophy,
  ChevronRight,
  Sparkles,
  Target,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/page-header'
import { interviewService, InterviewSession } from '@/services/interview-service'
import { useToast } from '@/components/ui/use-toast'
import { formatDistanceToNow } from 'date-fns'
import { useRouter } from 'next/navigation'

const interviewTypes = [
  {
    id: 'behavioral',
    title: 'Behavioral Interview',
    description: 'Practice STAR method responses for common behavioral questions',
    icon: MessageSquare,
    duration: '30-45 min',
    questions: 15,
    difficulty: 'Medium',
    color: 'bg-blue-500',
  },
  {
    id: 'technical',
    title: 'Technical Interview',
    description: 'Coding challenges and technical problem-solving',
    icon: Code,
    duration: '45-60 min',
    questions: 10,
    difficulty: 'Hard',
    color: 'bg-purple-500',
  },
  {
    id: 'system-design',
    title: 'System Design',
    description: 'Architecture and scalability discussions',
    icon: BrainCircuit,
    duration: '45-60 min',
    questions: 5,
    difficulty: 'Hard',
    color: 'bg-orange-500',
  },
  {
    id: 'mock',
    title: 'Full Mock Interview',
    description: 'Complete interview simulation with AI feedback',
    icon: Video,
    duration: '60-90 min',
    questions: 20,
    difficulty: 'Varies',
    color: 'bg-green-500',
  },
]

export default function InterviewsPage() {
  const router = useRouter()
  const [sessions, setSessions] = useState<InterviewSession[]>([])
  const [stats, setStats] = useState<any>(null)
  const [selectedInterview, setSelectedInterview] = useState<InterviewSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchData = async () => {
    try {
      const [sessionsData, statsData] = await Promise.all([
        interviewService.getSessions(),
        interviewService.getStats()
      ])
      setSessions(sessionsData.data)
      setStats(statsData)
      if (sessionsData.data.length > 0) {
        setSelectedInterview(sessionsData.data[0])
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch interview data",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleStartSession = async (type: string) => {
    try {
      const session = await interviewService.createSession({ type })
      toast({
        title: "Session Started",
        description: `New ${type} session created. Redirecting...`
      })
      router.push(`/dashboard/interviews/practice?sessionId=${session.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start session",
        variant: "destructive"
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const completedCount = stats?.completed_sessions || 0
  const targetCount = 5
  const progress = (completedCount / targetCount) * 100

  return (
    <div className="space-y-6">
      <PageHeader
        title="Interview Preparation"
        description="Practice with AI-powered mock interviews tailored to your target roles"
      />

      {/* Progress Banner */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Weekly Interview Practice</h3>
                <p className="text-sm text-muted-foreground">
                  {completedCount} of {targetCount} completed • 7 day streak
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-48">
                <Progress value={progress} className="h-2" />
              </div>
              <Badge variant="secondary" className="gap-1">
                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                7 day streak
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="practice">
        <TabsList>
          <TabsTrigger value="practice" className="gap-2">
            <Play className="h-4 w-4" />
            Practice
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <Clock className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="practice" className="mt-6">
          {/* Interview Types */}
          <div className="grid gap-6 md:grid-cols-2">
            {interviewTypes.map((type, index) => (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="h-full hover:border-primary/50 transition-colors cursor-pointer group"
                  onClick={() => handleStartSession(type.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`h-12 w-12 rounded-lg ${type.color} bg-opacity-10 flex items-center justify-center flex-shrink-0`}>
                        <type.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {type.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {type.duration}
                          </span>
                          <span>{type.questions} questions</span>
                          <Badge variant="outline" className="text-xs">{type.difficulty}</Badge>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* AI Interview Coach */}
          <Card className="mt-6">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>AI Interview Coach</CardTitle>
                  <CardDescription>Get personalized practice based on your target roles</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 rounded-lg border border-border bg-muted/30">
                  <Target className="h-5 w-5 text-primary mb-2" />
                  <h4 className="font-medium">Target Companies</h4>
                  <p className="text-sm text-muted-foreground">Based on your goals</p>
                </div>
                <div className="p-4 rounded-lg border border-border bg-muted/30">
                  <BrainCircuit className="h-5 w-5 text-primary mb-2" />
                  <h4 className="font-medium">Focus Areas</h4>
                  <p className="text-sm text-muted-foreground">System Design, STAR Method</p>
                </div>
                <div className="p-4 rounded-lg border border-border bg-muted/30">
                  <Star className="h-5 w-5 text-primary mb-2" />
                  <h4 className="font-medium">Skill Level</h4>
                  <p className="text-sm text-muted-foreground">Professional</p>
                </div>
              </div>
              <Button className="w-full mt-4 gap-2" onClick={() => handleStartSession('personalized')}>
                <Sparkles className="h-4 w-4" />
                Start Personalized Session
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          {!sessions || sessions.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <Clock className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">No interview history</p>
              <p className="text-sm text-muted-foreground mb-6">Complete your first practice session to see history here</p>
              <Button variant="outline" onClick={() => handleStartSession('mixed')}>
                Start Practice
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Interview List */}
              <div className="lg:col-span-1 space-y-3">
                {sessions.map((interview) => (
                  <Card 
                    key={interview.id}
                    className={`cursor-pointer transition-all hover:border-primary/50 ${
                      selectedInterview?.id === interview.id ? 'border-primary ring-1 ring-primary/20' : ''
                    }`}
                    onClick={() => setSelectedInterview(interview)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0">
                          <Badge variant="outline" className="mb-2 capitalize">{interview.type}</Badge>
                          <h4 className="font-medium text-foreground truncate">{interview.target_role || 'General Interview'}</h4>
                          <p className="text-xs text-muted-foreground capitalize">{interview.status}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-foreground">
                            {interview.score !== null ? Math.round(interview.score) : '--'}
                          </div>
                          <p className="text-[10px] text-muted-foreground">
                            {formatDistanceToNow(new Date(interview.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Interview Details */}
              {selectedInterview && (
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <Badge variant="outline" className="mb-2 capitalize">{selectedInterview.type}</Badge>
                        <CardTitle>{selectedInterview.target_role || 'General Interview'}</CardTitle>
                        <CardDescription>
                          Difficulty: <span className="capitalize">{selectedInterview.difficulty}</span> • 
                          {formatDistanceToNow(new Date(selectedInterview.created_at), { addSuffix: true })}
                        </CardDescription>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-foreground">
                          {selectedInterview.score !== null ? Math.round(selectedInterview.score) : '--'}
                        </div>
                        <p className="text-sm text-muted-foreground">Score</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Completed Session
                      </span>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Star className="h-4 w-4 text-success" />
                        Summary
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedInterview.status === 'completed' 
                          ? 'Review your strengths and areas for improvement from this session.'
                          : 'This session is still in progress or pending.'}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <Button className="flex-1 gap-2">
                        <Play className="h-4 w-4" />
                        Review Session
                      </Button>
                      <Button variant="outline" className="gap-2">
                        <Video className="h-4 w-4" />
                        Practice Again
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
