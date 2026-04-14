/**
 * ProductDropdown — mega-menu panel for the "Product" nav item.
 * All items are now fully linked via React Router.
 */

import { Link } from 'react-router-dom'

// ── Data ──────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    label: 'Write PRDs',
    desc: 'AI-powered product requirements',
    href: '/how-it-works',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
  },
  {
    label: 'Brainstorm Roadmaps',
    desc: 'Generate and explore product ideas',
    href: '/how-it-works',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3" />
      </svg>
    ),
  },
  {
    label: 'Product Coaching',
    desc: 'AI feedback on product decisions',
    href: '/how-ai-works',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
      </svg>
    ),
  },
  {
    label: 'Integrations',
    desc: 'Notion, Confluence, JIRA & more',
    href: '/pricing',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
      </svg>
    ),
  },
  {
    label: 'Team Collaboration',
    desc: 'Shared workspaces for your team',
    href: '/pricing',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
      </svg>
    ),
  },
  {
    label: 'How AI works',
    desc: 'The PM reasoning layer explained',
    href: '/how-ai-works',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
      </svg>
    ),
  },
]

const USE_CASES = [
  {
    label: 'Product Managers',
    href: '/use-cases/product-managers',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      </svg>
    ),
  },
  {
    label: 'Engineering Teams',
    href: '/use-cases/engineering',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
      </svg>
    ),
  },
  {
    label: 'Design Teams',
    href: '/use-cases/design',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
      </svg>
    ),
  },
  {
    label: 'Startups',
    href: '/use-cases/startups',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
      </svg>
    ),
  },
]

// ── Component ─────────────────────────────────────────────────────────────────

export default function ProductDropdown() {
  return (
    <div className="
      absolute left-1/2 top-full z-50
      mt-2 w-[640px] -translate-x-1/2
      rounded-2xl border border-white/[0.08]
      bg-zinc-900 shadow-2xl shadow-black/60
      overflow-hidden
    ">
      <div className="flex divide-x divide-white/[0.06]">

        {/* ── Left column: Features ──────────────────────────────────── */}
        <div className="flex-1 p-5">
          <p className="mb-3 px-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
            Features
          </p>

          <div className="space-y-0.5">
            {FEATURES.map(({ label, desc, href, icon }) => (
              <Link
                key={label}
                to={href}
                className="
                  group/item flex items-start gap-3
                  rounded-xl px-3 py-2.5
                  transition-colors duration-150
                  hover:bg-white/5
                "
              >
                <div className="
                  mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center
                  rounded-lg border border-white/[0.08] bg-zinc-800
                  text-zinc-500
                  transition-colors duration-150
                  group-hover/item:border-indigo-500/30
                  group-hover/item:bg-indigo-500/10
                  group-hover/item:text-indigo-400
                ">
                  {icon}
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-medium leading-tight text-zinc-200 transition-colors group-hover/item:text-white">
                    {label}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-zinc-500">
                    {desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Right column: Use Cases ────────────────────────────────── */}
        <div className="w-[200px] flex-shrink-0 p-5">
          <p className="mb-3 px-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
            Use Cases
          </p>

          <div className="space-y-0.5">
            {USE_CASES.map(({ label, href, icon }) => (
              <Link
                key={label}
                to={href}
                className="
                  group/case flex items-center gap-2.5
                  rounded-xl px-3 py-2.5
                  transition-colors duration-150
                  hover:bg-white/5
                "
              >
                <span className="flex-shrink-0 text-zinc-500 transition-colors group-hover/case:text-indigo-400">
                  {icon}
                </span>
                <span className="text-[13px] font-medium text-zinc-300 transition-colors group-hover/case:text-white">
                  {label}
                </span>
              </Link>
            ))}
          </div>

          {/* Mini CTA */}
          <div className="mt-6 mx-1 p-3 rounded-xl bg-indigo-500/8 border border-indigo-500/15">
            <p className="text-[11px] font-semibold text-indigo-300 mb-1">New to Product Path?</p>
            <p className="text-[11px] text-zinc-500 leading-relaxed mb-2.5">Start free — no credit card needed.</p>
            <Link
              to="/signup"
              className="block w-full text-center text-[11px] font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg transition-colors"
            >
              Get started free →
            </Link>
          </div>
        </div>

      </div>

      {/* ── Footer row ──────────────────────────────────────────────── */}
      <div className="flex items-center gap-6 border-t border-white/[0.06] bg-zinc-950/60 px-6 py-3">
        <Link
          to="/"
          onClick={() => {
            setTimeout(() => {
              document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
            }, 100)
          }}
          className="text-xs font-medium text-zinc-500 transition-colors hover:text-indigo-400"
        >
          Watch demo →
        </Link>
        <Link
          to="/enterprise"
          className="text-xs font-medium text-zinc-500 transition-colors hover:text-indigo-400"
        >
          Contact enterprise →
        </Link>
        <Link
          to="/pricing"
          className="ml-auto text-xs font-medium text-zinc-500 transition-colors hover:text-indigo-400"
        >
          View pricing →
        </Link>
      </div>
    </div>
  )
}
