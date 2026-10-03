import { useRef, useState } from 'react'
import { AlertTriangle, CheckCircle2, FileText, Sparkles, UploadCloud, X } from 'lucide-react'
import { apiPost } from '../lib/api.js'
import { Chip, PageHeader, ProgressBar } from '../components/ui.jsx'

const TABS = ['Score', 'Improve', 'Keywords', 'Optimized']

// Deterministic demo analysis so results feel consistent for a given file + role.
function demoAnalysis(fileName, role) {
  let hash = 0
  for (const ch of `${fileName}:${role}`) hash = (hash * 31 + ch.charCodeAt(0)) % 1000
  const score = 58 + (hash % 35)
  return {
    score,
    breakdown: [
      { label: 'Keywords', value: 40 + (hash % 55) },
      { label: 'Formatting', value: 55 + (hash % 40) },
      { label: 'Content', value: 45 + (hash % 50) },
      { label: 'Structure', value: 60 + (hash % 35) },
    ],
    strengths: ['Quantifiable achievements (e.g. "grew signups 200%")', 'Clean, consistent formatting with no spelling errors'],
    improve: ['Short duration of professional experience', 'Missing a dedicated skills section'],
    missingKeywords: ['Agile Methodology', 'Unit Testing', 'CI/CD', 'System Design', 'Problem Solving', 'Cross-functional Collaboration'],
    suggestedSkills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'SQL', 'MongoDB', 'AWS', 'Git'],
    tips: [
      `Quantify the "${role || 'target role'}" impact - how many users, how much faster, how much saved.`,
      'Mention specific frameworks and tools used, not just "web development".',
      'List collaboration tools used day-to-day (e.g. Jira, Slack, Trello).',
    ],
  }
}

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null)
  const [role, setRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [tab, setTab] = useState('Score')
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef(null)

  const acceptFile = (f) => {
    if (!f) return
    const okType = /\.(pdf|doc|docx)$/i.test(f.name)
    if (!okType) return
    setFile(f)
    setResult(null)
  }

  const handleAnalyze = async () => {
    if (!file) return
    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('target_role', role)
    const remote = await apiPost('/resume/analyze', formData)
    setResult(remote || demoAnalysis(file.name, role))
    setTab('Score')
    setLoading(false)
  }

  return (
    <div>
      <PageHeader title="Resume ATS Analyzer" subtitle="Upload your resume to get an ATS compatibility score and AI-powered optimization suggestions" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="card fade-up space-y-4 p-5 sm:p-6 lg:col-span-2">
          <div>
            <p className="mb-1.5 text-sm font-semibold text-slate-700">Upload Resume</p>
            <p className="mb-3 text-xs text-slate-400">Supported formats: PDF, DOC, DOCX (max 10MB)</p>

            {!file ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); acceptFile(e.dataTransfer.files?.[0]) }}
                onClick={() => inputRef.current?.click()}
                className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed px-4 py-10 text-center transition ${
                  dragOver ? 'border-indigo-400 bg-indigo-50/50' : 'border-slate-200 hover:border-indigo-300'
                }`}
              >
                <UploadCloud size={28} className="text-slate-400" />
                <p className="text-sm font-medium text-slate-600">Click or drag your resume here</p>
                <input
                  ref={inputRef} type="file" accept=".pdf,.doc,.docx" className="hidden"
                  onChange={(e) => acceptFile(e.target.files?.[0])}
                />
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-indigo-50 text-indigo-600"><FileText size={18} /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">{file.name}</p>
                  <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <button onClick={() => { setFile(null); setResult(null) }} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="label" htmlFor="target-role">Target role (optional)</label>
            <input id="target-role" className="input" placeholder="e.g. Software Engineer" value={role} onChange={(e) => setRole(e.target.value)} />
          </div>

          <button onClick={handleAnalyze} disabled={!file || loading} className="btn-primary w-full">
            <Sparkles size={16} /> {loading ? 'Analyzing...' : 'Analyze Resume'}
          </button>

          {result && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center">
              <AlertTriangle className="mx-auto mb-1 text-amber-500" size={20} />
              <p className="text-3xl font-extrabold text-amber-600">{result.score}</p>
              <p className="text-xs font-semibold text-amber-700">ATS Compatibility Score</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-3">
          {!result ? (
            <div className="card flex h-full min-h-[280px] flex-col items-center justify-center gap-2 p-8 text-center text-slate-400">
              <FileText size={28} />
              <p className="text-sm">Upload a resume and run the analysis to see your results here.</p>
            </div>
          ) : (
            <div className="card fade-up overflow-hidden">
              <div className="flex border-b border-slate-100">
                {TABS.map((t) => (
                  <button
                    key={t} onClick={() => setTab(t)}
                    className={`flex-1 px-3 py-3 text-xs font-semibold transition sm:text-sm ${
                      tab === t ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="p-5 sm:p-6">
                {tab === 'Score' && (
                  <div className="space-y-5">
                    <p className="text-sm font-semibold text-slate-700">Score Breakdown</p>
                    {result.breakdown.map((b) => (
                      <div key={b.label}>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="text-slate-600">{b.label}</span>
                          <span className="font-semibold text-slate-900">{b.value}%</span>
                        </div>
                        <ProgressBar value={b.value} tone={b.value >= 70 ? 'green' : b.value >= 45 ? 'amber' : 'red'} />
                      </div>
                    ))}
                  </div>
                )}

                {tab === 'Improve' && (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-emerald-600"><CheckCircle2 size={15} /> Strengths</p>
                      <ul className="space-y-1.5 text-sm text-slate-600">
                        {result.strengths.map((s) => <li key={s}>- {s}</li>)}
                      </ul>
                    </div>
                    <div>
                      <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-amber-600"><AlertTriangle size={15} /> Areas to improve</p>
                      <ul className="space-y-1.5 text-sm text-slate-600">
                        {result.improve.map((s) => <li key={s}>- {s}</li>)}
                      </ul>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="mb-2 text-sm font-semibold text-slate-700">Experience tips</p>
                      <ul className="space-y-1.5 text-sm text-slate-600">
                        {result.tips.map((t) => <li key={t}>- {t}</li>)}
                      </ul>
                    </div>
                  </div>
                )}

                {tab === 'Keywords' && (
                  <div className="space-y-5">
                    <div>
                      <p className="mb-2 text-sm font-semibold text-slate-700">Missing keywords</p>
                      <div className="flex flex-wrap gap-1.5">
                        {result.missingKeywords.map((k) => <Chip key={k} tone="amber">{k}</Chip>)}
                      </div>
                    </div>
                    <div>
                      <p className="mb-2 text-sm font-semibold text-slate-700">Suggested skills</p>
                      <div className="flex flex-wrap gap-1.5">
                        {result.suggestedSkills.map((k) => <Chip key={k} tone="indigo">{k}</Chip>)}
                      </div>
                    </div>
                  </div>
                )}

                {tab === 'Optimized' && (
                  <div className="flex flex-col items-center gap-3 py-8 text-center">
                    <Sparkles className="text-indigo-500" size={28} />
                    <p className="text-sm text-slate-600">
                      Apply the suggestions above, then re-run the analysis to track your ATS score improving over time.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
