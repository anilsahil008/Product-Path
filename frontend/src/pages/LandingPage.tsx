import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

// ── Stars ─────────────────────────────────────────────────────────────────────
function Stars() {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

// ── Quote card ────────────────────────────────────────────────────────────────
function Quote({ text, name, role, company }: { text: string; name: string; role: string; company: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4 hover:border-zinc-700 transition-colors">
      <Stars />
      <p className="text-sm text-zinc-300 leading-relaxed flex-1">"{text}"</p>
      <div className="flex items-center gap-3 pt-3 border-t border-zinc-800">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          {name[0]}
        </div>
        <div>
          <p className="text-xs font-semibold text-zinc-200">{name}</p>
          <p className="text-[11px] text-zinc-500">{role} · {company}</p>
        </div>
      </div>
    </div>
  )
}

// ── Check ─────────────────────────────────────────────────────────────────────
function Check() {
  return (
    <svg className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[700px] bg-indigo-600/15 rounded-full blur-[160px]" />
        <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-violet-700/10 rounded-full blur-[130px]" />
        <div className="absolute top-[5%] right-[5%] w-[400px] h-[400px] bg-blue-600/8 rounded-full blur-[120px]" />
      </div>

      <Navbar />

      <div className="relative z-10">

        {/* ══════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════ */}
        <section className="max-w-5xl mx-auto px-6 pt-24 pb-16 flex flex-col items-center text-center">

          <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-bold tracking-tight text-white max-w-4xl leading-[1.04]">
            Build products<br />
            <span className="text-indigo-400">with confidence.</span>
          </h1>

          <p className="mt-6 text-xl text-zinc-400 max-w-2xl leading-relaxed">
            Product managers spend <span className="text-white font-medium">40% of their week writing docs</span> instead of building product. Product Path cuts that to minutes — so you ship faster, think deeper, and lead better.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
            <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-600/20">
              Start building free
            </Link>
            <Link to="/how-it-works" className="w-full sm:w-auto px-8 py-4 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-sm font-medium rounded-xl transition-colors">
              See how it works →
            </Link>
          </div>

          <p className="mt-4 text-xs text-zinc-600">Free forever · No credit card · Cancel anytime</p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mt-16 pt-10 border-t border-zinc-800 w-full max-w-2xl">
            {[
              { value: '< 10 min', label: 'Time to first PRD draft' },
              { value: '8 hrs/wk', label: 'Saved per PM on average' },
              { value: '3×', label: 'Faster doc reviews' },
              { value: '4.8 / 5', label: 'Avg rating from PMs' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-zinc-500 mt-1 leading-snug">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            SOCIAL PROOF
        ══════════════════════════════════════════════ */}
        <section className="max-w-5xl mx-auto px-6 pb-16 text-center">
          <p className="text-xs font-semibold text-zinc-600 uppercase tracking-widest mb-8">
            Trusted by product teams at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {['Acme Corp', 'Meridian', 'Vanta', 'Lattice', 'Rippling', 'Linear'].map(name => (
              <span key={name} className="text-sm font-bold text-zinc-700 tracking-wide select-none">
                {name}
              </span>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            PRODUCT PREVIEW
        ══════════════════════════════════════════════ */}
        <section className="max-w-5xl mx-auto px-6 pb-28">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden shadow-[0_0_120px_rgba(99,102,241,0.12)]">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800 bg-zinc-900">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-amber-500/60" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
              <div className="ml-3 flex-1 bg-zinc-800 rounded h-5 max-w-xs" />
            </div>
            <div className="flex min-h-[420px]">
              {/* Sidebar */}
              <div className="w-56 border-r border-zinc-800 p-3 space-y-1 hidden sm:block bg-zinc-900/60">
                <div className="px-2 py-2 mb-3">
                  <div className="h-2 bg-zinc-700 rounded w-20" />
                </div>
                {[
                  { label: 'Dashboard PRD', active: true },
                  { label: 'Sprint planning', active: false },
                  { label: 'Feature brief', active: false },
                  { label: 'User research', active: false },
                  { label: 'Q3 roadmap', active: false },
                ].map(({ label: _l, active }, i) => (
                  <div key={i} className={`flex items-center gap-2 px-2 py-2 rounded-lg ${active ? 'bg-indigo-600/20 border border-indigo-500/20' : ''}`}>
                    <div className={`w-3 h-3 rounded-sm flex-shrink-0 ${active ? 'bg-indigo-500' : 'bg-zinc-600'}`} />
                    <div className={`h-2 rounded flex-1 ${active ? 'bg-indigo-400/60' : 'bg-zinc-700'}`} />
                  </div>
                ))}
              </div>

              {/* Chat */}
              <div className="flex-1 flex flex-col justify-end p-6 gap-4">
                <div className="self-end max-w-sm bg-indigo-600 rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-white leading-relaxed shadow-lg">
                  Write a PRD for a self-serve dashboard for non-technical users. Focus on reducing data team dependency.
                </div>

                <div className="self-start max-w-lg bg-zinc-800 rounded-2xl rounded-tl-sm px-5 py-4 text-sm text-zinc-300 space-y-3 border border-zinc-700">
                  <p className="font-semibold text-zinc-100 text-xs uppercase tracking-wide">PRD: Self-Serve Dashboard Builder</p>
                  <p><span className="text-zinc-400 font-medium">Problem:</span> Non-technical teams wait an average of <span className="text-white">3–5 days</span> per report request, creating bottlenecks that delay strategic decisions.</p>
                  <p><span className="text-zinc-400 font-medium">Goal:</span> Enable 80% of standard reporting use cases to be self-served in under 2 clicks, reducing data team tickets by 40%.</p>
                  <div className="flex gap-2 pt-1">
                    {['📊 Metrics defined', '🎯 Scope set', '⚠️ 2 open questions'].map(tag => (
                      <span key={tag} className="text-[10px] font-medium text-zinc-400 bg-zinc-700 px-2 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 mt-1">
                  <div className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl h-11 px-4 flex items-center">
                    <span className="text-sm text-zinc-600">Make the success metrics more specific to mobile retention…</span>
                  </div>
                  <div className="w-11 h-11 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-600/30">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            THE PROBLEM
        ══════════════════════════════════════════════ */}
        <section className="max-w-5xl mx-auto px-6 pb-28">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-rose-400 uppercase tracking-widest mb-3">The problem</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-snug">
              Great PMs are buried in paperwork.
            </h2>
            <p className="mt-4 text-zinc-400 text-base max-w-2xl mx-auto leading-relaxed">
              Research shows product managers spend more time writing documents than talking to customers, reviewing data, or making product decisions. That's backwards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                stat: '40%',
                label: 'of PM time is spent writing docs',
                sub: 'ProductPlan PM survey, 2024',
                color: 'rose',
              },
              {
                stat: '3–4 hrs',
                label: 'to write one quality PRD from scratch',
                sub: 'Average across 500+ PM interviews',
                color: 'amber',
              },
              {
                stat: '8 stakeholders',
                label: 'need alignment per feature on average',
                sub: 'McKinsey product team research',
                color: 'violet',
              },
              {
                stat: '47 docs',
                label: 'the average PM produces per quarter',
                sub: 'Confluence PM usage data, 2023',
                color: 'indigo',
              },
            ].map(({ stat, label, sub, color }) => (
              <div key={stat} className={`bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-colors`}>
                <p className={`text-3xl font-bold mb-2 ${
                  color === 'rose' ? 'text-rose-400' :
                  color === 'amber' ? 'text-amber-400' :
                  color === 'violet' ? 'text-violet-400' : 'text-indigo-400'
                }`}>{stat}</p>
                <p className="text-sm font-medium text-zinc-200 leading-snug mb-2">{label}</p>
                <p className="text-[11px] text-zinc-600">{sub}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-zinc-500 text-sm">
              Product Path gives you that time back. <Link to="/how-it-works" className="text-indigo-400 hover:text-indigo-300 transition-colors">See how →</Link>
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            FEATURE 01 — Write in minutes
        ══════════════════════════════════════════════ */}
        <section id="features" className="max-w-6xl mx-auto px-6 pb-24">
          <div className="flex flex-col lg:flex-row gap-14 items-center">

            <div className="flex-1 space-y-5">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full">01</span>
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">AI Documentation</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold text-white leading-snug">
                A 3-hour PRD.<br />Written in 8 minutes.
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Paste a rough idea, meeting notes, or a Slack thread. Product Path applies PM methodology automatically — problem statement, goals, user stories, success metrics, open questions — and delivers a structured document ready for stakeholder review.
              </p>
              <ul className="space-y-2.5">
                {[
                  'PRDs, one-pagers, and user stories from a single prompt',
                  'Gap analysis and open question detection built in',
                  'Success metrics tied to your stated goals and OKRs',
                  'Tailored to your product domain, not generic text',
                ].map(b => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-zinc-400">
                    <Check />
                    {b}
                  </li>
                ))}
              </ul>
              <div className="pt-4 border-t border-zinc-800">
                <p className="text-3xl font-bold text-white">8 min</p>
                <p className="text-xs text-zinc-500 mt-1">average time to first complete PRD draft</p>
              </div>
              <blockquote className="border-l-2 border-indigo-500 pl-4 text-sm text-zinc-400 italic">
                "I pasted a rough brief and got a senior-quality PRD back in two minutes. My team thought I'd stayed up all night."
                <p className="mt-1 not-italic text-xs text-zinc-500 font-medium">Priya M. · Senior PM, Series B SaaS</p>
              </blockquote>
            </div>

            <div className="flex-1 w-full">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden shadow-[0_0_60px_rgba(99,102,241,0.08)]">
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/80">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-zinc-700" />
                    <div className="w-3 h-3 rounded-full bg-zinc-700" />
                    <div className="w-3 h-3 rounded-full bg-zinc-700" />
                  </div>
                  <span className="text-xs text-zinc-600">PRD · Dashboard Redesign</span>
                  <div className="w-10" />
                </div>
                <div className="p-6 space-y-4 min-h-[260px]">
                  <div className="space-y-1.5">
                    <div className="h-2 bg-indigo-600/50 rounded-full w-2/3" />
                    <div className="h-2 bg-zinc-800 rounded-full w-full" />
                    <div className="h-2 bg-zinc-800 rounded-full w-5/6" />
                    <div className="h-2 bg-zinc-800 rounded-full w-4/5" />
                  </div>
                  <div className="space-y-1.5 pt-2">
                    <div className="h-2 bg-zinc-700 rounded-full w-1/3" />
                    <div className="h-2 bg-zinc-800 rounded-full w-full" />
                    <div className="h-2 bg-zinc-800 rounded-full w-3/4" />
                  </div>
                  <div className="space-y-1.5 pt-2">
                    <div className="h-2 bg-zinc-700 rounded-full w-2/5" />
                    <div className="flex gap-2">
                      {['Goal 1', 'Goal 2', 'Goal 3'].map(g => (
                        <div key={g} className="h-6 bg-zinc-800 rounded-lg flex-1" />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <div className="h-2 bg-amber-500/20 rounded-full flex-1" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ══════════════════════════════════════════════
            FEATURE 02 — Coaching
        ══════════════════════════════════════════════ */}
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="flex flex-col lg:flex-row-reverse gap-14 items-center">

            <div className="flex-1 space-y-5">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full">02</span>
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">AI Coaching</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold text-white leading-snug">
                A CPO in your pocket.<br />Available 24/7.
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Most PMs don't have a senior mentor to review their work before it goes to the team. Product Path fills that gap — reviewing your docs like an experienced Chief Product Officer, flagging strategic gaps, challenging assumptions, and coaching you to think more sharply.
              </p>
              <ul className="space-y-2.5">
                {[
                  'Flags missing user research, unclear scope, and weak metrics',
                  'Challenges assumptions before stakeholders do',
                  'Suggests frameworks you may not have considered',
                  'Coaches in your domain — B2B, consumer, platform, mobile',
                ].map(b => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-zinc-400">
                    <Check />
                    {b}
                  </li>
                ))}
              </ul>
              <div className="pt-4 border-t border-zinc-800">
                <p className="text-3xl font-bold text-white">3×</p>
                <p className="text-xs text-zinc-500 mt-1">improvement in document quality scores reported by users</p>
              </div>
              <blockquote className="border-l-2 border-indigo-500 pl-4 text-sm text-zinc-400 italic">
                "It caught three strategic gaps in my roadmap that I had completely missed. The kind of feedback I'd wait weeks for from a VP."
                <p className="mt-1 not-italic text-xs text-zinc-500 font-medium">Divya R. · Head of Product, Series C</p>
              </blockquote>
            </div>

            <div className="flex-1 w-full">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden shadow-[0_0_60px_rgba(99,102,241,0.08)]">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800 bg-zinc-900/80">
                  <div className="w-3 h-3 rounded-full bg-zinc-700" />
                  <div className="w-3 h-3 rounded-full bg-zinc-700" />
                  <div className="w-3 h-3 rounded-full bg-zinc-700" />
                </div>
                <div className="p-6 space-y-4 min-h-[260px]">
                  <div className="bg-zinc-800 rounded-xl p-4 text-xs text-zinc-400 space-y-2 border border-zinc-700">
                    <p className="text-zinc-300 font-semibold text-xs uppercase tracking-wide">CPO Review — 3 gaps found</p>
                    <div className="space-y-2 pt-1">
                      <div className="flex gap-2">
                        <span className="text-amber-400 flex-shrink-0">⚠</span>
                        <p>Your success metric "increase engagement" is too vague to measure. Define a specific percentage lift and timeframe.</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-amber-400 flex-shrink-0">⚠</span>
                        <p>Who is the primary user persona here? The scope implies both admin and end-user — pick one to anchor the v1.</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-rose-400 flex-shrink-0">✕</span>
                        <p>No competitive context included. At minimum, acknowledge what alternatives your users use today and why they'd switch.</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500 px-1">Want me to rewrite the success metrics section with specifics?</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ══════════════════════════════════════════════
            FEATURE 03 — Team
        ══════════════════════════════════════════════ */}
        <section className="max-w-6xl mx-auto px-6 pb-28">
          <div className="flex flex-col lg:flex-row gap-14 items-center">

            <div className="flex-1 space-y-5">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full">03</span>
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Team</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-bold text-white leading-snug">
                Give every teammate<br />a senior PM.
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                You shouldn't be the only person on your team who can write a great spec. Product Path lets engineers draft clear requirements, designers capture decisions, and junior PMs produce work at a senior level — so your whole team ships with confidence.
              </p>
              <ul className="space-y-2.5">
                {[
                  'Shared project workspaces with full context and history',
                  'Junior PMs producing senior-level output from day one',
                  'Engineers and designers writing specs without PM bottlenecks',
                  'Async collaboration that scales across time zones',
                ].map(b => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-zinc-400">
                    <Check />
                    {b}
                  </li>
                ))}
              </ul>
              <div className="pt-4 border-t border-zinc-800">
                <p className="text-3xl font-bold text-white">10×</p>
                <p className="text-xs text-zinc-500 mt-1">output for solo PMs running cross-functional teams</p>
              </div>
              <blockquote className="border-l-2 border-indigo-500 pl-4 text-sm text-zinc-400 italic">
                "I'm the only PM at a company of 30. Product Path is basically my entire team."
                <p className="mt-1 not-italic text-xs text-zinc-500 font-medium">Rahul S. · Solo PM, Seed-Stage Startup</p>
              </blockquote>
            </div>

            <div className="flex-1 w-full">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden shadow-[0_0_60px_rgba(99,102,241,0.08)]">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800 bg-zinc-900/80">
                  <div className="w-3 h-3 rounded-full bg-zinc-700" />
                  <div className="w-3 h-3 rounded-full bg-zinc-700" />
                  <div className="w-3 h-3 rounded-full bg-zinc-700" />
                </div>
                <div className="p-6 min-h-[260px] space-y-3">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex -space-x-2">
                      {['P', 'J', 'M', 'S'].map((l, i) => (
                        <div key={i} className={`w-7 h-7 rounded-full border-2 border-zinc-900 flex items-center justify-center text-[10px] font-bold text-white ${
                          i === 0 ? 'bg-indigo-600' : i === 1 ? 'bg-violet-600' : i === 2 ? 'bg-blue-600' : 'bg-emerald-600'
                        }`}>{l}</div>
                      ))}
                    </div>
                    <span className="text-xs text-zinc-500">4 teammates · Q3 roadmap workspace</span>
                  </div>
                  {[
                    { name: 'Priya', color: 'bg-indigo-600', msg: 'Added success metrics for the dashboard feature' },
                    { name: 'James', color: 'bg-violet-600', msg: 'Eng scope review done — flagged 2 risks' },
                    { name: 'Maria', color: 'bg-blue-600', msg: 'User story set drafted for sprint 12' },
                  ].map(({ name, color, msg }) => (
                    <div key={name} className="flex items-start gap-3 bg-zinc-800/60 rounded-xl px-4 py-3 border border-zinc-700/50">
                      <div className={`w-6 h-6 rounded-full ${color} flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 mt-0.5`}>
                        {name[0]}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-zinc-300">{name}</p>
                        <p className="text-xs text-zinc-500">{msg}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ══════════════════════════════════════════════
            THE TRANSFORMATION
        ══════════════════════════════════════════════ */}
        <section className="max-w-5xl mx-auto px-6 pb-28">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">The results</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">What changes when PMs use Product Path</h2>
            <p className="mt-3 text-zinc-400 text-sm max-w-xl mx-auto">Based on self-reported data from Product Path users after 30 days.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
            {[
              { before: '3–4 hours', after: '< 10 minutes', label: 'Time to write a PRD', icon: '📄' },
              { before: '1–2 rounds', after: '4–5 rounds', label: 'Doc review iterations', icon: '🔄' },
              { before: 'Reactive', after: 'Strategic', label: 'How PMs describe their work', icon: '🎯' },
            ].map(({ before, after, label, icon }) => (
              <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center">
                <span className="text-2xl">{icon}</span>
                <div className="flex items-center justify-center gap-4 mt-4 mb-3">
                  <div>
                    <p className="text-xs text-zinc-600 uppercase tracking-wide mb-1">Before</p>
                    <p className="text-base font-semibold text-zinc-500 line-through">{before}</p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-indigo-500 flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                  <div>
                    <p className="text-xs text-indigo-400 uppercase tracking-wide mb-1">After</p>
                    <p className="text-base font-bold text-white">{after}</p>
                  </div>
                </div>
                <p className="text-xs text-zinc-500">{label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { stat: '94%', label: 'say they ship faster' },
              { stat: '87%', label: 'produce better quality docs' },
              { stat: '78%', label: 'feel more confident in stakeholder reviews' },
              { stat: '4.8/5', label: 'average satisfaction rating' },
            ].map(({ stat, label }) => (
              <div key={stat} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 text-center">
                <p className="text-2xl font-bold text-indigo-400">{stat}</p>
                <p className="text-xs text-zinc-500 mt-1.5 leading-snug">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            REVIEWS
        ══════════════════════════════════════════════ */}
        <section id="reviews" className="max-w-6xl mx-auto px-6 pb-28">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">Reviews</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">What PMs are saying</h2>
            <p className="mt-3 text-zinc-400 text-sm">Real feedback from product managers who use Product Path daily.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Quote
              text="I wrote a full PRD in 18 minutes that would have taken me most of the day. The structure it gave me was exactly what my eng team needed — no back and forth."
              name="Marcus T."
              role="Senior PM"
              company="B2B SaaS, Series B"
            />
            <Quote
              text="The coaching feature is unreal. It caught three strategic gaps in my roadmap that I had completely missed before the exec review. Saved me from a very awkward meeting."
              name="Divya R."
              role="Head of Product"
              company="Series C startup"
            />
            <Quote
              text="I'm a junior PM with two years of experience. Product Path makes me feel like I have a senior mentor available whenever I need one. My work quality has jumped noticeably."
              name="Beatrice K."
              role="Product Manager"
              company="Early-stage startup"
            />
            <Quote
              text="I don't have senior PMs willing to mentor me, and Product Path has basically become my coach. Deep work tasks are so much easier to start — and actually finish."
              name="Caleb M."
              role="Startup PM"
              company="Solo PM, 15-person team"
            />
            <Quote
              text="Our data team used to get 30+ report requests per week. After using Product Path to standardize our PRD process, engineers and designers write their own specs. Game changer."
              name="Sarah L."
              role="Product Lead"
              company="Growth-stage platform"
            />
            <Quote
              text="Finally a PM tool that actually understands product work. It doesn't just generate text — it thinks like a PM. The RICE scoring and MoSCoW prioritization it applies automatically is exactly right."
              name="Tom A."
              role="Principal PM"
              company="Enterprise SaaS"
            />
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            HOW IT WORKS (3 steps)
        ══════════════════════════════════════════════ */}
        <section id="how-it-works" className="max-w-5xl mx-auto px-6 pb-28">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">How it works</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Three steps. No learning curve.</h2>
            <p className="mt-3 text-zinc-400 text-sm max-w-xl mx-auto">Start with your idea — Product Path handles the rest.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative">
            <div className="hidden md:block absolute top-9 left-[calc(16.66%+1.5rem)] right-[calc(16.66%+1.5rem)] h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

            {[
              {
                step: '01',
                icon: '💬',
                title: 'Describe your idea',
                desc: 'Type a rough idea, paste meeting notes, or upload a doc. No templates, no forms — just talk to it.',
              },
              {
                step: '02',
                icon: '🧠',
                title: 'AI builds the structure',
                desc: 'Product Path applies the right frameworks and produces a structured, review-ready document in under 10 minutes.',
              },
              {
                step: '03',
                icon: '🚀',
                title: 'Refine and ship',
                desc: 'Iterate with follow-ups, get coaching on gaps, and share polished docs with your team — all in one place.',
              },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="flex flex-col items-center text-center bg-zinc-900/60 border border-zinc-800 rounded-2xl p-7 relative hover:border-zinc-700 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-2xl mb-5">
                  {icon}
                </div>
                <span className="absolute top-4 right-4 text-[10px] font-bold text-zinc-700">{step}</span>
                <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/how-it-works" className="inline-flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              See a full walkthrough →
            </Link>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            PRICING TEASER
        ══════════════════════════════════════════════ */}
        <section id="pricing" className="max-w-4xl mx-auto px-6 pb-28">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Start free. Upgrade when ready.</h2>
            <p className="mt-3 text-zinc-400 text-sm">No credit card required to get started.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {/* Free */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-7 flex flex-col">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">Free</p>
              <p className="text-4xl font-bold text-white mb-1">$0</p>
              <p className="text-xs text-zinc-500 mb-6">Forever free · No card needed</p>
              <ul className="space-y-2.5 flex-1 mb-7">
                {['40 chats/month', 'Core PM prompts', 'File uploads', 'Chat history'].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-zinc-400">
                    <Check />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="w-full text-center py-3 border border-zinc-700 hover:border-indigo-500 text-zinc-300 hover:text-white text-sm font-semibold rounded-xl transition-colors">
                Get started free
              </Link>
            </div>

            {/* Pro */}
            <div className="relative bg-gradient-to-br from-indigo-950/60 to-violet-950/40 border border-indigo-600/50 rounded-2xl p-7 flex flex-col overflow-hidden shadow-[0_0_40px_rgba(99,102,241,0.1)]">
              <div className="absolute top-4 right-4">
                <span className="text-xs font-semibold text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 px-2.5 py-1 rounded-full">Most popular</span>
              </div>
              <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">Pro</p>
              <p className="text-4xl font-bold text-white mb-1">$19<span className="text-lg text-zinc-400 font-normal">/mo</span></p>
              <p className="text-xs text-zinc-500 mb-6">Or $15/mo billed annually</p>
              <ul className="space-y-2.5 flex-1 mb-7">
                {['Unlimited chats', 'Advanced frameworks', 'Export to Notion / JIRA', 'Up to 5 seats'].map(f => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-zinc-300">
                    <Check />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => alert("Pro plan coming soon — you'll be first to know!")}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-zinc-600 mt-6">
            Need enterprise? <Link to="/enterprise" className="text-indigo-400 hover:text-indigo-300 transition-colors">Talk to us →</Link>
            &nbsp;·&nbsp;
            <Link to="/pricing" className="text-indigo-400 hover:text-indigo-300 transition-colors">See full pricing →</Link>
          </p>
        </section>

        {/* ══════════════════════════════════════════════
            ENTERPRISE
        ══════════════════════════════════════════════ */}
        <section id="enterprise" className="max-w-6xl mx-auto px-6 pb-24">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-10 sm:p-14 flex flex-col lg:flex-row gap-10 items-start">
            <div className="flex-1">
              <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">Enterprise</p>
              <h2 className="text-3xl font-bold text-white mb-4 leading-snug">Built for teams that ship world-class products</h2>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                Give your entire product organization an AI-powered PM. Security, compliance, and collaboration tools designed for companies that take product seriously.
              </p>
              <blockquote className="border-l-2 border-indigo-500 pl-4 text-sm text-zinc-400 italic mb-8">
                "Product Path cut our doc creation time by 80% while improving quality. Our PMs spend their time on strategy now, not writing."
                <p className="mt-1 not-italic text-xs text-zinc-500 font-medium">VP of Product · Growth-stage company, 200 employees</p>
              </blockquote>
              <Link to="/enterprise" className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors">
                Explore enterprise
              </Link>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-3">
              {[
                { icon: '🔒', label: 'SOC 2 Type II', desc: 'Audited security controls' },
                { icon: '🔑', label: 'SSO / SAML', desc: 'Enterprise identity management' },
                { icon: '🧩', label: 'Custom AI Models', desc: 'Bring your own LLM' },
                { icon: '👥', label: 'Unlimited Seats', desc: 'Role-based access controls' },
                { icon: '📋', label: 'Custom Templates', desc: "Your team's standards, built in" },
                { icon: '💬', label: 'Dedicated Support', desc: 'Onboarding + ongoing SLA' },
              ].map(({ icon, label, desc }) => (
                <div key={label} className="bg-zinc-800/60 border border-zinc-700/60 rounded-xl p-4 hover:border-zinc-600 transition-colors">
                  <span className="text-xl">{icon}</span>
                  <p className="text-sm font-semibold text-zinc-200 mt-2">{label}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            FINAL CTA
        ══════════════════════════════════════════════ */}
        <section className="max-w-4xl mx-auto px-6 pb-24 text-center">
          <div className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-indigo-950/40 to-zinc-900/40 p-14">
            <h2 className="text-4xl font-bold text-white mb-4">Start shipping better products.</h2>
            <p className="text-zinc-400 text-sm mb-8 max-w-xl mx-auto">
              Join thousands of product managers who use Product Path to write better docs, align teams faster, and build products users actually want.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-600/20">
                Start building free
              </Link>
              <button className="w-full sm:w-auto px-8 py-4 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-sm font-medium rounded-xl transition-colors">
                Request a demo
              </button>
            </div>
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-xs text-zinc-600">
              <span>Free to start</span>
              <span>·</span>
              <span>No credit card</span>
              <span>·</span>
              <span>Cancel anytime</span>
              <span>·</span>
              <span>Setup in 30 seconds</span>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════════ */}
        <footer className="border-t border-zinc-800 max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
            <div>
              <img src="/logo-dark.svg" alt="Product Path" className="h-7 mb-3 select-none" />
              <p className="text-xs text-zinc-500 leading-relaxed">The AI product manager for PMs and their teams.</p>
            </div>
            {[
              {
                heading: 'Product',
                items: [
                  { label: 'How it works', href: '/how-it-works' },
                  { label: 'How AI works', href: '/how-ai-works' },
                  { label: 'Pricing', href: '/pricing' },
                  { label: 'Enterprise', href: '/enterprise' },
                ],
              },
              {
                heading: 'Use Cases',
                items: [
                  { label: 'Product Managers', href: '#' },
                  { label: 'Engineering Teams', href: '#' },
                  { label: 'Design Teams', href: '#' },
                  { label: 'Startups', href: '#' },
                ],
              },
              {
                heading: 'Company',
                items: [
                  { label: 'Reviews', href: '#reviews' },
                  { label: 'Resources', href: '/resources' },
                  { label: 'Privacy', href: '#' },
                  { label: 'Terms', href: '#' },
                ],
              },
            ].map(({ heading, items }) => (
              <div key={heading}>
                <p className="text-xs font-semibold text-zinc-300 mb-3 uppercase tracking-wider">{heading}</p>
                <ul className="space-y-2">
                  {items.map(({ label, href }) => (
                    <li key={label}>
                      <Link to={href} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">{label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
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
