import { useState, useRef, useCallback, useEffect } from 'react'
import MessageBubble from './MessageBubble'
import ChatInput from './ChatInput'
import Sidebar from './Sidebar'
import ActionCards from './ActionCards'
import { streamMessage, fetchHistory, deleteSession, uploadFile, type Message, type Role } from '../services/chatApi'

// ── Session storage helpers ───────────────────────────────────────────────────

interface ChatSession {
  id: string
  title: string
  updatedAt: string
}

function loadSessions(): ChatSession[] {
  try {
    return JSON.parse(localStorage.getItem('chatpm_sessions') || '[]')
  } catch { return [] }
}

function persistSessions(sessions: ChatSession[]) {
  localStorage.setItem('chatpm_sessions', JSON.stringify(sessions))
}

function getOrCreateSessionId(): string {
  const key = 'chatpm_session_id'
  const stored = localStorage.getItem(key)
  if (stored) return stored
  const id = crypto.randomUUID()
  localStorage.setItem(key, id)
  return id
}

// ── Component ─────────────────────────────────────────────────────────────────

interface UploadedFile {
  filename: string
  artifactId: number
}

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

  const bottomRef = useRef<HTMLDivElement>(null)

  // ── Load history on session change ─────────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    setIsLoadingHistory(true)
    setMessages([])

    fetchHistory(sessionId)
      .then(data => {
        if (cancelled) return
        setMessages(
          data.messages.map((m: { role: Role; content: string }) => ({
            id: crypto.randomUUID(),
            role: m.role,
            content: m.content,
            streaming: false,
          }))
        )
      })
      .catch(() => {})
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

  const finalizeStream = () =>
    setMessages(prev => {
      const updated = [...prev]
      const last = updated[updated.length - 1]
      if (last?.role === 'assistant') {
        updated[updated.length - 1] = { ...last, streaming: false }
      }
      return updated
    })

  // ── Save session to sidebar list ────────────────────────────────────────────
  const saveToSessionList = useCallback((id: string, title: string) => {
    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== id)
      const updated = [{ id, title, updatedAt: new Date().toISOString() }, ...filtered].slice(0, 30)
      persistSessions(updated)
      return updated
    })
  }, [])

  // ── Core stream executor ────────────────────────────────────────────────────
  const executeStream = useCallback(async (text: string, mode: string) => {
    try {
      for await (const event of streamMessage(sessionId, text, mode)) {
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
  }, [sessionId])

  // ── Send message ────────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text: string, mode: string = 'pm') => {
    if (isStreaming) return
    setError(null)
    setIsStreaming(true)
    setLastUserMessage(text)
    setLastMode(mode)

    // Derive title from first user message (truncated)
    const title = text.length > 40 ? text.slice(0, 40) + '…' : text
    saveToSessionList(sessionId, title)

    appendMessage({ id: crypto.randomUUID(), role: 'user', content: text })
    appendMessage({ id: crypto.randomUUID(), role: 'assistant', content: '', streaming: true })
    await executeStream(text, mode)
  }, [isStreaming, sessionId, executeStream, saveToSessionList])

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
    await deleteSession(sessionId)
    const newId = crypto.randomUUID()
    localStorage.setItem('chatpm_session_id', newId)
    setSessionId(newId)
    setError(null)
    setLastUserMessage(null)
    setUploadedFiles([])
  }, [sessionId])

  // ── Load existing session from sidebar ──────────────────────────────────────
  const selectSession = useCallback((id: string) => {
    if (id === sessionId) return
    localStorage.setItem('chatpm_session_id', id)
    setSessionId(id)
    setError(null)
    setLastUserMessage(null)
    setUploadedFiles([])
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

          {/* Edit / new chat icon */}
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
              Loading conversation…
            </div>
          ) : isEmpty ? (
            <ActionCards onSend={sendMessage} isStreaming={isStreaming} />
          ) : (
            <div className="max-w-3xl mx-auto px-4 py-8">
              {messages.map(msg => (
                <MessageBubble key={msg.id} message={msg} />
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
