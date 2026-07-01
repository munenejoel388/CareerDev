export type Profile = {
  id: string
  full_name: string | null
  target_career: string | null
  experience_level: string | null
  created_at: string
  updated_at: string
}

export type CareerAnalysis = {
  id: string
  user_id: string
  current_career: string
  target_career: string
  experience_level: string
  current_skills: string[]
  goals: string | null
  readiness_score: number
  summary: string | null
  skill_gaps: SkillGap[]
  learning_recommendations: LearningRecommendation[]
  created_at: string
}

export type SkillGap = {
  skill: string
  priority: 'low' | 'medium' | 'high'
  reason: string
}

export type LearningRecommendation = {
  title: string
  provider: string
  url: string
  skill: string
}

export type NewCareerAnalysis = {
  user_id: string
  current_career: string
  target_career: string
  experience_level: string
  current_skills: string[]
  goals?: string
  readiness_score?: number
  summary?: string
  skill_gaps?: SkillGap[]
  learning_recommendations?: LearningRecommendation[]
}
