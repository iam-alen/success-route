import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Compass, FileCheck2, GitBranch, Sparkles } from 'lucide-react'
import { Logo } from '../components/ui.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const features = [
  {
    icon: GitBranch,
    title: 'AI Career Advice',
    desc: 'Personalized career suggestions based on your profile, skills and interests.',
  },
  {
    icon: Compass,
    title: 'Career Roadmaps',
    desc: 'Enter your dream job and get a clear, step-by-step path with courses & certifications.',
  },
  {
    icon: FileCheck2,
    title: 'Resume Analysis',
    desc: 'Optimize your resume with AI-powered ATS scoring and keyword suggestions.',
  },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const { continueAsGuest } = useAuth()

  const handleGuest = () => {
    continueAsGuest()
    navigate('/home')
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6">
        <Logo />
        <Link to="/signin" className="btn-secondary">
          Sign In
        </Link>
      </header>

      <section className="mx-auto max-w-3xl px-4 pb-16 pt-10 text-center sm:px-6 sm:pt-16">
        <div className="fade-up mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
          <Sparkles size={14} /> Reverse Methodology Career Guidance
        </div>
        <h1 className="fade-up text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Navigate your career with <span className="text-indigo-600">AI guidance</span>
        </h1>
        <p className="fade-up mt-4 text-base text-slate-500 sm:text-lg">
          Get personalized career recommendations, build actionable roadmaps, and optimize your
          resume - all powered by AI.
        </p>
        <div className="fade-up mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/signup" className="btn-primary w-full sm:w-auto">
            Start Free <ArrowRight size={16} />
          </Link>
          <button onClick={handleGuest} className="btn-secondary w-full sm:w-auto">
            Continue as Guest
          </button>
        </div>
      </section>

      <section className="border-t border-slate-100 bg-slate-50/60 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-slate-900">
            Everything you need for career success
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card fade-up p-6 text-center">
                <div className="mx-auto mb-4 grid size-11 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Icon size={22} />
                </div>
                <h3 className="font-semibold text-slate-900">{title}</h3>
                <p className="mt-1.5 text-sm text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
