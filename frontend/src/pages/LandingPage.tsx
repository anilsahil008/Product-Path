import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white relative overflow-hidden">

      {/* Gradient blobs */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[900px] h-[700px] bg-indigo-600/20 rounded-full blur-[150px]" />
        <div className="absolute top-[5%] left-[15%] w-[500px] h-[450px] bg-violet-700/15 rounded-full blur-[120px]" />
        <div className="absolute top-[5%] right-[10%] w-[450px] h-[400px] bg-blue-600/10 rounded-full blur-[110px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <Link to="/">
          <img src="/logo-dark.svg" alt="Product Path" className="h-8 select-none" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/product"   className="text-sm text-zinc-400 hover:text-white transition-colors">Product</Link>
          <Link to="/pricing"   className="text-sm text-zinc-400 hover:text-white transition-colors">Pricing</Link>
          <Link to="/resources" className="text-sm text-zinc-400 hover:text-white transition-colors">Resources</Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm text-zinc-400 hover:text-white transition-colors px-4 py-2"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Start free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-28 pb-24">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse flex-shrink-0" />
          Now in beta — free for early teams
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-semibold tracking-tight text-white max-w-3xl leading-[1.08]">
          Build products<br />
          <span className="text-indigo-400">with confidence.</span>
        </h1>

        {/* Subheadline */}
        <p className="mt-6 text-lg text-zinc-400 max-w-lg leading-relaxed">
          Your AI co-pilot for product management. Write PRDs, align stakeholders, and ship faster — without the chaos.
        </p>

        {/* CTAs */}
        <div className="flex items-center gap-4 mt-10">
          <Link
            to="/signup"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Start for free
          </Link>
          <Link
            to="/app"
            className="flex items-center gap-2 px-6 py-3 text-zinc-300 hover:text-white text-sm font-medium transition-colors"
          >
            Try the demo
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Product preview shell */}
      <section className="relative z-10 max-w-5xl mx-auto px-8 pb-24">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm overflow-hidden shadow-[0_0_80px_rgba(99,102,241,0.08)]">
          {/* Window chrome */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800 bg-zinc-900/80">
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
            <div className="ml-4 flex-1 bg-zinc-800 rounded-md h-5 max-w-xs" />
          </div>

          {/* Inner preview */}
          <div className="flex min-h-[340px]">
            {/* Fake sidebar */}
            <div className="w-48 border-r border-zinc-800 p-3 space-y-1 hidden sm:block">
              {['Write a PRD', 'Prioritize features', 'Align stakeholders', 'Sprint planning'].map((label, i) => (
                <div key={i} className={`h-7 rounded-md ${i === 0 ? 'bg-zinc-700' : 'bg-zinc-800/60'}`} />
              ))}
            </div>

            {/* Fake chat area */}
            <div className="flex-1 p-6 space-y-4 flex flex-col justify-end">
              <div className="self-end max-w-xs bg-indigo-600/80 rounded-xl rounded-tr-sm px-4 py-2.5 text-sm text-white">
                Write a PRD for a user onboarding redesign
              </div>
              <div className="self-start max-w-sm bg-zinc-800 rounded-xl rounded-tl-sm px-4 py-2.5 text-sm text-zinc-300 space-y-1">
                <div className="h-2.5 bg-zinc-600 rounded w-full" />
                <div className="h-2.5 bg-zinc-600 rounded w-4/5" />
                <div className="h-2.5 bg-zinc-600 rounded w-3/5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-800 px-8 py-6 max-w-7xl mx-auto flex items-center justify-between">
        <span className="text-xs text-zinc-600">© 2025 Product Path. All rights reserved.</span>
        <div className="flex gap-6">
          <Link to="/privacy" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Privacy</Link>
          <Link to="/terms"   className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Terms</Link>
        </div>
      </footer>

    </div>
  )
}
