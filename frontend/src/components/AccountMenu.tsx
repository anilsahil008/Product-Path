import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface Props {
  onClose: () => void
}

const MENU_ITEMS = [
  { label: 'Profile',      to: '/app/settings/profile' },
  { label: 'Templates',    to: '/app/templates' },
  { label: 'Integrations', to: '/app/settings/integrations' },
  { label: 'Billing',      to: '/app/settings/billing' },
  { label: 'Team',         to: '/app/settings/team' },
]

export default function AccountMenu({ onClose }: Props) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = () => {
    onClose()
    logout()
    navigate('/')
  }

  return (
    <>
      {/* Backdrop — click outside closes */}
      <div className="fixed inset-0 z-10" onClick={onClose} />

      {/* Panel */}
      <div className="absolute bottom-full left-0 right-0 z-20 mb-1 overflow-hidden rounded-xl border border-zinc-700/60 bg-zinc-900 shadow-2xl shadow-black/60">

        {/* Header */}
        <div className="border-b border-zinc-800 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
            My Account
          </p>
          <p className="mt-1 truncate text-xs font-medium text-zinc-300">
            {user?.email ?? '—'}
          </p>
          <span className="mt-1 inline-block rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold text-zinc-400">
            Free plan
          </span>
        </div>

        {/* Nav items */}
        <div className="p-1.5 space-y-0.5">
          {MENU_ITEMS.map(({ label, to }) => (
            <button
              key={label}
              onClick={() => { onClose(); navigate(to) }}
              className="w-full rounded-lg px-3 py-2 text-left text-[13px] text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
            >
              {label}
            </button>
          ))}
        </div>

        {/* Sign out */}
        <div className="border-t border-zinc-800 p-1.5">
          <button
            onClick={handleSignOut}
            className="w-full rounded-lg px-3 py-2 text-left text-[13px] font-medium text-red-400 transition-colors hover:bg-red-950/40 hover:text-red-300"
          >
            Sign out
          </button>
        </div>

      </div>
    </>
  )
}
