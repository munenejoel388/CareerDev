import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  ClipboardList,
  BookOpen,
  History as HistoryIcon,
  User,
  Settings,
  LogOut,
  BriefcaseBusiness
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const menuItems = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Career Analysis', to: '/career-analysis', icon: ClipboardList },
  { label: 'Learning', to: '/learning', icon: BookOpen },
  { label: 'History', to: '/history', icon: HistoryIcon },
  { label: 'Profile', to: '/profile', icon: User },
  { label: 'Settings', to: '/profile#settings', icon: Settings },
]

export default function Sidebar() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      await signOut()
      navigate('/')
    } catch (err) {
      console.error('Failed to sign out', err)
    }
  }

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0 shrink-0">
      <div className="flex flex-col flex-1 px-4 py-6">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3 px-2 mb-8">
          <span className="grid size-10 place-items-center rounded-lg bg-cyan-500 text-slate-950 font-bold glow-effect">
            <BriefcaseBusiness size={22} />
          </span>
          <div>
            <span className="block text-lg font-bold text-white tracking-wide">CareerDevAI</span>
            <span className="block text-xs font-medium text-cyan-400">AI career planner</span>
          </div>
        </NavLink>

        {/* Menu Navigation */}
        <nav className="space-y-1.5 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    'flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 group',
                    isActive
                      ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
                  ].join(' ')
                }
              >
                <Icon size={18} className="shrink-0 transition-transform group-hover:scale-105" />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-200"
        >
          <LogOut size={18} className="shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}