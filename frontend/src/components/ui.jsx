import { Compass } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Logo({ to = '/', className = '' }) {
  return (
    <Link to={to} className={`inline-flex items-center gap-2 font-semibold text-slate-900 ${className}`}>
      <span className="grid size-8 place-items-center rounded-lg bg-indigo-600 text-white shadow-sm shadow-indigo-600/30">
        <Compass size={18} />
      </span>
      Success Route
    </Link>
  )
}

const barTones = {
  indigo: 'bg-indigo-600',
  green: 'bg-emerald-500',
  amber: 'bg-amber-500',
  red: 'bg-rose-500',
}

export function ProgressBar({ value = 0, max = 100, tone = 'indigo', className = '' }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div
      className={`h-2 w-full overflow-hidden rounded-full bg-slate-100 ${className}`}
      role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}
    >
      <div className={`h-full rounded-full transition-all duration-700 ease-out ${barTones[tone]}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

const chipTones = {
  slate: 'bg-slate-100 text-slate-700',
  indigo: 'bg-indigo-50 text-indigo-700',
  green: 'bg-emerald-50 text-emerald-700',
  amber: 'bg-amber-50 text-amber-700',
}

export function Chip({ children, tone = 'slate', className = '' }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${chipTones[tone]} ${className}`}>
      {children}
    </span>
  )
}

export function PageHeader({ title, subtitle, center = false }) {
  return (
    <header className={`mb-8 fade-up ${center ? 'text-center' : ''}`}>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
      {subtitle && <p className="mt-1.5 text-slate-500">{subtitle}</p>}
    </header>
  )
}
