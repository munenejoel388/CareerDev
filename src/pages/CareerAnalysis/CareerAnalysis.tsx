import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ChevronRight, 
  ChevronLeft, 
  Brain, 
  Sparkles, 
  Plus, 
  X
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { createCareerAnalysis } from '../../services/careerAnalyses'
import { getCurrentUserProfile, upsertProfile } from '../../services/profiles'
import type { SkillGap, LearningRecommendation, NewCareerAnalysis } from '../../types/database'

const STEPS = [
  { id: 1, label: 'Current Profile' },
  { id: 2, label: 'Target Role' },
  { id: 3, label: 'Education' },
  { id: 4, label: 'Experience' },
  { id: 5, label: 'Skills' },
]

const POPULAR_SKILLS = [
  'Python', 'JavaScript', 'TypeScript', 'React', 'HTML/CSS', 'Node.js', 
  'SQL', 'Machine Learning', 'Deep Learning', 'Data Structures', 
  'System Design', 'Docker', 'Kubernetes', 'AWS', 'Linux', 'Git'
]

const COURSE_LINKS = {
  awsCloudPractitioner: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/134/aws-cloud-practitioner-essentials',
  googleDataStructures: 'https://techdevguide.withgoogle.com/paths/data-structures-and-algorithms/',
  ibmPython: 'https://skillsbuild.org/students/course-catalog/python-for-data-science',
  microsoftAi: 'https://learn.microsoft.com/en-us/training/paths/get-started-with-artificial-intelligence-on-azure/',
  redHatLinux: 'https://www.redhat.com/en/services/training/rh104-red-hat-enterprise-linux-technical-overview',
  stanfordMachineLearning: 'https://www.coursera.org/specializations/machine-learning-introduction',
}

