import { supabase } from './supabase'
import type { Profile } from '../types/database'

export async function getCurrentUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle<Profile>()

  if (error) {
    throw error
  }

  return data
}

export async function upsertProfile(profile: Partial<Profile> & { id: string }) {
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile)
    .select('*')
    .single<Profile>()

  if (error) {
    throw error
  }

  return data
}
