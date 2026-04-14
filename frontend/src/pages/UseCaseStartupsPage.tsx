import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

function Check() {
  return (
    <svg className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  )
}

export default function UseCaseStartupsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-[40%] right-0 w-[400px] h-[400px] bg-emerald-700/8 rounded-full blur-[120px]" />
      </div>

      <Navbar />

      <div className="relative z-10">

        {/* Hero */}
        <section className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
            </svg>
            For Startups
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.05] mb-6">
            Move fast.<br />
            <span className="text-indigo-400">Ship with the structure of a big team.</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-10">
            At a startup, every hour counts. You can't afford to spend half your week writing docs that nobody reads — but you also can't afford to ship without clear requirements and aligned teams. Product Path gives you both.
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
            <p className="text-xs font-semibold text-rose-400 uppercase tracking-widest mb-3">The startup reality</p>
            <h2 className="text-3xl font-bold text-white">Speed and structure feel like a trade-off. They're not.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { stat: '1 PM', label: 'for every 8–10 engineers at most early-stage startups', sub: 'That\'s one person responsible for all the product clarity', color: 'text-rose-400' },
              { stat: '42%', label: 'of startup product failures trace back to unclear requirements', sub: 'CB Insights startup post-mortem analysis, 2023', color: 'text-amber-400' },
              { stat: '$140k+', label: 'average PM salary — often out of reach at seed stage', sub: 'An experienced PM is expensive. Product Path isn\'t.', color: 'text-violet-400' },
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
            <h2 className="text-3xl font-bold text-white">The PM leverage startups need</h2>
          </div>

          {[
            {
              icon: '🚀',
              title: 'One PM doing the work of three',
              desc: 'At a startup, your PM (or your founder acting as PM) needs to produce PRDs, user stories, stakeholder updates, competitive briefs, and sprint goals — often in the same day. Product Path compresses that output to minutes per doc.',
              bullets: ['Full PRDs in under 10 minutes from a prompt', 'User stories generated from your requirements', 'Stakeholder and investor updates drafted instantly', 'Sprint goals and OKRs from your product strategy'],
            },
            {
              icon: '🎯',
              title: 'Ship the right thing the first time',
              desc: 'Startups can\'t afford to build the wrong feature. Product Path coaches you on your product decisions before you commit — flagging weak success metrics, challenging your assumptions, and asking the questions investors and customers will ask.',
              bullets: ['Validates your problem statement before you build', 'Flags weak success metrics and vague goals', 'Surfaces competitive and market considerations', 'Stress-tests your solution against user needs'],
            },
            {
              icon: '👥',
              title: 'Get every teammate thinking like a PM',
              desc: 'At a 10-person startup, everyone is part of the product team. Engineers, designers, and even founders need to write clear requirements and make aligned decisions. Product Path gives your whole team the product mindset — without the PM title.',
              bullets: ['Engineers write their own specs without a bottleneck', 'Designers capture decisions in structured formats', 'Founders communicate product vision clearly', 'New hires ramp faster with built-in PM structure'],
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

        {/* Pricing highlight */}
        <section className="max-w-4xl mx-auto px-6 pb-24">
          <div className="bg-gradient-to-br from-indigo-950/60 to-zinc-900/60 border border-indigo-700/40 rounded-2xl p-10 text-center">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-3">Startup-friendly pricing</p>
            <h2 className="text-2xl font-bold text-white mb-3">Senior PM quality. Fraction of the cost.</h2>
            <p className="text-zinc-400 text-sm max-w-lg mx-auto mb-8">
              A senior PM costs $140k+ per year. Product Path starts free and scales to $19/month — giving your startup the product structure it needs without the headcount.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-8">
              {[
                { plan: 'Free', price: '$0/mo', desc: '40 chats, core PM prompts' },
                { plan: 'Pro', price: '$19/mo', desc: 'Unlimited chats, full team features' },
              ].map(({ plan, price, desc }) => (
                <div key={plan} className="text-center">
                  <p className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-1">{plan}</p>
                  <p className="text-3xl font-bold text-white">{price}</p>
                  <p className="text-xs text-zinc-500 mt-1">{desc}</p>
                </div>
              ))}
            </div>
            <Link to="/pricing" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
              See full pricing →
            </Link>
          </div>
        </section>

        {/* Quotes */}
        <section className="max-w-5xl mx-auto px-6 pb-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                text: "I'm the only PM at a company of 30. Product Path is basically my entire team. I output what a team of three would normally produce.",
                name: 'Rahul S.', role: 'Solo PM', company: 'Seed-stage startup',
                color: 'bg-emerald-600',
              },
              {
                text: "We couldn't afford a senior PM when we were at 8 people. Product Path let our CTO write specs that our contractors could actually build from. It saved us from at least two bad builds.",
                name: 'Alex M.', role: 'Co-founder & CEO', company: 'Pre-seed startup',
                color: 'bg-indigo-600',
              },
            ].map(({ text, name, role, company, color }) => (
              <div key={name} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed flex-1">"{text}"</p>
                <div className="flex items-center gap-3 pt-3 border-t border-zinc-800">
                  <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-white text-xs font-bold`}>{name[0]}</div>
                  <div>
                    <p className="text-xs font-semibold text-zinc-200">{name}</p>
                    <p className="text-[11px] text-zinc-500">{role} · {company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-6 pb-24 text-center">
          <div className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-indigo-950/40 to-zinc-900/40 p-12">
            <h2 className="text-3xl font-bold text-white mb-3">Build faster. Ship smarter.</h2>
            <p className="text-zinc-400 text-sm mb-8 max-w-md mx-auto">Start free today — no credit card, no setup. Get your first PRD in 8 minutes.</p>
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
