"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  Trophy, 
  Clock, 
  Star,
  Play,
  CheckCircle2,
  Lock,
  ChevronRight,
  Target,
  TrendingUp,
  Loader2,
  GraduationCap,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { PageHeader } from '@/components/page-header'
import { learningService, LearningPath } from '@/services/learning-service'
import { useToast } from '@/components/ui/use-toast'

export default function LearningPage() {
  const [paths, setPaths] = useState<LearningPath[]>([])
  const [activePath, setActivePath] = useState<LearningPath | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()
    async function fetchData() {
    try {
      const [pathsData, activeData] = await Promise.all([
        learningService.getLearningPaths(),
        learningService.getActivePath()
      ]);
      setPaths(pathsData.data);
      setActivePath(activeData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch learning paths",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }



  useEffect(() => {
    fetchData()
  }, [])

  const handleGeneratePath = async () => {
    setIsGenerating(true)
    try {
      await learningService.generatePath()
      toast({
        title: "Path Generated!",
        description: "AI has created a personalized learning path for you."
      })
      fetchData()
    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: error.response?.data?.detail || "Could not generate path. Make sure your profile is complete.",
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false)
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
        title="Learning Paths"
        description="AI-recommended courses to bridge your skill gaps and reach your career goals"
      />

      {/* Continue Learning */}
      {activePath ? (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                <Badge variant="secondary" className="mb-2">Continue Learning</Badge>
                <h3 className="text-xl font-semibold text-foreground">{activePath.target_role} Path</h3>
                <p className="text-sm text-muted-foreground mt-1">Level: {activePath.current_level}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {activePath.estimated_duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    {activePath.progress}% Complete
                  </span>
                </div>
              </div>
              <Button size="lg" className="gap-2">
                <Play className="h-4 w-4" />
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
            <p className="text-muted-foreground font-medium text-lg">No active learning path</p>
            <p className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto">
              Ready to level up? Our AI can generate a custom learning roadmap based on your profile and target career goals.
            </p>
            <Button 
              size="lg" 
              onClick={handleGeneratePath} 
              disabled={isGenerating}
              className="gap-2 px-8"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating Your Path...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate My Learning Path
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{paths?.length || 0}</p>
              <p className="text-sm text-muted-foreground">Total Paths</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">--</p>
              <p className="text-sm text-muted-foreground">Learning Time</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Star className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">1</p>
              <p className="text-sm text-muted-foreground">Current Streak</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Trophy className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-muted-foreground">Achievements</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Learning Paths */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Learning Paths</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          {!paths || paths.length === 0 ? (
            <p className="text-muted-foreground text-sm col-span-full italic">No learning paths generated yet.</p>
          ) : (
            paths.map((path, index) => (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:border-primary/50 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {path.is_active && (
                            <Badge className="bg-success/10 text-success text-xs">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs capitalize">
                            {path.current_level}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{path.target_role}</CardTitle>
                        <CardDescription>Estimated duration: {path.estimated_duration}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{path.progress}%</span>
                      </div>
                      <Progress value={path.progress} className="h-2" />
                    </div>

                    {path.focus_areas && path.focus_areas.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {path.focus_areas.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {path.estimated_duration}
                      </span>
                      <Button size="sm" className="gap-1">
                        View Details
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

