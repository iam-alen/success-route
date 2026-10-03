import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Brain, RefreshCw, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { recommend } from '../data/careers.js'
import { apiPost } from '../lib/api.js'
import { Chip, PageHeader, ProgressBar } from '../components/ui.jsx'

export default function CareerAdvice() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)

  const handleGenerate = async () => {
    setLoading(true)
    const remote = await apiPost('/recommendations', JSON.stringify({ skills: user?.skills || [] }))
    setResults(remote?.results || recommend(user?.skills || []))
    setLoading(false)
  }

  return (
    <div>
      <PageHeader title="AI Career Recommendations" subtitle="Get personalized career suggestions based on your profile" />

      {!results && (
        <div className="card fade-up flex flex-col items-center gap-4 px-6 py-14 text-center">
          <span className="grid size-16 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Brain size={30} />
          </span>
          <div>
            <h2 className="font-semibold text-slate-900">Ready to discover your ideal career?</h2>
            <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
              Our AI will analyze your skills, interests and preferences to recommend the best career paths for you.
            </p>
          </div>
          <button onClick={handleGenerate} disabled={loading} className="btn-primary">
            {loading ? <><RefreshCw size={16} className="animate-spin" /> Analyzing...</> : <><Sparkles size={16} /> Get AI Recommendations</>}
          </button>
        </div>
      )}

      {results && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">{results.length} roles matched to your profile</p>
            <button onClick={handleGenerate} className="btn-secondary text-xs">
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          {results.map(({ career, score, have, missing }) => (
            <div key={career.id} className="card fade-up p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600">{career.category}</span>
                  <h3 className="mt-0.5 text-lg font-bold text-slate-900">{career.title}</h3>
                  <p className="mt-1 max-w-xl text-sm text-slate-500">{career.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-indigo-600">{score}%</span>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Match Score</p>
                </div>
              </div>

              <ProgressBar value={score} className="mt-4" />

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-1.5 text-xs font-semibold text-slate-500">Matching skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {have.length ? have.map((s) => <Chip key={s} tone="green">{s}</Chip>) : <span className="text-xs text-slate-400">None yet</span>}
                  </div>
                </div>
                <div>
                  <p className="mb-1.5 text-xs font-semibold text-slate-500">Skill gaps</p>
                  <div className="flex flex-wrap gap-1.5">
                    {missing.length ? missing.map((s) => <Chip key={s} tone="amber">+ {s}</Chip>) : <span className="text-xs text-slate-400">None - great fit!</span>}
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/roadmap', { state: { role: career.title } })}
                className="btn-secondary mt-5 w-full sm:w-auto"
              >
                Build roadmap for {career.title} <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
