import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, LogOut, Plus, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { Chip, PageHeader } from '../components/ui.jsx'

const EDUCATION_LEVELS = ['High School', "Bachelor's Degree", "Master's Degree", 'PhD', 'Self-Taught']

export default function Profile() {
  const { user, updateProfile, signOut } = useAuth()
  const navigate = useNavigate()
  const [education, setEducation] = useState(user?.education || '')
  const [preference, setPreference] = useState(user?.preference || '')
  const [interests, setInterests] = useState(user?.interests || '')
  const [skills, setSkills] = useState(user?.skills || [])
  const [skillInput, setSkillInput] = useState('')
  const [saved, setSaved] = useState(false)

  const addSkill = (e) => {
    e.preventDefault()
    const value = skillInput.trim()
    if (!value || skills.includes(value)) return
    setSkills([...skills, value])
    setSkillInput('')
  }
  const removeSkill = (skill) => setSkills(skills.filter((s) => s !== skill))

  const handleSave = (e) => {
    e.preventDefault()
    updateProfile({ education, preference, interests, skills })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleSignOut = () => {
    signOut()
    navigate('/')
  }

  return (
    <div>
      <PageHeader title="Your Profile" subtitle="Keep this up to date for sharper career recommendations" />

      <form onSubmit={handleSave} className="card fade-up space-y-5 p-5 sm:p-6">
        <div>
          <label className="label">Name</label>
          <input className="input bg-slate-50" value={user?.name || ''} disabled />
          {user?.guest && <p className="mt-1 text-xs text-slate-400">You're browsing as a guest - sign up to save your profile permanently.</p>}
        </div>

        <div>
          <label className="label" htmlFor="education">Education</label>
          <select id="education" className="input" value={education} onChange={(e) => setEducation(e.target.value)}>
            <option value="">Select level</option>
            {EDUCATION_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="preference">Career preference</label>
          <input id="preference" className="input" placeholder="e.g. Technology, Design, Healthcare" value={preference} onChange={(e) => setPreference(e.target.value)} />
        </div>

        <div>
          <label className="label" htmlFor="interests">Interests</label>
          <textarea id="interests" className="input min-h-[90px] resize-y" placeholder="What kind of work energizes you?" value={interests} onChange={(e) => setInterests(e.target.value)} />
        </div>

        <div>
          <label className="label">Skills</label>
          <div className="mb-2 flex flex-wrap gap-1.5">
            {skills.map((s) => (
              <Chip key={s} tone="indigo" className="gap-1">
                {s}
                <button type="button" onClick={() => removeSkill(s)} className="ml-0.5 rounded-full hover:bg-indigo-100">
                  <X size={12} />
                </button>
              </Chip>
            ))}
            {skills.length === 0 && <span className="text-sm text-slate-400">No skills added yet</span>}
          </div>
          <div className="flex gap-2">
            <input
              className="input" placeholder="Add a skill and press Enter"
              value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') addSkill(e) }}
            />
            <button type="button" onClick={addSkill} className="btn-secondary shrink-0"><Plus size={16} /></button>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <button type="submit" className="btn-primary">
            {saved ? <><Check size={16} /> Saved</> : 'Save Profile'}
          </button>
          <button type="button" onClick={handleSignOut} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-rose-600">
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </form>
    </div>
  )
}
