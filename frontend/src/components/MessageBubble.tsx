import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Message } from '../services/chatApi'

interface Props {
  message: Message
  onRetry?: () => void
}

// ── Icons ─────────────────────────────────────────────────────────────────────

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill={filled ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
  </svg>
)

const ThumbUpIcon = ({ filled }: { filled: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill={filled ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.25M6.633 10.25H5.25a1.125 1.125 0 0 0-1.125 1.125v6.75c0 .621.504 1.125 1.125 1.125h1.383" />
  </svg>
)

const ThumbDownIcon = ({ filled }: { filled: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill={filled ? 'currentColor' : 'none'} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 1.5H9.7m8.075-9.75c.01.05.027.1.05.148.593 1.2.925 2.55.925 3.977 0 1.487-.36 2.89-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 0 0 .303-.54" />
  </svg>
)

const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
  </svg>
)

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
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
function ActionToolbar({ content }: { content: string; onRetry?: () => void }) {
  const [copied,    setCopied]    = useState(false)
  const [liked,     setLiked]     = useState<'heart' | 'up' | 'down' | null>(null)

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const btnBase = 'flex items-center justify-center rounded-lg p-2 transition-all duration-150'
  const btnIdle = 'text-zinc-400 hover:text-white hover:bg-zinc-700'

  return (
    <div className="flex items-center gap-0.5 mt-2 ml-10 rounded-xl bg-zinc-800/60 border border-zinc-700/50 px-1.5 py-1 animate-in fade-in slide-in-from-bottom-1 duration-200">

      {/* ── Heart ── */}
      <Tip label="Love it">
        <button
          onClick={() => setLiked(l => l === 'heart' ? null : 'heart')}
          className={`${btnBase} ${liked === 'heart' ? 'text-rose-400' : btnIdle}`}
        >
          <HeartIcon filled={liked === 'heart'} />
        </button>
      </Tip>

      {/* ── Thumbs up ── */}
      <Tip label="Helpful">
        <button
          onClick={() => setLiked(l => l === 'up' ? null : 'up')}
          className={`${btnBase} ${liked === 'up' ? 'text-teal-400' : btnIdle}`}
        >
          <ThumbUpIcon filled={liked === 'up'} />
        </button>
      </Tip>

      {/* ── Thumbs down ── */}
      <Tip label="Not helpful">
        <button
          onClick={() => setLiked(l => l === 'down' ? null : 'down')}
          className={`${btnBase} ${liked === 'down' ? 'text-amber-400' : btnIdle}`}
        >
          <ThumbDownIcon filled={liked === 'down'} />
        </button>
      </Tip>

      {/* ── Divider ── */}
      <div className="mx-1 h-3.5 w-px bg-zinc-700/60" />

      {/* ── Copy ── */}
      <Tip label={copied ? 'Copied!' : 'Copy'}>
        <button
          onClick={handleCopy}
          className={`${btnBase} ${copied ? 'text-teal-400' : btnIdle}`}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
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
            'max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed break-words',
            isUser
              ? 'bg-indigo-600 text-white rounded-br-sm whitespace-pre-wrap'
              : 'bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-bl-sm',
          ].join(' ')}
        >
          {isUser ? (
            <>
              {message.content || (isStreaming ? '\u00A0' : '')}
              {isStreaming && (
                <span className="inline-block w-[2px] h-4 ml-0.5 bg-current opacity-70 animate-pulse align-text-bottom" />
              )}
            </>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => <h1 className="text-base font-bold text-zinc-100 mt-4 mb-2 first:mt-0">{children}</h1>,
                h2: ({ children }) => <h2 className="text-sm font-bold text-zinc-100 mt-4 mb-1.5 first:mt-0">{children}</h2>,
                h3: ({ children }) => <h3 className="text-sm font-semibold text-zinc-200 mt-3 mb-1 first:mt-0">{children}</h3>,
                p:  ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                strong: ({ children }) => <strong className="font-semibold text-zinc-100">{children}</strong>,
                em: ({ children }) => <em className="italic text-zinc-300">{children}</em>,
                ul: ({ children }) => <ul className="list-disc list-outside ml-4 mb-2 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-outside ml-4 mb-2 space-y-1">{children}</ol>,
                li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                code: ({ children, className }) => {
                  const isBlock = className?.includes('language-')
                  return isBlock
                    ? <code className="block bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs font-mono text-zinc-300 overflow-x-auto my-2 whitespace-pre">{children}</code>
                    : <code className="bg-zinc-700 rounded px-1 py-0.5 text-xs font-mono text-zinc-200">{children}</code>
                },
                pre: ({ children }) => <pre className="my-2">{children}</pre>,
                blockquote: ({ children }) => <blockquote className="border-l-2 border-indigo-500 pl-3 my-2 text-zinc-400 italic">{children}</blockquote>,
                hr: () => <hr className="border-zinc-700 my-3" />,
                a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">{children}</a>,
              }}
            >
              {message.content || (isStreaming ? '\u00A0' : '')}
            </ReactMarkdown>
          )}
          {!isUser && isStreaming && (
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
