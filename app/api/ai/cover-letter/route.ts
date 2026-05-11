"use server"

import { generateText, Output } from 'ai'
import { z } from 'zod'

export const maxDuration = 60

const coverLetterSchema = z.object({
  coverLetter: z.string().describe('The complete cover letter'),
  highlights: z.array(z.string()).describe('Key achievements highlighted'),
  keywords: z.array(z.string()).describe('Industry keywords used'),
  tone: z.string().describe('Description of the tone used'),
  wordCount: z.number(),
  suggestions: z.array(z.string()).describe('Additional personalization suggestions'),
})

export async function POST(req: Request) {
  const { 
    jobDescription, 
    company, 
    role, 
    userProfile,
    tone = 'professional',
    length = 'medium',
  } = await req.json()

  const lengthGuide = {
    short: '200-250 words',
    medium: '300-350 words',
    long: '400-450 words',
  }[length] || '300-350 words'

  const { output } = await generateText({
    model: 'groq/llama-3.3-70b-versatile',
    output: Output.object({
      schema: coverLetterSchema,
    }),
    messages: [
      {
        role: 'user',
        content: `Write a compelling cover letter for the following position:

Role: ${role}
Company: ${company}
Job Description:
${jobDescription}

Candidate Profile:
${JSON.stringify(userProfile, null, 2)}

Requirements:
- Tone: ${tone}
- Length: ${lengthGuide}
- Highlight relevant achievements from the candidate's background
- Include industry-specific keywords for ATS optimization
- Show genuine enthusiasm for the company and role
- End with a clear call to action`,
      },
    ],
  })

  return Response.json({ result: output })
}
