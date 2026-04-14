import { useState, useRef, useCallback, useEffect } from 'react'
import MessageBubble from './MessageBubble'
import ChatInput from './ChatInput'
import Sidebar from './Sidebar'
import ActionCards from './ActionCards'
import { streamMessage, fetchHistory, deleteSession, uploadFile, type Message, type Role } from '../services/chatApi'

// ── Types ─────────────────────────────────────────────────────────────────────

interface ChatSession {
  id: string
  title: string
  updatedAt: string
}

interface UploadedFile {
  filename: string
  artifactId: number
}

// ── localStorage helpers ──────────────────────────────────────────────────────

const SESSIONS_KEY = 'chatpm_sessions'
const SESSION_ID_KEY = 'chatpm_session_id'
const MSG_PREFIX = 'chatpm_msgs_'

function loadSessions(): ChatSession[] {
  try { return JSON.parse(localStorage.getItem(SESSIONS_KEY) || '[]') }
  catch { return [] }
}

function persistSessions(sessions: ChatSession[]) {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))
}

function getOrCreateSessionId(): string {
  const stored = localStorage.getItem(SESSION_ID_KEY)
  if (stored) return stored
  const id = crypto.randomUUID()
  localStorage.setItem(SESSION_ID_KEY, id)
  return id
}

// Save completed messages for a session to localStorage
function saveMessages(sid: string, msgs: Message[]) {
  const toSave = msgs
    .filter(m => !m.streaming && m.content)
    .map(m => ({ role: m.role, content: m.content }))
  if (toSave.length > 0) {
    localStorage.setItem(MSG_PREFIX + sid, JSON.stringify(toSave))
  }
}

// Load messages from localStorage for a session
function loadMessages(sid: string): Message[] {
  try {
    const stored = localStorage.getItem(MSG_PREFIX + sid)
    if (!stored) return []
    const parsed = JSON.parse(stored) as Array<{ role: Role; content: string }>
    return parsed.map(m => ({
      id: crypto.randomUUID(),
      role: m.role,
      content: m.content,
      streaming: false,
    }))
  } catch { return [] }
}

