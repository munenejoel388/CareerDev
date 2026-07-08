import { isSupabaseConfigured, supabase } from './supabase'
import type { CareerAnalysis, NewCareerAnalysis } from '../types/database'

const LOCAL_ANALYSES_KEY = 'local_analyses'

function readLocalAnalyses() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_ANALYSES_KEY) || '[]') as CareerAnalysis[]
  } catch {
    return []
  }
}

function writeLocalAnalyses(analyses: CareerAnalysis[]) {
  localStorage.setItem(LOCAL_ANALYSES_KEY, JSON.stringify(analyses))
}

export async function listCareerAnalyses(userId: string) {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('career_analyses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .returns<CareerAnalysis[]>()

      if (error) {
        throw error
      }

      const otherUsersAnalyses = readLocalAnalyses().filter((analysis) => analysis.user_id !== userId)
      writeLocalAnalyses([...data, ...otherUsersAnalyses])

      return data
    } catch (error) {
      console.warn('Falling back to local career analyses:', error)
    }
  }

  return readLocalAnalyses()
    .filter((analysis) => analysis.user_id === userId)
    .sort((first, second) => Date.parse(second.created_at) - Date.parse(first.created_at))
}

export async function createCareerAnalysis(analysis: NewCareerAnalysis) {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('career_analyses')
        .insert(analysis)
        .select('*')
        .single<CareerAnalysis>()

      if (error) {
        throw error
      }

      writeLocalAnalyses([data, ...readLocalAnalyses().filter((item) => item.id !== data.id)])

      return data
    } catch (error) {
      console.warn('Saving career analysis locally after Supabase failure:', error)
    }
  }

  const localAnalysis: CareerAnalysis = {
    id: crypto.randomUUID(),
    user_id: analysis.user_id,
    current_career: analysis.current_career,
    target_career: analysis.target_career,
    experience_level: analysis.experience_level,
    current_skills: analysis.current_skills,
    goals: analysis.goals ?? null,
    readiness_score: analysis.readiness_score ?? 0,
    summary: analysis.summary ?? null,
    skill_gaps: analysis.skill_gaps ?? [],
    learning_recommendations: analysis.learning_recommendations ?? [],
    created_at: new Date().toISOString(),
  }

  writeLocalAnalyses([localAnalysis, ...readLocalAnalyses()])

  return localAnalysis
}

export async function updateAnalysisRecommendations(analysisId: string, recommendations: any[]) {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('career_analyses')
        .update({ learning_recommendations: recommendations })
        .eq('id', analysisId)
        .select('*')
        .single<CareerAnalysis>()

      if (error) {
        throw error
      }

      writeLocalAnalyses(readLocalAnalyses().map((analysis) => (analysis.id === analysisId ? data : analysis)))

      return data
    } catch (error) {
      console.warn('Updating recommendations locally after Supabase failure:', error)
    }
  }

  const updatedAnalyses = readLocalAnalyses().map((analysis) =>
    analysis.id === analysisId ? { ...analysis, learning_recommendations: recommendations } : analysis,
  )
  const updatedAnalysis = updatedAnalyses.find((analysis) => analysis.id === analysisId)

  writeLocalAnalyses(updatedAnalyses)

  if (!updatedAnalysis) {
    throw new Error('Analysis not found.')
  }

  return updatedAnalysis
}

export async function resetCareerAnalysesForUser(userId: string) {
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase
        .from('career_analyses')
        .delete()
        .eq('user_id', userId)

      if (error) {
        throw error
      }
    } catch (error) {
      console.warn('Resetting local career analyses after Supabase failure:', error)
    }
  }

  writeLocalAnalyses(readLocalAnalyses().filter((analysis) => analysis.user_id !== userId))
}
