import type { ReactNode } from 'react'

interface Card {
  icon: ReactNode
  label: string
  description: string
  prompt: string
  badge?: string
}

interface Props {
  onSend: (text: string, mode: string) => void
  isStreaming: boolean
}

const CARDS: Card[] = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
    label: 'Help me write a document',
    description: 'Create a new PRD or other document',
    prompt: "I need help writing a product requirements document. Let's start with understanding the problem I'm trying to solve.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
      </svg>
    ),
    label: 'Improve an existing document',
    description: 'Get expert feedback on your writing',
    prompt: "I have an existing product document I'd like you to review and improve. Please ask me to share it.",
    badge: 'Pro',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
      </svg>
    ),
    label: 'Brainstorm new features',
    description: 'Generate ideas for your product roadmap',
    prompt: "Let's brainstorm new feature ideas for my product. I want to explore what would have the highest impact on users and the business.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
      </svg>
    ),
    label: 'Get feedback on my ideas',
    description: 'Receive insights on your product concepts',
    prompt: "I have some product ideas I'd like honest feedback on. What questions should I answer first to make the feedback useful?",
  },
]

export default function ActionCards({ onSend, isStreaming }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 select-none">
      <h1 className="text-3xl font-semibold text-zinc-100 mb-1 text-center">
        How can I{' '}
        <span className="text-indigo-400">help you</span>
        {' '}today?
      </h1>
      <p className="text-sm text-zinc-500 mb-10 text-center">
        Your AI-powered product thinking partner
      </p>

      <div className="w-full max-w-2xl space-y-2">
        {CARDS.map(card => (
          <button
            key={card.label}
            onClick={() => onSend(card.prompt, 'pm')}
            disabled={isStreaming}
            className="w-full flex items-center gap-4 px-5 py-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 transition-all text-left group disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-zinc-700 group-hover:bg-zinc-600 flex items-center justify-center text-zinc-400 group-hover:text-indigo-400 transition-colors">
              {card.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-zinc-200">{card.label}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{card.description}</p>
            </div>
            {card.badge && (
              <span className="flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                {card.badge}
              </span>
            )}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 flex-shrink-0 transition-colors">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  )
}
