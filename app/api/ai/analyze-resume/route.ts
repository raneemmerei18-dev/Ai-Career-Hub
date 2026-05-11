"use server"

import { generateText, Output } from 'ai'
import { z } from 'zod'

export const maxDuration = 60

const resumeAnalysisSchema = z.object({
  overallScore: z.number().min(0).max(100).describe('Overall resume quality score'),
  atsScore: z.number().min(0).max(100).describe('ATS compatibility score'),
  sections: z.object({
    summary: z.object({
      score: z.number().min(0).max(100),
      feedback: z.string(),
      suggestions: z.array(z.string()),
    }),
    experience: z.object({
      score: z.number().min(0).max(100),
      feedback: z.string(),
      suggestions: z.array(z.string()),
    }),
    skills: z.object({
      score: z.number().min(0).max(100),
      feedback: z.string(),
      suggestions: z.array(z.string()),
      missingKeywords: z.array(z.string()),
    }),
    education: z.object({
      score: z.number().min(0).max(100),
      feedback: z.string(),
      suggestions: z.array(z.string()),
    }),
  }),
  strengths: z.array(z.string()).describe('Key strengths of the resume'),
  improvements: z.array(z.object({
    priority: z.enum(['high', 'medium', 'low']),
    area: z.string(),
    suggestion: z.string(),
  })),
  keywords: z.object({
    present: z.array(z.string()),
    missing: z.array(z.string()),
    recommended: z.array(z.string()),
  }),
})

export async function POST(req: Request) {
  const { resumeContent, targetRole, targetIndustry } = await req.json()

  const { output } = await generateText({
    model: 'groq/llama-3.3-70b-versatile',
    output: Output.object({
      schema: resumeAnalysisSchema,
    }),
    messages: [
      {
        role: 'user',
        content: `Analyze this resume for a ${targetRole} position in the ${targetIndustry} industry.
        
Resume Content:
${resumeContent}

Provide a comprehensive analysis including:
1. Overall quality score
2. ATS compatibility score
3. Section-by-section feedback
4. Key strengths
5. Prioritized improvements
6. Keyword analysis for ATS optimization`,
      },
    ],
  })

  return Response.json({ analysis: output })
}
