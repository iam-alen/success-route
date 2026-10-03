import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

export default function SignUp() {
  const { signUp, continueAsGuest } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError('Please fill in every field.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    const result = signUp(form)
    if (result.error) setError(result.error)
    else navigate('/home')
  }

  const handleGuest = () => {
    continueAsGuest()
    navigate('/home')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="card fade-up w-full max-w-sm p-7">
        <div className="mb-5 flex flex-col items-center text-center">
          <span className="grid size-11 place-items-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/30">
            <Compass size={22} />
          </span>
          <h1 className="mt-3 text-lg font-bold text-slate-900">Create an account</h1>
          <p className="text-sm text-slate-500">Start your career journey today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="label" htmlFor="name">Full Name</label>
            <input id="name" className="input" placeholder="John Doe" value={form.name} onChange={update('name')} autoComplete="name" />
          </div>
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" type="email" className="input" placeholder="you@example.com" value={form.email} onChange={update('email')} autoComplete="email" />
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input id="password" type="password" className="input" placeholder="••••••••" value={form.password} onChange={update('password')} autoComplete="new-password" />
          </div>
          <div>
            <label className="label" htmlFor="confirm">Confirm Password</label>
            <input id="confirm" type="password" className="input" placeholder="••••••••" value={form.confirm} onChange={update('confirm')} autoComplete="new-password" />
          </div>

          {error && <p className="text-sm font-medium text-rose-600">{error}</p>}

          <button type="submit" className="btn-primary w-full">Create Account</button>
          <button type="button" onClick={handleGuest} className="btn-secondary w-full">Continue as Guest</button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          Already have an account? <Link to="/signin" className="font-semibold text-indigo-600 hover:text-indigo-500">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
