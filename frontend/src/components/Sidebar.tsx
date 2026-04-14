import { useState, useRef, useEffect, type KeyboardEvent } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import SidebarItem from './SidebarItem'
import AccountMenu from './AccountMenu'

// ── Types ─────────────────────────────────────────────────────────────────────

interface ChatSession {
  id: string
  title: string
  updatedAt: string
}

interface Project {
  id: string
  name: string
  createdAt: string
}

interface Props {
  currentSessionId: string
  sessions: ChatSession[]
  onSelectSession: (id: string) => void
  onNewChat: () => void
  onDeleteSession: (id: string) => void
  isStreaming: boolean
}

// ── Project storage ───────────────────────────────────────────────────────────

const PROJECTS_KEY = 'chatpm_projects'

function loadProjects(): Project[] {
  try { return JSON.parse(localStorage.getItem(PROJECTS_KEY) || '[]') }
  catch { return [] }
}

function saveProjects(projects: Project[]) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects))
}

// ── Icons ─────────────────────────────────────────────────────────────────────

const icons = {
  chat: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
    </svg>
  ),
  document: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
  ),
  product: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3" />
    </svg>
  ),
  template: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25" />
    </svg>
  ),
  folder: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
    </svg>
  ),
  plus: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
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
  isStreaming,
}: Props) {
  const { user }   = useAuth()
  const navigate   = useNavigate()

  const [accountMenuOpen,   setAccountMenuOpen]   = useState(false)
  const [workspaceCardOpen, setWorkspaceCardOpen] = useState(false)
  const [projects,          setProjects]          = useState<Project[]>(loadProjects)
  const [creatingProject,   setCreatingProject]   = useState(false)
  const [projectName,       setProjectName]       = useState('')
  const projectInputRef = useRef<HTMLInputElement>(null)

  const initials     = user?.email?.charAt(0).toUpperCase() ?? '?'
  const displayName  = user?.email?.split('@')[0] ?? 'Guest'
  const usedChats    = sessions.length
  const totalChats   = 40

  // Focus the project input when it appears
  useEffect(() => {
    if (creatingProject) projectInputRef.current?.focus()
  }, [creatingProject])

  const openCreateProject = () => {
    setProjectName('')
    setCreatingProject(true)
  }

  const confirmCreateProject = () => {
    const name = projectName.trim()
    if (!name) { setCreatingProject(false); return }
    const project: Project = { id: crypto.randomUUID(), name, createdAt: new Date().toISOString() }
    const updated = [project, ...projects]
    setProjects(updated)
    saveProjects(updated)
    setCreatingProject(false)
    setProjectName('')
    navigate(`/app/projects/${project.id}`)
  }

  const deleteProject = (id: string) => {
    const updated = projects.filter(p => p.id !== id)
    setProjects(updated)
    saveProjects(updated)
  }

  const handleProjectKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') confirmCreateProject()
    if (e.key === 'Escape') { setCreatingProject(false); setProjectName('') }
  }

  return (
    <aside className="relative flex h-full w-[220px] flex-shrink-0 flex-col bg-zinc-900 border-r border-zinc-800">

      {/* ── TOP: Logo + workspace switcher ────────────────────────── */}
      <div className="relative border-b border-zinc-800 px-3 py-3 space-y-2">
        <NavLink to="/" className="flex items-center px-1 py-1">
          <img src="/logo-dark.svg" alt="Product Path" className="h-6 select-none" />
        </NavLink>

        {/* Workspace switcher button */}
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

      {/* ── PRIMARY NAV ───────────────────────────────────────────── */}
      <div className="border-b border-zinc-800 px-2 py-2 space-y-0.5">
        <SidebarItem to="/app/chat"      icon={icons.chat}     label="Chats"     end />
        <SidebarItem to="/app/documents" icon={icons.document} label="Documents" />
        <SidebarItem to="/app/products"  icon={icons.product}  label="Products"  />
        <SidebarItem to="/app/templates" icon={icons.template} label="Templates" />
      </div>

      {/* ── PROJECTS ─────────────────────────────────────────────── */}
      <div className="border-b border-zinc-800 px-2 pb-2">
        <SectionHeader
          label="Projects"
          action={
            <button
              onClick={openCreateProject}
              title="New project"
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {icons.plus}
            </button>
          }
        />

        {/* Inline project name input */}
        {creatingProject && (
          <div className="flex items-center gap-1 px-1 mb-1">
            <input
              ref={projectInputRef}
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
              onKeyDown={handleProjectKeyDown}
              onBlur={confirmCreateProject}
              placeholder="Project name…"
              className="flex-1 rounded-lg bg-zinc-800 border border-indigo-500 px-2.5 py-1.5 text-[12px] text-zinc-100 placeholder-zinc-500 focus:outline-none"
            />
          </div>
        )}

        {/* Project list */}
        {projects.map(p => (
          <div key={p.id} className="group relative">
            <button
              onClick={() => navigate(`/app/projects/${p.id}`)}
              className="w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200 truncate"
            >
              <span className="flex-shrink-0 text-zinc-600">{icons.folder}</span>
              <span className="truncate flex-1">{p.name}</span>
            </button>
            <button
              onClick={() => deleteProject(p.id)}
              title="Delete project"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 hidden rounded-md p-1 text-zinc-500 hover:bg-red-900/50 hover:text-red-400 group-hover:flex transition-colors"
            >
              {icons.trash}
            </button>
          </div>
        ))}

        {/* Create project button — only when no input open */}
        {!creatingProject && (
          <button
            onClick={openCreateProject}
            className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
          >
            {icons.plus}
            <span>Create a project</span>
          </button>
        )}
      </div>

      {/* ── CHATS LIST ────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col min-h-0 px-2">
        <SectionHeader
          label="Chats"
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

        {/* Session list */}
        <div className="flex-1 overflow-y-auto space-y-0.5 pb-2">
          {sessions.length === 0 ? (
            <p className="px-2.5 py-2 text-xs text-zinc-600 italic">No chats yet</p>
          ) : (
            sessions.map(session => (
              <div key={session.id} className="group relative">
                <button
                  onClick={() => onSelectSession(session.id)}
                  className={[
                    'w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors',
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

        {/* Usage bar */}
        <div className="border-t border-zinc-800 py-3 space-y-2">
          <div className="flex items-center justify-between px-1">
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

      {/* ── BOTTOM: Profile + account menu ───────────────────────── */}
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
