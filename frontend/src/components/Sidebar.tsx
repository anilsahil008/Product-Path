import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AccountMenu from './AccountMenu'

// ── Types ─────────────────────────────────────────────────────────────────────

interface ChatSession {
  id: string
  title: string
  updatedAt: string
}

interface Props {
  currentSessionId: string
  sessions: ChatSession[]
  onSelectSession: (id: string) => void
  onNewChat: () => void
  onDeleteSession: (id: string) => void
  onSelectTemplate: (prompt: string) => void
  isStreaming: boolean
}

// ── Templates ─────────────────────────────────────────────────────────────────

const TEMPLATE_GROUPS = [
  {
    label: 'Core PM',
    color: 'text-indigo-400',
    items: [
      {
        label: 'Write a PRD',
        prompt: "I want to write a PRD. Before we start, ask me the 2–3 questions you need answered to make this genuinely useful — not a generic template.",
      },
      {
        label: 'User stories',
        prompt: "Help me write user stories for a feature. Ask me about the feature, the persona, and what job they're trying to do — then generate stories with clear acceptance criteria.",
      },
      {
        label: 'Define an epic',
        prompt: "I need to define an epic for my backlog. Ask me about the initiative, the business outcome we're targeting, and the key user segment — then help me write a well-structured epic with sub-stories.",
      },
      {
        label: 'Roadmap planning',
        prompt: "Help me plan my product roadmap. Ask me about my current priorities, team capacity, and business goals — then help me structure a Now/Next/Later roadmap with clear rationale for each decision.",
      },
      {
        label: 'Stakeholder update',
        prompt: "I need to write a stakeholder update for my product area. Ask me what's shipped, what's in progress, and what decisions need to be made — then help me write a clear, concise update.",
      },
    ],
  },
  {
    label: 'Data & BI',
    color: 'text-emerald-400',
    items: [
      {
        label: 'BI dashboard PRD',
        prompt: "I want to write a PRD for a business intelligence dashboard or report. Ask me who the audience is, what decisions this will drive, and what data sources we're working with — then help me write a strong PRD.",
      },
      {
        label: 'Data quality initiative',
        prompt: "I need to scope a data quality initiative. Ask me about the data domain, what business impact the quality issues are causing, and what good looks like — then help me define the initiative clearly with success metrics.",
      },
      {
        label: 'Metrics framework',
        prompt: "Help me define a metrics framework for my product area. Ask me about the business outcomes we care about, the user behaviors that drive them, and what we can actually measure — then help me build a clear, layered framework.",
      },
      {
        label: 'CRM / Salesforce analysis',
        prompt: "I need to think through a product initiative involving Salesforce or CRM data. Ask me about the business question we're trying to answer and who needs this insight — then help me define what data is needed and what decisions it enables.",
      },
    ],
  },
  {
    label: 'Agile',
    color: 'text-amber-400',
    items: [
      {
        label: 'Sprint goal',
        prompt: "Help me write a sprint goal. Ask me about the sprint theme and the key outcome we're driving — then help me write a goal that's outcome-focused, not task-focused.",
      },
      {
        label: 'Backlog grooming',
        prompt: "I need to groom my backlog and prioritize items for an upcoming sprint. Describe your top 5–7 candidate items and I'll help you think through prioritization with clear rationale for what makes the cut.",
      },
      {
        label: 'OKR definition',
        prompt: "Help me write OKRs for my product area. Ask me about the business goals for the quarter, what success looks like, and how my team contributes — then help me write objectives with measurable key results.",
      },
      {
        label: 'Retro action items',
        prompt: "I just ran a retrospective and want to turn the output into concrete action items. Share your key themes and I'll help you prioritize and frame them as clear, ownable actions with expected outcomes.",
      },
    ],
  },
]

// ── Icons ─────────────────────────────────────────────────────────────────────

const icons = {
  plus: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  ),
  edit: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
    </svg>
  ),
  trash: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
  ),
  chevronDown: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  ),
  template: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
  ),
}

// ── Section header ─────────────────────────────────────────────────────────────
function SectionHeader({ label, action }: { label: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-2.5 pb-1 pt-4">
      <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
        {label}
      </span>
      {action}
    </div>
  )
}