export default function CareerAnalysis() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  
  // Wizard state values
  const [currentRole, setCurrentRole] = useState('')
  const [yearsExperience, setYearsExperience] = useState('0-1 years')
  const [highestEducation, setHighestEducation] = useState("Bachelor's Degree")
  
  const [targetCareer, setTargetCareer] = useState('')
  const [goals, setGoals] = useState('')
  
  const [major, setMajor] = useState('')
  const [institution, setInstitution] = useState('')
  
  const [projectsDescription, setProjectsDescription] = useState('')
  const [pastCompany, setPastCompany] = useState('')

  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Load profile values if they exist
  useEffect(() => {
    if (user) {
      getCurrentUserProfile(user.id)
        .then((profile) => {
          if (!profile) return
          if (profile.target_career) setTargetCareer(profile.target_career)
          if (profile.experience_level) {
            const mapExp: Record<string, string> = {
              'Junior': '0-2 years',
              'Mid': '2-5 years',
              'Senior': '5+ years',
            }
            setYearsExperience(mapExp[profile.experience_level] || '0-1 years')
          }
        })
        .catch((error) => console.error('Error loading profile for analysis:', error))
    }
  }, [user])

  function handleAddSkill(skill: string) {
    const cleaned = skill.trim()
    if (cleaned && !skills.includes(cleaned)) {
      setSkills([...skills, cleaned])
    }
    setSkillInput('')
  }

  function handleRemoveSkill(skill: string) {
    setSkills(skills.filter(s => s !== skill))
  }

  // Next and Back buttons
  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  // AI analysis generator algorithm
  function generateAIAnalysis(targetRole: string, userSkills: string[], exp: string, edu: string) {
    const target = targetRole.toLowerCase()
    
    // 1. Calculate readiness score
    let score = 35 // Base score
    if (edu.includes("Bachelor's") || edu.includes("Master's") || edu.includes("PhD")) score += 15
    if (exp === '2-5 years') score += 10
    if (exp === '5+ years') score += 20
    
    // Add points for matching expected skills
    let expected: string[] = []
    let gaps: SkillGap[] = []
    let recommendations: LearningRecommendation[] = []

    if (target.includes('ai') || target.includes('machine') || target.includes('intelligence') || target.includes('data')) {
      expected = ['Python', 'Machine Learning', 'Data Structures', 'SQL', 'Deep Learning', 'System Design']
      
      // Calculate matching skills
      const matches = userSkills.filter(s => expected.map(e => e.toLowerCase()).includes(s.toLowerCase()))
      score += matches.length * 8

      // Determine Gaps
      expected.forEach(s => {
        if (!userSkills.map(us => us.toLowerCase()).includes(s.toLowerCase())) {
          let priority: 'low' | 'medium' | 'high' = 'medium'
          let reason = ''
          if (s === 'Python' || s === 'Machine Learning') {
            priority = 'high'
            reason = 'Core foundation required to develop models.'
          } else if (s === 'Data Structures') {
            priority = 'high'
            reason = 'Crucial for passing engineering interviews and building optimized algorithms.'
          } else {
            reason = 'Important secondary skill to store data and deploy systems.'
          }
          gaps.push({ skill: s, priority, reason })
        }
      })

      // Recommendations matching the screenshot
      recommendations = [
        { title: 'Python for Data Science', provider: 'IBM SkillsBuild', url: COURSE_LINKS.ibmPython, skill: 'Python' },
        { title: 'Data Structures and Algorithms', provider: 'Google for Developers', url: COURSE_LINKS.googleDataStructures, skill: 'Data Structures' },
        { title: 'Get Started with AI on Azure', provider: 'Microsoft Learn', url: COURSE_LINKS.microsoftAi, skill: 'Artificial Intelligence' },
        { title: 'Machine Learning Specialization', provider: 'Stanford / Coursera', url: COURSE_LINKS.stanfordMachineLearning, skill: 'Machine Learning' }
      ]
    } else if (target.includes('front') || target.includes('web') || target.includes('react') || target.includes('developer')) {
      expected = ['JavaScript', 'TypeScript', 'React', 'HTML/CSS', 'System Design', 'Git']
      
      const matches = userSkills.filter(s => expected.map(e => e.toLowerCase()).includes(s.toLowerCase()))
      score += matches.length * 8

      expected.forEach(s => {
        if (!userSkills.map(us => us.toLowerCase()).includes(s.toLowerCase())) {
          let priority: 'low' | 'medium' | 'high' = 'medium'
          let reason = ''
          if (s === 'React' || s === 'JavaScript') {
            priority = 'high'
            reason = 'Core framework of modern interactive user interfaces.'
          } else if (s === 'TypeScript') {
            priority = 'medium'
            reason = 'Helps prevent UI runtime errors and improves enterprise codebase scalability.'
          } else {
            reason = 'Essential for design architecture and collaborative version control.'
          }
          gaps.push({ skill: s, priority, reason })
        }
      })

      recommendations = [
        { title: 'Python for Data Science', provider: 'IBM SkillsBuild', url: COURSE_LINKS.ibmPython, skill: 'Python' },
        { title: 'AWS Cloud Practitioner Essentials', provider: 'AWS Skill Builder', url: COURSE_LINKS.awsCloudPractitioner, skill: 'Cloud' },
        { title: 'Data Structures and Algorithms', provider: 'Google for Developers', url: COURSE_LINKS.googleDataStructures, skill: 'Data Structures' }
      ]
    } else {
      // Default / Cloud / General
      expected = ['Linux', 'Cloud Computing', 'AWS', 'Docker', 'System Design', 'Git']
      const matches = userSkills.filter(s => expected.map(e => e.toLowerCase()).includes(s.toLowerCase()))
      score += matches.length * 8

      expected.forEach(s => {
        if (!userSkills.map(us => us.toLowerCase()).includes(s.toLowerCase())) {
          let priority: 'low' | 'medium' | 'high' = 'medium'
          let reason = ''
          if (s === 'Linux' || s === 'Cloud Computing') {
            priority = 'high'
            reason = 'Necessary infrastructure layer for deploying application software.'
          } else {
            reason = 'Aids in continuous integration, containerization, and backend design.'
          }
          gaps.push({ skill: s, priority, reason })
        }
      })

      recommendations = [
        { title: 'Red Hat Enterprise Linux Technical Overview', provider: 'Red Hat Academy', url: COURSE_LINKS.redHatLinux, skill: 'Linux' },
        { title: 'AWS Cloud Practitioner Essentials', provider: 'AWS Skill Builder', url: COURSE_LINKS.awsCloudPractitioner, skill: 'Cloud Computing' },
        { title: 'Get Started with AI on Azure', provider: 'Microsoft Learn', url: COURSE_LINKS.microsoftAi, skill: 'AI' }
      ]
    }

    score = Math.min(score, 100)
    
    // Build summary text
    const summary = `Based on your profile as a ${edu} graduate with ${exp} experience, you have a solid foundation. To succeed as a ${targetRole}, you should prioritize closing skill gaps in ${gaps.map(g => g.skill).slice(0, 3).join(', ')}. Your readiness score is ${score}%. We have prepared a customized learning roadmap below containing IBM, AWS, Google, and Microsoft resources to help you achieve your goals.`

    return {
      readiness_score: score,
      skill_gaps: gaps,
      learning_recommendations: recommendations,
      summary,
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) {
      setError('You must be logged in to save an analysis.')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      // 1. Generate AI analysis
      const analysisData = generateAIAnalysis(targetCareer, skills, yearsExperience, highestEducation)

      const payload: NewCareerAnalysis = {
        user_id: user.id,
        current_career: currentRole || 'Student',
        target_career: targetCareer,
        experience_level: yearsExperience,
        current_skills: skills,
        goals: goals,
        readiness_score: analysisData.readiness_score,
        summary: analysisData.summary,
        skill_gaps: analysisData.skill_gaps,
        learning_recommendations: analysisData.learning_recommendations,
      }

      const mapExp: Record<string, string> = {
        '0-1 years': 'Junior',
        '2-5 years': 'Mid',
        '5+ years': 'Senior',
      }
      await upsertProfile({
        id: user.id,
        target_career: targetCareer,
        experience_level: mapExp[yearsExperience] || 'Junior',
      })

      await createCareerAnalysis(payload)

      // Dispatch window events so dashboard instantly updates
      window.dispatchEvent(new Event('profile-updated'))
      window.dispatchEvent(new Event('analyses-updated'))
      window.dispatchEvent(new Event('roadmap-updated'))

      // Redirect to dashboard
      navigate('/dashboard')
    } catch (err) {
      console.error('Error submitting career analysis:', err)
      setError('An error occurred while generating analysis. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8 text-left max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <Brain size={24} className="text-cyan-400" />
          AI Career Advisor
        </h1>
        <p className="text-sm text-slate-400 mt-1">Provide your details to identify skill gaps and generate a customized roadmap.</p>
      </div>

      {/* Step Progress Tracker */}
      <div className="grid grid-cols-5 gap-2 pb-2">
        {STEPS.map((step) => (
          <div key={step.id} className="space-y-2">
            <div className={`h-1.5 rounded-full transition-all duration-300 ${currentStep >= step.id ? 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.3)]' : 'bg-slate-800'}`} />
            <span className={`hidden md:block text-xs font-bold transition ${currentStep === step.id ? 'text-white' : 'text-slate-500'}`}>
              {step.id}: {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* Form Card */}
      <div className="rounded-2xl border border-slate-800 bg-[#0d1321]/60 p-8 backdrop-blur-xl relative">
        {error && (
          <div className="mb-6 rounded-xl border border-rose-500/25 bg-rose-500/5 px-4 py-3 text-xs text-rose-400">
            {error}
          </div>
        )}

        {/* STEP 1: Current Profile */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="size-6 rounded-md bg-cyan-500/10 text-cyan-400 font-bold text-xs flex items-center justify-center">1</span>
              Current Profile Status
            </h3>
            <p className="text-xs text-slate-400">Tell us about your current career background and education level.</p>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="currentRole" className="block text-xs font-bold uppercase tracking-wider text-slate-400">Current Role / Major</label>
                <input
                  id="currentRole"
                  type="text"
                  placeholder="e.g. IT Student, Junior QA, Sales Clerk"
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-850 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-700 outline-none focus:border-cyan-500 transition duration-200"
                />
              </div>

              <div>
                <label htmlFor="yearsExp" className="block text-xs font-bold uppercase tracking-wider text-slate-400">Years of Experience</label>
                <select
                  id="yearsExp"
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-850 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500 transition duration-200"
                >
                  <option value="0-1 years">0-1 years (Entry Level)</option>
                  <option value="2-5 years">2-5 years (Mid Level)</option>
                  <option value="5+ years">5+ years (Senior Level)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="highestEdu" className="block text-xs font-bold uppercase tracking-wider text-slate-400">Highest Education Degree</label>
                <select
                  id="highestEdu"
                  value={highestEducation}
                  onChange={(e) => setHighestEducation(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-850 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500 transition duration-200"
                >
                  <option value="High School">High School Diploma</option>
                  <option value="Associate's Degree">Associate's Degree</option>
                  <option value="Bachelor's Degree">Bachelor's Degree</option>
                  <option value="Master's Degree">Master's Degree</option>
                  <option value="PhD">PhD / Doctorate</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Target Role */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="size-6 rounded-md bg-cyan-500/10 text-cyan-400 font-bold text-xs flex items-center justify-center">2</span>
              Target Role Goal
            </h3>
            <p className="text-xs text-slate-400">What is the dream career role you are building towards?</p>

            <div className="space-y-6">
              <div>
                <label htmlFor="targetCareer" className="block text-xs font-bold uppercase tracking-wider text-slate-400">Target Career Role</label>
                <input
                  id="targetCareer"
                  type="text"
                  placeholder="e.g. AI Engineer, Frontend Developer, Cloud Architect"
                  value={targetCareer}
                  onChange={(e) => setTargetCareer(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-850 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-700 outline-none focus:border-cyan-500 transition duration-200"
                  required
                />
              </div>

              <div>
                <label htmlFor="goals" className="block text-xs font-bold uppercase tracking-wider text-slate-400">Core Goals & Motivation</label>
                <textarea
                  id="goals"
                  rows={4}
                  placeholder="Tell us what you hope to achieve, why you want to transition, or what your target timeline is."
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-850 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-700 outline-none focus:border-cyan-500 transition duration-200 resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Education Details */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="size-6 rounded-md bg-cyan-500/10 text-cyan-400 font-bold text-xs flex items-center justify-center">3</span>
              Education Details
            </h3>
            <p className="text-xs text-slate-400">Provide details about your academic studies or degrees.</p>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="major" className="block text-xs font-bold uppercase tracking-wider text-slate-400">Field of Study / Major</label>
                <input
                  id="major"
                  type="text"
                  placeholder="e.g. Computer Science, Mechanical Engineering, Business"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-850 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-700 outline-none focus:border-cyan-500 transition duration-200"
                />
              </div>

              <div>
                <label htmlFor="institution" className="block text-xs font-bold uppercase tracking-wider text-slate-400">Institution / University</label>
                <input
                  id="institution"
                  type="text"
                  placeholder="e.g. Stanford University, Local College, Coursera"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-850 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-700 outline-none focus:border-cyan-500 transition duration-200"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Experience / Projects */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="size-6 rounded-md bg-cyan-500/10 text-cyan-400 font-bold text-xs flex items-center justify-center">4</span>
              Past Projects & Companies
            </h3>
            <p className="text-xs text-slate-400">Briefly mention your past employers or key projects you have worked on.</p>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="company" className="block text-xs font-bold uppercase tracking-wider text-slate-400">Last Employer (Optional)</label>
                <input
                  id="company"
                  type="text"
                  placeholder="e.g. Acme Corp, Freelance"
                  value={pastCompany}
                  onChange={(e) => setPastCompany(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-850 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-700 outline-none focus:border-cyan-500 transition duration-200"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="projectDesc" className="block text-xs font-bold uppercase tracking-wider text-slate-400">Key Projects / Job Description</label>
                <textarea
                  id="projectDesc"
                  rows={4}
                  placeholder="Describe your primary responsibilities, key tools used, or projects built."
                  value={projectsDescription}
                  onChange={(e) => setProjectsDescription(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-850 bg-slate-950 px-4 py-3 text-sm text-white placeholder-slate-700 outline-none focus:border-cyan-500 transition duration-200 resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Current Skills */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="size-6 rounded-md bg-cyan-500/10 text-cyan-400 font-bold text-xs flex items-center justify-center">5</span>
              Technical Skills Assessment
            </h3>
            <p className="text-xs text-slate-400">Select popular skills or type your custom skills to build your inventory.</p>

            {/* Selected Skills Tags */}
            <div className="flex flex-wrap gap-2.5 min-h-[50px] p-4 rounded-xl bg-slate-950 border border-slate-850">
              {skills.length === 0 ? (
                <span className="text-slate-600 text-xs italic self-center">No skills added yet. Click items below or type one.</span>
              ) : (
                skills.map(skill => (
                  <span key={skill} className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 px-3 py-1.5 text-xs font-semibold text-cyan-400">
                    {skill}
                    <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-white">
                      <X size={12} />
                    </button>
                  </span>
                ))
              )}
            </div>

            {/* Custom Add Skill Input */}
            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                placeholder="Type a custom skill (e.g. Rust)"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill(skillInput))}
                className="w-full rounded-xl border border-slate-850 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-500 transition duration-200"
              />
              <button
                type="button"
                onClick={() => handleAddSkill(skillInput)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition flex items-center justify-center"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Popular Skills List */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Popular Skill Recommendations</h4>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SKILLS.map(skill => {
                  const isAdded = skills.includes(skill)
                  return (
                    <button
                      key={skill}
                      type="button"
                      disabled={isAdded}
                      onClick={() => handleAddSkill(skill)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
                        isAdded 
                          ? 'border-slate-850 bg-slate-900/50 text-slate-600 cursor-not-allowed'
                          : 'border-slate-800 bg-slate-900 text-slate-300 hover:border-cyan-500/30 hover:text-cyan-400'
                      }`}
                    >
                      {skill}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Form Action Controls */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-800/80">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-2.5 text-sm font-semibold text-slate-400 hover:border-slate-700 hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
            Back
          </button>

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-1.5 rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700 transition"
            >
              Next
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !targetCareer}
              className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-2.5 text-sm font-bold text-slate-950 hover:bg-cyan-400 transition-all duration-300 disabled:opacity-50 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
            >
              {isSubmitting ? (
                <>
                  <Sparkles size={16} className="animate-pulse" />
                  Generating Analysis...
                </>
              ) : (
                <>
                  <Brain size={16} />
                  Analyze Career with AI
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
