"use server"

import { generateText, Output } from 'ai'
import { z } from 'zod'

export const maxDuration = 60

const interviewPrepSchema = z.object({
  company: z.object({
    overview: z.string(),
    culture: z.string(),
    recentNews: z.array(z.string()),
    interviewProcess: z.string().nullable(),
  }),
  questions: z.array(z.object({
    question: z.string(),
    type: z.enum(['behavioral', 'technical', 'situational', 'company-specific']),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    tips: z.array(z.string()),
    sampleAnswer: z.string(),
    followUpQuestions: z.array(z.string()),
  })),
  yourQuestions: z.array(z.object({
    question: z.string(),
    purpose: z.string(),
    whatToLookFor: z.string(),
  })).describe('Questions to ask the interviewer'),
  prepChecklist: z.array(z.object({
    category: z.string(),
    items: z.array(z.string()),
  })),
  starStories: z.array(z.object({
    situation: z.string(),
    task: z.string(),
    action: z.string(),
    result: z.string(),
    applicableQuestions: z.array(z.string()),
  })).describe('STAR format stories to prepare'),
})

export async function POST(req: Request) {
  const { role, company, userProfile, interviewType } = await req.json()

  const { output } = await generateText({
    model: 'groq/llama-3.3-70b-versatile',
    output: Output.object({
      schema: interviewPrepSchema,
    }),
    messages: [
      {
        role: 'user',
        content: `Prepare comprehensive interview materials for a ${role} position at ${company}.

Interview Type: ${interviewType || 'general'}

Candidate Profile:
${JSON.stringify(userProfile, null, 2)}

Generate:
1. Company research summary
2. 10-15 tailored interview questions with sample answers
3. Smart questions to ask the interviewer
4. Preparation checklist
5. 3-5 STAR format stories based on the candidate's experience`,
      },
    ],
  })

  return Response.json({ prep: output })
}
