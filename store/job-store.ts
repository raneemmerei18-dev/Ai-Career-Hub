import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { JobMatch } from '@/types'

interface JobState {
  jobs: JobMatch[]
  isLoading: boolean
  error: string | null
  
  // Actions
  fetchJobs: () => Promise<void>
  applyForJob: (jobId: string) => Promise<void>
  toggleSaveJob: (jobId: string) => Promise<void>
}

// Mock Jobs Data (12+ jobs)
const initialMockJobs: JobMatch[] = [
  {
    id: '1',
    userId: 'user-1',
    jobId: 'job-1',
    matchScore: 98,
    matchedSkills: ['React', 'Next.js', 'TypeScript', 'Node.js'],
    missingSkills: ['AWS'],
    status: 'new',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    job: {
      id: 'job-1',
      title: 'Senior Frontend Engineer',
      company: 'TechFlow Solutions',
      location: 'Remote (Global)',
      description: 'Lead the development of our next-generation SaaS platform using React and Next.js.',
      requirements: ['5+ years of React experience', 'Strong TypeScript skills', 'Experience with Node.js backend'],
      responsibilities: ['Architecting frontend solutions', 'Mentoring junior developers', 'Performance optimization'],
      salaryMin: 140000,
      salaryMax: 190000,
      employmentType: 'full-time',
      remoteType: 'remote',
      postedAt: '2026-05-08T10:00:00Z',
      source: 'Internal'
    }
  },
  {
    id: '2',
    userId: 'user-1',
    jobId: 'job-2',
    matchScore: 95,
    matchedSkills: ['Python', 'FastAPI', 'PostgreSQL', 'Docker'],
    missingSkills: ['Kubernetes'],
    status: 'new',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    job: {
      id: 'job-2',
      title: 'Backend Systems Architect',
      company: 'DataStream AI',
      location: 'San Francisco, CA',
      description: 'Build scalable backend services for our AI-driven data processing pipeline.',
      requirements: ['Expertise in Python and FastAPI', 'Strong understanding of distributed systems', 'Database optimization skills'],
      responsibilities: ['Designing microservices', 'Database schema design', 'API security implementation'],
      salaryMin: 160000,
      salaryMax: 220000,
      employmentType: 'full-time',
      remoteType: 'hybrid',
      postedAt: '2026-05-07T14:30:00Z',
      source: 'LinkedIn'
    }
  },
  {
    id: '3',
    userId: 'user-1',
    jobId: 'job-3',
    matchScore: 92,
    matchedSkills: ['Full Stack', 'Next.js', 'Prisma', 'Tailwind CSS'],
    missingSkills: ['Redis'],
    status: 'new',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    job: {
      id: 'job-3',
      title: 'Full Stack Developer',
      company: 'Nexus Digital',
      location: 'London, UK (Hybrid)',
      description: 'Join a fast-paced agency building high-performance web applications for global brands.',
      requirements: ['Proficiency in Next.js and Tailwind CSS', 'Experience with Prisma or similar ORM', 'Good UI/UX sense'],
      responsibilities: ['End-to-end feature development', 'Client communication', 'Testing and deployment'],
      salaryMin: 70000,
      salaryMax: 100000,
      employmentType: 'full-time',
      remoteType: 'hybrid',
      postedAt: '2026-05-09T09:00:00Z',
      source: 'Indeed'
    }
  },
  {
    id: '4',
    userId: 'user-1',
    jobId: 'job-4',
    matchScore: 89,
    matchedSkills: ['React Native', 'TypeScript', 'Firebase'],
    missingSkills: ['GraphQL'],
    status: 'new',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    job: {
      id: 'job-4',
      title: 'Senior Mobile Developer',
      company: 'AppVenture',
      location: 'Remote',
      description: 'Develop high-quality mobile experiences using React Native.',
      requirements: ['Deep knowledge of React Native', 'TypeScript proficiency', 'App Store/Play Store deployment experience'],
      responsibilities: ['Cross-platform mobile dev', 'State management optimization', 'Offline-first architecture'],
      salaryMin: 130000,
      salaryMax: 170000,
      employmentType: 'full-time',
      remoteType: 'remote',
      postedAt: '2026-05-06T11:20:00Z',
      source: 'Glassdoor'
    }
  },
  {
    id: '5',
    userId: 'user-1',
    jobId: 'job-5',
    matchScore: 86,
    matchedSkills: ['DevOps', 'AWS', 'Terraform', 'CI/CD'],
    missingSkills: ['Ansible'],
    status: 'new',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    job: {
      id: 'job-5',
      title: 'Infrastructure Engineer',
      company: 'CloudNative Corp',
      location: 'Berlin, Germany',
      description: 'Manage and scale our cloud infrastructure using modern DevOps practices.',
      requirements: ['AWS certification', 'Experience with Terraform/IaC', 'Strong shell scripting skills'],
      responsibilities: ['Infrastructure automation', 'Cost optimization', 'Security hardening'],
      salaryMin: 85000,
      salaryMax: 120000,
      employmentType: 'full-time',
      remoteType: 'onsite',
      postedAt: '2026-05-05T16:45:00Z',
      source: 'Internal'
    }
  },
  {
    id: '6',
    userId: 'user-1',
    jobId: 'job-6',
    matchScore: 84,
    matchedSkills: ['UI/UX Design', 'Figma', 'React', 'CSS'],
    missingSkills: ['A/B Testing'],
    status: 'new',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    job: {
      id: 'job-6',
      title: 'Product Designer (Engineer-Focused)',
      company: 'CreativeFlow',
      location: 'New York, NY',
      description: 'Design beautiful interfaces that solve complex engineering problems.',
      requirements: ['Expert Figma skills', 'Basic React knowledge', 'Portfolio of B2B designs'],
      responsibilities: ['User research', 'Prototyping', 'Design system maintenance'],
      salaryMin: 120000,
      salaryMax: 160000,
      employmentType: 'full-time',
      remoteType: 'hybrid',
      postedAt: '2026-05-04T10:15:00Z',
      source: 'Dribbble'
    }
  },
  {
    id: '7',
    userId: 'user-1',
    jobId: 'job-7',
    matchScore: 81,
    matchedSkills: ['Go', 'Microservices', 'gRPC'],
    missingSkills: ['Kafka'],
    status: 'new',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    job: {
      id: 'job-7',
      title: 'Systems Engineer (Go)',
      company: 'TurboLink',
      location: 'Austin, TX',
      description: 'Build high-performance networking tools using Go.',
      requirements: ['3+ years of Go experience', 'Understanding of networking protocols', 'Concurrency expert'],
      responsibilities: ['Kernel-level programming', 'Performance benchmarking', 'SDK development'],
      salaryMin: 150000,
      salaryMax: 200000,
      employmentType: 'full-time',
      remoteType: 'onsite',
      postedAt: '2026-05-03T13:00:00Z',
      source: 'LinkedIn'
    }
  },
  {
    id: '8',
    userId: 'user-1',
    jobId: 'job-8',
    matchScore: 78,
    matchedSkills: ['Java', 'Spring Boot', 'MySQL'],
    missingSkills: ['React'],
    status: 'new',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    job: {
      id: 'job-8',
      title: 'Enterprise Java Developer',
      company: 'GlobalFinance',
      location: 'Remote',
      description: 'Maintain and modernize legacy banking systems.',
      requirements: ['Strong Java/Spring Boot skills', 'SQL optimization', 'Experience with large-scale systems'],
      responsibilities: ['System modernization', 'Batch processing', 'Security audits'],
      salaryMin: 110000,
      salaryMax: 150000,
      employmentType: 'full-time',
      remoteType: 'remote',
      postedAt: '2026-05-02T09:30:00Z',
      source: 'Indeed'
    }
  },
  {
    id: '9',
    userId: 'user-1',
    jobId: 'job-9',
    matchScore: 75,
    matchedSkills: ['QA Automation', 'Selenium', 'Python'],
    missingSkills: ['Cypress'],
    status: 'new',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    job: {
      id: 'job-9',
      title: 'QA Automation Lead',
      company: 'QualityFirst',
      location: 'Toronto, Canada',
      description: 'Lead our automated testing efforts across web and mobile.',
      requirements: ['Expertise in Selenium and Python', 'CI/CD integration experience', 'Leadership skills'],
      responsibilities: ['Test strategy development', 'Framework architecture', 'Team mentoring'],
      salaryMin: 100000,
      salaryMax: 140000,
      employmentType: 'full-time',
      remoteType: 'hybrid',
      postedAt: '2026-05-01T15:20:00Z',
      source: 'Glassdoor'
    }
  },
  {
    id: '10',
    userId: 'user-1',
    jobId: 'job-10',
    matchScore: 72,
    matchedSkills: ['Data Science', 'PyTorch', 'SQL'],
    missingSkills: ['NLP'],
    status: 'new',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    job: {
      id: 'job-10',
      title: 'Machine Learning Engineer',
      company: 'AIVision',
      location: 'Remote',
      description: 'Develop and deploy computer vision models.',
      requirements: ['Strong mathematical background', 'PyTorch proficiency', 'Experience with AWS SageMaker'],
      responsibilities: ['Model training', 'Data pipeline development', 'Model optimization'],
      salaryMin: 140000,
      salaryMax: 210000,
      employmentType: 'full-time',
      remoteType: 'remote',
      postedAt: '2026-04-30T11:00:00Z',
      source: 'Internal'
    }
  },
  {
    id: '11',
    userId: 'user-1',
    jobId: 'job-11',
    matchScore: 68,
    matchedSkills: ['Technical Writing', 'Markdown', 'Git'],
    missingSkills: ['Docusaurus'],
    status: 'new',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    job: {
      id: 'job-11',
      title: 'Senior Technical Writer',
      company: 'DocuTech',
      location: 'Seattle, WA',
      description: 'Create developer-focused documentation for our API products.',
      requirements: ['Experience writing for developers', 'Strong Git skills', 'Ability to read code (JS/Python)'],
      responsibilities: ['API documentation', 'Tutorial creation', 'Documentation site management'],
      salaryMin: 90000,
      salaryMax: 130000,
      employmentType: 'full-time',
      remoteType: 'hybrid',
      postedAt: '2026-04-29T14:00:00Z',
      source: 'Indeed'
    }
  },
  {
    id: '12',
    userId: 'user-1',
    jobId: 'job-12',
    matchScore: 65,
    matchedSkills: ['Salesforce', 'Apex', 'JavaScript'],
    missingSkills: ['LWC'],
    status: 'new',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    job: {
      id: 'job-12',
      title: 'Salesforce Developer',
      company: 'CrmMasters',
      location: 'Chicago, IL',
      description: 'Customize and extend our Salesforce implementation.',
      requirements: ['Apex and SOQL proficiency', 'Salesforce certifications', 'Good communication skills'],
      responsibilities: ['Custom object design', 'Trigger development', 'Integration with external APIs'],
      salaryMin: 110000,
      salaryMax: 160000,
      employmentType: 'full-time',
      remoteType: 'onsite',
      postedAt: '2026-04-28T10:30:00Z',
      source: 'LinkedIn'
    }
  },
  {
    id: '13',
    userId: 'user-1',
    jobId: 'job-13',
    matchScore: 60,
    matchedSkills: ['PHP', 'Laravel', 'Vue.js'],
    missingSkills: ['Inertia.js'],
    status: 'new',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    job: {
      id: 'job-13',
      title: 'Laravel Developer',
      company: 'WebSolutions Plus',
      location: 'Remote',
      description: 'Build modern web applications using the TALL stack.',
      requirements: ['Strong PHP/Laravel skills', 'Vue.js experience', 'MySQL knowledge'],
      responsibilities: ['Backend feature development', 'Frontend component building', 'API maintenance'],
      salaryMin: 60000,
      salaryMax: 90000,
      employmentType: 'full-time',
      remoteType: 'remote',
      postedAt: '2026-04-27T09:00:00Z',
      source: 'Upwork'
    }
  }
]

export const useJobStore = create<JobState>()(
  persist(
    (set, get) => ({
      jobs: initialMockJobs,
      isLoading: false,
      error: null,

      fetchJobs: async () => {
        set({ isLoading: true })
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 800))
          // In a real app, we would fetch from API here
          // For now, we use the persisted mock data
          set({ isLoading: false })
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
        }
      },

      applyForJob: async (jobId: string) => {
        set({ isLoading: true })
        try {
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1500))
          
          const { jobs } = get()
          const updatedJobs = jobs.map(job => 
            job.id === jobId 
              ? { ...job, status: 'applied' as const, appliedAt: new Date().toISOString() } 
              : job
          )
          
          set({ jobs: updatedJobs, isLoading: false })
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false })
          throw error
        }
      },

      toggleSaveJob: async (jobId: string) => {
        const { jobs } = get()
        const updatedJobs = jobs.map(job => 
          job.id === jobId 
            ? { ...job, status: job.status === 'saved' ? 'new' : 'saved' as const } 
            : job
        )
        set({ jobs: updatedJobs })
      }
    }),
    {
      name: 'ai-career-hub-jobs',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
