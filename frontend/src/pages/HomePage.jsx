import { Link } from 'react-router-dom'
import { ArrowRight, Compass, FileText, Map, User } from 'lucide-react'
import { profileCompletion, useAuth } from '../context/AuthContext.jsx'
import { Chip, ProgressBar } from '../components/ui.jsx'

const actions = [
  { to: '/career-advice', icon: Compass, title: 'Career Advice', desc: 'Get AI-powered career suggestions' },
  { to: '/roadmap', icon: Map, title: 'Career Roadmap', desc: 'Plan your path to success' },
  { to: '/resume', icon: FileText, title: 'Resume Analyzer', desc: 'Optimize for ATS systems' },
  { to: '/profile', icon: User, title: 'Profile', desc: 'Update your information' },
]

export default function HomePage() {
  const { user } = useAuth()
  const completion = profileCompletion(user)
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-8">
      <header className="fade-up">
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          {greeting}, {(user?.name || 'Guest').toUpperCase()}
        </h1>
        <p className="mt-1 text-slate-500">What would you like to work on today?</p>
      </header>

      <section className="card fade-up p-5 sm:p-6">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-slate-700">Complete your profile</span>
          <span className="font-semibold text-slate-900">{completion}%</span>
        </div>
        <ProgressBar value={completion} className="mt-2" />
        {completion < 100 && (
          <Link to="/profile" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-500">
            Complete now <ArrowRight size={14} />
          </Link>
        )}
      </section>

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {actions.map(({ to, icon: Icon, title, desc }) => (
          <Link key={to} to={to} className="card fade-up group flex flex-col gap-3 p-5 transition hover:-translate-y-0.5 hover:shadow-md">
            <span className="grid size-10 place-items-center rounded-lg bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
              <Icon size={20} />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
              <p className="mt-0.5 text-xs text-slate-500">{desc}</p>
            </div>
          </Link>
        ))}
      </section>

      <section className="card fade-up p-5 sm:p-6">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
          <User size={16} className="text-indigo-500" /> Profile Summary
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Education</p>
            <p className="mt-1 text-sm font-medium text-slate-800">{user?.education || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Career Preference</p>
            <p className="mt-1">
              {user?.preference ? <Chip tone="indigo">{user.preference}</Chip> : <span className="text-sm text-slate-400">Not specified</span>}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Skills</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {user?.skills?.length ? user.skills.map((s) => <Chip key={s}>{s}</Chip>) : <span className="text-sm text-slate-400">None added yet</span>}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Interests</p>
            <p className="mt-1 text-sm font-medium text-slate-800">{user?.interests || 'Not specified'}</p>
          </div>
        </div>
        <Link to="/profile" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-500">
          Edit Profile <ArrowRight size={14} />
        </Link>
      </section>
    </div>
  )
}
