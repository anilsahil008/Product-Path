import { useState } from 'react'
import type { Message } from '../services/chatApi'

interface Props {
  message: Message
  onRetry?: () => void
}

// ── Icons ─────────────────────────────────────────────────────────────────────

const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
  </svg>
)

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
  </svg>
)

// Bookmark — Save to Docs
const BookmarkIcon = ({ filled }: { filled: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill={filled ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
  </svg>
)

// Checkmark circle — Mark as helpful
const HelpfulIcon = ({ filled }: { filled: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill={filled ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
)

// Flag — Flag response
const FlagIcon = ({ filled }: { filled: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill={filled ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5" />
  </svg>
)

// Sparkle — Regenerate
const SparkleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
  </svg>
)

// Dots — More
const DotsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm6.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm6.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
  </svg>
)

// ── Tooltip wrapper ───────────────────────────────────────────────────────────
function Tip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="group/tip relative flex items-center justify-center">
      {children}
      <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-zinc-700 px-2 py-1 text-[10px] text-zinc-200 opacity-0 transition-opacity duration-150 group-hover/tip:opacity-100 shadow-lg">
        {label}
      </div>
    </div>
  )
}

// ── Action toolbar ────────────────────────────────────────────────────────────
function ActionToolbar({ content, onRetry }: { content: string; onRetry?: () => void }) {
  const [copied, setCopied]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [helpful, setHelpful]   = useState<'yes' | 'flag' | null>(null)

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const btnBase = 'flex items-center justify-center rounded-lg p-1.5 transition-all duration-150'
  const btnIdle = 'text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800/80'

  return (
    <div className="flex items-center gap-0.5 mt-2 ml-10 animate-in fade-in slide-in-from-bottom-1 duration-200">

      {/* ── Copy ── */}
      <Tip label={copied ? 'Copied!' : 'Copy'}>
        <button
          onClick={handleCopy}
          className={`${btnBase} ${copied ? 'text-teal-400' : btnIdle}`}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      </Tip>

      {/* ── Divider ── */}
      <div className="mx-1 h-3.5 w-px bg-zinc-700/60" />

      {/* ── Helpful ── */}
      <Tip label={helpful === 'yes' ? 'Marked helpful' : 'Helpful'}>
        <button
          onClick={() => setHelpful(h => h === 'yes' ? null : 'yes')}
          className={`${btnBase} ${helpful === 'yes' ? 'text-teal-400' : btnIdle}`}
        >
          <HelpfulIcon filled={helpful === 'yes'} />
        </button>
      </Tip>

      {/* ── Flag ── */}
      <Tip label={helpful === 'flag' ? 'Flagged' : 'Flag response'}>
        <button
          onClick={() => setHelpful(h => h === 'flag' ? null : 'flag')}
          className={`${btnBase} ${helpful === 'flag' ? 'text-amber-400' : btnIdle}`}
        >
          <FlagIcon filled={helpful === 'flag'} />
        </button>
      </Tip>

      {/* ── Divider ── */}
      <div className="mx-1 h-3.5 w-px bg-zinc-700/60" />

      {/* ── Save to Docs ── */}
      <Tip label={saved ? 'Saved!' : 'Save to Docs'}>
        <button
          onClick={() => setSaved(s => !s)}
          className={`${btnBase} ${saved ? 'text-indigo-400' : btnIdle}`}
        >
          <BookmarkIcon filled={saved} />
        </button>
      </Tip>

      {/* ── Regenerate ── */}
      {onRetry && (
        <Tip label="Regenerate">
          <button
            onClick={onRetry}
            className={`${btnBase} ${btnIdle} hover:rotate-12 transition-transform`}
          >
            <SparkleIcon />
          </button>
        </Tip>
      )}

      {/* ── More ── */}
      <Tip label="More">
        <button className={`${btnBase} ${btnIdle}`}>
          <DotsIcon />
        </button>
      </Tip>

    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function MessageBubble({ message, onRetry }: Props) {
  const isUser      = message.role === 'user'
  const isStreaming = !!message.streaming

  return (
    <div className={`flex flex-col w-full mb-4 ${isUser ? 'items-end' : 'items-start'}`}>
      <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>

        {/* Assistant avatar */}
        {!isUser && (
          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center mr-3 mt-1 select-none overflow-hidden">
            <img src="/logo-dark.svg" alt="Product Path" className="w-5 h-5 object-contain" />
          </div>
        )}

        <div
          className={[
            'max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words',
            isUser
              ? 'bg-indigo-600 text-white rounded-br-sm'
              : 'bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-bl-sm',
          ].join(' ')}
        >
          {message.content || (isStreaming ? '\u00A0' : '')}
          {isStreaming && (
            <span className="inline-block w-[2px] h-4 ml-0.5 bg-current opacity-70 animate-pulse align-text-bottom" />
          )}
        </div>

        {/* User avatar */}
        {isUser && (
          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold ml-3 mt-1 select-none">
            You
          </div>
        )}
      </div>

      {/* Action toolbar — assistant only, after streaming completes */}
      {!isUser && !isStreaming && message.content && (
        <ActionToolbar content={message.content} onRetry={onRetry} />
      )}
    </div>
  )
}