function removeMessages(sid: string) {
  localStorage.removeItem(MSG_PREFIX + sid)
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Chat() {
  const [sessionId, setSessionId]               = useState<string>(getOrCreateSessionId)
  const [sessions, setSessions]                 = useState<ChatSession[]>(loadSessions)
  const [messages, setMessages]                 = useState<Message[]>([])
  const [isStreaming, setIsStreaming]            = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const [error, setError]                       = useState<string | null>(null)
  const [lastUserMessage, setLastUserMessage]   = useState<string | null>(null)
  const [lastMode, setLastMode]                 = useState<string>('pm')
  const [uploadedFiles, setUploadedFiles]       = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading]           = useState(false)
  const [sidebarOpen, setSidebarOpen]           = useState(true)

  const bottomRef       = useRef<HTMLDivElement>(null)
  const sessionIdRef    = useRef(sessionId)
  sessionIdRef.current  = sessionId

  // ── Load history on session change ─────────────────────────────────────────
  useEffect(() => {
    // 1. Load from localStorage instantly — always available
    const local = loadMessages(sessionId)
    if (local.length > 0) {
      setMessages(local)
      setIsLoadingHistory(false)
      return
    }

    // 2. Fall back to backend (server may have history if not restarted)
    let cancelled = false
    setIsLoadingHistory(true)
    setMessages([])

    fetchHistory(sessionId)
      .then(data => {
        if (cancelled) return
        const msgs = data.messages.map((m: { role: Role; content: string }) => ({
          id: crypto.randomUUID(),
          role: m.role,
          content: m.content,
          streaming: false,
        }))
        setMessages(msgs)
        // Cache in localStorage for next time
        if (msgs.length > 0) saveMessages(sessionId, msgs)
      })
      .catch(() => {
        // Backend unavailable — stay with empty chat, no crash
      })
      .finally(() => { if (!cancelled) setIsLoadingHistory(false) })

    return () => { cancelled = true }
  }, [sessionId])

  // ── Auto-scroll ─────────────────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // ── Message state helpers ───────────────────────────────────────────────────
  const appendMessage = (msg: Message) =>
    setMessages(prev => [...prev, msg])

  const appendChunk = (chunk: string) =>
    setMessages(prev => {
      const updated = [...prev]
      const last = updated[updated.length - 1]
      if (last?.role === 'assistant') {
        updated[updated.length - 1] = { ...last, content: last.content + chunk }
      }
      return updated
    })

  // Finalize stream AND persist to localStorage
  const finalizeStream = useCallback(() =>
    setMessages(prev => {
      const updated = [...prev]
      const last = updated[updated.length - 1]
      if (last?.role === 'assistant') {
        updated[updated.length - 1] = { ...last, streaming: false }
      }
      // Save completed conversation to localStorage
      saveMessages(sessionIdRef.current, updated)
      return updated
    }), [])

  // ── Save session to sidebar list ────────────────────────────────────────────
  const saveToSessionList = useCallback((id: string, title: string) => {
    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== id)
      const updated = [{ id, title, updatedAt: new Date().toISOString() }, ...filtered].slice(0, 50)
      persistSessions(updated)
      return updated
    })
  }, [])

  // ── Core stream executor ────────────────────────────────────────────────────
  const executeStream = useCallback(async (text: string, mode: string) => {
    try {
      for await (const event of streamMessage(sessionIdRef.current, text, mode)) {
        if (event.type === 'chunk') {
          appendChunk(event.content)
        } else if (event.type === 'error') {
          setError(event.content)
          break
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection lost. You can retry below.')
    } finally {
      finalizeStream()
      setIsStreaming(false)
    }
  }, [finalizeStream])

  // ── Send message ────────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text: string, mode: string = 'pm') => {
    if (isStreaming) return
    setError(null)
    setIsStreaming(true)
    setLastUserMessage(text)
    setLastMode(mode)

    const title = text.length > 40 ? text.slice(0, 40) + '…' : text
    saveToSessionList(sessionIdRef.current, title)

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text }
    const asstMsg: Message = { id: crypto.randomUUID(), role: 'assistant', content: '', streaming: true }

    setMessages(prev => {
      const updated = [...prev, userMsg]
      // Save user message immediately so it persists even if response fails
      saveMessages(sessionIdRef.current, updated)
      return [...updated, asstMsg]
    })

    await executeStream(text, mode)
  }, [isStreaming, executeStream, saveToSessionList])

  // ── Retry last message ──────────────────────────────────────────────────────
  const retryLast = useCallback(async () => {
    if (!lastUserMessage || isStreaming) return
    setError(null)
    setIsStreaming(true)
    setMessages(prev => {
      const updated = [...prev]
      if (updated[updated.length - 1]?.role === 'assistant') updated.pop()
      return updated
    })
    appendMessage({ id: crypto.randomUUID(), role: 'assistant', content: '', streaming: true })
    await executeStream(lastUserMessage, lastMode)
  }, [lastUserMessage, lastMode, isStreaming, executeStream])

  // ── New chat ────────────────────────────────────────────────────────────────
  const clearChat = useCallback(async () => {
    deleteSession(sessionId).catch(() => {})
    const newId = crypto.randomUUID()
    localStorage.setItem(SESSION_ID_KEY, newId)
    setSessionId(newId)
    setMessages([])
    setError(null)
    setLastUserMessage(null)
    setUploadedFiles([])
  }, [sessionId])

  // ── Load existing session from sidebar ──────────────────────────────────────
  const selectSession = useCallback((id: string) => {
    if (id === sessionId) return
    localStorage.setItem(SESSION_ID_KEY, id)
    setSessionId(id)
    setError(null)
    setLastUserMessage(null)
    setUploadedFiles([])
  }, [sessionId])

  // ── Delete a session from sidebar ───────────────────────────────────────────
  const deleteSessionFromList = useCallback((id: string) => {
    deleteSession(id).catch(() => {})
    removeMessages(id)
    setSessions(prev => {
      const updated = prev.filter(s => s.id !== id)
      persistSessions(updated)
      return updated
    })
    // If deleting current session, create a new one
    if (id === sessionId) {
      const newId = crypto.randomUUID()
      localStorage.setItem(SESSION_ID_KEY, newId)
      setSessionId(newId)
      setMessages([])
      setError(null)
      setLastUserMessage(null)
    }
  }, [sessionId])

  // ── File upload ─────────────────────────────────────────────────────────────
  const handleUpload = useCallback(async (file: File) => {
    setIsUploading(true)
    setError(null)
    try {
      const result = await uploadFile(sessionId, file)
      setUploadedFiles(prev => [...prev, { filename: result.filename, artifactId: result.artifact_id }])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }, [sessionId])

  // ── Render ──────────────────────────────────────────────────────────────────
  const isEmpty = messages.length === 0 && !isLoadingHistory

  return (
    <div className="flex h-full bg-zinc-950">

      {/* Sidebar */}
      {sidebarOpen && (
        <Sidebar
          currentSessionId={sessionId}
          sessions={sessions}
          onSelectSession={selectSession}
          onNewChat={clearChat}
          onDeleteSession={deleteSessionFromList}
          isStreaming={isStreaming}
        />
      )}

      {/* Main workspace */}
      <div className="flex flex-col flex-1 min-w-0 h-full">

        {/* Top bar */}
        <header className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800 bg-zinc-950">
          <button
            onClick={() => setSidebarOpen(o => !o)}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          <button
            onClick={clearChat}
            disabled={isStreaming}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors disabled:opacity-40"
            aria-label="New chat"
            title="New chat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
          </button>
        </header>

        {/* Error banner */}
        {error && (
          <div className="flex items-center justify-between gap-4 bg-red-950/60 border-b border-red-900 px-6 py-2">
            <p className="text-sm text-red-400">{error}</p>
            {lastUserMessage && (
              <button
                onClick={retryLast}
                disabled={isStreaming}
                className="flex-shrink-0 text-xs font-medium text-red-400 underline hover:text-red-200 disabled:opacity-40"
              >
                Retry
              </button>
            )}
          </div>
        )}

        {/* Content area */}
        <div className="flex-1 overflow-y-auto">
          {isLoadingHistory ? (
            <div className="h-full flex items-center justify-center text-zinc-600 text-sm">
              <svg className="w-4 h-4 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Loading conversation…
            </div>
          ) : isEmpty ? (
            <ActionCards onSend={sendMessage} isStreaming={isStreaming} />
          ) : (
            <div className="max-w-3xl mx-auto px-4 py-8">
              {messages.map((msg, i) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  onRetry={msg.role === 'assistant' && i === messages.length - 1 ? retryLast : undefined}
                />
              ))}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <ChatInput
          onSend={sendMessage}
          onUpload={handleUpload}
          isStreaming={isStreaming}
          isUploading={isUploading}
          uploadedFiles={uploadedFiles}
        />
      </div>
    </div>
  )
}
