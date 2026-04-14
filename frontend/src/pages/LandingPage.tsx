import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

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
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
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

// ── Check icon ────────────────────────────────────────────────────────────────
function Check() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5">
      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
    </svg>
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
      <Navbar />

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

        {/* ── Social proof bar ── */}
        <section className="max-w-5xl mx-auto px-6 pb-16 text-center">
          <p className="text-xs font-semibold text-zinc-600 uppercase tracking-widest mb-8">
            Trusted by product teams at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10">
            {['Acme Corp', 'Meridian', 'Vanta', 'Lattice', 'Rippling', 'Linear'].map(name => (
              <span key={name} className="text-sm font-semibold text-zinc-700 tracking-wide select-none">
                {name}
              </span>
            ))}
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
        <section id="features" className="max-w-6xl mx-auto px-6 pb-24 space-y-28">

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

        {/* ── How it works ── */}
        <section id="how-it-works" className="max-w-5xl mx-auto px-6 pb-28">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">How it works</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">From idea to shipped in three steps</h2>
            <p className="mt-3 text-zinc-400 text-sm max-w-xl mx-auto">No learning curve. Start with your idea — Product Path handles the structure, strategy, and polish.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

            {[
              {
                step: '01',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
                  </svg>
                ),
                title: 'Describe your idea',
                desc: 'Type a rough idea, paste meeting notes, or upload a document. No templates or forms — just say what you need.',
              },
              {
                step: '02',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                  </svg>
                ),
                title: 'AI does the heavy lifting',
                desc: 'Product Path generates your PRD, user stories, success metrics, and priorities — structured and ready for review.',
              },
              {
                step: '03',
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                  </svg>
                ),
                title: 'Refine and ship',
                desc: 'Ask follow-up questions, iterate in real time, and share polished docs with your team — all in one place.',
              },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="flex flex-col items-center text-center bg-zinc-900/60 border border-zinc-800 rounded-2xl p-7 relative">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-5">
                  {icon}
                </div>
                <span className="absolute top-4 right-4 text-[10px] font-bold text-zinc-700">{step}</span>
                <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/signup" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors">
              Try it free — no credit card
            </Link>
          </div>
        </section>

        {/* ── How AI works ── */}
        <section id="how-ai-works" className="max-w-5xl mx-auto px-6 pb-28">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-10 sm:p-14">
            <div className="flex flex-col lg:flex-row gap-12 items-start">

              {/* Left */}
              <div className="flex-1">
                <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">How AI works</p>
                <h2 className="text-3xl font-bold text-white mb-4 leading-snug">
                  Built for product work.<br />Designed to be trusted.
                </h2>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Product Path isn't just a general AI wrapper. It's a PM-specific layer built on top of frontier models — tuned for product strategy, user research, prioritization frameworks, and stakeholder communication.
                </p>
              </div>

              {/* Right — pillars */}
              <div className="flex-1 space-y-5">
                {[
                  {
                    icon: '🧠',
                    title: 'PM-native reasoning',
                    desc: 'Our prompting layer understands product methodology — RICE, MoSCoW, Jobs-to-be-Done, OKRs — so outputs are always structured like a senior PM wrote them.',
                  },
                  {
                    icon: '🔒',
                    title: 'Your data stays yours',
                    desc: 'Your conversations and documents are never used to train AI models. What you share with Product Path stays private.',
                  },
                  {
                    icon: '⚡',
                    title: 'Powered by frontier models',
                    desc: 'We use the latest large language models with real-time streaming — so responses are fast, accurate, and never feel like a template.',
                  },
                  {
                    icon: '🎯',
                    title: 'Context-aware across your session',
                    desc: 'Product Path remembers what you told it earlier in the conversation — your product domain, constraints, and goals inform every response.',
                  },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="flex gap-4 items-start">
                    <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-base flex-shrink-0">
                      {icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-200">{title}</p>
                      <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* ── Reviews ── */}
        <section id="reviews" className="max-w-6xl mx-auto px-6 pb-24">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">Reviews</p>
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
            <Quote
              text="Wrote a full PRD in 20 minutes that would have taken me most of the day. The structure it gave me was exactly what my eng team needed."
              name="Marcus"
              role="Senior PM, B2B SaaS"
            />
            <Quote
              text="The AI coaching feature is unreal. It caught three strategic gaps in my roadmap that I had completely missed."
              name="Divya"
              role="Head of Product, Series C"
            />
            <Quote
              text="Finally a PM tool that actually understands product work. It doesn't just generate text — it thinks like a PM."
              name="Tom"
              role="Solo PM, Seed Startup"
            />
          </div>
        </section>

        {/* ── Pricing ── */}
        <section id="pricing" className="max-w-5xl mx-auto px-6 pb-28">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Simple, transparent pricing</h2>
            <p className="mt-3 text-zinc-400 text-sm">Start free. Upgrade when you're ready.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">

            {/* Free */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex flex-col">
              <div className="mb-6">
                <p className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">Free</p>
                <div className="flex items-end gap-1.5">
                  <span className="text-4xl font-bold text-white">$0</span>
                  <span className="text-zinc-500 text-sm mb-1.5">/ month</span>
                </div>
                <p className="text-xs text-zinc-500 mt-2">Perfect for getting started</p>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {[
                  '40 chats per month',
                  'Core PM prompts (PRDs, user stories)',
                  'Backlog prioritization help',
                  'CSV & JSON file uploads',
                  'Chat history',
                  'Standard response speed',
                ].map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-400">
                    <Check />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                to="/signup"
                className="w-full text-center py-3 border border-zinc-700 hover:border-indigo-500 text-zinc-300 hover:text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Get started free
              </Link>
            </div>

            {/* Pro */}
            <div className="relative bg-gradient-to-br from-indigo-950/60 to-violet-950/40 border border-indigo-700/50 rounded-2xl p-8 flex flex-col overflow-hidden">
              <div className="absolute top-4 right-4">
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-600/30 text-indigo-300 border border-indigo-500/30">
                  Most popular
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-transparent pointer-events-none" />

              <div className="mb-6 relative">
                <p className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-2">Pro</p>
                <div className="flex items-end gap-1.5">
                  <span className="text-4xl font-bold text-white">$19</span>
                  <span className="text-zinc-400 text-sm mb-1.5">/ month</span>
                </div>
                <p className="text-xs text-zinc-500 mt-2">For serious PMs who ship faster</p>
              </div>

              <ul className="space-y-3 flex-1 mb-8 relative">
                {[
                  'Unlimited chats',
                  'Priority response speed',
                  'Advanced PM frameworks & templates',
                  'Document analysis (PDF, Word)',
                  'Export to Notion, Confluence, JIRA',
                  'Custom AI persona & tone',
                  'Team workspace (up to 5 seats)',
                  'Priority support',
                ].map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-300">
                    <Check />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => alert('Pro plan coming soon — you\'ll be first to know!')}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors relative"
              >
                Upgrade to Pro
              </button>
              <p className="text-center text-xs text-zinc-600 mt-3 relative">Cancel anytime · No contracts</p>
            </div>

          </div>

          <p className="text-center text-xs text-zinc-600 mt-8">
            Need more? <Link to="/enterprise" className="text-indigo-400 hover:text-indigo-300 transition-colors">Talk to us about Enterprise →</Link>
          </p>
        </section>

        {/* ── Enterprise ── */}
        <section id="enterprise" className="max-w-6xl mx-auto px-6 pb-24">
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
              <Link to="/enterprise" className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors">
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
              {
                heading: 'Product',
                links: [
                  { label: 'Write PRDs', hash: 'features' },
                  { label: 'AI Coaching', hash: 'features' },
                  { label: 'How it works', hash: 'how-it-works' },
                  { label: 'Pricing', hash: 'pricing' },
                ],
              },
              {
                heading: 'Use Cases',
                links: [
                  { label: 'Product Managers', hash: '' },
                  { label: 'Engineering', hash: '' },
                  { label: 'Design', hash: '' },
                  { label: 'Startups', hash: '' },
                ],
              },
              {
                heading: 'Company',
                links: [
                  { label: 'Enterprise', hash: '' },
                  { label: 'Reviews', hash: 'reviews' },
                  { label: 'Resources', hash: '' },
                  { label: 'Privacy', hash: '' },
                ],
              },
            ].map(({ heading, links }) => (
              <div key={heading}>
                <p className="text-xs font-semibold text-zinc-300 mb-3 uppercase tracking-wider">{heading}</p>
                <ul className="space-y-2">
                  {links.map(({ label, hash }) => (
                    <li key={label}>
                      <a
                        href={hash ? `#${hash}` : '#'}
                        onClick={hash ? (e) => {
                          e.preventDefault()
                          document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
                        } : undefined}
                        className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        {label}
                      </a>
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
