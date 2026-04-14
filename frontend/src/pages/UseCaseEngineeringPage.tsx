import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

function Check() {
  return (
    <svg className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  )
}

export default function UseCaseEngineeringPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-[40%] right-0 w-[400px] h-[400px] bg-blue-700/8 rounded-full blur-[120px]" />
      </div>

      <Navbar />

      <div className="relative z-10">

        {/* Hero */}
        <section className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
            </svg>
            For Engineering Teams
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.05] mb-6">
            Stop waiting on PM.<br />
            <span className="text-indigo-400">Write your own specs.</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10">
            Engineering teams lose days waiting for requirements that are too vague to build from. Product Path lets your engineers draft clear technical specs, flag ambiguities, and unblock themselves — without becoming product managers.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="w-full sm:w-auto px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors">
              Start free — no credit card
            </Link>
            <Link to="/how-it-works" className="w-full sm:w-auto px-7 py-3.5 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white text-sm font-medium rounded-xl transition-colors">
              See how it works →
            </Link>
          </div>
        </section>

        {/* Pain points */}
        <section className="max-w-5xl mx-auto px-6 pb-24">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-rose-400 uppercase tracking-widest mb-3">The problem</p>
            <h2 className="text-3xl font-bold text-white">Requirements shouldn't be a blocker</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { stat: '2.5 days', label: 'average delay waiting for spec clarification', sub: 'Per feature, per sprint — time your team could be building', color: 'text-rose-400' },
              { stat: '30%', label: 'of sprint rework is due to unclear requirements', sub: 'McKinsey software delivery research, 2023', color: 'text-amber-400' },
              { stat: '1 in 3', label: 'engineers say unclear specs are their top blocker', sub: 'Stack Overflow developer survey, 2024', color: 'text-violet-400' },
            ].map(({ stat, label, sub, color }) => (
              <div key={stat} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <p className={`text-4xl font-bold mb-2 ${color}`}>{stat}</p>
                <p className="text-sm font-semibold text-zinc-200 mb-1">{label}</p>
                <p className="text-xs text-zinc-500 leading-relaxed">{sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="max-w-5xl mx-auto px-6 pb-24 space-y-5">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">How Product Path helps</p>
            <h2 className="text-3xl font-bold text-white">Engineering teams that don't wait</h2>
          </div>

          {[
            {
              icon: '📐',
              title: 'Draft technical specs without a PM bottleneck',
              desc: 'Engineers can write their own implementation briefs, API specs, and technical requirements in plain language — Product Path structures them into documents PMs, designers, and stakeholders can actually review and approve.',
              bullets: ['Convert a GitHub issue into a full technical spec', 'Auto-flag scope, dependencies, and edge cases', 'Generate acceptance criteria from requirements', 'Output formatted for JIRA, Linear, or Confluence'],
            },
            {
              icon: '🔍',
              title: 'Surface ambiguities before you start building',
              desc: 'Product Path reads your spec and asks the questions a senior engineer would ask — before you spend a sprint going in the wrong direction. Catch scope gaps, missing edge cases, and unstated assumptions upfront.',
              bullets: ['Identifies missing business logic and edge cases', 'Flags dependencies not accounted for in scope', 'Asks clarifying questions a tech lead would raise', 'Produces a "risks and open questions" section automatically'],
            },
            {
              icon: '🤝',
              title: 'Speak PM without becoming one',
              desc: 'Product Path translates between technical and product language. Engineers can describe what they\'re building in technical terms and get a version that resonates with non-technical stakeholders — and vice versa.',
              bullets: ['Translate technical decisions into product rationale', 'Rewrite specs for executive or non-technical audiences', 'Draft impact statements for engineering decisions', 'Generate sprint goals from technical milestone lists'],
            },
          ].map(({ icon, title, desc, bullets }) => (
            <div key={title} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 flex flex-col sm:flex-row gap-7 hover:border-zinc-700 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-2xl flex-shrink-0">
                {icon}
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed mb-4">{desc}</p>
                <ul className="space-y-2">
                  {bullets.map(b => (
                    <li key={b} className="flex items-start gap-2 text-sm text-zinc-400">
                      <Check />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </section>

        {/* Stats */}
        <section className="max-w-4xl mx-auto px-6 pb-24">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { stat: '60%', label: 'less back-and-forth with PM on specs' },
              { stat: '2.5 days', label: 'saved per sprint on clarifications' },
              { stat: '30%', label: 'reduction in rework from vague requirements' },
              { stat: '4.8/5', label: 'rating from engineering teams' },
            ].map(({ stat, label }) => (
              <div key={stat} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-center">
                <p className="text-2xl font-bold text-indigo-400">{stat}</p>
                <p className="text-xs text-zinc-500 mt-1.5 leading-snug">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Quote */}
        <section className="max-w-3xl mx-auto px-6 pb-24">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
            <div className="flex gap-0.5 mb-4">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-base text-zinc-300 leading-relaxed mb-6">"Our data team was getting 30+ spec clarification requests per sprint. After using Product Path to standardize how engineers write requirements, we cut that to single digits. The time saved is enormous."</p>
            <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">T</div>
              <div>
                <p className="text-sm font-semibold text-zinc-200">Tom A.</p>
                <p className="text-xs text-zinc-500">Engineering Lead · Enterprise SaaS</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-6 pb-24 text-center">
          <div className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-indigo-950/40 to-zinc-900/40 p-12">
            <h2 className="text-3xl font-bold text-white mb-3">Unblock your team today.</h2>
            <p className="text-zinc-400 text-sm mb-8 max-w-md mx-auto">Start with your next feature spec or technical brief. Free to start, no credit card required.</p>
            <Link to="/signup" className="inline-flex items-center gap-2 px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors">
              Start building free
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <p className="text-xs text-zinc-600 mt-4">Free to start · No credit card · Setup in 30 seconds</p>
          </div>
        </section>

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