// ── Template group (collapsible) ───────────────────────────────────────────────
function TemplateGroup({
  label,
  color,
  items,
  onSelect,
  isStreaming,
}: {
  label: string
  color: string
  items: { label: string; prompt: string }[]
  onSelect: (prompt: string) => void
  isStreaming: boolean
}) {
  const [open, setOpen] = useState(true)

  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-zinc-800/60 transition-colors group"
      >
        <span className={`text-[10px] font-semibold uppercase tracking-[0.1em] ${color} flex-1 text-left`}>
          {label}
        </span>
        <span className={`text-zinc-600 transition-transform duration-150 ${open ? '' : '-rotate-90'}`}>
          {icons.chevronDown}
        </span>
      </button>

      {open && (
        <div className="space-y-0.5 mt-0.5">
          {items.map(item => (
            <button
              key={item.label}
              onClick={() => onSelect(item.prompt)}
              disabled={isStreaming}
              className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-left text-[12px] text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed group"
            >
              <span className="text-zinc-600 group-hover:text-zinc-500 flex-shrink-0">{icons.template}</span>
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Workspace info card ────────────────────────────────────────────────────────
function WorkspaceCard({ user, onClose, onNavigate }: {
  user: { email: string } | null
  onClose: () => void
  onNavigate: (path: string) => void
}) {
  const initial = user?.email?.charAt(0).toUpperCase() ?? '?'
  const name    = user?.email?.split('@')[0] ?? 'Guest'

  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} />
      <div className="absolute left-2 right-2 top-full z-20 mt-1 overflow-hidden rounded-xl border border-zinc-700/60 bg-zinc-900 shadow-2xl shadow-black/60">
        <div className="p-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white select-none">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-zinc-200">{name}</p>
              <p className="truncate text-[10px] text-zinc-500">{user?.email}</p>
            </div>
          </div>
          <span className="mt-2 inline-block rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold text-zinc-400">
            Free plan · Personal workspace
          </span>
        </div>
        <div className="p-1.5 space-y-0.5">
          {[
            { label: 'Account settings', path: '/app/settings/profile' },
            { label: 'Billing & plan',   path: '/app/settings/billing' },
          ].map(({ label, path }) => (
            <button
              key={label}
              onClick={() => { onClose(); onNavigate(path) }}
              className="w-full rounded-lg px-3 py-2 text-left text-[13px] text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
            >
              {label}
            </button>
          ))}
        </div>
        <div className="border-t border-zinc-800 p-1.5">
          <div className="flex items-center justify-between px-3 py-2 rounded-lg text-[12px] text-zinc-500 bg-zinc-800/50">
            <span>Create workspace</span>
            <span className="text-[10px] text-zinc-600 bg-zinc-700 px-1.5 py-0.5 rounded-full">Soon</span>
          </div>
        </div>
      </div>
    </>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Sidebar({
  currentSessionId,
  sessions,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onSelectTemplate,
  isStreaming,
}: Props) {
  const { user }   = useAuth()
  const navigate   = useNavigate()

  const [accountMenuOpen,   setAccountMenuOpen]   = useState(false)
  const [workspaceCardOpen, setWorkspaceCardOpen] = useState(false)

  const initials     = user?.email?.charAt(0).toUpperCase() ?? '?'
  const displayName  = user?.email?.split('@')[0] ?? 'Guest'
  const usedChats    = sessions.length
  const totalChats   = 40

  const handleTemplateSelect = (prompt: string) => {
    onNewChat()
    // Small delay to let new session ID settle before sending
    setTimeout(() => onSelectTemplate(prompt), 80)
  }

  return (
    <aside className="relative flex h-full w-[220px] flex-shrink-0 flex-col bg-zinc-900 border-r border-zinc-800">

      {/* ── TOP: Logo + workspace switcher ────────────────────────── */}
      <div className="relative border-b border-zinc-800 px-3 py-3 space-y-2">
        <NavLink to="/" className="flex items-center px-1 py-1">
          <img src="/logo-dark.svg" alt="Product Path" className="h-6 select-none" />
        </NavLink>

        <button
          onClick={() => { setWorkspaceCardOpen(o => !o); setAccountMenuOpen(false) }}
          className="flex w-full items-center gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-zinc-800"
        >
          <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-indigo-600 text-[10px] font-bold text-white select-none">
            {initials}
          </div>
          <span className="flex-1 truncate text-left text-[13px] font-medium text-zinc-300">
            Personal account
          </span>
          <span className={`text-zinc-500 transition-transform duration-200 ${workspaceCardOpen ? 'rotate-180' : ''}`}>
            {icons.chevronDown}
          </span>
        </button>

        {workspaceCardOpen && (
          <WorkspaceCard
            user={user}
            onClose={() => setWorkspaceCardOpen(false)}
            onNavigate={navigate}
          />
        )}
      </div>

      {/* ── NEW CHAT BUTTON ───────────────────────────────────────── */}
      <div className="px-3 pt-3 pb-2">
        <button
          onClick={onNewChat}
          disabled={isStreaming}
          className="w-full flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[13px] font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {icons.plus}
          New chat
        </button>
      </div>

      {/* ── SCROLLABLE BODY ───────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto flex flex-col min-h-0">

        {/* ── TEMPLATES ─────────────────────────────────────────── */}
        <div className="px-2 border-b border-zinc-800 pb-3">
          <SectionHeader label="Templates" />
          <div className="space-y-1 mt-0.5">
            {TEMPLATE_GROUPS.map(group => (
              <TemplateGroup
                key={group.label}
                label={group.label}
                color={group.color}
                items={group.items}
                onSelect={handleTemplateSelect}
                isStreaming={isStreaming}
              />
            ))}
          </div>
        </div>

        {/* ── CHATS LIST ────────────────────────────────────────── */}
        <div className="flex flex-col flex-1 min-h-0 px-2">
          <SectionHeader
            label="Recent chats"
            action={
              <button
                onClick={onNewChat}
                disabled={isStreaming}
                title="New chat"
                className="text-zinc-500 hover:text-zinc-300 transition-colors disabled:opacity-40"
              >
                {icons.edit}
              </button>
            }
          />

          <div className="flex-1 overflow-y-auto space-y-0.5 pb-2">
            {sessions.length === 0 ? (
              <p className="px-2.5 py-2 text-xs text-zinc-600 italic">No chats yet</p>
            ) : (
              sessions.map(session => (
                <div key={session.id} className="group relative">
                  <button
                    onClick={() => onSelectSession(session.id)}
                    className={[
                      'w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[12px] transition-colors',
                      session.id === currentSessionId
                        ? 'bg-zinc-700/70 text-zinc-100'
                        : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100',
                    ].join(' ')}
                  >
                    <span className="truncate flex-1 pr-5">{session.title}</span>
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); onDeleteSession(session.id) }}
                    title="Delete chat"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 hidden rounded-md p-1 text-zinc-500 hover:bg-red-900/50 hover:text-red-400 group-hover:flex transition-colors"
                  >
                    {icons.trash}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── USAGE BAR ─────────────────────────────────────────── */}
        <div className="border-t border-zinc-800 px-3 py-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-zinc-500">
              {usedChats} of {totalChats} free chats
            </span>
            <button
              onClick={() => navigate('/app/settings/billing')}
              className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Upgrade
            </button>
          </div>
          <div className="h-1 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all"
              style={{ width: `${Math.min((usedChats / totalChats) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── BOTTOM: Account menu ──────────────────────────────────── */}
      <div className="relative border-t border-zinc-800 px-3 py-3">
        <button
          onClick={() => { setAccountMenuOpen(o => !o); setWorkspaceCardOpen(false) }}
          className="flex w-full items-center gap-2.5 rounded-xl px-2 py-2 transition-colors hover:bg-zinc-800"
        >
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-indigo-500 text-xs font-bold text-white select-none">
            {initials}
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className="truncate text-[13px] font-semibold text-zinc-200">{displayName}</p>
            <p className="text-[10px] text-zinc-500">Free Trial</p>
          </div>
          <span className={`text-zinc-500 transition-transform duration-200 ${accountMenuOpen ? 'rotate-180' : ''}`}>
            {icons.chevronDown}
          </span>
        </button>

        {accountMenuOpen && (
          <AccountMenu onClose={() => setAccountMenuOpen(false)} />
        )}
      </div>

    </aside>
  )
}
