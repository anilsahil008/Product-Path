import type { ReactNode } from 'react'

interface Props {
  title: string
  description: string
  icon: ReactNode
}

export default function PlaceholderPage({ title, description, icon }: Props) {
  return (
    <div className="flex flex-col flex-1 h-full bg-zinc-950 items-center justify-center select-none">
      <div className="text-zinc-700 mb-4">{icon}</div>
      <h2 className="text-xl font-semibold text-zinc-300 mb-2">{title}</h2>
      <p className="text-sm text-zinc-500">{description}</p>
    </div>
  )
}
