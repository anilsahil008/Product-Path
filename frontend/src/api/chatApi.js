const BASE_URL = 'http://localhost:8000'

/**
 * Sends a message and yields parsed SSE events from the stream.
 *
 * Each yielded value is one of:
 *   { type: 'chunk', content: string }
 *   { type: 'done' }
 *   { type: 'error', content: string }
 *
 * We use fetch + ReadableStream instead of EventSource because
 * EventSource only supports GET requests.
 */
export async function* streamMessage(sessionId, message) {
  const response = await fetch(`${BASE_URL}/api/chat/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, message }),
  })

  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() // keep any incomplete trailing line

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          yield JSON.parse(line.slice(6))
        } catch {
          // malformed event — skip
        }
      }
    }
  }
}

export async function fetchHistory(sessionId) {
  const response = await fetch(`${BASE_URL}/api/chat/history/${sessionId}`)
  if (!response.ok) throw new Error(`Server error: ${response.status}`)
  return response.json()
}

export async function deleteSession(sessionId) {
  const response = await fetch(`${BASE_URL}/api/chat/session/${sessionId}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error(`Server error: ${response.status}`)
  return response.json()
}
