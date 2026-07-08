import { useState, useEffect } from 'react'
import { Outlet, useNavigate, Link } from 'react-router-dom'
import { Menu, X, User as UserIcon, LogOut, BriefcaseBusiness, LayoutDashboard, ClipboardList, BookOpen, History, Settings } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Sidebar from './Sidebar'
import { getCurrentUserProfile } from '../../services/profiles'
import type { Profile } from '../../types/database'

export default function DashboardLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (user) {
      getCurrentUserProfile(user.id)
        .then((data) => {
          if (data) setProfile(data)
        })
        .catch((err) => console.error('Error fetching profile:', err))
    }
  }, [user])

  // Watch for profile update events (we will trigger this when profile changes)
  useEffect(() => {
    function handleProfileUpdate() {
      if (user) {
        getCurrentUserProfile(user.id)
          .then((data) => {
            if (data) setProfile(data)
          })
          .catch((err) => console.error('Error updating profile layout:', err))
      }
    }
    window.addEventListener('profile-updated', handleProfileUpdate)
    return () => window.removeEventListener('profile-updated', handleProfileUpdate)
  }, [user])

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User'

  async function handleLogout() {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-[#050814] text-slate-100 flex">
      {/* Desktop Sidebar (hidden on mobile) */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar (Slide out) */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-lg bg-cyan-500 text-slate-950 font-bold glow-effect">
                <BriefcaseBusiness size={22} />
              </span>
              <div>
                <span className="block text-lg font-bold text-white tracking-wide">CareerDevAI</span>
              </div>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="space-y-1.5" onClick={() => setIsMobileMenuOpen(false)}>
            <Link to="/dashboard" className="flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition">
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>
            <Link to="/career-analysis" className="flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition">
              <ClipboardList size={18} />
              <span>Career Analysis</span>
            </Link>
            <Link to="/learning" className="flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition">
              <BookOpen size={18} />
              <span>Learning</span>
            </Link>
            <Link to="/history" className="flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition">
              <History size={18} />
              <span>History</span>
            </Link>
            <Link to="/profile" className="flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition">
              <UserIcon size={18} />
              <span>Profile</span>
            </Link>
            <Link to="/profile#settings" className="flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition">
              <Settings size={18} />
              <span>Settings</span>
            </Link>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 border-b border-slate-800/80 bg-slate-950/40 backdrop-blur sticky top-0 z-30 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            {/* Hamburger button on mobile */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <Menu size={22} />
            </button>
            
            <div className="hidden sm:block">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Career Platform</span>
              <h1 className="text-sm font-bold text-slate-300">Plan, learn, and track your next move</h1>
            </div>
          </div>

          {/* User Display */}
          <div className="flex items-center gap-4">
            <Link to="/profile" className="flex items-center gap-3 hover:opacity-85 transition">
              <div className="hidden md:block text-right">
                <span className="block text-sm font-semibold text-white leading-tight">{displayName}</span>
                <span className="block text-xs text-slate-500">{profile?.target_career || 'Career Seeker'}</span>
              </div>
              
              {/* User Avatar */}
              <div className="size-9 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center text-cyan-400 font-bold overflow-hidden shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                {profile?.full_name ? (
                  <span>{profile.full_name.charAt(0).toUpperCase()}</span>
                ) : (
                  <UserIcon size={16} />
                )}
              </div>
            </Link>
          </div>
        </header>

        {/* Dynamic Page Router Outlet */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
