import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, CheckCircle, Clock, ChevronRight, Play, ExternalLink } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { listCareerAnalyses, updateAnalysisRecommendations } from '../../services/careerAnalyses'
import type { CareerAnalysis, LearningRecommendation } from '../../types/database'

type ExtendedRecommendation = LearningRecommendation & {
  status?: 'Not Started' | 'In Progress' | 'Completed'
  progress?: number
}

// Brand SVG Icons for premium aesthetics
function BrandIcon({ provider }: { provider: string }) {
  const name = provider.toLowerCase()
  if (name.includes('ibm')) {
    return (
      <svg className="size-10 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2 4h20v2H2V4zm0 4h20v2H2V8zm0 4h20v2H2v-2zm0 4h20v2H2v-2zm0 4h20v2H2v-2z" />
      </svg>
    )
  }
  if (name.includes('red hat')) {
    return (
      <svg className="size-10 text-red-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5.67-1.5 1.5-1.5 1.5.67 1.5 1.5zm-1.5-3c-.55 0-1-.45-1-1V8.5c0-.55.45-1 1-1s1.45.45 1.45 1V13c0 .55-.45 1-1.45 1z" />
      </svg>
    )
  }
  if (name.includes('aws') || name.includes('amazon')) {
    return (
      <svg className="size-10 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
      </svg>
    )
  }
  if (name.includes('google')) {
    return (
      <svg className="size-10 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.579-7.859-8s3.529-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C18.155 2.185 15.46 1 12.24 1c-6.075 0-11 4.925-11 11s4.925 11 11 11c6.34 0 10.56-4.455 10.56-10.75 0-.725-.075-1.275-.175-1.825H12.24z" />
      </svg>
    )
  }
  return (
    <svg className="size-10 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm0 14.5L5 14v3.5l7 4 7-4V14l-7 3.5z" />
    </svg>
  )
}

