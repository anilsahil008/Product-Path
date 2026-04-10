const BASE_URL = 'https://product-path.onrender.com'

// ── Types ────────────────────────────────────────────────────────────────────

export type Role = 'user' | 'assistant'

export interface Message {
  id: string
  role: Role
  content: string
  streaming?: boolean
}

type SSEChunk = { type: 'chunk'; content: string }
type SSEDone  = { type: 'done' }
type SSEError = { type: 'error'; content: string }
export type SSEEvent = SSEChunk | SSEDone | SSEError

interface HistoryResponse {
  session_id: string
  messages: Array<{ role: Role; content: string }>
}

export interface UploadedArtifact {
  artifact_id: number
  filename: string
  content_type: string
  size_chars: number
}

export interface AuthUser {
  id: number
  email: string
}

export interface AuthResponse {
  token: string
  user: AuthUser
}

// ── Auth API ─────────────────────────────────────────────────────────────────

export async function signup(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { detail?: string }
    throw new Error(err.detail ?? `Signup failed: ${res.status}`)
  }
  return res.json() as Promise<AuthResponse>
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { detail?: string }
    throw new Error(err.detail ?? 'Invalid email or password')
  }
  return res.json() as Promise<AuthResponse>
}

export async function getMe(token: string): Promise<AuthUser> {
  const res = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Unauthorized')
  return res.json() as Promise<AuthUser>
}

// ── Chat API ──────────────────────────────────────────────────────────────────

export async function* streamMessage(
  sessionId: string,
  message: string,
  mode: string = 'pm',
): AsyncGenerator<SSEEvent> {
  const response = await fetch(`${BASE_URL}/api/chat/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, message, mode }),
  })

  if (!response.ok) {
    throw new Error(`Server error: ${response.status} ${response.statusText}`)
  }

  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          yield JSON.parse(line.slice(6)) as SSEEvent
        } catch {
          // skip malformed events
        }
      }
    }
  }
}

export async function fetchHistory(sessionId: string): Promise<HistoryResponse> {
  const response = await fetch(`${BASE_URL}/api/chat/history/${sessionId}`)
  if (!response.ok) throw new Error(`Failed to load history: ${response.status}`)
  return response.json() as Promise<HistoryResponse>
}

export async function deleteSession(sessionId: string): Promise<void> {
  await fetch(`${BASE_URL}/api/chat/session/${sessionId}`, { method: 'DELETE' })
}

export async function uploadFile(sessionId: string, file: File): Promise<UploadedArtifact> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${BASE_URL}/api/artifacts/upload/${sessionId}`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({})) as { detail?: string }
    throw new Error(err.detail ?? `Upload failed: ${response.status}`)
  }

  return response.json() as Promise<UploadedArtifact>
}
