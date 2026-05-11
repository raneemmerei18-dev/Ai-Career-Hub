"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  ArrowLeft,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Play,
  Pause,
  SkipForward,
  Clock,
  Sparkles,
  RotateCcw,
  CheckCircle,
  Lightbulb,
  Loader2,
  BrainCircuit,
  Volume2
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { interviewService } from '@/services/interview-service'
import { useToast } from '@/components/ui/use-toast'
import { useSearchParams, useRouter } from 'next/navigation'

interface Question {
  id: string
  question: string
  type: string
  tips: string[]
  timeLimit: number
}

export default function InterviewPracticePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isStarted, setIsStarted] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(180)
  const [isRecording, setIsRecording] = useState(false)
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [isMicOn, setIsMicOn] = useState(true)
  const [showTips, setShowTips] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  // Speech Recognition state
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef<any>(null)
  const isRecordingRef = useRef(false) // Use ref for the onend handler to see current state
  const micPermissionDeniedRef = useRef(false)
  const micDeniedToastShownRef = useRef(false)
  
  const [responses, setResponses] = useState<Record<string, {
    transcript: string
    feedback?: {
      score: number
      feedback: string
      strengths: string[]
      improvements: string[]
      model_answer?: string
    }
  }>>({})
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  
  const currentQuestion = questions[currentQuestionIndex]
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0

  // Initialize Speech Recognition ONCE
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      
      if (SpeechRecognition) {
        console.log('Speech Recognition initialized')
        const recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = 'en-US'

        recognition.onstart = () => {
          console.log('Speech recognition started')
          setIsRecording(true)
          micPermissionDeniedRef.current = false
          isRecordingRef.current = true
        }

        recognition.onresult = (event: any) => {
          let currentTranscript = ''
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript
          }
          console.log('Live Transcript:', currentTranscript)
          setTranscript(currentTranscript)
        }

        recognition.onend = () => {
          console.log('Speech recognition ended')
          // Auto-restart if we're still supposed to be recording
          if (isRecordingRef.current && !micPermissionDeniedRef.current) {
            console.log('Auto-restarting speech recognition...')
            try {
              recognition.start()
            } catch (e) {
              console.error('Failed to restart recognition', e)
            }
          } else {
            setIsRecording(false)
          }
        }

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            micPermissionDeniedRef.current = true
            isRecordingRef.current = false
            setIsRecording(false)
            setIsMicOn(false)
            if (!micDeniedToastShownRef.current) {
              toast({ title: "Mic Error", description: "Microphone permission denied. Please allow microphone access in your browser/site settings.", variant: "destructive" })
              micDeniedToastShownRef.current = true
            }
          }
        }

        recognitionRef.current = recognition
      } else {
        console.warn('Speech Recognition not supported in this browser')
        toast({ title: "Compatibility Info", description: "Your browser doesn't support live transcription. Please use Chrome for the best experience." })
      }
    }

    return () => {
      if (recognitionRef.current) {
        isRecordingRef.current = false
        recognitionRef.current.stop()
      }
    }
  }, []) 

  // Camera Management
  useEffect(() => {
    if (isStarted && isCameraOn && !streamRef.current) {
      const startCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: true 
          })
          streamRef.current = stream
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
        } catch (error) {
          console.error('Error accessing camera:', error)
          setIsCameraOn(false)
        }
      }
      startCamera()
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
        streamRef.current = null
      }
    }
  }, [isStarted, isCameraOn])

  // Fetch session data
  useEffect(() => {
    const initSession = async () => {
      const sid = searchParams.get('sessionId')
      try {
        let session
        if (sid) {
          setSessionId(sid)
          session = await interviewService.getSession(sid)
        } else {
          session = await interviewService.createSession({ type: 'mixed', difficulty: 'medium' })
          setSessionId(session.id)
        }
        
        if (session && session.questions && session.questions.length > 0) {
          setQuestions(session.questions.map((q: any) => ({ ...q, timeLimit: 180 })))
        } else {
          // Fallback questions if AI fails
          setQuestions([
            { id: 'f1', question: "Tell me about yourself and your background.", type: 'behavioral', tips: ["Mention your recent role", "Keep it under 2 minutes"], timeLimit: 180 },
            { id: 'f2', question: "What are your greatest technical strengths?", type: 'technical', tips: ["Mention specific languages", "Give examples of projects"], timeLimit: 180 },
            { id: 'f3', question: "Describe a difficult project you worked on.", type: 'behavioral', tips: ["Use STAR method", "Focus on the resolution"], timeLimit: 180 }
          ])
        }
      } catch (error) {
        console.error("Session init failed:", error)
        toast({ title: "Session Warning", description: "Using standard practice mode.", variant: "default" })
        setQuestions([
          { id: 'f1', question: "Tell me about yourself and your background.", type: 'behavioral', tips: ["Mention your recent role", "Keep it under 2 minutes"], timeLimit: 180 },
          { id: 'f2', question: "What are your greatest technical strengths?", type: 'technical', tips: ["Mention specific languages", "Give examples of projects"], timeLimit: 180 },
          { id: 'f3', question: "Describe a difficult project you worked on.", type: 'behavioral', tips: ["Use STAR method", "Focus on the resolution"], timeLimit: 180 }
        ])
      } finally {
        setIsLoading(false)
      }
    }
    initSession()
  }, [searchParams])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isStarted && !isPaused && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isStarted, isPaused, timeRemaining])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleStart = () => {
    setIsStarted(true)
    startRecording()
  }

  const startRecording = () => {
    if (micPermissionDeniedRef.current) {
      toast({ title: "Mic Disabled", description: "Microphone access is blocked. Enable it from browser settings, then refresh the page." })
      return
    }
    if (recognitionRef.current && !isRecordingRef.current) {
      setTranscript('')
      isRecordingRef.current = true
      recognitionRef.current.start()
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current && isRecordingRef.current) {
      isRecordingRef.current = false
      recognitionRef.current.stop()
    }
  }

  const handleSubmitAnswer = async () => {
    console.log('Submitting answer for question:', currentQuestionIndex)
    if (!sessionId || !currentQuestion || !transcript.trim()) {
      toast({ title: "No answer detected", description: "Please speak your answer before continuing." })
      return
    }

    setIsSubmitting(true)
    stopRecording()

    try {
      console.log('Calling evaluation API...')
      const result = await interviewService.submitAnswer(sessionId, {
        question_id: currentQuestion.id,
        answer: transcript,
        time_taken_seconds: 180 - timeRemaining
      })
      console.log('Evaluation result received:', result)

      setResponses(prev => ({
        ...prev,
        [currentQuestion.id]: {
          transcript: transcript,
          feedback: result
        }
      }))

      toast({ title: "Answer Evaluated", description: `Score: ${result.score}%` })
      
      // Explicitly check if there's a next question
      const nextIndex = currentQuestionIndex + 1
      if (nextIndex < questions.length) {
        console.log('Moving to next question:', nextIndex)
        setCurrentQuestionIndex(nextIndex)
        setTimeRemaining(180)
        setShowTips(false)
        setTranscript('')
        // Delay recording start to allow previous one to stop fully
        setTimeout(() => {
          if (isStarted && !isPaused) {
            startRecording()
          }
        }, 500)
      } else {
        console.log('Interview completed')
        toast({ title: "Interview Completed!", description: "Well done! Redirecting to dashboard..." })
        setTimeout(() => router.push('/dashboard/interviews'), 2000)
      }
    } catch (error) {
      console.error('Submission error:', error)
      toast({ title: "Evaluation Failed", description: "AI couldn't evaluate your answer right now.", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex)
      setTimeRemaining(180)
      setShowTips(false)
      setTranscript('')
      setTimeout(() => startRecording(), 300)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'behavioral': return 'bg-blue-100 text-blue-700'
      case 'technical': return 'bg-purple-100 text-purple-700'
      case 'system_design': return 'bg-orange-100 text-orange-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <BrainCircuit className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Groq AI Mock Interview</CardTitle>
            <CardDescription>
              Tailored specifically for your skills and target role
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted rounded-lg p-6 space-y-4">
              <h3 className="font-medium">Interview Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Questions:</span>
                  <span className="ml-2 font-medium">{questions.length}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Time:</span>
                  <span className="ml-2 font-medium">~15 minutes</span>
                </div>
                <div className="col-span-2">
                  <span className="text-muted-foreground">Target Role:</span>
                  <span className="ml-2 font-medium text-primary">Senior Software Engineer</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Link href="/dashboard/interviews" className="flex-1">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <Button className="flex-1" onClick={handleStart}>
                <Play className="h-4 w-4 mr-2" />
                Start AI Interview
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/interviews">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="font-semibold">AI Mock Interview</h1>
              <p className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Progress value={progress} className="w-32 h-2" />
              <span className="text-sm font-medium">{Math.round(progress)}%</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsPaused(!isPaused)}>
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 p-6">
        {/* Main Video Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <div className="aspect-video bg-gray-900 relative">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className={cn("w-full h-full object-cover", !isCameraOn && "hidden")}
              />
              {!isCameraOn && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <VideoOff className="h-16 w-16 text-white/50" />
                </div>
              )}
              
              {/* Timer Overlay */}
              <div className="absolute top-4 left-4 bg-black/60 rounded-lg px-3 py-2 flex items-center gap-2">
                <Clock className="h-4 w-4 text-white" />
                <span className={cn("font-mono text-lg font-bold text-white", timeRemaining <= 30 && "text-red-400")}>
                  {formatTime(timeRemaining)}
                </span>
              </div>

              {/* Recording Indicator */}
              {isRecording && (
                <div className="absolute top-4 right-4 bg-red-500 rounded-full px-3 py-1 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                  <span className="text-white text-sm font-medium uppercase">Live</span>
                </div>
              )}
            </div>
          </Card>

          {/* Question Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {currentQuestion && (
                    <Badge className={getTypeColor(currentQuestion.type)}>
                      {currentQuestion.type}
                    </Badge>
                  )}
                  <Badge variant="outline">Groq AI</Badge>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowTips(!showTips)}>
                  <Lightbulb className="h-4 w-4 mr-2" />
                  {showTips ? 'Hide Tips' : 'Show Tips'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-lg font-medium leading-relaxed">
                {currentQuestion?.question}
              </p>

              {showTips && currentQuestion?.tips && (
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <ul className="space-y-1 text-sm text-amber-700 dark:text-amber-300">
                    {currentQuestion.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-500">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                   {isRecording ? <Volume2 className="h-4 w-4 animate-pulse text-primary" /> : <MicOff className="h-4 w-4" />}
                   {isRecording ? 'Listening...' : 'Microphone Off'}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => setTranscript('')}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                  <Button onClick={handleSubmitAnswer} disabled={isSubmitting || !transcript.trim()}>
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                    Submit Answer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Feedback (Real-time) */}
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                AI Evaluation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {responses[currentQuestion?.id]?.feedback ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary">
                      {responses[currentQuestion.id].feedback?.score}%
                    </div>
                    <p className="text-xs text-muted-foreground uppercase mt-1">Score</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Feedback</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {responses[currentQuestion.id].feedback?.feedback}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Sparkles className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground italic">
                    Submit your answer to see Groq AI feedback
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Transcript */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Live Transcript</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {transcript || <span className="italic text-muted-foreground">Start speaking to see your transcript here...</span>}
                </p>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
