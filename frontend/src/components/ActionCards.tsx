import type { ReactNode } from 'react'

interface Card {
  icon: ReactNode
  label: string
  description: string
  prompt: string
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
    label: 'Write a PRD',
    description: 'Turn your idea into a structured product spec',
    prompt: "I want to write a PRD. Before we start, ask me the 2–3 questions you need answered to make this genuinely useful — not generic.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
      </svg>
    ),
    label: 'Review my document',
    description: "Get CPO-level feedback on what you've written",
    prompt: "I have a product document I'd like you to review. What should I share with you so you can give me the most useful feedback?",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3" />
      </svg>
    ),
    label: 'Help me prioritize',
    description: 'Cut through your backlog with clear tradeoffs',
    prompt: "I need help prioritizing my roadmap or backlog. I'll describe what I'm working with — help me think through the tradeoffs, not just rank items.",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
    label: 'Prepare for a stakeholder meeting',
    description: 'Sharpen your narrative before you present',
    prompt: "I have a stakeholder meeting coming up and I want to prepare. Ask me what I'm presenting and who will be in the room — then help me pressure-test my narrative.",
  },
]

export default function ActionCards({ onSend, isStreaming }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 select-none">

      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-semibold text-zinc-100 mb-2">
          What are you working on?
        </h1>
        <p className="text-sm text-zinc-500 max-w-sm">
          Pick a starting point or describe your challenge directly below.
        </p>
      </div>

      {/* Cards — 2×2 grid on wider screens */}
      <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CARDS.map(card => (
          <button
            key={card.label}
            onClick={() => onSend(card.prompt, 'pm')}
            disabled={isStreaming}
            className="flex flex-col gap-3 p-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-600 transition-all text-left group disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <div className="w-8 h-8 rounded-lg bg-zinc-800 group-hover:bg-indigo-600/20 border border-zinc-700 group-hover:border-indigo-500/40 flex items-center justify-center text-zinc-400 group-hover:text-indigo-400 transition-all">
              {card.icon}
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-200 group-hover:text-white transition-colors">{card.label}</p>
              <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{card.description}</p>
            </div>
          </button>
        ))}
      </div>

    </div>
  )
}
