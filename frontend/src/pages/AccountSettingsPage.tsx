import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function getInitials(email: string): string {
  const name = email.split('@')[0]
  const parts = name.split(/[._-]/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

function getDisplayName(email: string): string {
  const name = email.split('@')[0]
  return name
    .split(/[._-]/)
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ')
}

export default function AccountSettingsPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const initials = user ? getInitials(user.email) : 'U'
  const defaultName = user ? getDisplayName(user.email) : ''

  const [displayName, setDisplayName] = useState(defaultName)
  const [savedName, setSavedName] = useState(defaultName)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleSave = async () => {
    if (!displayName.trim() || displayName === savedName) return
    setIsSaving(true)
    // Simulate save delay — wire to backend when ready
    await new Promise(r => setTimeout(r, 600))
    setSavedName(displayName.trim())
    setIsSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-full bg-zinc-950 text-zinc-100">

      {/* Top bar */}
      <header className="flex items-center gap-3 px-6 py-4 border-b border-zinc-800 bg-zinc-950">
        <button
          onClick={() => navigate('/app/chat')}
          className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Back to chat
        </button>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">

        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Account settings</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage your profile and preferences</p>
        </div>

        {/* Profile card */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
          <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Profile</h2>

          {/* Avatar + email */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-lg font-bold flex-shrink-0 select-none">
              {initials}
            </div>
            <div>
              <p className="text-base font-medium text-zinc-100">{savedName}</p>
              <p className="text-sm text-zinc-500">{user?.email}</p>
            </div>
          </div>

          {/* Display name */}
          <div className="space-y-1.5">
            <label className="text-sm text-zinc-400 font-medium">Display name</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                placeholder="Your name"
              />
              <button
                onClick={handleSave}
                disabled={isSaving || !displayName.trim() || displayName.trim() === savedName}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
              >
                {isSaving ? 'Saving…' : saved ? 'Saved ✓' : 'Save'}
              </button>
            </div>
          </div>

          {/* Email (read-only) */}
          <div className="space-y-1.5">
            <label className="text-sm text-zinc-400 font-medium">Email</label>
            <input
              type="email"
              value={user?.email ?? ''}
              readOnly
              className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-lg px-3 py-2 text-sm text-zinc-500 cursor-not-allowed"
            />
            <p className="text-xs text-zinc-600">Email cannot be changed at this time</p>
          </div>
        </section>

        {/* Plan card */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Plan</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-indigo-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-100">Free plan</p>
                <p className="text-xs text-zinc-500">40 chats included</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/app/settings/billing')}
              className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              Upgrade →
            </button>
          </div>
        </section>

        {/* Session */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Session</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-200">Sign out of Product Path</p>
              <p className="text-xs text-zinc-500 mt-0.5">You'll be redirected to the login page</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-sm font-medium rounded-lg transition-colors"
            >
              Sign out
            </button>
          </div>
        </section>

        {/* Danger zone */}
        <section className="bg-zinc-900 border border-red-900/40 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-medium text-red-500/80 uppercase tracking-wider">Danger zone</h2>
          {!showDeleteConfirm ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-200">Delete account</p>
                <p className="text-xs text-zinc-500 mt-0.5">Permanently delete your account and all data. Cannot be undone.</p>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 border border-red-800 text-red-400 hover:bg-red-900/20 text-sm font-medium rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-red-400 font-medium">Are you sure? This cannot be undone.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 text-sm font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
                  onClick={() => {
                    // Wire to backend delete endpoint when ready
                    logout()
                    navigate('/login')
                  }}
                >
                  Yes, delete my account
                </button>
              </div>
            </div>
          )}
        </section>

      </div>
    </div>
  )
}
