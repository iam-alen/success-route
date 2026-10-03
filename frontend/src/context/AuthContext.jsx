import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)
const USER_KEY = 'sr_user'
const ACCOUNTS_KEY = 'sr_accounts'

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}
const write = (key, value) => {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* storage unavailable */ }
}
const remove = (key) => {
  try { localStorage.removeItem(key) } catch { /* storage unavailable */ }
}

const blankProfile = { education: '', preference: '', interests: '', skills: [] }

export function profileCompletion(user) {
  if (!user) return 0
  const checks = [user.name, user.education, user.preference, user.interests, user.skills?.length > 0]
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => read(USER_KEY, null))

  const persist = useCallback((next) => {
    setUser(next)
    if (next) write(USER_KEY, next)
    else remove(USER_KEY)
  }, [])

  const signUp = useCallback(({ name, email, password }) => {
    const accounts = read(ACCOUNTS_KEY, {})
    const key = email.trim().toLowerCase()
    if (accounts[key]) return { error: 'An account with this email already exists.' }
    const profile = { name: name.trim(), email: key, guest: false, ...blankProfile }
    accounts[key] = { password, profile }
    write(ACCOUNTS_KEY, accounts)
    persist(profile)
    return { ok: true }
  }, [persist])

  const signIn = useCallback(({ email, password }) => {
    const accounts = read(ACCOUNTS_KEY, {})
    const account = accounts[email.trim().toLowerCase()]
    if (!account || account.password !== password) return { error: 'Invalid email or password.' }
    persist(account.profile)
    return { ok: true }
  }, [persist])

  const continueAsGuest = useCallback(() => {
    persist({
      name: 'Guest', email: '', guest: true,
      education: "Bachelor's Degree", preference: 'Technology', interests: '',
      skills: ['JavaScript', 'React', 'Data Analysis'],
    })
  }, [persist])

  const updateProfile = useCallback((patch) => {
    if (!user) return
    const next = { ...user, ...patch }
    persist(next)
    if (!user.guest) {
      const accounts = read(ACCOUNTS_KEY, {})
      if (accounts[user.email]) {
        accounts[user.email].profile = next
        write(ACCOUNTS_KEY, accounts)
      }
    }
  }, [user, persist])

  const signOut = useCallback(() => persist(null), [persist])

  const value = useMemo(
    () => ({ user, signUp, signIn, continueAsGuest, updateProfile, signOut }),
    [user, signUp, signIn, continueAsGuest, updateProfile, signOut],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
