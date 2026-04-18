import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Message } from '../services/chatApi'

interface Props {
  message: Message
  onRetry?: () => void
}

// ── Markdown → Word HTML converter ───────────────────────────────────────────

function processInline(text: string): string {
  return text
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code style="background:#f3f4f6;padding:1pt 4pt;font-family:Consolas,monospace;font-size:9pt;border-radius:2pt">$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="color:#4338ca">$1</a>')
}

function markdownToHtml(md: string): string {
  const lines = md.split('\n')
  const out: string[] = []
  let inTable = false
  let inList = false
  let inOrderedList = false
  let tableHasHead = false

  const closeList = () => {
    if (inList)        { out.push('</ul>');  inList = false }
    if (inOrderedList) { out.push('</ol>'); inOrderedList = false }
  }
  const closeTable = () => {
    if (inTable) { out.push('</tbody></table>'); inTable = false; tableHasHead = false }
  }

  for (let i = 0; i < lines.length; i++) {
    const raw  = lines[i]
    const line = raw.trimEnd()

    // ── Table row ──
    if (/^\s*\|.+\|\s*$/.test(line)) {
      const cells = line.trim().slice(1, -1).split('|').map(c => c.trim())
      const nextLine = (lines[i + 1] || '').trim()
      const isSep = /^\|[\s\-:|]+\|$/.test(nextLine)

      if (!inTable) {
        closeList()
        out.push('<table style="border-collapse:collapse;width:100%;margin:10pt 0;font-size:10pt">')
        if (isSep) {
          out.push('<thead><tr style="background:#eef2ff">')
          cells.forEach(c => out.push(`<th style="border:1pt solid #c7d2fe;padding:6pt 8pt;text-align:left;font-weight:600;color:#312e81">${processInline(c)}</th>`))
          out.push('</tr></thead><tbody>')
          i++
          inTable = true
          tableHasHead = true
          continue
        }
        out.push('<tbody>')
        inTable = true
      }
      if (tableHasHead && /^[\s\-:|]+$/.test(cells.join(''))) continue // skip separator
      out.push('<tr>')
      cells.forEach((c, idx) => out.push(
        `<td style="border:1pt solid #e5e7eb;padding:5pt 8pt;${idx === 0 ? 'font-weight:500;color:#1f2937' : 'color:#374151'}">${processInline(c)}</td>`
      ))
      out.push('</tr>')
      continue
    } else {
      closeTable()
    }

    // ── HR ──
    if (/^---+$/.test(line.trim())) {
      closeList()
      out.push('<hr style="border:none;border-top:1pt solid #e5e7eb;margin:14pt 0"/>')
      continue
    }

    // ── Headers ──
    if (line.startsWith('# ')) {
      closeList()
      out.push(`<h1 style="font-size:22pt;color:#1e1b4b;margin:0 0 6pt;font-family:Calibri,Arial,sans-serif">${processInline(line.slice(2))}</h1>`)
      continue
    }
    if (line.startsWith('## ')) {
      closeList()
      out.push(`<h2 style="font-size:14pt;color:#312e81;border-bottom:1.5pt solid #c7d2fe;padding-bottom:3pt;margin:18pt 0 6pt;font-family:Calibri,Arial,sans-serif">${processInline(line.slice(3))}</h2>`)
      continue
    }
    if (line.startsWith('### ')) {
      closeList()
      out.push(`<h3 style="font-size:11pt;color:#4338ca;margin:12pt 0 4pt;font-family:Calibri,Arial,sans-serif">${processInline(line.slice(4))}</h3>`)
      continue
    }

    // ── Unordered list ──
    if (/^[-*] /.test(line)) {
      if (inOrderedList) { out.push('</ol>'); inOrderedList = false }
      if (!inList) { out.push('<ul style="margin:4pt 0 4pt 18pt;padding:0">'); inList = true }
      out.push(`<li style="margin:2pt 0;color:#374151">${processInline(line.replace(/^[-*] /, ''))}</li>`)
      continue
    }

    // ── Ordered list ──
    if (/^\d+\. /.test(line)) {
      if (inList) { out.push('</ul>'); inList = false }
      if (!inOrderedList) { out.push('<ol style="margin:4pt 0 4pt 18pt;padding:0">'); inOrderedList = true }
      out.push(`<li style="margin:2pt 0;color:#374151">${processInline(line.replace(/^\d+\. /, ''))}</li>`)
      continue
    }

    // ── Blank line ──
    if (line.trim() === '') {
      closeList()
      out.push('<p style="margin:3pt 0"> </p>')
      continue
    }

    // ── Italic-only line (section subtitle) ──
    if (/^\*[^*].+[^*]\*$/.test(line.trim())) {
      closeList()
      out.push(`<p style="color:#6b7280;font-style:italic;margin:2pt 0 6pt;font-size:10pt">${processInline(line.trim())}</p>`)
      continue
    }

    // ── Plain paragraph ──
    closeList()
    out.push(`<p style="margin:4pt 0;line-height:1.6;color:#1f2937">${processInline(line)}</p>`)
  }

  closeTable()
  closeList()
  return out.join('\n')
}

