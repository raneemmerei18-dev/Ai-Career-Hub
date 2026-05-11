"""
AI Service for Career Hub
Handles all AI-powered features using Groq models
"""
from typing import Optional
import json
import os
import httpx
from pydantic import BaseModel


class AIService:
    """Service for AI-powered career analysis and recommendations"""
    
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        self.base_url = "https://api.groq.com/openai/v1"
        self.model = "llama-3.3-70b-versatile"
    
    async def _call_groq(self, messages: list, temperature: float = 0.7) -> str:
        """Make a call to the Groq chat completion API."""
        if not self.api_key:
            # Return mock response for demo
            return self._get_mock_response(messages)
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": self.model,
                    "messages": messages,
                    "temperature": temperature
                },
                timeout=60.0
            )
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]

    def _parse_ai_json(self, response_text: str) -> dict:
        """Helper to parse JSON from AI response, handling markdown blocks."""
        text = response_text.strip()
        if text.startswith("```"):
            # Remove opening ```json or ```
            lines = text.split("\n")
            if lines[0].startswith("```"):
                lines = lines[1:]
            # Remove closing ```
            if lines and lines[-1].startswith("```"):
                lines = lines[:-1]
            text = "\n".join(lines).strip()
        
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            # Try to find JSON-like structure if parsing fails
            import re
            match = re.search(r'(\{.*\})|(\[.*\])', text, re.DOTALL)
            if match:
                try:
                    return json.loads(match.group(0))
                except:
                    pass
            return {"raw_response": response_text}
    
    def _get_mock_response(self, messages: list) -> str:
        """Return mock response for demo purposes"""
        last_message = messages[-1]["content"].lower()
        
        if "analyze" in last_message and "resume" in last_message:
            return json.dumps({
                "overall_score": 78,
                "sections": {
                    "contact_info": {"score": 95, "feedback": "Well formatted contact information"},
                    "summary": {"score": 72, "feedback": "Could be more impactful with quantified achievements"},
                    "experience": {"score": 80, "feedback": "Good use of action verbs, add more metrics"},
                    "skills": {"score": 75, "feedback": "Consider organizing by proficiency level"},
                    "education": {"score": 90, "feedback": "Complete and well formatted"}
                },
                "suggestions": [
                    "Add quantifiable achievements (e.g., 'Increased revenue by 25%')",
                    "Include more industry-specific keywords for ATS optimization",
                    "Consider adding a projects or portfolio section",
                    "Strengthen your professional summary with specific accomplishments"
                ],
                "ats_compatibility": 82,
                "keyword_analysis": {
                    "found": ["Python", "JavaScript", "React", "SQL", "API"],
                    "missing": ["TypeScript", "AWS", "Docker", "CI/CD"]
                }
            })
        
        if "skill" in last_message and "gap" in last_message:
            return json.dumps({
                "skill_gaps": [
                    {
                        "skill": "Cloud Computing (AWS/GCP)",
                        "importance": "high",
                        "current_level": 2,
                        "required_level": 4,
                        "resources": [
                            {"name": "AWS Certified Solutions Architect", "type": "certification", "duration": "3 months"},
                            {"name": "Cloud Computing Specialization", "type": "course", "platform": "Coursera"}
                        ]
                    },
                    {
                        "skill": "System Design",
                        "importance": "high",
                        "current_level": 3,
                        "required_level": 5,
                        "resources": [
                            {"name": "Grokking System Design", "type": "course", "platform": "Educative"},
                            {"name": "Designing Data-Intensive Applications", "type": "book"}
                        ]
                    },
                    {
                        "skill": "Leadership & Management",
                        "importance": "medium",
                        "current_level": 2,
                        "required_level": 4,
                        "resources": [
                            {"name": "Engineering Management Course", "type": "course", "platform": "LinkedIn Learning"}
                        ]
                    }
                ],
                "timeline": "6-12 months recommended",
                "priority_order": ["Cloud Computing", "System Design", "Leadership"]
            })
        
        if "interview" in last_message:
            return json.dumps({
                "questions": [
                    {
                        "question": "Tell me about a challenging project you led and how you handled obstacles.",
                        "type": "behavioral",
                        "tips": "Use the STAR method. Focus on your specific contributions and quantify results."
                    },
                    {
                        "question": "Design a URL shortening service like bit.ly",
                        "type": "system_design",
                        "tips": "Start with requirements, then discuss high-level architecture, data model, and scaling strategies."
                    },
                    {
                        "question": "Implement a function to find the longest palindromic substring.",
                        "type": "technical",
                        "tips": "Consider both expand-around-center and dynamic programming approaches."
                    }
                ],
                "preparation_tips": [
                    "Research the company culture and recent news",
                    "Prepare 3-5 strong examples from your experience",
                    "Practice coding problems daily for 2 weeks before"
                ]
            })
        
        if "career" in last_message and "path" in last_message:
            return json.dumps({
                "current_position": "Senior Software Engineer",
                "target_position": "Engineering Manager",
                "timeline": "2-3 years",
                "milestones": [
                    {
                        "title": "Tech Lead",
                        "timeline": "6-12 months",
                        "requirements": ["Lead a team of 3-5 engineers", "Own technical roadmap", "Mentor junior developers"]
                    },
                    {
                        "title": "Staff Engineer / Manager Track Decision",
                        "timeline": "12-18 months",
                        "requirements": ["Demonstrate leadership impact", "Drive cross-team initiatives"]
                    },
                    {
                        "title": "Engineering Manager",
                        "timeline": "24-36 months",
                        "requirements": ["People management experience", "Budget and resource planning", "Performance management"]
                    }
                ],
                "recommended_actions": [
                    "Volunteer to lead sprint planning and retrospectives",
                    "Take on mentorship responsibilities",
                    "Complete a management training program"
                ]
            })
        
        if "job" in last_message and "match" in last_message:
            return json.dumps({
                "match_score": 85,
                "breakdown": {
                    "skills_match": 88,
                    "experience_match": 82,
                    "education_match": 90,
                    "location_match": 100,
                    "salary_match": 75
                },
                "matching_skills": ["Python", "React", "PostgreSQL", "REST APIs", "Agile"],
                "missing_skills": ["Kubernetes", "Terraform"],
                "recommendation": "Strong match! Consider highlighting your relevant project experience.",
                "application_tips": [
                    "Emphasize your experience with similar tech stack",
                    "Mention your experience leading technical projects",
                    "Include metrics from past achievements"
                ]
            })
        
        # Default response
        return json.dumps({
            "status": "success",
            "message": "AI analysis completed",
            "data": {}
        })
    
    async def analyze_resume(self, resume_content: str, job_description: Optional[str] = None) -> dict:
        """Analyze resume and provide feedback"""
        prompt = f"""Analyze the following resume and provide detailed feedback.
        
Resume:
{resume_content}

{"Job Description:" + job_description if job_description else ""}

Provide analysis in JSON format with:
- overall_score (0-100)
- sections (contact_info, summary, experience, skills, education) each with score and feedback
- suggestions (array of improvement suggestions)
- ats_compatibility score
- keyword_analysis with found and missing keywords
"""
        
        messages = [
            {"role": "system", "content": "You are an expert resume reviewer and career coach. Provide detailed, actionable feedback."},
            {"role": "user", "content": prompt}
        ]
        
        response = await self._call_groq(messages)
        return self._parse_ai_json(response)
    
    async def analyze_skill_gaps(self, current_skills: list, target_role: str) -> dict:
        """Analyze skill gaps for target role"""
        prompt = f"""Analyze the skill gap between current skills and target role requirements.

Current Skills: {', '.join([s.get('name', s) if isinstance(s, dict) else s for s in current_skills])}
Target Role: {target_role}

Provide analysis in JSON format with:
- skill_gaps (array with skill name, importance, current_level, required_level, and learning resources)
- timeline (recommended time to bridge gaps)
- priority_order (skills to learn first)
"""
        
        messages = [
            {"role": "system", "content": "You are a career development expert. Provide actionable skill gap analysis."},
            {"role": "user", "content": prompt}
        ]
        
        response = await self._call_groq(messages)
        return self._parse_ai_json(response)
    
    async def generate_interview_questions(self, job_title: str, company: str, skills: list) -> dict:
        """Generate tailored interview questions"""
        prompt = f"""Generate interview preparation questions for:

Job Title: {job_title}
Company: {company}
Key Skills: {', '.join(skills)}

Provide in JSON format with:
- questions (array with question, type [behavioral/technical/system_design], and tips)
- preparation_tips (general preparation advice)
"""
        
        messages = [
            {"role": "system", "content": "You are an expert interview coach with experience at top tech companies."},
            {"role": "user", "content": prompt}
        ]
        
        response = await self._call_groq(messages)
        return self._parse_ai_json(response)
    
    async def analyze_career_path(self, current_role: str, target_role: str, experience_years: int) -> dict:
        """Analyze and recommend career path"""
        prompt = f"""Create a career progression plan:

Current Role: {current_role}
Target Role: {target_role}
Years of Experience: {experience_years}

Provide in JSON format with:
- current_position
- target_position
- timeline
- milestones (array with title, timeline, requirements)
- recommended_actions
"""
        
        messages = [
            {"role": "system", "content": "You are a senior career advisor with deep industry knowledge."},
            {"role": "user", "content": prompt}
        ]
        
        response = await self._call_groq(messages)
        return self._parse_ai_json(response)
    
    async def calculate_job_match(self, profile_data: dict, job_data: dict) -> dict:
        """Calculate job match score"""
        prompt = f"""Calculate job match score between candidate and job.

Candidate Profile:
{json.dumps(profile_data, indent=2)}

Job Requirements:
{json.dumps(job_data, indent=2)}

Provide in JSON format with:
- match_score (0-100)
- breakdown (skills_match, experience_match, education_match, location_match, salary_match)
- matching_skills
- missing_skills
- recommendation
- application_tips
"""
        
        messages = [
            {"role": "system", "content": "You are an expert job matching algorithm. Provide accurate match analysis."},
            {"role": "user", "content": prompt}
        ]
        
        response = await self._call_groq(messages)
        return self._parse_ai_json(response)
    
    async def enhance_resume_content(self, content: str, job_description: Optional[str] = None) -> str:
        """Enhance resume content with AI suggestions"""
        prompt = f"""Improve the following resume content to be more impactful and professional.

Original Content:
{content}

{"Target Job:" + job_description if job_description else ""}

Rewrite to be more impactful with:
- Strong action verbs
- Quantified achievements where possible
- Keywords relevant to the target role
- Professional tone

Return only the improved content, not explanations.
"""
        
        messages = [
            {"role": "system", "content": "You are an expert resume writer. Improve content while maintaining authenticity."},
            {"role": "user", "content": prompt}
        ]
        
        return await self._call_groq(messages)
    
    async def evaluate_interview_answer(self, question: str, answer: str, target_role: str) -> dict:
        """Evaluate an interview answer and provide feedback"""
        prompt = f"""Evaluate the following interview answer:

Target Role: {target_role}
Question: {question}
Candidate Answer: {answer}

Provide a detailed evaluation in JSON format with:
- score (0-100)
- feedback (overall qualitative feedback)
- strengths (array of points where the candidate did well)
- improvements (array of specific suggestions for improvement)
- model_answer (a brief example of a strong response)
"""
        
        messages = [
            {"role": "system", "content": "You are a professional interview evaluator. Be constructive, specific, and fair."},
            {"role": "user", "content": prompt}
        ]
        
        response = await self._call_groq(messages)
        return self._parse_ai_json(response)

    async def generate_learning_path(self, current_skills: list, target_role: str) -> dict:
        """Generate a personalized learning path"""
        prompt = f"""Generate a personalized learning path to transition into a {target_role} role.

Current Skills: {', '.join([s.get('name', s) if isinstance(s, dict) else s for s in current_skills])}
Target Role: {target_role}

Provide a detailed learning path in JSON format with:
- target_role
- current_level (Beginner/Intermediate/Advanced)
- estimated_duration
- focus_areas (array of skill names)
- milestones (array of objects with title, description, and status='locked')
- courses (array of recommended courses with title, provider, and difficulty)
"""
        
        messages = [
            {"role": "system", "content": "You are an expert career and education advisor. Create structured, high-quality learning paths."},
            {"role": "user", "content": prompt}
        ]
        
        response = await self._call_groq(messages)
        return self._parse_ai_json(response)

    async def generate_cover_letter(self, profile_data: dict, job_data: dict) -> str:
        """Generate a tailored cover letter"""
        prompt = f"""Write a professional cover letter for this candidate applying to this job.

Candidate:
{json.dumps(profile_data, indent=2)}

Job:
{json.dumps(job_data, indent=2)}

Write a compelling cover letter that:
- Opens with a strong hook
- Highlights relevant experience
- Shows enthusiasm for the company
- Includes specific achievements
- Maintains professional tone
"""
        
        messages = [
            {"role": "system", "content": "You are an expert cover letter writer. Create compelling, personalized letters."},
            {"role": "user", "content": prompt}
        ]
        
        return await self._call_groq(messages)


# Singleton instance
ai_service = AIService()
