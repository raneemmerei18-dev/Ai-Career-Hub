"use server"

import { generateText, Output } from 'ai'
import { z } from 'zod'

export const maxDuration = 60

const jobMatchSchema = z.object({
  overallMatch: z.number().min(0).max(100).describe('Overall match percentage'),
  breakdown: z.object({
    skillsMatch: z.number().min(0).max(100),
    experienceMatch: z.number().min(0).max(100),
    educationMatch: z.number().min(0).max(100),
    cultureFit: z.number().min(0).max(100),
    growthPotential: z.number().min(0).max(100),
  }),
  matchingSkills: z.array(z.object({
    skill: z.string(),
    jobRequirement: z.string(),
    candidateLevel: z.string(),
    match: z.enum(['exact', 'strong', 'partial', 'transferable']),
  })),
  missingRequirements: z.array(z.object({
    requirement: z.string(),
    importance: z.enum(['required', 'preferred', 'bonus']),
    gap: z.string(),
    howToAddress: z.string(),
  })),
  standoutFactors: z.array(z.string()).describe('What makes this candidate stand out'),
  concerns: z.array(z.object({
    issue: z.string(),
    severity: z.enum(['minor', 'moderate', 'significant']),
    mitigation: z.string(),
  })),
  recommendation: z.object({
    shouldApply: z.boolean(),
    confidence: z.enum(['high', 'medium', 'low']),
    reasoning: z.string(),
    nextSteps: z.array(z.string()),
  }),
  tailoredResumeTips: z.array(z.string()).describe('How to tailor resume for this job'),
})

export async function POST(req: Request) {
  const { jobDescription, userProfile, preferences } = await req.json()

  const { output } = await generateText({
    model: 'groq/llama-3.3-70b-versatile',
    output: Output.object({
      schema: jobMatchSchema,
    }),
    messages: [
      {
        role: 'user',
        content: `Analyze the match between this job and candidate profile:

Job Description:
${jobDescription}

Candidate Profile:
${JSON.stringify(userProfile, null, 2)}

Candidate Preferences:
${JSON.stringify(preferences || {}, null, 2)}

Provide a comprehensive match analysis including:
1. Overall match score with breakdown by category
2. Matching skills analysis
3. Missing requirements and how to address them
4. Standout factors
5. Potential concerns
6. Application recommendation
7. Resume tailoring tips`,
      },
    ],
  })

  return Response.json({ match: output })
}
