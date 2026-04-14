import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

// ── Output type card ──────────────────────────────────────────────────────────
function OutputCard({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-600 hover:bg-zinc-900/80 transition-colors group">
      <span className="text-2xl">{icon}</span>
      <p className="text-xs font-semibold text-zinc-400 text-center group-hover:text-zinc-200 transition-colors">{label}</p>
    </div>
  )
}

// ── Step badge ────────────────────────────────────────────────────────────────
function StepBadge({ n }: { n: string }) {
  return (
    <div className="inline-flex items-center gap-2 mb-5">
      <span className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
        {n}
      </span>
      <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">
        Step {n}
      </span>
    </div>
  )
}

// ── Mock chat bubble ──────────────────────────────────────────────────────────
function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-xs bg-indigo-600/80 rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-white leading-relaxed">
        {text}
      </div>
    </div>
  )
}

function AIBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-start">
      <div className="max-w-sm bg-zinc-800 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-zinc-300 leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  )
}

// ── Chat window wrapper ───────────────────────────────────────────────────────
function ChatWindow({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden shadow-[0_0_60px_rgba(99,102,241,0.08)]">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800 bg-zinc-900/80">
        <div className="w-3 h-3 rounded-full bg-zinc-700" />
        <div className="w-3 h-3 rounded-full bg-zinc-700" />
        <div className="w-3 h-3 rounded-full bg-zinc-700" />
        <div className="ml-2 text-xs text-zinc-600 font-medium">Product Path</div>
      </div>
      <div className="p-5 space-y-4 min-h-[240px] flex flex-col justify-end">
        {children}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-[50%] left-[5%] w-[400px] h-[400px] bg-violet-700/8 rounded-full blur-[120px]" />
      </div>

      <Navbar />

      <div className="relative z-10">

        {/* ── Hero ── */}
        <section className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse flex-shrink-0" />
            No learning curve
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-white leading-[1.05] mb-6">
            From rough idea to<br />
            <span className="text-indigo-400">polished PRD in minutes.</span>
          </h1>

          <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10">
            No templates to fill out. No prompts to engineer. Just describe what you need — Product Path handles the structure, strategy, and polish like a senior PM colleague would.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Try it free — no credit card
            </Link>
            <Link
              to="/how-ai-works"
              className="w-full sm:w-auto px-7 py-3.5 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-sm font-medium rounded-xl transition-colors"
            >
              How the AI works →
            </Link>
          </div>
        </section>

        {/* ── Step 1 ── */}
        <section className="max-w-6xl mx-auto px-6 pb-28">
          <div className="flex flex-col lg:flex-row gap-14 items-center">

            {/* Text */}
            <div className="flex-1 space-y-5">
              <StepBadge n="1" />
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-snug">
                Start with anything.<br />Really, anything.
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                No form. No template. No right way to begin. Type a quick idea, paste messy meeting notes, or upload a document — Product Path figures out what you need and gets to work.
              </p>

              {/* Input type chips */}
              <div className="space-y-3 pt-2">
                {[
                  { icon: '💬', label: 'A rough idea', example: '"We need a way for non-technical users to build their own dashboards"' },
                  { icon: '📋', label: 'Meeting notes', example: '"From standup: users complaining dashboard takes too long to load, eng says DB queries need optimization..."' },
                  { icon: '📎', label: 'An uploaded file', example: 'Drop in a CSV, research doc, or competitor screenshot' },
                ].map(({ icon, label, example }) => (
                  <div key={label} className="flex items-start gap-3 bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                    <span className="text-xl flex-shrink-0">{icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-zinc-200">{label}</p>
                      <p className="text-xs text-zinc-500 mt-0.5 italic">{example}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual */}
            <div className="flex-1 w-full">
              <ChatWindow>
                <UserBubble text="We need a way for non-technical users to build their own dashboards without waiting on the data team every time." />
                <div className="flex items-center gap-2 self-start">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs text-zinc-600">Product Path is thinking…</span>
                </div>
              </ChatWindow>

              {/* Input bar below */}
              <div className="mt-3 flex gap-2">
                <div className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl h-11 px-4 flex items-center">
                  <span className="text-sm text-zinc-600">Describe your idea or paste your notes…</span>
                </div>
                <div className="w-11 h-11 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                  </svg>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── Divider ── */}
        <div className="max-w-6xl mx-auto px-6 pb-28">
          <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
        </div>

        {/* ── Step 2 ── */}
        <section className="max-w-6xl mx-auto px-6 pb-28">
          <div className="flex flex-col lg:flex-row-reverse gap-14 items-center">

            {/* Text */}
            <div className="flex-1 space-y-5">
              <StepBadge n="2" />
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-snug">
                AI builds the structure.<br />You stay in control.
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Product Path doesn't just summarize — it thinks like a senior PM. It applies the right frameworks, identifies what's missing, and produces a structured document that's ready for review.
              </p>

              <div className="space-y-2.5 pt-2">
                {[
                  'Full PRD with goals, scope, and user stories',
                  'Success metrics tied to your stated objectives',
                  'Open questions and assumptions flagged automatically',
                  'Prioritization based on your constraints',
                  'CPO-level gaps and strategic coaching',
                ].map(item => (
                  <div key={item} className="flex items-start gap-2.5 text-sm text-zinc-400">
                    <svg className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Visual */}
            <div className="flex-1 w-full">
              <ChatWindow>
                <UserBubble text="Write a PRD for self-serve dashboards for non-technical users." />
                <AIBubble>
                  <p className="font-semibold text-zinc-200 text-xs uppercase tracking-wide">PRD: Self-Serve Dashboard Builder</p>
                  <div className="space-y-1.5 text-xs text-zinc-400">
                    <p><span className="text-zinc-300 font-medium">Problem:</span> Non-technical users rely on the data team for every report, creating a bottleneck that delays decisions by 3–5 days on average.</p>
                    <p><span className="text-zinc-300 font-medium">Goal:</span> Enable 80% of standard reporting use cases to be self-served within 2 clicks.</p>
                    <p><span className="text-zinc-300 font-medium">Success metrics:</span> Data team ticket volume ↓40%, dashboard creation time ↓from 3 days to &lt;10 min.</p>
                  </div>
                  <div className="pt-1 border-t border-zinc-700 text-xs text-amber-400/80">
                    ⚠ Open question: What's the expected query complexity? This affects the no-code builder scope significantly.
                  </div>
                </AIBubble>
              </ChatWindow>
            </div>

          </div>
        </section>

        {/* ── Divider ── */}
        <div className="max-w-6xl mx-auto px-6 pb-28">
          <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
        </div>

        {/* ── Step 3 ── */}
        <section className="max-w-6xl mx-auto px-6 pb-28">
          <div className="flex flex-col lg:flex-row gap-14 items-center">

            {/* Text */}
            <div className="flex-1 space-y-5">
              <StepBadge n="3" />
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-snug">
                Refine with follow-ups.<br />Ship with confidence.
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                The conversation doesn't end after the first response. Ask follow-up questions, push back, request rewrites — Product Path remembers all your context and refines until it's exactly right.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  { q: '"Make the success metrics more specific to mobile retention"', tag: 'Refine metrics' },
                  { q: '"Add a section on what we\'re explicitly NOT building"', tag: 'Add scope' },
                  { q: '"Rewrite this for a technical audience"', tag: 'Change tone' },
                  { q: '"What would a CPO push back on here?"', tag: 'Get coaching' },
                ].map(({ q, tag }) => (
                  <div key={tag} className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
                    <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full flex-shrink-0">{tag}</span>
                    <p className="text-xs text-zinc-400 italic">{q}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual */}
            <div className="flex-1 w-full">
              <ChatWindow>
                <UserBubble text="Make the success metrics more specific to mobile retention." />
                <AIBubble>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Updated success metrics focused on mobile retention:
                  </p>
                  <div className="space-y-1 text-xs text-zinc-400">
                    <p>• <span className="text-zinc-300">D7 retention</span> for users who create a dashboard ≥ 60% (baseline: 38%)</p>
                    <p>• <span className="text-zinc-300">Dashboard creation on mobile</span> ≥ 45% of total sessions within 90 days</p>
                    <p>• <span className="text-zinc-300">Mobile → desktop continuation rate</span> ≥ 30% (signals cross-device stickiness)</p>
                  </div>
                  <p className="text-xs text-zinc-500 pt-1 border-t border-zinc-700">
                    Want me to add a section on measurement instrumentation?
                  </p>
                </AIBubble>
              </ChatWindow>
            </div>

          </div>
        </section>

        {/* ── What you can create ── */}
        <section className="max-w-5xl mx-auto px-6 pb-28">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">Outputs</p>
            <h2 className="text-3xl font-bold text-white">Everything a PM needs to ship</h2>
            <p className="mt-3 text-zinc-400 text-sm">From discovery to delivery — one tool, all the docs.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: '📄', label: 'Product Requirements Doc' },
              { icon: '📝', label: 'User Stories' },
              { icon: '🗺️', label: 'Roadmap Narrative' },
              { icon: '📃', label: 'One-Pager' },
              { icon: '📊', label: 'Stakeholder Update' },
              { icon: '🎯', label: 'Success Metrics' },
              { icon: '🔍', label: 'Competitive Brief' },
              { icon: '🏃', label: 'Sprint Goal & Scope' },
              { icon: '🧑‍🤝‍🧑', label: 'User Personas' },
              { icon: '⚖️', label: 'Prioritization Framework' },
              { icon: '📣', label: 'Go-to-Market Brief' },
              { icon: '🔎', label: 'Discovery Summary' },
            ].map(({ icon, label }) => (
              <OutputCard key={label} icon={icon} label={label} />
            ))}
          </div>
        </section>

        {/* ── Real example — before / after ── */}
        <section className="max-w-5xl mx-auto px-6 pb-28">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">Real example</p>
            <h2 className="text-3xl font-bold text-white">See the transformation</h2>
            <p className="mt-3 text-zinc-400 text-sm">This is all it takes to get a senior-PM-quality first draft.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* What you type */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="px-5 py-3.5 border-b border-zinc-800 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-zinc-600" />
                <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">What you type</span>
              </div>
              <div className="p-5">
                <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-sm text-zinc-300 leading-relaxed italic">
                  "We want to add notifications to the mobile app. Users keep missing important updates. Maybe push notifications? Or in-app? Not sure. The eng team says it's a big lift but PM thinks it's critical for retention."
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-zinc-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  Takes 15 seconds to type
                </div>
              </div>
            </div>

            {/* What you get */}
            <div className="bg-zinc-900 border border-indigo-500/30 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(99,102,241,0.06)]">
              <div className="px-5 py-3.5 border-b border-indigo-500/20 bg-indigo-500/5 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">What you get</span>
              </div>
              <div className="p-5 space-y-3 text-xs text-zinc-400 leading-relaxed">
                <p className="text-sm font-semibold text-zinc-200">PRD: Mobile Notification System</p>
                <div className="space-y-2">
                  <p><span className="text-zinc-300 font-medium">Problem statement:</span> Users miss time-sensitive updates because the app relies on passive in-app discovery. This drives a 23% drop in re-engagement after 7 days.</p>
                  <p><span className="text-zinc-300 font-medium">Proposed solution:</span> A tiered notification system — push for critical alerts, in-app for contextual updates — with user-controlled preferences to prevent fatigue.</p>
                  <p><span className="text-zinc-300 font-medium">Success metrics:</span> D7 re-engagement +15%, push opt-in rate ≥55%, notification-driven session rate ≥20%.</p>
                  <p><span className="text-zinc-300 font-medium">Engineering scope note:</span> Recommend starting with in-app only (estimated 2 sprints) to validate engagement lift before investing in push infrastructure.</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-600 pt-1 border-t border-zinc-800">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  Generated in under 10 seconds
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── CTA ── */}
        <section className="max-w-4xl mx-auto px-6 pb-24 text-center">
          <div className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-indigo-950/40 to-zinc-900/40 p-14">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to try it yourself?</h2>
            <p className="text-zinc-400 text-sm mb-8 max-w-xl mx-auto">
              Start with your next PRD, your current backlog, or just an idea you've been sitting on. Product Path is free to start — no setup, no credit card.
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
