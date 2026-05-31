const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function detectPlatform(url: string) {
  const res = await fetch(`${API_BASE}/api/v1/detect-platform`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  })
  if (!res.ok) throw new Error((await res.json()).detail || 'Detection failed')
  return res.json()
}

export async function submitPostAnalysis(url: string, timeframe = '30d') {
  const res = await fetch(`${API_BASE}/api/v1/post-analysis`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, timeframe }),
  })
  if (!res.ok) throw new Error((await res.json()).detail || 'Analysis submission failed')
  return res.json()
}

export async function submitProfileAnalysis(url: string) {
  const res = await fetch(`${API_BASE}/api/v1/profile-analysis`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  })
  if (!res.ok) throw new Error((await res.json()).detail || 'Analysis submission failed')
  return res.json()
}

export async function submitCompare(urls: string[], timeframe = '30d') {
  const res = await fetch(`${API_BASE}/api/v1/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ urls, timeframe }),
  })
  if (!res.ok) throw new Error((await res.json()).detail || 'Compare failed')
  return res.json()
}

export async function getJobStatus(jobId: string) {
  const res = await fetch(`${API_BASE}/api/v1/status/${jobId}`)
  if (!res.ok) throw new Error('Status check failed')
  return res.json()
}

export async function getTrending(platform?: string) {
  const params = platform ? `?platform=${platform}` : ''
  const res = await fetch(`${API_BASE}/api/v1/trending${params}`)
  if (!res.ok) throw new Error('Trending fetch failed')
  return res.json()
}

export function getExportUrl(jobId: string, format: 'csv' | 'pdf' | 'json') {
  return `${API_BASE}/api/v1/export/${jobId}?format=${format}`
}
