"use client"

import { ChatInterface } from '@/components/ai-coach/chat-interface'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Sparkles, 
  FileText, 
  Target, 
  GraduationCap, 
  MessageSquare,
  Lightbulb,
  TrendingUp,
  Users
} from 'lucide-react'

const quickActions = [
  {
    icon: FileText,
    title: "Resume Review",
    description: "Get AI-powered feedback on your resume",
    action: "Analyze my resume and suggest improvements",
  },
  {
    icon: Target,
    title: "Interview Prep",
    description: "Practice with tailored interview questions",
    action: "Help me prepare for an upcoming interview",
  },
  {
    icon: GraduationCap,
    title: "Skills Gap Analysis",
    description: "Identify skills to develop for your target role",
    action: "What skills should I develop for my career goals?",
  },
  {
    icon: Lightbulb,
    title: "Career Advice",
    description: "Get personalized career guidance",
    action: "Give me advice on advancing my career",
  },
]

const recentTopics = [
  { topic: "Resume optimization", date: "2 hours ago" },
  { topic: "Technical interview prep", date: "Yesterday" },
  { topic: "Salary negotiation tips", date: "3 days ago" },
]

export default function AICoachPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AI Career Coach</h1>
            <p className="text-muted-foreground">
              Your personal AI assistant for career growth and job search
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Chat Area */}
        <div className="lg:col-span-2">
          <ChatInterface className="h-[calc(100vh-220px)] min-h-[500px]" />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Actions</CardTitle>
              <CardDescription>
                Common tasks to get you started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickActions.map((action, i) => (
                <Button
                  key={i}
                  variant="outline"
                  className="w-full justify-start h-auto py-3"
                >
                  <action.icon className="h-4 w-4 mr-3 text-primary" />
                  <div className="text-left">
                    <div className="font-medium text-sm">{action.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {action.description}
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* AI Capabilities */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">What I Can Help With</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Resume Writing</Badge>
                <Badge variant="secondary">Interview Prep</Badge>
                <Badge variant="secondary">Career Planning</Badge>
                <Badge variant="secondary">Skill Development</Badge>
                <Badge variant="secondary">Job Search</Badge>
                <Badge variant="secondary">Salary Negotiation</Badge>
                <Badge variant="secondary">Cover Letters</Badge>
                <Badge variant="secondary">LinkedIn Optimization</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Recent Conversations */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent Topics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentTopics.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{item.topic}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.date}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Your Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Conversations</span>
                </div>
                <span className="font-medium">24</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Resumes Analyzed</span>
                </div>
                <span className="font-medium">3</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">Mock Interviews</span>
                </div>
                <span className="font-medium">5</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
