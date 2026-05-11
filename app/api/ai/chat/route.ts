"use server"

import {
  consumeStream,
  convertToModelMessages,
  streamText,
  tool,
  UIMessage,
} from 'ai'
import { z } from 'zod'

export const maxDuration = 60

const careerCoachSystemPrompt = `You are an expert AI Career Coach with deep knowledge in:
- Resume writing and optimization
- Job search strategies
- Interview preparation
- Career development and transitions
- Salary negotiation
- Personal branding
- Industry trends and job market insights

You help users:
1. Improve their resumes with specific, actionable feedback
2. Prepare for interviews with relevant questions and practice
3. Identify skill gaps and recommend learning paths
4. Navigate career transitions strategically
5. Develop their professional brand

Always be encouraging, specific, and actionable in your advice.
Reference the user's profile data when available to provide personalized guidance.`

export async function POST(req: Request) {
  const { messages, context }: { messages: UIMessage[]; context?: {
    userProfile?: Record<string, unknown>;
    targetRole?: string;
    currentRole?: string;
  } } = await req.json()

  const contextPrompt = context ? `
User Context:
- Current Role: ${context.currentRole || 'Not specified'}
- Target Role: ${context.targetRole || 'Not specified'}
- Profile Data: ${JSON.stringify(context.userProfile || {}, null, 2)}
` : ''

  const result = streamText({
    model: 'groq/llama-3.3-70b-versatile',
    system: careerCoachSystemPrompt + contextPrompt,
    messages: await convertToModelMessages(messages),
    tools: {
      searchJobs: tool({
        description: 'Search for relevant job opportunities based on criteria',
        inputSchema: z.object({
          keywords: z.array(z.string()).describe('Job search keywords'),
          location: z.string().nullable().describe('Preferred location'),
          remoteOnly: z.boolean().nullable().describe('Filter for remote jobs only'),
        }),
        execute: async ({ keywords, location, remoteOnly }) => {
          return {
            jobs: [
              { title: 'Senior Software Engineer', company: 'TechCorp', match: 92 },
              { title: 'Full Stack Developer', company: 'StartupXYZ', match: 88 },
            ],
            totalResults: 50,
          }
        },
      }),
      generateInterviewQuestions: tool({
        description: 'Generate tailored interview questions for a specific role',
        inputSchema: z.object({
          role: z.string().describe('The job role to prepare for'),
          type: z.enum(['behavioral', 'technical', 'situational']).describe('Type of questions'),
          count: z.number().min(1).max(10).describe('Number of questions to generate'),
        }),
        execute: async ({ role, type, count }) => {
          return {
            questions: [
              `Tell me about a time you demonstrated ${type} skills as a ${role}`,
              `How would you handle a challenging situation in your role as ${role}?`,
            ].slice(0, count),
          }
        },
      }),
      analyzeResume: tool({
        description: 'Analyze a resume section and provide improvement suggestions',
        inputSchema: z.object({
          section: z.enum(['summary', 'experience', 'skills', 'education']),
          content: z.string().describe('The content to analyze'),
        }),
        execute: async ({ section, content }) => {
          return {
            score: 75,
            suggestions: [
              'Use more action verbs',
              'Quantify achievements where possible',
              'Add relevant keywords for ATS optimization',
            ],
          }
        },
      }),
    },
    abortSignal: req.signal,
  })

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    onFinish: async ({ messages: allMessages, isAborted }) => {
      if (isAborted) return
      // Save chat history in production
    },
    consumeSseStream: consumeStream,
  })
}
