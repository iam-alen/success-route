import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

export default function SignIn() {
  const { signIn, continueAsGuest } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const redirectTo = location.state?.from?.pathname || '/home'

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (!form.email.trim() || !form.password) {
      setError('Please enter your email and password.')
      return
    }
    const result = signIn(form)
    if (result.error) setError(result.error)
    else navigate(redirectTo, { replace: true })
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
          <h1 className="mt-3 text-lg font-bold text-slate-900">Welcome back</h1>
          <p className="text-sm text-slate-500">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" type="email" className="input" placeholder="you@example.com" value={form.email} onChange={update('email')} autoComplete="email" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label className="label" htmlFor="password">Password</label>
              <span className="mb-1.5 text-xs font-medium text-indigo-600">Forgot password?</span>
            </div>
            <input id="password" type="password" className="input" placeholder="••••••••" value={form.password} onChange={update('password')} autoComplete="current-password" />
          </div>

          {error && <p className="text-sm font-medium text-rose-600">{error}</p>}

          <button type="submit" className="btn-primary w-full">Sign In</button>
          <button type="button" onClick={handleGuest} className="btn-secondary w-full">Continue as Guest</button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          Don&apos;t have an account? <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
