import { Link } from 'react-router-dom'
import { useState } from 'react'

// ── Product dropdown ──────────────────────────────────────────────────────────
const FEATURES = [
  { icon: '📄', label: 'Write PRDs', desc: 'AI-powered product docs' },
  { icon: '🧠', label: 'AI Coaching', desc: 'Expert feedback on your work' },
  { icon: '🗺️', label: 'Roadmap Planning', desc: 'Prioritize and sequence features' },
  { icon: '👥', label: 'Team Collaboration', desc: 'Co-pilot for your whole team' },
  { icon: '🔗', label: 'Integrations', desc: 'Connect your existing tools' },
]

const USE_CASES = [
  { icon: '🎯', label: 'Product Managers' },
  { icon: '⚙️', label: 'Engineering Teams' },
  { icon: '🎨', label: 'Design Teams' },
  { icon: '🚀', label: 'Startups' },
]

function ProductDropdown() {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[560px] bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl shadow-black/60 p-5 z-50">
      <div className="flex gap-6">
        {/* Features */}
        <div className="flex-1">
          <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-3 px-1">Features</p>
          <div className="space-y-0.5">
            {FEATURES.map(({ icon, label, desc }) => (
              <Link key={label} to="/signup"
                className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-800 transition-colors group"
              >
                <span className="text-base mt-0.5 flex-shrink-0">{icon}</span>
                <div>
                  <p className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">{label}</p>
                  <p className="text-xs text-zinc-500">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-px bg-zinc-800 self-stretch" />

        {/* Use cases */}
        <div className="w-44">
          <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-3 px-1">Use Cases</p>
          <div className="space-y-0.5">
            {USE_CASES.map(({ icon, label }) => (
              <Link key={label} to="/signup"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-800 transition-colors group"
              >
                <span className="text-base flex-shrink-0">{icon}</span>
                <p className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">{label}</p>
              </Link>
            ))}
          </div>
          {/* Bottom links */}
          <div className="mt-4 pt-3 border-t border-zinc-800 space-y-1 px-1">
            <Link to="/signup" className="block text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Watch demo →</Link>
            <Link to="/signup" className="block text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Contact us →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
    </div>
  )
}

// ── Quote card ────────────────────────────────────────────────────────────────
function Quote({ text, name, role }: { text: string; name: string; role: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col gap-4">
      <p className="text-sm text-zinc-300 leading-relaxed">"{text}"</p>
      <div className="flex items-center gap-3 mt-auto">
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          {name[0]}
        </div>
        <div>
          <p className="text-xs font-semibold text-zinc-200">{name}</p>
          <p className="text-[11px] text-zinc-500">{role}</p>
        </div>
      </div>
    </div>
  )
}

// ── Feature section ───────────────────────────────────────────────────────────
function Feature({
  number, title, headline, description, bullets, stat, statLabel, quote, quoteAuthor, quoteRole, flip,
}: {
  number: string; title: string; headline: string; description: string
  bullets: string[]; stat: string; statLabel: string
  quote: string; quoteAuthor: string; quoteRole: string; flip?: boolean
}) {
  return (
    <div className={`flex flex-col ${flip ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center`}>
      {/* Text */}
      <div className="flex-1 space-y-5">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full">{number}</span>
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">{title}</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-semibold text-white leading-snug">{headline}</h3>
        <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
        <ul className="space-y-2">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-400">
              <svg className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              {b}
            </li>
          ))}
        </ul>
        <div className="pt-2 border-t border-zinc-800 flex items-start gap-4">
          <div>
            <p className="text-2xl font-bold text-white">{stat}</p>
            <p className="text-xs text-zinc-500">{statLabel}</p>
          </div>
        </div>
        <blockquote className="border-l-2 border-indigo-500 pl-4 text-sm text-zinc-400 italic">
          "{quote}"
          <p className="mt-1 not-italic text-xs text-zinc-500 font-medium">{quoteAuthor} · {quoteRole}</p>
        </blockquote>
      </div>

      {/* Visual */}
      <div className="flex-1 w-full">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden shadow-[0_0_60px_rgba(99,102,241,0.07)]">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800 bg-zinc-900/80">
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
          </div>
          <div className="p-6 space-y-3 min-h-[220px]">
            {[85, 65, 90, 50, 75].map((w, i) => (
              <div key={i} className={`h-2.5 rounded-full ${i === 0 ? 'bg-indigo-600/60' : 'bg-zinc-800'}`} style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Nav ───────────────────────────────────────────────────────────────────────
function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="relative z-10 sticky top-0 bg-zinc-950/95 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_1px_0_rgba(255,255,255,0.04)]">
      <div className="max-w-7xl mx-auto px-5 flex items-center justify-between h-[52px]">

        {/* Logo */}
        <Link to="/" className="flex-shrink-0 flex items-center gap-2.5">
          <img src="/logo-dark.svg" alt="Product Path" className="h-6 select-none" />
        </Link>

        {/* Centre nav links */}
        <div className="hidden md:flex items-center">
          {/* Product dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <button className="flex items-center gap-1 px-3.5 py-2 text-[13px] font-medium text-zinc-400 hover:text-zinc-100 transition-colors">
              Product
              <svg className={`w-3 h-3 opacity-60 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            {open && <ProductDropdown />}
          </div>

          {[
            { label: 'Pricing',   to: '/pricing' },
            { label: 'Resources', to: '/resources' },
          ].map(({ label, to }) => (
            <Link key={label} to={to} className="px-3.5 py-2 text-[13px] font-medium text-zinc-400 hover:text-zinc-100 transition-colors">
              {label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          <Link
            to="/login"
            className="hidden sm:block px-3.5 py-1.5 text-[13px] font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            Log in
          </Link>

          <button className="hidden sm:block px-3.5 py-1.5 text-[13px] font-medium text-zinc-400 hover:text-zinc-100 transition-colors">
            Get a demo
          </button>

          {/* Gradient CTA — matches ChatPRD pill style */}
          <Link
            to="/signup"
            className="ml-1 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-semibold text-white transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)' }}
          >
            Start free
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

      </div>
    </nav>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* ── Gradient blobs ── */}
      <div className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[700px] bg-indigo-600/15 rounded-full blur-[160px]" />
        <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-violet-700/10 rounded-full blur-[130px]" />
        <div className="absolute top-[5%] right-[5%] w-[400px] h-[400px] bg-blue-600/8 rounded-full blur-[120px]" />
      </div>

      {/* ── Nav ── */}
      <Nav />

      <div className="relative z-10">

        {/* ── Hero ── */}
        <section className="max-w-7xl mx-auto px-6 pt-24 pb-16 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse flex-shrink-0" />
            Now in beta — free for early teams
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl leading-[1.05]">
            Build products<br />
            <span className="text-indigo-400">with confidence.</span>
          </h1>

          <p className="mt-6 text-lg text-zinc-400 max-w-2xl leading-relaxed">
            Turn ideas into clear decisions, strong requirements, and aligned execution — with an AI product partner that guides you at every step of the product lifecycle.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
            <Link to="/signup" className="w-full sm:w-auto px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors">
              Start building free
            </Link>
            <button className="w-full sm:w-auto px-7 py-3.5 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-sm font-medium rounded-xl transition-colors">
              Request a demo
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-10 mt-16 pt-10 border-t border-zinc-800 w-full max-w-xl">
            <Stat value="10k+" label="Product Managers" />
            <Stat value="50k+" label="Docs Created" />
            <Stat value="8h/wk" label="Time Saved" />
            <Stat value="4.8★" label="Avg Rating" />
          </div>
        </section>

        {/* ── Product preview ── */}
        <section className="max-w-5xl mx-auto px-6 pb-24">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden shadow-[0_0_100px_rgba(99,102,241,0.1)]">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800 bg-zinc-900">
              <div className="w-3 h-3 rounded-full bg-zinc-700" />
              <div className="w-3 h-3 rounded-full bg-zinc-700" />
              <div className="w-3 h-3 rounded-full bg-zinc-700" />
              <div className="ml-3 flex-1 bg-zinc-800 rounded h-5 max-w-xs" />
            </div>
            <div className="flex min-h-[380px]">
              {/* Sidebar */}
              <div className="w-52 border-r border-zinc-800 p-3 space-y-1 hidden sm:block bg-zinc-900/60">
                <div className="px-2 py-1 mb-2">
                  <div className="h-2 bg-zinc-700 rounded w-16" />
                </div>
                {['Dashboard PRD', 'Sprint planning', 'Feature brief', 'User research'].map((_t, i) => (
                  <div key={i} className={`flex items-center gap-2 px-2 py-2 rounded-lg ${i === 0 ? 'bg-zinc-700' : ''}`}>
                    <div className="w-3 h-3 rounded-sm bg-zinc-600 flex-shrink-0" />
                    <div className={`h-2 rounded flex-1 ${i === 0 ? 'bg-zinc-400' : 'bg-zinc-700'}`} />
                  </div>
                ))}
              </div>
              {/* Chat */}
              <div className="flex-1 flex flex-col justify-end p-6 gap-4">
                <div className="self-end max-w-sm bg-indigo-600/80 rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-white">
                  Write a PRD for a dashboard redesign — focus on self-serve analytics for non-technical users.
                </div>
                <div className="self-start max-w-lg bg-zinc-800/80 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-zinc-300 space-y-2">
                  <p>Here's your first draft. I've structured it around three core user personas and included success metrics tied to your Q3 OKRs.</p>
                  <div className="space-y-1.5 pt-1">
                    <div className="h-2 bg-zinc-600 rounded w-full" />
                    <div className="h-2 bg-zinc-600 rounded w-4/5" />
                    <div className="h-2 bg-zinc-600 rounded w-3/5" />
                  </div>
                </div>
                <div className="flex gap-2 mt-1">
                  <div className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl h-10 px-3 flex items-center">
                    <div className="h-2 bg-zinc-700 rounded w-48" />
                  </div>
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="max-w-6xl mx-auto px-6 pb-24 space-y-28">

          <Feature
            number="01"
            title="AI Documentation"
            headline="Write product docs in minutes, not days"
            description="Transform rough ideas, meeting notes, or a simple prompt into comprehensive PRDs, user stories, and technical specs. Product Path understands product strategy — your docs are structured, thorough, and ready for review."
            bullets={[
              'Generate PRDs, one-pagers, and user stories from a prompt',
              'Gap analysis and open question detection',
              'Export to Notion, Confluence, or Google Docs',
              'Tailored to your product domain and team style',
            ]}
            stat="10h/wk"
            statLabel="saved per PM on average"
            quote="I pasted a rough brief and got a senior-quality PRD back in two minutes. This is what I needed."
            quoteAuthor="Priya M."
            quoteRole="Senior PM, Series B Startup"
          />

          <Feature
            number="02"
            title="AI Coaching"
            headline="Instant feedback from an expert product coach"
            description="Product Path reviews your documents like a Chief Product Officer — identifying strategic gaps, questioning assumptions, and coaching you to think more deeply about users and their problems."
            bullets={[
              'CPO-level reviews with specific, actionable feedback',
              'Strategic gap analysis across competitive, technical, and UX dimensions',
              'Real-time coaching as you write and iterate',
              'Personalized to your product domain and context',
            ]}
            stat="3×"
            statLabel="improvement in doc quality scores"
            quote="It's like having a senior PM review every doc before it goes out. The quality of our specs has improved dramatically."
            quoteAuthor="James K."
            quoteRole="Product Lead, Growth-Stage Co."
            flip
          />

          <Feature
            number="03"
            title="Team"
            headline="Give everyone on your team an expert PM"
            description="Product Path's AI helps engineers draft specs, designers capture requirements, and junior PMs produce senior-level work — so your whole team ships with confidence, not just your best PM."
            bullets={[
              'Shared project spaces with team context and history',
              'Custom AI personas aligned to your team\'s style and domain',
              'Role-based access for PM, design, and engineering',
              'Async collaboration across time zones',
            ]}
            stat="10k+"
            statLabel="product managers trust Product Path"
            quote="I'm the only PM at a company of 12. With Product Path I've genuinely 10x'd myself."
            quoteAuthor="Rahul S."
            quoteRole="Solo PM, Seed-Stage Startup"
          />

        </section>

        {/* ── Reviews ── */}
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Everyone loves Product Path</h2>
            <p className="mt-3 text-zinc-400 text-sm">Real feedback from real product teams</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Quote
              text="Product Path gave me awesome feedback to strengthen my PRD narrative. This is going to save me a ton of time every sprint."
              name="Caleb"
              role="Startup PM"
            />
            <Quote
              text="I don't have senior PMs willing to mentor me, and Product Path has basically made me a coach. The deep work tasks are so much easier to start and finish."
              name="Beatrice"
              role="Junior PM, Series A"
            />
            <Quote
              text="Great for drafting out ideas and hypotheses that are swimming around in my head. Better on paper than lost forever."
              name="Sarah"
              role="Product Manager"
            />
          </div>
        </section>

        {/* ── Enterprise ── */}
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-10 sm:p-14 flex flex-col lg:flex-row gap-10 items-start">
            <div className="flex-1">
              <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">Enterprise</p>
              <h2 className="text-3xl font-bold text-white mb-4">Built for teams that ship world-class products</h2>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                Give your entire product organization an AI-powered PM. Security, compliance, and collaboration designed for companies that take product seriously.
              </p>
              <blockquote className="border-l-2 border-indigo-500 pl-4 text-sm text-zinc-400 italic mb-8">
                "Product Path has fundamentally changed how our team operates. We cut doc creation time by 80% while improving quality."
                <p className="mt-1 not-italic text-xs text-zinc-500 font-medium">VP of Product · Growth Company</p>
              </blockquote>
              <Link to="/signup" className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors">
                Explore enterprise
              </Link>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-3">
              {[
                { icon: '🔒', label: 'SOC 2 Type II', desc: 'Audited security controls' },
                { icon: '🔑', label: 'SSO', desc: 'Enterprise identity management' },
                { icon: '🧩', label: 'Custom AI Models', desc: 'Bring your own LLM' },
                { icon: '👥', label: 'Team Management', desc: 'Role-based access controls' },
                { icon: '📋', label: 'Custom Templates', desc: "Your team's standards" },
                { icon: '💬', label: 'Priority Support', desc: 'Dedicated onboarding' },
              ].map(({ icon, label, desc }) => (
                <div key={label} className="bg-zinc-800/60 border border-zinc-700/60 rounded-xl p-4">
                  <span className="text-lg">{icon}</span>
                  <p className="text-sm font-semibold text-zinc-200 mt-2">{label}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Footer CTA ── */}
        <section className="max-w-4xl mx-auto px-6 pb-24 text-center">
          <div className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-indigo-950/40 to-zinc-900/40 p-14">
            <h2 className="text-4xl font-bold text-white mb-4">Start shipping better products.</h2>
            <p className="text-zinc-400 text-sm mb-8">Join thousands of product managers who use Product Path to write better docs, align teams faster, and build products users love.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup" className="w-full sm:w-auto px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors">
                Start building free
              </Link>
              <button className="w-full sm:w-auto px-7 py-3.5 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-sm font-medium rounded-xl transition-colors">
                Request a demo
              </button>
            </div>
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-xs text-zinc-500">
              <span>Free to start</span>
              <span>·</span>
              <span>No credit card</span>
              <span>·</span>
              <span>Cancel anytime</span>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="border-t border-zinc-800 max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
            <div>
              <img src="/logo-dark.svg" alt="Product Path" className="h-7 mb-3 select-none" />
              <p className="text-xs text-zinc-500 leading-relaxed">The AI product manager for PMs and their teams.</p>
            </div>
            {[
              { heading: 'Product', links: ['Write PRDs', 'AI Coaching', 'Collaboration', 'Pricing'] },
              { heading: 'Use Cases', links: ['Product Managers', 'Engineering', 'Design', 'Startups'] },
              { heading: 'Company', links: ['About', 'Blog', 'Resources', 'Privacy'] },
            ].map(({ heading, links }) => (
              <div key={heading}>
                <p className="text-xs font-semibold text-zinc-300 mb-3 uppercase tracking-wider">{heading}</p>
                <ul className="space-y-2">
                  {links.map(l => (
                    <li key={l}>
                      <Link to="/" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">{l}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-zinc-600">© 2025 Product Path. All rights reserved.</p>
            <div className="flex gap-5">
              <Link to="/privacy" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Privacy</Link>
              <Link to="/terms" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Terms</Link>
            </div>
          </div>
        </footer>

      </div>
    </div>
  )
}
