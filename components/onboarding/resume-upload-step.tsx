"use client"

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, X, Sparkles, CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import { useOnboardingStore } from '@/store/onboarding-store'

export function ResumeUploadStep() {
  const { data, setResumeFile, setResumeAnalysis } = useOnboardingStore()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setResumeFile(file)
    
    // Simulate upload progress
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 100)

    // Simulate AI analysis after upload
    setTimeout(async () => {
      setIsAnalyzing(true)
      
      // In a real app, this would call an API endpoint
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock analysis results
      setResumeAnalysis({
        score: 78,
        extractedData: {
          skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL'],
          experience: 5,
          education: "Bachelor's in Computer Science",
        },
        suggestions: [
          'Add quantifiable achievements to your experience section',
          'Include more industry-specific keywords',
          'Consider adding a projects section',
        ],
      })
      
      setIsAnalyzing(false)
    }, 1500)
  }, [setResumeFile, setResumeAnalysis])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  })

  const handleRemoveFile = () => {
    setResumeFile(null)
    setResumeAnalysis(null)
    setUploadProgress(0)
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Upload your existing resume and our AI will analyze it to enhance your profile.
          This step is optional but recommended.
        </p>
      </div>

      {!data.resumeFile ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-muted/50'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                or click to browse (PDF, DOC, DOCX - Max 5MB)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-foreground truncate">
                    {data.resumeFile.name}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveFile}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {(data.resumeFile.size / 1024).toFixed(1)} KB
                </p>
                
                {uploadProgress < 100 && (
                  <div className="mt-2">
                    <Progress value={uploadProgress} className="h-1" />
                    <p className="text-xs text-muted-foreground mt-1">Uploading... {uploadProgress}%</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Analysis Results */}
      {isAnalyzing && (
        <Card className="border-primary/20">
          <CardContent className="p-6 flex items-center gap-4">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <div>
              <p className="font-medium text-foreground">Analyzing your resume...</p>
              <p className="text-sm text-muted-foreground">
                Our AI is extracting information and generating insights
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {data.resumeAnalysis && !isAnalyzing && (
        <div className="space-y-4">
          <Card className="border-success/20 bg-success/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Analysis Complete!</p>
                  <p className="text-sm text-muted-foreground">
                    Resume Score: {data.resumeAnalysis.score}/100
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h4 className="font-medium text-foreground">Extracted Information</h4>
              </div>
              
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Skills Detected: </span>
                  <span className="text-foreground">
                    {data.resumeAnalysis.extractedData.skills.join(', ')}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Years of Experience: </span>
                  <span className="text-foreground">
                    {data.resumeAnalysis.extractedData.experience} years
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Education: </span>
                  <span className="text-foreground">
                    {data.resumeAnalysis.extractedData.education}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h5 className="text-sm font-medium text-foreground mb-2">AI Suggestions</h5>
                <ul className="space-y-2">
                  {data.resumeAnalysis.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-primary">•</span>
                      <span className="text-muted-foreground">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have a resume ready? No problem! You can skip this step and create one later using our AI Resume Builder.
      </p>
    </div>
  )
}
