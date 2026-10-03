import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LogOut, Menu, User, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { Logo } from './ui.jsx'

const links = [
  { to: '/home', label: 'Dashboard' },
  { to: '/career-advice', label: 'Career Advice' },
  { to: '/roadmap', label: 'Roadmap' },
  { to: '/resume', label: 'Resume' },
]

const linkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`

export default function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const initials = (user?.name || 'G').split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()

  const handleSignOut = () => {
    signOut()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Logo to="/home" />

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>{l.label}</NavLink>
          ))}
          <NavLink to="/profile" title="Profile" className="ml-2 grid size-9 place-items-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 transition hover:bg-indigo-200">
            {initials}
          </NavLink>
          <button onClick={handleSignOut} title="Sign out" className="ml-1 rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800">
            <LogOut size={18} />
          </button>
        </nav>

        <button onClick={() => setOpen((v) => !v)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden" aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkClass} onClick={() => setOpen(false)}>{l.label}</NavLink>
            ))}
            <NavLink to="/profile" className={linkClass} onClick={() => setOpen(false)}>
              <span className="inline-flex items-center gap-2"><User size={16} /> Profile</span>
            </NavLink>
            <button onClick={handleSignOut} className="rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-600 hover:bg-slate-100">
              Sign out
            </button>
          </div>
        </nav>
      )}
    </header>
  )
}
