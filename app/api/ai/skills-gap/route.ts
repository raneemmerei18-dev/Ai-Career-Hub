"use server"

import { generateText, Output } from 'ai'
import { z } from 'zod'

export const maxDuration = 60

const skillsGapSchema = z.object({
  overallReadiness: z.number().min(0).max(100).describe('Overall readiness percentage for target role'),
  currentStrengths: z.array(z.object({
    skill: z.string(),
    level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
    relevance: z.number().min(0).max(100),
  })),
  gaps: z.array(z.object({
    skill: z.string(),
    importance: z.enum(['critical', 'important', 'nice-to-have']),
    currentLevel: z.enum(['none', 'beginner', 'intermediate']).nullable(),
    requiredLevel: z.enum(['intermediate', 'advanced', 'expert']),
    timeToAcquire: z.string().describe('Estimated time to acquire skill'),
  })),
  learningPath: z.array(z.object({
    phase: z.number(),
    title: z.string(),
    duration: z.string(),
    skills: z.array(z.string()),
    resources: z.array(z.object({
      type: z.enum(['course', 'book', 'project', 'certification']),
      name: z.string(),
      provider: z.string().nullable(),
      url: z.string().nullable(),
    })),
  })),
  certifications: z.array(z.object({
    name: z.string(),
    provider: z.string(),
    priority: z.enum(['high', 'medium', 'low']),
    estimatedTime: z.string(),
  })),
  timeline: z.object({
    shortTerm: z.array(z.string()).describe('0-3 months goals'),
    mediumTerm: z.array(z.string()).describe('3-6 months goals'),
    longTerm: z.array(z.string()).describe('6-12 months goals'),
  }),
})

export async function POST(req: Request) {
  const { currentSkills, targetRole, targetIndustry, experience } = await req.json()

  const { output } = await generateText({
    model: 'groq/llama-3.3-70b-versatile',
    output: Output.object({
      schema: skillsGapSchema,
    }),
    messages: [
      {
        role: 'user',
        content: `Analyze the skills gap for transitioning to a ${targetRole} position in the ${targetIndustry} industry.

Current Skills:
${JSON.stringify(currentSkills, null, 2)}

Years of Experience: ${experience}

Provide:
1. Overall readiness assessment
2. Current strengths and their relevance
3. Identified skill gaps with priority levels
4. A structured learning path with phases
5. Recommended certifications
6. Timeline with short, medium, and long-term goals`,
      },
    ],
  })

  return Response.json({ skillsGap: output })
}
