import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

// ── Icons ─────────────────────────────────────────────────────────────────────
function Check({ faded }: { faded?: boolean }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
      className={`w-4 h-4 flex-shrink-0 ${faded ? 'text-zinc-600' : 'text-indigo-400'}`}>
      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
    </svg>
  )
}

function Cross() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-zinc-700 flex-shrink-0">
      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    </svg>
  )
}

function Dash() {
  return <span className="text-zinc-700 text-sm font-bold flex-shrink-0">—</span>
}

// ── FAQ accordion ─────────────────────────────────────────────────────────────
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-zinc-800 last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
      >
        <span className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
          {question}
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
          strokeWidth={2} stroke="currentColor"
          className={`w-4 h-4 flex-shrink-0 text-zinc-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && (
        <p className="pb-5 text-sm text-zinc-400 leading-relaxed -mt-1">{answer}</p>
      )}
    </div>
  )
}

// ── Comparison table data ─────────────────────────────────────────────────────
type Cell = true | false | string

const TABLE_SECTIONS: {
  heading: string
  rows: { label: string; free: Cell; pro: Cell; enterprise: Cell }[]
}[] = [
  {
    heading: 'Core features',
    rows: [
      { label: 'Monthly chats', free: '40', pro: 'Unlimited', enterprise: 'Unlimited' },
      { label: 'Chat history', free: true, pro: true, enterprise: true },
      { label: 'File uploads (CSV, JSON, TXT)', free: true, pro: true, enterprise: true },
      { label: 'Response speed', free: 'Standard', pro: 'Priority', enterprise: 'Priority' },
    ],
  },
  {
    heading: 'AI capabilities',
    rows: [
      { label: 'Core PM prompts (PRD, user stories, prioritization)', free: true, pro: true, enterprise: true },
      { label: 'Advanced frameworks (RICE, MoSCoW, JTBD, DACI, Kano)', free: false, pro: true, enterprise: true },
      { label: 'CPO-level gap analysis & coaching', free: false, pro: true, enterprise: true },
      { label: 'Custom AI persona & tone', free: false, pro: true, enterprise: true },
      { label: 'Bring your own LLM / API key', free: false, pro: false, enterprise: true },
    ],
  },
  {
    heading: 'Outputs & export',
    rows: [
      { label: 'Export to Notion', free: false, pro: true, enterprise: true },
      { label: 'Export to Confluence', free: false, pro: true, enterprise: true },
      { label: 'Export to JIRA', free: false, pro: true, enterprise: true },
      { label: 'PDF & Word download', free: false, pro: true, enterprise: true },
      { label: 'Custom templates', free: false, pro: false, enterprise: true },
    ],
  },
  {
    heading: 'Team & collaboration',
    rows: [
      { label: 'Seats included', free: '1', pro: 'Up to 5', enterprise: 'Unlimited' },
      { label: 'Shared workspace', free: false, pro: true, enterprise: true },
      { label: 'Role-based access control', free: false, pro: false, enterprise: true },
      { label: 'Org-wide context & memory', free: false, pro: false, enterprise: true },
    ],
  },
  {
    heading: 'Security & support',
    rows: [
      { label: 'Data never used for training', free: true, pro: true, enterprise: true },
      { label: 'SSO / SAML', free: false, pro: false, enterprise: true },
      { label: 'SOC 2 Type II', free: false, pro: false, enterprise: true },
      { label: 'Support', free: 'Community', pro: 'Email', enterprise: 'Dedicated' },
      { label: 'SLA', free: false, pro: false, enterprise: true },
    ],
  },
]

function TableCell({ value }: { value: Cell }) {
  if (value === true) return <div className="flex justify-center"><Check /></div>
  if (value === false) return <div className="flex justify-center"><Cross /></div>
  if (value === '—') return <div className="flex justify-center"><Dash /></div>
  return <p className="text-xs text-zinc-400 text-center">{value}</p>
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function PricingPage() {
  const [annual, setAnnual] = useState(false)

  const proMonthly = 19
  const proAnnual = 15

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-[40%] right-[0%] w-[400px] h-[400px] bg-violet-700/8 rounded-full blur-[120px]" />
      </div>

      <Navbar />

      <div className="relative z-10">

        {/* ── Hero ── */}
        <section className="max-w-3xl mx-auto px-6 pt-24 pb-14 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse flex-shrink-0" />
            Free to start — no credit card
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-white leading-tight mb-4">
            Simple pricing.<br />
            <span className="text-indigo-400">No surprises.</span>
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Start free, upgrade when you need more. Cancel anytime.
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-3 mt-10">
            <span className={`text-sm font-medium transition-colors ${!annual ? 'text-white' : 'text-zinc-500'}`}>Monthly</span>
            <button
              onClick={() => setAnnual(a => !a)}
              className={`relative w-11 h-6 rounded-full transition-colors ${annual ? 'bg-indigo-600' : 'bg-zinc-700'}`}
              aria-label="Toggle annual billing"
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${annual ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
            <span className={`text-sm font-medium transition-colors ${annual ? 'text-white' : 'text-zinc-500'}`}>
              Annual
            </span>
            {annual && (
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            )}
          </div>
        </section>

        {/* ── Plan cards ── */}
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* Free */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex flex-col">
              <div className="mb-6">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Free</p>
                <div className="flex items-end gap-1.5">
                  <span className="text-4xl font-bold text-white">$0</span>
                  <span className="text-zinc-500 text-sm mb-1.5">/ month</span>
                </div>
                <p className="text-xs text-zinc-500 mt-2">Perfect for getting started</p>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {[
                  '40 chats per month',
                  'Core PM prompts',
                  'File uploads (CSV, JSON, TXT)',
                  'Chat history',
                  'Standard response speed',
                  '1 seat',
                ].map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-400">
                    <Check faded />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                to="/signup"
                className="w-full text-center py-3 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Get started free
              </Link>
            </div>

            {/* Pro — highlighted */}
            <div className="relative bg-gradient-to-b from-indigo-950/70 to-zinc-900/80 border border-indigo-600/50 rounded-2xl p-8 flex flex-col shadow-[0_0_50px_rgba(99,102,241,0.12)] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/5 to-transparent pointer-events-none" />

              <div className="absolute top-4 right-4">
                <span className="text-xs font-semibold text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 px-2.5 py-1 rounded-full">
                  Most popular
                </span>
              </div>

              <div className="mb-6 relative">
                <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">Pro</p>
                <div className="flex items-end gap-1.5">
                  <span className="text-4xl font-bold text-white">
                    ${annual ? proAnnual : proMonthly}
                  </span>
                  <span className="text-zinc-400 text-sm mb-1.5">/ month</span>
                </div>
                {annual && (
                  <p className="text-xs text-emerald-400 mt-1">
                    Billed annually — ${proAnnual * 12}/yr
                  </p>
                )}
                {!annual && (
                  <p className="text-xs text-zinc-500 mt-2">Or ${proAnnual}/mo billed annually</p>
                )}
              </div>

              <ul className="space-y-3 flex-1 mb-8 relative">
                {[
                  'Unlimited chats',
                  'Priority response speed',
                  'Advanced PM frameworks & templates',
                  'CPO-level coaching & gap analysis',
                  'Export to Notion, Confluence, JIRA',
                  'Custom AI persona & tone',
                  'Up to 5 seats',
                  'Email support',
                ].map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-300">
                    <Check />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => alert("Pro plan coming soon — you'll be first to know when it launches!")}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors relative"
              >
                Upgrade to Pro
              </button>
              <p className="text-center text-xs text-zinc-600 mt-3 relative">Cancel anytime · No contracts</p>
            </div>

            {/* Enterprise */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex flex-col">
              <div className="mb-6">
                <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Enterprise</p>
                <div className="flex items-end gap-1.5">
                  <span className="text-4xl font-bold text-white">Custom</span>
                </div>
                <p className="text-xs text-zinc-500 mt-2">For teams that ship world-class products</p>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {[
                  'Everything in Pro',
                  'Unlimited seats',
                  'SSO / SAML',
                  'SOC 2 Type II',
                  'Custom AI models (BYO LLM)',
                  'Org-wide context & memory',
                  'Custom templates',
                  'Dedicated onboarding & support',
                  'SLA',
                ].map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-400">
                    <Check faded />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                to="/enterprise"
                className="w-full text-center py-3 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Contact us
              </Link>
            </div>

          </div>
        </section>

        {/* ── Comparison table ── */}
        <section className="max-w-5xl mx-auto px-6 pb-28">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">Compare plans</p>
            <h2 className="text-3xl font-bold text-white">Everything side by side</h2>
            <p className="mt-3 text-zinc-400 text-sm">Exactly what you get on each plan — no asterisks.</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">

            {/* Table header */}
            <div className="grid grid-cols-4 border-b border-zinc-800 sticky top-[54px] bg-zinc-900 z-10">
              <div className="px-6 py-4" />
              {['Free', 'Pro', 'Enterprise'].map((plan, i) => (
                <div key={plan} className={`px-4 py-4 text-center border-l ${i === 1 ? 'border-indigo-500/20 bg-indigo-500/5' : 'border-zinc-800'}`}>
                  <p className={`text-xs font-bold uppercase tracking-wider ${i === 1 ? 'text-indigo-400' : 'text-zinc-500'}`}>{plan}</p>
                </div>
              ))}
            </div>

            {/* Sections */}
            {TABLE_SECTIONS.map((section, si) => (
              <div key={section.heading}>
                {/* Section heading */}
                <div className="grid grid-cols-4 bg-zinc-950/60 border-b border-zinc-800/60">
                  <div className="col-span-4 px-6 py-3">
                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{section.heading}</p>
                  </div>
                </div>

                {/* Rows */}
                {section.rows.map((row, ri) => (
                  <div
                    key={row.label}
                    className={`grid grid-cols-4 ${ri < section.rows.length - 1 || si < TABLE_SECTIONS.length - 1 ? 'border-b border-zinc-800/40' : ''} hover:bg-zinc-800/20 transition-colors`}
                  >
                    <div className="px-6 py-3.5 flex items-center">
                      <p className="text-sm text-zinc-300">{row.label}</p>
                    </div>
                    <div className="px-4 py-3.5 border-l border-zinc-800 flex items-center justify-center">
                      <TableCell value={row.free} />
                    </div>
                    <div className="px-4 py-3.5 border-l border-indigo-500/20 bg-indigo-500/[0.03] flex items-center justify-center">
                      <TableCell value={row.pro} />
                    </div>
                    <div className="px-4 py-3.5 border-l border-zinc-800 flex items-center justify-center">
                      <TableCell value={row.enterprise} />
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {/* CTA row */}
            <div className="grid grid-cols-4 border-t border-zinc-800 bg-zinc-950/40">
              <div className="px-6 py-5" />
              <div className="px-4 py-5 border-l border-zinc-800 flex items-center justify-center">
                <Link to="/signup" className="text-xs font-semibold text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 px-3 py-1.5 rounded-lg transition-colors">
                  Get started
                </Link>
              </div>
              <div className="px-4 py-5 border-l border-indigo-500/20 bg-indigo-500/[0.03] flex items-center justify-center">
                <button
                  onClick={() => alert("Pro plan coming soon!")}
                  className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Upgrade
                </button>
              </div>
              <div className="px-4 py-5 border-l border-zinc-800 flex items-center justify-center">
                <Link to="/enterprise" className="text-xs font-semibold text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 px-3 py-1.5 rounded-lg transition-colors">
                  Contact us
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="max-w-3xl mx-auto px-6 pb-28">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-3xl font-bold text-white">Common questions</h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-8">
            {[
              {
                question: 'What counts as a chat?',
                answer: 'Each time you send a message and receive a response counts as one chat. Follow-up messages within the same conversation thread also count. Starting a brand new conversation resets to a new chat.',
              },
              {
                question: 'Can I switch plans anytime?',
                answer: 'Yes. You can upgrade, downgrade, or cancel at any time. If you upgrade mid-cycle you get immediate access to Pro features. If you downgrade, you keep Pro access until the end of your billing period.',
              },
              {
                question: 'Is there a free trial for Pro?',
                answer: 'The Free plan is effectively a trial — it gives you full access to the core experience. When Pro launches, we plan to offer a 14-day trial so you can explore advanced features before committing.',
              },
              {
                question: 'Do unused chats roll over?',
                answer: "No — the 40 free chats reset at the start of each calendar month. They don't accumulate. If you need more, upgrading to Pro gives you unlimited chats with no caps.",
              },
              {
                question: 'What payment methods do you accept?',
                answer: 'We accept all major credit and debit cards (Visa, Mastercard, Amex) via Stripe. For Enterprise plans, we also support invoicing and bank transfer.',
              },
              {
                question: 'Is my data safe?',
                answer: 'Yes. Your conversations and documents are never used to train AI models. We do not share your data with third parties. Enterprise plans include additional security controls including SSO and SOC 2 Type II compliance.',
              },
            ].map(faq => (
              <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section className="max-w-4xl mx-auto px-6 pb-24">
          <div className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-indigo-950/40 to-zinc-900/40 p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-3">Not sure which plan is right?</h2>
            <p className="text-zinc-400 text-sm mb-8 max-w-lg mx-auto">
              Start with the Free plan — no commitment, no credit card. Most PMs find it tells them everything they need to know.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
                className="w-full sm:w-auto px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Start free — no credit card
              </Link>
              <Link
                to="/enterprise"
                className="w-full sm:w-auto px-7 py-3.5 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-sm font-medium rounded-xl transition-colors"
              >
                Talk to us about Enterprise
              </Link>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="border-t border-zinc-800 max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <img src="/logo-dark.svg" alt="Product Path" className="h-6 select-none" />
            <p className="text-xs text-zinc-600">© 2026 Product Path. All rights reserved.</p>
            <div className="flex gap-5">
              <a href="#" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Privacy</a>
              <a href="#" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Terms</a>
            </div>
          </div>
        </footer>

      </div>
    </div>
  )
}
