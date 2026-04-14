import { useNavigate } from 'react-router-dom'

const FREE_CHAT_LIMIT = 40

// Count sessions from localStorage
function getSessionCount(): number {
  try {
    const sessions = JSON.parse(localStorage.getItem('chatpm_sessions') || '[]')
    return sessions.length
  } catch { return 0 }
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5">
      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
    </svg>
  )
}

const PRO_FEATURES = [
  'Unlimited chats',
  'Priority response speed',
  'Advanced PM frameworks & templates',
  'Document analysis (PDF, Word)',
  'Export to Notion, Confluence, JIRA',
  'Custom AI persona & tone',
  'Team workspace (up to 5 seats)',
  'Priority support',
]

const FREE_FEATURES = [
  '40 chats per month',
  'Core PM prompts (PRDs, user stories, prioritization)',
  'CSV & JSON file uploads',
  'Chat history',
  'Standard response speed',
]

export default function BillingPage() {
  const navigate = useNavigate()
  const sessionCount = getSessionCount()
  const usedPct = Math.min((sessionCount / FREE_CHAT_LIMIT) * 100, 100)
  const remaining = Math.max(FREE_CHAT_LIMIT - sessionCount, 0)

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
          <h1 className="text-xl font-semibold text-zinc-100">Billing & plan</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage your subscription and usage</p>
        </div>

        {/* Current plan usage */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-3">Current plan</h2>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-zinc-100">Free</span>
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-zinc-700 text-zinc-300">Active</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-zinc-100">$0</p>
              <p className="text-xs text-zinc-500">/ month</p>
            </div>
          </div>

          {/* Usage bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-zinc-500">
              <span>Chats used this month</span>
              <span>{sessionCount} / {FREE_CHAT_LIMIT}</span>
            </div>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${usedPct >= 80 ? 'bg-amber-500' : 'bg-indigo-500'}`}
                style={{ width: `${usedPct}%` }}
              />
            </div>
            <p className="text-xs text-zinc-600">
              {remaining > 0
                ? `${remaining} chats remaining`
                : 'Monthly limit reached — upgrade for unlimited access'}
            </p>
          </div>

          {/* Free features */}
          <div className="pt-2 border-t border-zinc-800 space-y-2">
            {FREE_FEATURES.map(f => (
              <div key={f} className="flex items-start gap-2">
                <CheckIcon />
                <span className="text-sm text-zinc-400">{f}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Pro plan upgrade card */}
        <section className="relative bg-gradient-to-br from-indigo-950/60 to-violet-950/40 border border-indigo-700/40 rounded-xl p-6 space-y-5 overflow-hidden">
          {/* Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-transparent pointer-events-none" />

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-semibold text-zinc-100">Pro</h2>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-600/30 text-indigo-300 border border-indigo-500/30">
                  Recommended
                </span>
              </div>
              <p className="text-sm text-zinc-400">For serious PMs who ship faster</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-zinc-100">$19</p>
              <p className="text-xs text-zinc-500">/ month</p>
            </div>
          </div>

          {/* Pro features */}
          <div className="space-y-2.5">
            {PRO_FEATURES.map(f => (
              <div key={f} className="flex items-start gap-2">
                <CheckIcon />
                <span className="text-sm text-zinc-300">{f}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              // Stripe checkout — wire when ready
              alert('Pro plan coming soon! We\'ll notify you when it\'s available.')
            }}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold rounded-lg text-sm transition-colors"
          >
            Upgrade to Pro
          </button>

          <p className="text-center text-xs text-zinc-600">
            Cancel anytime · No contracts · Billed monthly
          </p>
        </section>

        {/* FAQ */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
          <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Questions</h2>
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-zinc-200 font-medium">When will Pro be available?</p>
              <p className="text-zinc-500 mt-1">We're rolling out Pro in Q2 2026. Join the waitlist by upgrading above and you'll be first to know.</p>
            </div>
            <div className="pt-3 border-t border-zinc-800">
              <p className="text-zinc-200 font-medium">What happens when I hit 40 chats?</p>
              <p className="text-zinc-500 mt-1">Your chat access pauses until the next month or until you upgrade. Your existing history is always preserved.</p>
            </div>
            <div className="pt-3 border-t border-zinc-800">
              <p className="text-zinc-200 font-medium">Is my data private?</p>
              <p className="text-zinc-500 mt-1">Yes. Your conversations are never used to train models and are only accessible by you.</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
