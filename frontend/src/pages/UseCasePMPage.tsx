import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

function Check() {
  return (
    <svg className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  )
}

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

export default function UseCasePMPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-[40%] right-0 w-[400px] h-[400px] bg-violet-700/8 rounded-full blur-[120px]" />
      </div>

      <Navbar />

      <div className="relative z-10">

        {/* Hero */}
        <section className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            For Product Managers
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.05] mb-6">
            Stop writing docs.<br />
            <span className="text-indigo-400">Start shipping product.</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10">
            You became a PM to make product decisions — not to spend 40% of your week writing requirements, one-pagers, and stakeholder updates. Product Path handles the writing so you can focus on what matters.
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
            <p className="text-xs font-semibold text-rose-400 uppercase tracking-widest mb-3">The reality</p>
            <h2 className="text-3xl font-bold text-white">A typical PM week looks like this</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { stat: '40%', label: 'of your week writing docs', sub: 'PRDs, one-pagers, meeting notes, stakeholder updates', color: 'text-rose-400' },
              { stat: '3–4 hrs', label: 'per PRD from scratch', sub: 'And that\'s before the revision rounds with eng and design', color: 'text-amber-400' },
              { stat: '8 people', label: 'need alignment per feature', sub: 'Each needing a slightly different version of the same doc', color: 'text-violet-400' },
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
        <section className="max-w-5xl mx-auto px-6 pb-24 space-y-6">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">How Product Path helps</p>
            <h2 className="text-3xl font-bold text-white">Built for how PMs actually work</h2>
          </div>

          {[
            {
              icon: '📄',
              title: 'Write a PRD in 8 minutes, not 4 hours',
              desc: 'Paste an idea, a Slack thread, or meeting notes. Product Path structures it into a complete PRD — problem statement, goals, user stories, success metrics, and open questions — ready for stakeholder review.',
              bullets: ['PRDs, one-pagers, and user stories from a prompt', 'Success metrics tied to your OKRs automatically', 'Open questions and assumptions flagged upfront', 'Tailored to your product domain and team context'],
            },
            {
              icon: '🧠',
              title: 'Get CPO-level coaching before every review',
              desc: 'Product Path reviews your work like a seasoned Chief Product Officer — identifying strategic gaps, challenging weak assumptions, and coaching you to sharpen your thinking before stakeholders push back.',
              bullets: ['Flags missing user research and weak success metrics', 'Challenges assumptions before execs do', 'Suggests frameworks you may not have considered', 'Personalized to your product domain (B2B, consumer, platform)'],
            },
            {
              icon: '🔄',
              title: 'Iterate in real time with your context intact',
              desc: "Ask follow-up questions, request rewrites, drill into specific sections. Product Path remembers everything you've said — your product, your constraints, your users — so every response builds on the last.",
              bullets: ['"Make the metrics more specific to mobile retention"', '"Add a non-goals section for the eng team"', '"Rewrite this for a non-technical audience"', '"What would a CPO push back on here?"'],
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

        {/* Transformation */}
        <section className="max-w-4xl mx-auto px-6 pb-24">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">The results</p>
            <h2 className="text-3xl font-bold text-white">What PMs report after 30 days</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { stat: '8 min', label: 'avg time to first PRD draft' },
              { stat: '8 hrs/wk', label: 'saved on documentation' },
              { stat: '94%', label: 'say they ship faster' },
              { stat: '3×', label: 'improvement in doc quality' },
            ].map(({ stat, label }) => (
              <div key={stat} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-center">
                <p className="text-2xl font-bold text-indigo-400">{stat}</p>
                <p className="text-xs text-zinc-500 mt-1.5 leading-snug">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews */}
        <section className="max-w-5xl mx-auto px-6 pb-24">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white">What PMs are saying</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { text: 'I wrote a full PRD in 18 minutes that would have taken me most of the day. My team thought I\'d stayed up all night.', name: 'Priya M.', role: 'Senior PM, Series B SaaS' },
              { text: 'The coaching feature caught three strategic gaps in my roadmap before my exec review. Saved me from a very awkward meeting.', name: 'Divya R.', role: 'Head of Product, Series C' },
              { text: 'I\'m the only PM at a 30-person company. Product Path is basically my entire team. I output what a team of three would normally produce.', name: 'Rahul S.', role: 'Solo PM, Seed Startup' },
            ].map(({ text, name, role }) => (
              <div key={name} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
                <Stars />
                <p className="text-sm text-zinc-300 leading-relaxed">"{text}"</p>
                <div className="pt-3 border-t border-zinc-800">
                  <p className="text-xs font-semibold text-zinc-200">{name}</p>
                  <p className="text-[11px] text-zinc-500">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-6 pb-24 text-center">
          <div className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-indigo-950/40 to-zinc-900/40 p-12">
            <h2 className="text-3xl font-bold text-white mb-3">Ready to get your time back?</h2>
            <p className="text-zinc-400 text-sm mb-8 max-w-md mx-auto">Start with your next PRD, your current backlog, or just an idea you've been sitting on. Free to start, no credit card.</p>
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
