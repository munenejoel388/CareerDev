import { isSupabaseConfigured, supabase } from './supabase'
import type { Profile } from '../types/database'

function profileKey(userId: string) {
  return `user_profile:${userId}`
}

function readLocalProfile(userId: string) {
  try {
    const userProfile = localStorage.getItem(profileKey(userId))
    const legacyProfile = localStorage.getItem('user_profile')
    return JSON.parse(userProfile || legacyProfile || 'null') as Profile | null
  } catch {
    return null
  }
}

function writeLocalProfile(profile: Profile) {
  localStorage.setItem(profileKey(profile.id), JSON.stringify(profile))
  localStorage.setItem('user_profile', JSON.stringify(profile))
}

export async function getCurrentUserProfile(userId: string) {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle<Profile>()

      if (error) {
        throw error
      }

      if (data) {
        writeLocalProfile(data)
      }

      return data
    } catch (error) {
      console.warn('Falling back to local profile storage:', error)
    }
  }

  return readLocalProfile(userId)
}

export async function upsertProfile(profile: Partial<Profile> & { id: string }) {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert(profile)
        .select('*')
        .single<Profile>()

      if (error) {
        throw error
      }

      writeLocalProfile(data)

      return data
    } catch (error) {
      console.warn('Saving profile locally after Supabase failure:', error)
    }
  }

  const now = new Date().toISOString()
  const existing = readLocalProfile(profile.id)
  const localProfile: Profile = {
    id: profile.id,
    full_name: profile.full_name ?? existing?.full_name ?? null,
    target_career: profile.target_career ?? existing?.target_career ?? null,
    experience_level: profile.experience_level ?? existing?.experience_level ?? null,
    created_at: existing?.created_at ?? now,
    updated_at: now,
  }

  writeLocalProfile(localProfile)

  return localProfile
}
