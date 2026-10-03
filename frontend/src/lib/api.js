// Thin wrapper around fetch. Returns null when the backend is unreachable,
// so every page can fall back to built-in demo data and the site still works.
const BASE = import.meta.env.VITE_API_URL || '/api'

export async function apiPost(path, body, { timeout = 5000 } = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: 'POST',
      body,
      signal: controller.signal,
      headers: body instanceof FormData ? undefined : { 'Content-Type': 'application/json' },
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}