function downloadAsDoc(content: string) {
  // Extract title from first H1 for filename
  const titleMatch = content.match(/^# (.+)$/m)
  const title = titleMatch ? titleMatch[1].replace(/[^\w\s-]/g, '').trim() : 'Document'
  const filename = `${title}.doc`

  const bodyHtml = markdownToHtml(content)
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:w="urn:schemas-microsoft-com:office:word"
  xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page { margin: 2.5cm; }
    body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; color: #1f2937; line-height: 1.5; }
    h1 { font-size: 22pt; color: #1e1b4b; page-break-after: avoid; }
    h2 { font-size: 14pt; color: #312e81; page-break-after: avoid; border-bottom: 1.5pt solid #c7d2fe; padding-bottom: 3pt; margin-top: 18pt; }
    h3 { font-size: 11pt; color: #4338ca; page-break-after: avoid; margin-top: 12pt; }
    table { border-collapse: collapse; width: 100%; margin: 8pt 0; }
    th { background: #eef2ff; padding: 6pt 8pt; text-align: left; font-weight: 600; color: #312e81; border: 1pt solid #c7d2fe; }
    td { padding: 5pt 8pt; border: 1pt solid #e5e7eb; color: #374151; }
    tr:nth-child(even) td { background: #f9fafb; }
    ul, ol { margin-left: 18pt; padding: 0; }
    li { margin: 2pt 0; }
    hr { border: none; border-top: 1pt solid #e5e7eb; margin: 14pt 0; }
    p { margin: 4pt 0; }
    strong { color: #111827; }
    code { background: #f3f4f6; padding: 1pt 4pt; font-family: Consolas, monospace; font-size: 9pt; border-radius: 2pt; }
    a { color: #4338ca; }
  </style>
</head>
<body>${bodyHtml}</body>
</html>`

  const blob = new Blob([html], { type: 'application/msword' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
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

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
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

// ── Thanks toast ──────────────────────────────────────────────────────────────
function ThanksToast({ onDone }: { onDone: () => void }) {
  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-sm text-zinc-200 shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200"
      onAnimationEnd={() => setTimeout(onDone, 1800)}
    >
      <span className="text-teal-400">✓</span>
      Thanks for your feedback!
    </div>
  )
}

// ── Feedback modal ────────────────────────────────────────────────────────────
const FEEDBACK_OPTIONS = ['Lacks Detail', 'Inaccurate', 'Bad Writing', 'Too Short', 'Too Long', 'Other'] as const

function FeedbackModal({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [details, setDetails]   = useState('')
  const [submitted, setSubmitted] = useState(false)

  const toggle = (opt: string) =>
    setSelected(prev => {
      const next = new Set(prev)
      next.has(opt) ? next.delete(opt) : next.add(opt)
      return next
    })

  const handleSubmit = () => {
    setSubmitted(true)
    setTimeout(onClose, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-sm mx-4 rounded-2xl bg-zinc-900 border border-zinc-700 shadow-2xl p-6 animate-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-4">
            <span className="text-3xl">🙏</span>
            <p className="text-sm text-zinc-200 font-medium">Thanks for your feedback!</p>
          </div>
        ) : (
          <>
            <h3 className="text-base font-semibold text-zinc-100 mb-1">What could we improve?</h3>
            <p className="text-xs text-zinc-400 mb-4">Select all that apply:</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {FEEDBACK_OPTIONS.map(opt => (
                <button
                  key={opt}
                  onClick={() => toggle(opt)}
                  className={[
                    'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150',
                    selected.has(opt)
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-zinc-100',
                  ].join(' ')}
                >
                  {opt}
                </button>
              ))}
            </div>
            <textarea
              value={details}
              onChange={e => setDetails(e.target.value)}
              placeholder="Additional details about what we could improve..."
              rows={3}
              className="w-full rounded-xl bg-zinc-800 border border-zinc-700 text-sm text-zinc-200 placeholder-zinc-500 px-3 py-2.5 resize-none focus:outline-none focus:border-indigo-500 transition-colors mb-4"
            />
            <div className="flex gap-2 justify-end">
              <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={selected.size === 0 && !details.trim()}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Submit Feedback
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── Action toolbar ────────────────────────────────────────────────────────────
function ActionToolbar({ content }: { content: string; onRetry?: () => void }) {
  const [copied,       setCopied]       = useState(false)
  const [liked,        setLiked]        = useState<'heart' | 'up' | 'down' | null>(null)
  const [showThanks,   setShowThanks]   = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [downloaded,   setDownloaded]   = useState(false)

  const handlePositive = (type: 'heart' | 'up') => {
    setLiked(l => l === type ? null : type)
    setShowThanks(true)
  }

  const handleThumbDown = () => {
    if (liked === 'down') { setLiked(null) }
    else { setLiked('down'); setShowFeedback(true) }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  const handleDownload = () => {
    downloadAsDoc(content)
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 2000)
  }

  const btnBase = 'flex items-center justify-center rounded-lg p-2 transition-all duration-150'
  const btnIdle = 'text-zinc-400 hover:text-white hover:bg-zinc-700'

  return (
    <>
      <div className="flex items-center gap-0.5 mt-2 ml-10 rounded-xl bg-zinc-800/60 border border-zinc-700/50 px-1.5 py-1 animate-in fade-in slide-in-from-bottom-1 duration-200">

        {/* ── Heart ── */}
        <Tip label="Love it">
          <button onClick={() => handlePositive('heart')} className={`${btnBase} ${liked === 'heart' ? 'text-rose-400' : btnIdle}`}>
            <HeartIcon filled={liked === 'heart'} />
          </button>
        </Tip>

        {/* ── Thumbs up ── */}
        <Tip label="Helpful">
          <button onClick={() => handlePositive('up')} className={`${btnBase} ${liked === 'up' ? 'text-teal-400' : btnIdle}`}>
            <ThumbUpIcon filled={liked === 'up'} />
          </button>
        </Tip>

        {/* ── Thumbs down ── */}
        <Tip label="Not helpful">
          <button onClick={handleThumbDown} className={`${btnBase} ${liked === 'down' ? 'text-amber-400' : btnIdle}`}>
            <ThumbDownIcon filled={liked === 'down'} />
          </button>
        </Tip>

        {/* ── Divider ── */}
        <div className="mx-1 h-3.5 w-px bg-zinc-700/60" />

        {/* ── Copy ── */}
        <Tip label={copied ? 'Copied!' : 'Copy'}>
          <button onClick={handleCopy} className={`${btnBase} ${copied ? 'text-teal-400' : btnIdle}`}>
            {copied ? <CheckIcon /> : <CopyIcon />}
          </button>
        </Tip>

        {/* ── Download as Word ── */}
        <Tip label={downloaded ? 'Downloaded!' : 'Download as Word'}>
          <button onClick={handleDownload} className={`${btnBase} ${downloaded ? 'text-indigo-400' : btnIdle}`}>
            <DownloadIcon />
          </button>
        </Tip>

      </div>

      {showThanks   && <ThanksToast onDone={() => setShowThanks(false)} />}
      {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}
    </>
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
          <div className="flex-shrink-0 mr-3 mt-1 select-none">
            {isStreaming ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-indigo-600/20 border border-indigo-500/30 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-[10px] font-medium text-indigo-300 ml-0.5">Thinking…</span>
              </div>
            ) : (
              <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden">
                <img src="/logo-dark.svg" alt="Product Path" className="w-5 h-5 object-contain" />
              </div>
            )}
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
          {!isUser && isStreaming && message.content && (
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
