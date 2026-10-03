import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Award, BookOpen, ChevronDown, Database, Flag, MapPin, Sparkles } from 'lucide-react'
import { CAREERS, buildGenericCareer, findCareer } from '../data/careers.js'
import { apiPost } from '../lib/api.js'
import { Chip, PageHeader } from '../components/ui.jsx'

function StageCard({ stage, index, isLast }) {
  const [open, setOpen] = useState(index === 0)
  return (
    <div className="relative pl-10">
      <span className="absolute left-0 top-1 grid size-7 place-items-center rounded-full bg-indigo-600 text-xs font-bold text-white shadow-sm">
        {index + 1}
      </span>
      {!isLast && <span className="absolute left-[13px] top-8 h-[calc(100%+0.5rem)] w-px bg-slate-200" />}

      <div className="card mb-6 overflow-hidden">
        <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
          <div>
            <h3 className="font-semibold text-slate-900">{stage.title}</h3>
            <p className="text-xs text-slate-500">{stage.duration}</p>
          </div>
          <ChevronDown size={18} className={`shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div className="space-y-4 border-t border-slate-100 px-5 pb-5 pt-4">
            <p className="text-sm text-slate-600">{stage.description}</p>

            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">Skills you&apos;ll gain</p>
              <div className="flex flex-wrap gap-1.5">
                {stage.skills.map((s) => <Chip key={s} tone="indigo">{s}</Chip>)}
              </div>
            </div>

            {stage.courses.length > 0 && (
              <div>
                <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <BookOpen size={13} /> Courses
                </p>
                <ul className="space-y-1.5">
                  {stage.courses.map((c) => (
                    <li key={c.name} className="text-sm text-slate-700">
                      <span className="font-medium">{c.name}</span>
                      <span className="text-slate-400"> - {c.provider}, {c.meta}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {stage.certs.length > 0 && (
              <div>
                <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <Award size={13} /> Certifications
                </p>
                <ul className="space-y-1.5">
                  {stage.certs.map((c) => (
                    <li key={c.name} className="text-sm text-slate-700">
                      <span className="font-medium">{c.name}</span>
                      <span className="text-slate-400"> - {c.issuer}, {c.meta}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <Flag size={13} /> Milestones
              </p>
              <ul className="space-y-1 text-sm text-slate-700">
                {stage.milestones.map((m) => <li key={m}>- {m}</li>)}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function RoadmapGenerator() {
  const location = useLocation()
  const resultsRef = useRef(null)
  const [role, setRole] = useState(location.state?.role || '')
  const [career, setCareer] = useState(null)
  const [loading, setLoading] = useState(false)
  const [source, setSource] = useState(null)

  const generate = async (targetRole) => {
    const value = (targetRole ?? role).trim()
    if (!value) return
    setLoading(true)
    const remote = await apiPost('/roadmap', JSON.stringify({ role: value }))
    if (remote?.career) {
      setCareer(remote.career)
      setSource('Live data source')
    } else {
      setCareer(findCareer(value) || buildGenericCareer(value))
      setSource('Demo dataset (backend offline)')
    }
    setLoading(false)
  }

  useEffect(() => {
    if (location.state?.role) generate(location.state.role)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (career) resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [career])

  return (
    <div>
      <PageHeader title="Career Roadmap Generator" subtitle="Enter your dream job and get a clear, step-by-step path with courses & certifications" />

      <div className="card fade-up p-5 sm:p-6">
        <div className="mb-3 flex items-center gap-1.5 text-xs font-medium text-slate-400">
          <Database size={13} /> {CAREERS.length} sample roles in database - any other role generates a custom path
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); generate() }}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <input
            className="input"
            placeholder="e.g. Machine Learning Engineer"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            list="career-suggestions"
          />
          <datalist id="career-suggestions">
            {CAREERS.map((c) => <option key={c.id} value={c.title} />)}
          </datalist>
          <button type="submit" disabled={loading || !role.trim()} className="btn-primary shrink-0">
            <Sparkles size={16} /> {loading ? 'Generating...' : 'Generate'}
          </button>
        </form>
      </div>

      {career && (
        <div ref={resultsRef} className="mt-8 space-y-8">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Chip tone="indigo">Reverse roadmap generated</Chip>
            {source && <Chip>{source}</Chip>}
          </div>

          <div className="card fade-up p-6 text-center">
            <span className="mx-auto mb-3 grid size-12 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
              <MapPin size={22} />
            </span>
            <h2 className="text-xl font-bold text-slate-900">{career.title}</h2>
            <p className="mx-auto mt-1.5 max-w-lg text-sm text-slate-500">{career.description}</p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <Chip tone="indigo">{career.category}</Chip>
              <Chip tone="green">{career.demand}</Chip>
              <Chip>{career.duration}</Chip>
            </div>

            <div className="mx-auto mt-6 grid max-w-lg grid-cols-3 gap-3 border-t border-slate-100 pt-6">
              {[['Entry Level', career.salary.entry], ['Mid Level', career.salary.mid], ['Senior Level', career.salary.senior]].map(([label, value]) => (
                <div key={label}>
                  <p className="text-sm font-bold text-slate-900">{value}</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="fade-up mb-5 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Your step-by-step path
            </h3>
            {career.stages.map((stage, i) => (
              <StageCard key={stage.title} stage={stage} index={i} isLast={i === career.stages.length - 1} />
            ))}
            <div className="relative pl-10">
              <span className="absolute left-0 top-1 grid size-7 place-items-center rounded-full bg-emerald-500 text-white shadow-sm">
                <Flag size={14} />
              </span>
              <p className="pt-1 text-sm font-semibold text-emerald-600">Goal reached: {career.title} 🎉</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
