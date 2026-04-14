import { useState, useRef, useEffect, type ChangeEvent, type KeyboardEvent } from 'react'

const PLACEHOLDERS = [
  'Write a PRD for a new feature…',
  'Help me prioritize my backlog…',
  'Create user stories for…',
  'Prep me for a stakeholder meeting…',
  'Define success metrics for…',
  'Review my product spec…',
  'Write a one-pager for…',
  'Help me think through a tradeoff…',
]

interface UploadedFile {
  filename: string
  artifactId: number
}

interface Props {
  onSend: (text: string, mode?: string) => void
  onUpload: (file: File) => Promise<void>
  isStreaming: boolean
  isUploading: boolean
  uploadedFiles: UploadedFile[]
}

export default function ChatInput({
  onSend,
  onUpload,
  isStreaming,
  isUploading,
  uploadedFiles,
}: Props) {
  const [value, setValue]         = useState('')
  const [phIndex, setPhIndex]     = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Rotate placeholder every 4 seconds when idle
  useEffect(() => {
    if (isStreaming) return
    const t = setInterval(() => {
      setPhIndex(i => (i + 1) % PLACEHOLDERS.length)
    }, 4000)
    return () => clearInterval(t)
  }, [isStreaming])

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed || isStreaming) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    const el = textareaRef.current
    if (el) {
      el.style.height = 'auto'
      el.style.height = `${Math.min(el.scrollHeight, 160)}px`
    }
  }

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    await onUpload(file)
    e.target.value = ''
  }

  const canSend = value.trim().length > 0 && !isStreaming

  return (
    <div className="px-4 pb-5 pt-3 bg-zinc-950 border-t border-zinc-800">
      <div className="max-w-3xl mx-auto">

        {/* Uploaded file badges */}
        {uploadedFiles.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {uploadedFiles.map(f => (
              <span
                key={f.artifactId}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-900/40 text-teal-400 text-xs font-medium rounded-full border border-teal-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                </svg>
                {f.filename}
              </span>
            ))}
          </div>
        )}

        {/* Input box */}
        <div className="flex flex-col rounded-xl border border-zinc-700 bg-zinc-800 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">

          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={isStreaming}
            placeholder={
              isStreaming
                ? 'Waiting for response…'
                : uploadedFiles.length > 0
                ? 'Ask me about the uploaded file…'
                : PLACEHOLDERS[phIndex]
            }
            rows={1}
            className="w-full resize-none px-4 pt-3.5 pb-2 text-sm text-zinc-100 placeholder-zinc-500 leading-relaxed focus:outline-none bg-transparent overflow-hidden"
          />

          {/* Bottom toolbar */}
          <div className="flex items-center justify-between px-3 pb-2.5">
            <div className="flex items-center gap-1">

              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.json,.txt"
                className="hidden"
                onChange={handleFileChange}
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isStreaming || isUploading}
                aria-label="Attach file"
                title="Upload CSV, JSON, or TXT"
                className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 002.112 2.13" />
                  </svg>
                )}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-600 hidden sm:block">
                Enter to send · Shift+Enter for newline
              </span>
              <button
                onClick={handleSend}
                disabled={!canSend}
                aria-label="Send message"
                className="w-8 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
