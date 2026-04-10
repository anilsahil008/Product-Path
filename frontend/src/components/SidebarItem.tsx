import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

interface Props {
  to: string
  icon: ReactNode
  label: string
  end?: boolean          // pass `end` for exact-match active detection
  badge?: ReactNode
}

export default function SidebarItem({ to, icon, label, end = false, badge }: Props) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => [
        'group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors duration-100',
        isActive
          ? 'bg-zinc-700/70 text-zinc-100'
          : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100',
      ].join(' ')}
    >
      <span className="flex-shrink-0 opacity-70 group-[.active]:opacity-100">{icon}</span>
      <span className="flex-1 truncate font-medium leading-none">{label}</span>
      {badge}
    </NavLink>
  )
}
