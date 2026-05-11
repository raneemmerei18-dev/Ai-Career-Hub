"use client"

import { useState } from 'react'
import { Plus, X, Search, Code, Briefcase, MessageSquare, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { useOnboardingStore, type Skill } from '@/store/onboarding-store'

const skillSuggestions: Record<string, string[]> = {
  technical: [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go', 'Rust',
    'React', 'Vue.js', 'Angular', 'Next.js', 'Node.js', 'Express',
    'PostgreSQL', 'MongoDB', 'Redis', 'AWS', 'Docker', 'Kubernetes',
    'Git', 'CI/CD', 'REST APIs', 'GraphQL', 'Machine Learning', 'Data Science'
  ],
  soft: [
    'Leadership', 'Communication', 'Problem Solving', 'Critical Thinking',
    'Teamwork', 'Time Management', 'Adaptability', 'Creativity',
    'Emotional Intelligence', 'Conflict Resolution', 'Decision Making',
    'Presentation Skills', 'Negotiation', 'Mentoring'
  ],
  tools: [
    'VS Code', 'IntelliJ IDEA', 'Figma', 'Sketch', 'Adobe XD',
    'Jira', 'Confluence', 'Slack', 'Microsoft Office', 'Google Workspace',
    'Notion', 'Asana', 'Trello', 'GitHub', 'GitLab', 'Postman'
  ],
  domain: [
    'Agile/Scrum', 'Product Management', 'UX Design', 'Data Analysis',
    'Project Management', 'DevOps', 'Cloud Architecture', 'System Design',
    'Security', 'Compliance', 'API Design', 'Microservices'
  ]
}

const categoryIcons = {
  technical: Code,
  soft: MessageSquare,
  tools: Wrench,
  domain: Briefcase,
}

const proficiencyLabels = ['Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Expert']

export function SkillsStep() {
  const { data, addSkill, removeSkill, updateSkill } = useOnboardingStore()
  const { skills } = data
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('technical')

  const filteredSuggestions = skillSuggestions[activeCategory]?.filter(
    skill => 
      skill.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !skills.some(s => s.name.toLowerCase() === skill.toLowerCase())
  ) || []

  const handleAddSkill = (skillName: string, category: string) => {
    if (skills.some(s => s.name.toLowerCase() === skillName.toLowerCase())) return
    
    addSkill({
      id: `skill-${Date.now()}`,
      name: skillName,
      category: category as Skill['category'],
      level: 3,
      yearsOfExperience: 1,
    })
    setSearchTerm('')
  }

  const handleAddCustomSkill = () => {
    if (!searchTerm.trim()) return
    handleAddSkill(searchTerm.trim(), activeCategory)
  }

  const skillsByCategory = {
    technical: skills.filter(s => s.category === 'technical'),
    soft: skills.filter(s => s.category === 'soft'),
    tools: skills.filter(s => s.category === 'tools'),
    domain: skills.filter(s => s.category === 'domain'),
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Add your skills and rate your proficiency level. This helps us match you with the right opportunities.
      </p>

      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid grid-cols-4 w-full">
          {Object.entries(categoryIcons).map(([category, Icon]) => (
            <TabsTrigger key={category} value={category} className="gap-2 capitalize">
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{category}</span>
              {skillsByCategory[category as keyof typeof skillsByCategory].length > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 justify-center">
                  {skillsByCategory[category as keyof typeof skillsByCategory].length}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.keys(categoryIcons).map((category) => (
          <TabsContent key={category} value={category} className="space-y-4 mt-4">
            {/* Search and Add */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={`Search ${category} skills...`}
                  className="pl-10"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCustomSkill()}
                />
              </div>
              <Button onClick={handleAddCustomSkill} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Suggestions */}
            {filteredSuggestions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {filteredSuggestions.slice(0, 12).map((skill) => (
                  <Button
                    key={skill}
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddSkill(skill, category)}
                    className="gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    {skill}
                  </Button>
                ))}
              </div>
            )}

            {/* Added Skills */}
            <div className="space-y-3">
              {skillsByCategory[category as keyof typeof skillsByCategory].map((skill) => (
                <div key={skill.id} className="p-4 rounded-lg border border-border bg-card">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="font-medium text-foreground">{skill.name}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {proficiencyLabels[skill.level - 1]}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSkill(skill.id)}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <Label>Proficiency</Label>
                        <span className="text-muted-foreground text-xs">
                          {proficiencyLabels[skill.level - 1]}
                        </span>
                      </div>
                      <Slider
                        value={[skill.level]}
                        onValueChange={([value]) => updateSkill(skill.id, { level: value })}
                        min={1}
                        max={5}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Beginner</span>
                        <span>Expert</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Years of Experience</Label>
                      <Input
                        type="number"
                        min="0"
                        max="50"
                        value={skill.yearsOfExperience}
                        onChange={(e) => updateSkill(skill.id, { yearsOfExperience: parseInt(e.target.value) || 0 })}
                        className="w-24 h-8"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {skillsByCategory[category as keyof typeof skillsByCategory].length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No {category} skills added yet.</p>
                  <p className="text-sm">Search or click suggestions above to add skills.</p>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Skills Summary */}
      <div className="mt-6 p-4 rounded-lg bg-muted/50">
        <h4 className="text-sm font-medium mb-2">Skills Summary</h4>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge key={skill.id} variant="secondary" className="gap-1">
              {skill.name}
              <button
                onClick={() => removeSkill(skill.id)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {skills.length === 0 && (
            <span className="text-sm text-muted-foreground">No skills added yet</span>
          )}
        </div>
      </div>
    </div>
  )
}
