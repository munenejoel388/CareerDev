import {
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  ClipboardList,
  History,
  LayoutDashboard,
  LogIn,
  LogOut,
  Sparkles,
  User,
  UserPlus,
} from 'lucide-react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Career Analysis', to: '/career-analysis', icon: ClipboardList },
  { label: 'Learning', to: '/learning', icon: BookOpen },
  { label: 'History', to: '/history', icon: History },
  { label: 'Profile', to: '/profile', icon: User },
]

function AppLayout() {
  const { isConfigured, signOut, user } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row">
        <aside className="border-b border-slate-200 bg-white px-5 py-5 lg:w-72 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between gap-4 lg:block">
            <Link to="/" className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-lg bg-blue-600 text-white">
                <BriefcaseBusiness size={22} aria-hidden="true" />
              </span>
              <span>
                <span className="block text-lg font-bold text-slate-950">CareerDev</span>
                <span className="block text-xs font-medium text-slate-500">AI career planner</span>
              </span>
            </Link>

            <div className="hidden items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 sm:flex lg:mt-6 lg:w-fit">
              <Sparkles size={14} aria-hidden="true" />
              Sprint 3
            </div>
          </div>

          <nav className="mt-6 flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
            {navItems.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      'flex min-w-fit items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition',
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
                    ].join(' ')
                  }
                >
                  <Icon size={18} aria-hidden="true" />
                  {item.label}
                </NavLink>
              )
            })}
          </nav>

          <div className="mt-6 hidden rounded-lg border border-slate-200 bg-slate-50 p-4 lg:block">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
              <BarChart3 size={18} aria-hidden="true" />
              Career readiness
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Readiness scoring will activate after Supabase and AI analysis are connected.
            </p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-slate-200 bg-white px-6 py-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Career Development Platform</p>
                <p className="text-xl font-bold text-slate-950">Plan, learn, and track your next move</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {!isConfigured ? (
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
                    Supabase not connected
                  </span>
                ) : null}

                {user ? (
                  <>
                    <span className="max-w-52 truncate text-sm font-medium text-slate-600">
                      {user.email}
                    </span>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <LogOut size={16} aria-hidden="true" />
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <LogIn size={16} aria-hidden="true" />
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      <UserPlus size={16} aria-hidden="true" />
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </header>

          <main className="flex-1 px-6 py-8">
            <div className="mx-auto max-w-5xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default AppLayout
