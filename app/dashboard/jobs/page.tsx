"use client"

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  MapPin, 
  DollarSign, 
  Clock, 
  Building2,
  Heart,
  ExternalLink,
  Briefcase,
  ChevronDown,
  Star,
  CheckCircle2,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ScoreRing } from '@/components/score-ring'
import { PageHeader } from '@/components/page-header'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useJobStore } from '@/store/job-store'
import { useToast } from '@/components/ui/use-toast'

const formatSalary = (min?: number, max?: number) => {
  if (!min || !max) return 'Competitive'
  return `$${(min / 1000).toFixed(0)}K - $${(max / 1000).toFixed(0)}K`
}

export default function JobsPage() {
  const { jobs, applyForJob, toggleSaveJob } = useJobStore()
  const { toast } = useToast()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [selectedJobId, setSelectedJobId] = useState<string | null>(jobs[0]?.id || null)
  const [isApplying, setIsApplying] = useState(false)

  const sortedJobs = useMemo(() => {
    return [...jobs].sort((a, b) => b.matchScore - a.matchScore)
  }, [jobs])

  const filteredJobs = useMemo(() => {
    return sortedJobs.filter(match => {
      const matchesSearch = match.job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.job.company.toLowerCase().includes(searchQuery.toLowerCase())
      
      if (activeTab === 'saved') return matchesSearch && match.status === 'saved'
      if (activeTab === 'applied') return matchesSearch && match.status === 'applied'
      return matchesSearch
    })
  }, [sortedJobs, searchQuery, activeTab])

  const selectedMatch = useMemo(() => {
    return jobs.find(m => m.id === selectedJobId) || jobs[0]
  }, [jobs, selectedJobId])

  const handleApply = async () => {
    if (!selectedMatch || selectedMatch.status === 'applied') return
    
    setIsApplying(true)
    try {
      await applyForJob(selectedMatch.id)
      toast({
        title: "Application Successful!",
        description: `You've successfully applied to ${selectedMatch.job.title} at ${selectedMatch.job.company}.`,
      })
    } catch (error) {
      toast({
        title: "Application Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Job Matching"
        description="AI-powered job recommendations based on your profile and preferences"
      />

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search jobs, companies, skills..."
            className="pl-10"
          />
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Jobs</SheetTitle>
              <SheetDescription>Refine your job search results</SheetDescription>
            </SheetHeader>
            <div className="space-y-6 mt-6">
              <div className="space-y-3">
                <Label>Job Type</Label>
                <div className="space-y-2">
                  {['Full-time', 'Part-time', 'Contract', 'Internship'].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox id={type} />
                      <Label htmlFor={type} className="font-normal">{type}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <Label>Work Arrangement</Label>
                <div className="space-y-2">
                  {['Remote', 'Hybrid', 'On-site'].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox id={type} />
                      <Label htmlFor={type} className="font-normal">{type}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <Label>Salary Range</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="50-100">$50K - $100K</SelectItem>
                    <SelectItem value="100-150">$100K - $150K</SelectItem>
                    <SelectItem value="150-200">$150K - $200K</SelectItem>
                    <SelectItem value="200+">$200K+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <Label>Match Score</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Minimum score" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="90">90%+</SelectItem>
                    <SelectItem value="80">80%+</SelectItem>
                    <SelectItem value="70">70%+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full">Apply Filters</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all" className="gap-2">
            <Briefcase className="h-4 w-4" />
            All Jobs
            <Badge variant="secondary" className="ml-1">{jobs.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="saved" className="gap-2">
            <Heart className="h-4 w-4" />
            Saved
            <Badge variant="secondary" className="ml-1">{jobs.filter(j => j.status === 'saved').length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="applied" className="gap-2">
            <Star className="h-4 w-4" />
            Applied
            <Badge variant="secondary" className="ml-1">{jobs.filter(j => j.status === 'applied').length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid gap-6 lg:grid-cols-5">
            {/* Job List */}
            <div className="lg:col-span-2 space-y-3">
              {filteredJobs.map((match, index) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all hover:border-primary/50 ${
                      selectedJobId === match.id ? 'border-primary ring-1 ring-primary/20' : ''
                    }`}
                    onClick={() => setSelectedJobId(match.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          <Building2 className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-medium text-foreground truncate">{match.job.title}</h3>
                            <button 
                              onClick={(e) => { e.stopPropagation(); toggleSaveJob(match.id) }}
                              className="flex-shrink-0"
                            >
                              <Heart className={`h-4 w-4 ${match.status === 'saved' ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`} />
                            </button>
                          </div>
                          <p className="text-sm text-muted-foreground">{match.job.company}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {match.job.location}
                            </span>
                            <span>•</span>
                            <span>{new Date(match.job.postedAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center justify-between mt-3">
                            <Badge variant="secondary" className="text-xs">
                              {match.matchScore}% match
                            </Badge>
                            <span className="text-sm font-medium text-primary">
                              {formatSalary(match.job.salaryMin, match.job.salaryMax)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
              {filteredJobs.length === 0 && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Briefcase className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground">No jobs found matching your criteria.</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Job Details */}
            {selectedMatch && (
              <Card className="lg:col-span-3 h-fit sticky top-20">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{selectedMatch.job.title}</CardTitle>
                        <CardDescription className="text-base">{selectedMatch.job.company}</CardDescription>
                        <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {selectedMatch.job.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {new Date(selectedMatch.job.postedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ScoreRing score={selectedMatch.matchScore} size={64} strokeWidth={4} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="capitalize">{selectedMatch.job.employmentType}</Badge>
                    <Badge variant="outline" className="capitalize">{selectedMatch.job.remoteType}</Badge>
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                      <DollarSign className="h-3 w-3 mr-1" />
                      {formatSalary(selectedMatch.job.salaryMin, selectedMatch.job.salaryMax)}
                    </Badge>
                  </div>

                  <div className="flex gap-3">
                    {selectedMatch.status === 'applied' ? (
                      <Button className="flex-1 gap-2 bg-success hover:bg-success/90" disabled>
                        <CheckCircle2 className="h-4 w-4" />
                        Successfully Applied
                      </Button>
                    ) : (
                      <Button 
                        className="flex-1 gap-2" 
                        onClick={handleApply}
                        disabled={isApplying}
                      >
                        {isApplying ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Applying...
                          </>
                        ) : (
                          <>
                            Apply Now
                            <ExternalLink className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => toggleSaveJob(selectedMatch.id)}
                    >
                      <Heart className={`h-4 w-4 ${selectedMatch.status === 'saved' ? 'fill-destructive text-destructive' : ''}`} />
                    </Button>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">About the Role</h4>
                    <p className="text-sm text-muted-foreground">{selectedMatch.job.description}</p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Requirements</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMatch.job.requirements.map((req) => (
                        <Badge key={req} variant="secondary">{req}</Badge>
                      ))}
                    </div>
                  </div>

                  {selectedMatch.job.responsibilities && (
                    <div>
                      <h4 className="font-medium mb-2">Responsibilities</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {selectedMatch.job.responsibilities.map((resp, i) => (
                          <li key={i}>{resp}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                    <h4 className="font-medium">Why You Match</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {selectedMatch.matchedSkills.slice(0, 3).map((skill, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <Star className="h-3 w-3 text-success fill-success" />
                          Your skill in <strong>{skill}</strong> matches the requirements
                        </li>
                      ))}
                      <li className="flex items-center gap-2">
                        <Star className="h-3 w-3 text-success fill-success" />
                        Match Score: {selectedMatch.matchScore}% (Top Candidate)
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
