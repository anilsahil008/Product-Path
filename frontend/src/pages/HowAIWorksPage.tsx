import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

// ── Reusable check / x icons ─────────────────────────────────────────────────
function Check() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-indigo-400 flex-shrink-0">
      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
    </svg>
  )
}

function Cross() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-zinc-700 flex-shrink-0">
      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    </svg>
  )
}

// ── FAQ accordion item ────────────────────────────────────────────────────────
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
        <svg
          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
          strokeWidth={2} stroke="currentColor"
          className={`w-4 h-4 flex-shrink-0 text-zinc-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {open && (
        <p className="pb-5 text-sm text-zinc-400 leading-relaxed -mt-1">
          {answer}
        </p>
      )}
    </div>
  )
}

// ── Comparison rows ───────────────────────────────────────────────────────────
const COMPARISON = [
  {
    label: 'Understands PM frameworks (RICE, MoSCoW, JTBD, OKRs)',
    generic: false,
    pp: true,
  },
  {
    label: 'Structured outputs (PRD, user stories, one-pagers)',
    generic: false,
    pp: true,
  },
  {
    label: 'PM-level coaching and gap analysis',
    generic: false,
    pp: true,
  },
  {
    label: 'Context-aware within your session',
    generic: false,
    pp: true,
  },
  {
    label: 'Your data never used to train models',
    generic: false,
    pp: true,
  },
  {
    label: 'Real-time streaming responses',
    generic: true,
    pp: true,
  },
  {
    label: 'Requires prompt engineering know-how',
    generic: true,
    pp: false,
  },
]

// ── Four pillars ──────────────────────────────────────────────────────────────
const PILLARS = [
  {
    icon: '🧠',
    title: 'PM-native reasoning',
    desc: 'Our prompting layer deeply understands product methodology — RICE, MoSCoW, Jobs-to-be-Done, OKRs, DACI, and more. Every output is structured like a senior PM wrote it, not a generic language model.',
  },
  {
    icon: '🔒',
    title: 'Your data stays yours',
    desc: 'Your conversations and documents are never used to train AI models. What you share with Product Path is private to you — we don\'t share it with third parties or use it to improve our models.',
  },
  {
    icon: '🎯',
    title: 'Context-aware sessions',
    desc: 'Product Path remembers what you told it earlier in the conversation — your product domain, constraints, team context, and goals — so every response builds on what came before.',
  },
  {
    icon: '⚡',
    title: 'Frontier model speed',
    desc: 'We use the latest large language models with real-time token streaming. Responses start appearing instantly — no waiting for a full answer to generate before you see anything.',
  },
]

// ── FAQ data ──────────────────────────────────────────────────────────────────
const FAQS = [
  {
    question: 'Which AI model does Product Path use?',
    answer: 'Product Path is built on top of frontier large language models — the same class of models powering the leading AI products. We layer our own PM-specific reasoning on top so outputs are always structured for product work, not generic text generation.',
  },
  {
    question: 'How is this different from just using ChatGPT?',
    answer: 'ChatGPT is a general-purpose tool. You have to know the right prompts to get product-quality output, and even then the results often lack the structure a real PM needs. Product Path has PM methodology baked in — it automatically applies the right frameworks, asks the right clarifying questions, and outputs docs that are ready for review.',
  },
  {
    question: 'Is my data used to train the AI?',
    answer: 'No. Your conversations, documents, and uploaded files are never used to train AI models — ours or anyone else\'s. Your work stays private and is only ever used to generate responses in your session.',
  },
  {
    question: 'Can I use my own API key?',
    answer: 'Not currently, but this is on our roadmap for Pro and Enterprise plans. Today, all AI compute is handled on our end so you don\'t need to configure anything.',
  },
  {
    question: 'What happens to my data if I cancel?',
    answer: 'Your data remains accessible as long as you have an active account. If you cancel, we retain your data for 30 days so you can export anything you need, then it\'s permanently deleted.',
  },
]

// ── Page ──────────────────────────────────────────────────────────────────────
export default function HowAIWorksPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* ── Background blobs ── */}
      <div className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-[30%] right-[0%] w-[400px] h-[400px] bg-violet-700/8 rounded-full blur-[120px]" />
      </div>

      <Navbar />

      <div className="relative z-10">

        {/* ── Hero ── */}
        <section className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse flex-shrink-0" />
            Under the hood
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-white leading-[1.05] mb-6">
            Not just another<br />
            <span className="text-indigo-400">AI wrapper.</span>
          </h1>

          <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10">
            Product Path is a PM-specific reasoning layer built on top of frontier AI models. It understands product methodology, protects your data, and produces output that's actually usable — not just impressive-looking text.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Try it free
            </Link>
            <Link
              to="/"
              className="w-full sm:w-auto px-7 py-3.5 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-sm font-medium rounded-xl transition-colors"
            >
              See all features
            </Link>
          </div>
        </section>

        {/* ── The Stack ── */}
        <section className="max-w-3xl mx-auto px-6 pb-28">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">The stack</p>
            <h2 className="text-3xl font-bold text-white">What powers Product Path</h2>
            <p className="mt-3 text-zinc-400 text-sm max-w-lg mx-auto">
              Three layers work together to turn your rough idea into a senior-PM-quality output.
            </p>
          </div>

          <div className="space-y-2">
            {/* Layer 1 — Your input */}
            <div className="rounded-2xl border border-zinc-700 bg-zinc-900/60 px-7 py-5 flex items-center gap-5">
              <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-lg flex-shrink-0">
                💬
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-200">Your input</p>
                <p className="text-xs text-zinc-500 mt-0.5">Rough idea, meeting notes, uploaded doc, or a quick question — anything goes</p>
              </div>
              <div className="ml-auto text-xs font-medium text-zinc-600 bg-zinc-800 px-2.5 py-1 rounded-full flex-shrink-0">
                Layer 1
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center py-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-zinc-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
              </svg>
            </div>

            {/* Layer 2 — PM reasoning (highlighted) */}
            <div className="rounded-2xl border border-indigo-500/40 bg-indigo-500/8 px-7 py-5 flex items-center gap-5 shadow-[0_0_40px_rgba(99,102,241,0.08)]">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-lg flex-shrink-0">
                🧠
              </div>
              <div>
                <p className="text-sm font-semibold text-indigo-200">PM reasoning layer</p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Applies frameworks (RICE, MoSCoW, JTBD), understands your context, structures the output, coaches on gaps
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {['RICE', 'MoSCoW', 'JTBD', 'OKRs', 'DACI', 'Kano', 'CIRCLES'].map(tag => (
                    <span key={tag} className="text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="ml-auto text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full flex-shrink-0">
                Layer 2
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center py-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-zinc-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
              </svg>
            </div>

            {/* Layer 3 — Frontier model */}
            <div className="rounded-2xl border border-zinc-700 bg-zinc-900/60 px-7 py-5 flex items-center gap-5">
              <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-lg flex-shrink-0">
                ⚡
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-200">Frontier AI model</p>
                <p className="text-xs text-zinc-500 mt-0.5">Latest-generation large language model — fast, accurate, streaming in real time</p>
              </div>
              <div className="ml-auto text-xs font-medium text-zinc-600 bg-zinc-800 px-2.5 py-1 rounded-full flex-shrink-0">
                Layer 3
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center py-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-zinc-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
              </svg>
            </div>

            {/* Output */}
            <div className="rounded-2xl border border-zinc-700 bg-zinc-900/40 px-7 py-5 flex items-center gap-5">
              <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-lg flex-shrink-0">
                📄
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-200">Senior-PM-quality output</p>
                <p className="text-xs text-zinc-500 mt-0.5">Structured PRD, user stories, priorities, coaching — ready for your team</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Four pillars ── */}
        <section className="max-w-5xl mx-auto px-6 pb-28">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">Core principles</p>
            <h2 className="text-3xl font-bold text-white">Built to earn your trust</h2>
            <p className="mt-3 text-zinc-400 text-sm">Four things that make Product Path different from every other AI tool.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {PILLARS.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-7 hover:border-zinc-700 transition-colors"
              >
                <div className="w-11 h-11 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xl mb-5">
                  {icon}
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Comparison table ── */}
        <section className="max-w-3xl mx-auto px-6 pb-28">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">Comparison</p>
            <h2 className="text-3xl font-bold text-white">Product Path vs Generic AI</h2>
            <p className="mt-3 text-zinc-400 text-sm">Why PMs switch from ChatGPT to Product Path</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-3 border-b border-zinc-800">
              <div className="px-6 py-4" />
              <div className="px-6 py-4 border-l border-zinc-800 text-center">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Generic AI</p>
              </div>
              <div className="px-6 py-4 border-l border-indigo-500/20 text-center bg-indigo-500/5">
                <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Product Path</p>
              </div>
            </div>

            {/* Rows */}
            {COMPARISON.map(({ label, generic, pp }, i) => (
              <div
                key={label}
                className={`grid grid-cols-3 ${i < COMPARISON.length - 1 ? 'border-b border-zinc-800/60' : ''}`}
              >
                <div className="px-6 py-4 flex items-center">
                  <p className="text-sm text-zinc-300 leading-snug">{label}</p>
                </div>
                <div className="px-6 py-4 border-l border-zinc-800 flex items-center justify-center">
                  {generic ? <Check /> : <Cross />}
                </div>
                <div className="px-6 py-4 border-l border-indigo-500/20 flex items-center justify-center bg-indigo-500/[0.03]">
                  {pp ? <Check /> : <Cross />}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="max-w-3xl mx-auto px-6 pb-28">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-3xl font-bold text-white">Common questions</h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-8">
            {FAQS.map(({ question, answer }) => (
              <FAQItem key={question} question={question} answer={answer} />
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="max-w-4xl mx-auto px-6 pb-24 text-center">
          <div className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-indigo-950/40 to-zinc-900/40 p-14">
            <h2 className="text-4xl font-bold text-white mb-4">See the AI in action.</h2>
            <p className="text-zinc-400 text-sm mb-8 max-w-xl mx-auto">
              The best way to understand how Product Path works is to use it. Start free — no credit card, no setup.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Start building free
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-xs text-zinc-600">
              <span>Free to start</span>
              <span>·</span>
              <span>No credit card</span>
              <span>·</span>
              <span>Cancel anytime</span>
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
