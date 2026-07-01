import { supabase } from './supabase'
import type { CareerAnalysis, NewCareerAnalysis } from '../types/database'

export async function listCareerAnalyses(userId: string) {
  const { data, error } = await supabase
    .from('career_analyses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .returns<CareerAnalysis[]>()

  if (error) {
    throw error
  }

  return data
}

export async function createCareerAnalysis(analysis: NewCareerAnalysis) {
  const { data, error } = await supabase
    .from('career_analyses')
    .insert(analysis)
    .select('*')
    .single<CareerAnalysis>()

  if (error) {
    throw error
  }

  return data
}

export async function updateAnalysisRecommendations(analysisId: string, recommendations: any[]) {
  const { data, error } = await supabase
    .from('career_analyses')
    .update({ learning_recommendations: recommendations })
    .eq('id', analysisId)
    .select('*')
    .single<CareerAnalysis>()

  if (error) {
    throw error
  }

  return data
}