export default function LearningRoadmap() {
  const { user } = useAuth()
  const [analysis, setAnalysis] = useState<CareerAnalysis | null>(null)
  const [courses, setCourses] = useState<ExtendedRecommendation[]>([])
  
  const [activeTab, setActiveTab] = useState<'recommended' | 'in-progress' | 'completed'>('recommended')
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const loadRoadmap = useCallback(() => {
    if (!user) return
    setIsLoading(true)

    listCareerAnalyses(user.id)
      .then((data) => {
        if (data.length > 0) {
          setAnalysis(data[0])
          processRecommendations(data[0].learning_recommendations)
        } else {
          setAnalysis(null)
          setCourses([])
        }
      })
      .catch((err) => console.error('Error fetching roadmap:', err))
      .finally(() => setIsLoading(false))
  }, [user])

  useEffect(() => {
    loadRoadmap()
  }, [loadRoadmap])

  // Watch for external updates
  useEffect(() => {
    window.addEventListener('roadmap-updated', loadRoadmap)
    return () => window.removeEventListener('roadmap-updated', loadRoadmap)
  }, [loadRoadmap])

  function processRecommendations(recs: LearningRecommendation[]) {
    // Inject default progress values if they are missing
    const processed = recs.map((rec: ExtendedRecommendation) => ({
      ...rec,
      status: rec.status || 'Not Started',
      progress: rec.progress || 0
    }))
    setCourses(processed)
  }

  async function handleStatusChange(title: string, newStatus: 'Not Started' | 'In Progress' | 'Completed', newProgress = 0) {
    if (!analysis) return
    setIsUpdating(title)

    const updatedCourses = courses.map(c => {
      if (c.title === title) {
        return {
          ...c,
          status: newStatus,
          progress: newStatus === 'Completed' ? 100 : newProgress
        }
      }
      return c
    })

    try {
      const updatedAnalysis = await updateAnalysisRecommendations(analysis.id, updatedCourses)
      setAnalysis(updatedAnalysis)
      processRecommendations(updatedAnalysis.learning_recommendations)
      
      // Dispatch events to refresh other widgets
      window.dispatchEvent(new Event('roadmap-updated'))
      window.dispatchEvent(new Event('profile-updated'))
      window.dispatchEvent(new Event('analyses-updated'))
    } catch (err) {
      console.error('Error updating roadmap status:', err)
    } finally {
      setIsUpdating(null)
    }
  }

  async function handleProgressSlider(title: string, val: number) {
    let status: 'Not Started' | 'In Progress' | 'Completed' = 'In Progress'
    if (val === 100) status = 'Completed'
    if (val === 0) status = 'Not Started'
    
    // Update local state first for smooth slider responsiveness
    setCourses(prev => prev.map(c => c.title === title ? { ...c, status, progress: val } : c))
    
    // Debounce database sync slightly or just write immediately
    if (analysis) {
      const updatedCourses = courses.map(c => {
        if (c.title === title) {
          return { ...c, status, progress: val }
        }
        return c
      })
      await updateAnalysisRecommendations(analysis.id, updatedCourses)
      window.dispatchEvent(new Event('roadmap-updated'))
    }
  }

  // Filters
  const recommendedCourses = courses
  const inProgressCourses = courses.filter(c => c.status === 'In Progress')
  const completedCourses = courses.filter(c => c.status === 'Completed')

  const visibleCourses = 
    activeTab === 'recommended' ? recommendedCourses :
    activeTab === 'in-progress' ? inProgressCourses :
    completedCourses

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500" />
      </div>
    )
  }

  return (
    <div className="space-y-8 text-left max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <BookOpen size={24} className="text-cyan-400" />
            Learning Roadmap
          </h1>
          <p className="text-sm text-slate-400 mt-1">Access personalized courses aligned to bridge your skill gaps.</p>
        </div>

        {analysis && (
          <span className="self-start rounded-full border border-cyan-500/30 bg-cyan-950/20 px-3.5 py-1 text-xs font-semibold text-cyan-400">
            Path: {analysis.target_career}
          </span>
        )}
      </div>

      {!analysis ? (
        <div className="rounded-2xl border border-slate-800 bg-[#0d1321]/60 p-8 text-center backdrop-blur-xl space-y-5">
          <BookOpen className="mx-auto text-slate-600 size-12" />
          <h3 className="text-lg font-bold text-white">No Roadmap Found</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            You must complete a career analysis assessment first so that the AI advisor can map out your tailored learning resources.
          </p>
          <Link
            to="/career-analysis"
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-bold text-slate-950 hover:bg-cyan-400 transition shadow-[0_0_15px_rgba(6,182,212,0.15)]"
          >
            Get AI Roadmap
            <ChevronRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Tabs Filter Row */}
          <div className="flex border-b border-slate-800 gap-6">
            <button
              onClick={() => setActiveTab('recommended')}
              className={`pb-4 text-sm font-semibold relative transition ${activeTab === 'recommended' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Recommended ({recommendedCourses.length})
              {activeTab === 'recommended' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-500" />}
            </button>
            <button
              onClick={() => setActiveTab('in-progress')}
              className={`pb-4 text-sm font-semibold relative transition ${activeTab === 'in-progress' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              In Progress ({inProgressCourses.length})
              {activeTab === 'in-progress' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-500" />}
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`pb-4 text-sm font-semibold relative transition ${activeTab === 'completed' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Completed ({completedCourses.length})
              {activeTab === 'completed' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-500" />}
            </button>
          </div>

          {/* Roadmap List */}
          <div className="space-y-4">
            {visibleCourses.length === 0 ? (
              <div className="rounded-2xl border border-slate-850 bg-slate-900/10 p-12 text-center text-slate-500 text-sm">
                No courses match this filter category.
              </div>
            ) : (
              visibleCourses.map((course) => (
                <div 
                  key={course.title}
                  className="rounded-2xl border border-slate-800 bg-[#0d1321]/60 p-5 md:p-6 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-700/80 transition duration-200"
                >
                  <div className="flex items-start gap-4">
                    {/* Brand Icon Wrapper */}
                    <div className="size-14 rounded-xl bg-slate-950 border border-slate-850 flex items-center justify-center shrink-0 shadow-inner">
                      <BrandIcon provider={course.provider} />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-white text-md tracking-wide leading-snug">{course.title}</h3>
                        <span className="rounded-md bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                          {course.skill}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        Provider: <span className="font-semibold text-slate-300">{course.provider}</span>
                      </p>
                      
                      {/* External Link */}
                      <a 
                        href={course.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-400/80 hover:text-cyan-300 mt-2 transition"
                      >
                        Visit Course Material
                        <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>

                  {/* Actions & Progress Area */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 shrink-0 md:min-w-[280px]">
                    {/* Progress Slider (Only if In Progress) */}
                    {course.status === 'In Progress' && (
                      <div className="flex-1 space-y-1.5 min-w-[140px]">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-slate-400">Progress</span>
                          <span className="text-cyan-400">{course.progress}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={course.progress || 0}
                          onChange={(e) => handleProgressSlider(course.title, parseInt(e.target.value))}
                          className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                      </div>
                    )}

                    {/* Status Pill Indicator */}
                    <div className="flex items-center gap-3">
                      {course.status === 'Completed' ? (
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-xs font-bold text-emerald-400">
                          <CheckCircle size={14} />
                          Completed
                        </span>
                      ) : course.status === 'In Progress' ? (
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 text-xs font-bold text-purple-400">
                          <Clock size={14} />
                          In Progress
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 border border-slate-700 px-3 py-1.5 text-xs font-bold text-slate-400">
                          Not Started
                        </span>
                      )}

                      {/* Action buttons to trigger progress */}
                      {course.status === 'Not Started' && (
                        <button
                          onClick={() => handleStatusChange(course.title, 'In Progress', 10)}
                          disabled={isUpdating === course.title}
                          className="flex items-center gap-1 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-3.5 py-1.5 text-xs font-bold transition disabled:opacity-50"
                        >
                          <Play size={12} fill="currentColor" />
                          Start
                        </button>
                      )}

                      {course.status === 'In Progress' && (
                        <button
                          onClick={() => handleStatusChange(course.title, 'Completed')}
                          disabled={isUpdating === course.title}
                          className="flex items-center gap-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3.5 py-1.5 text-xs font-bold transition disabled:opacity-50"
                        >
                          <CheckCircle size={12} />
                          Complete
                        </button>
                      )}

                      {course.status === 'Completed' && (
                        <button
                          onClick={() => handleStatusChange(course.title, 'In Progress', 50)}
                          disabled={isUpdating === course.title}
                          className="rounded-xl border border-slate-800 hover:border-slate-700 hover:bg-slate-800 px-2 py-1.5 text-[10px] font-bold text-slate-400 transition"
                        >
                          Reset Progress
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
