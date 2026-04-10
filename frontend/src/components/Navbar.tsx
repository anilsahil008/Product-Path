/**
 * Navbar — public marketing site only.
 * Mount inside LandingPage (and any future public pages).
 * Do NOT render inside /app/* routes — the app has its own Sidebar.
 *
 * To mount:  import Navbar from '../components/Navbar'
 *            <Navbar />   ← place above your page content
 */

const NAV_LINKS = [
  'Product',
  'Enterprise',
  'Customers',
  'Pricing',
  'Resources',
  'Reviews',
  'How it works',
  'How AI works',
]

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-zinc-950/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[54px] max-w-[1280px] items-center justify-between px-5">

        {/* ── Left: logo ──────────────────────────────────────────────── */}
        <div className="flex flex-shrink-0 items-center gap-2.5 select-none">
          <img
            src="/logo-dark.svg"
            alt="Product Path"
            className="h-[26px] w-auto"
          />
        </div>

        {/* ── Centre: nav links ────────────────────────────────────────── */}
        <nav className="hidden items-center md:flex" aria-label="Main navigation">
          {NAV_LINKS.map((label) => (
            <a
              key={label}
              href="#"
              className="
                px-3.5 py-2
                text-[13px] font-medium leading-none
                text-zinc-400
                transition-colors duration-150
                hover:text-zinc-100
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-indigo-500 focus-visible:ring-offset-1
                focus-visible:ring-offset-zinc-950 rounded-sm
              "
            >
              {label}
            </a>
          ))}
        </nav>

        {/* ── Right: actions ───────────────────────────────────────────── */}
        <div className="flex items-center gap-1">
          {/* Log in — plain text */}
          <a
            href="#"
            className="
              hidden sm:block
              px-3.5 py-1.5
              text-[13px] font-medium
              text-zinc-400 hover:text-zinc-100
              transition-colors duration-150
              rounded-md
            "
          >
            Log in
          </a>

          {/* Start free — solid primary CTA */}
          <a
            href="#"
            className="
              ml-1 flex items-center gap-1.5
              rounded-full
              bg-indigo-600 hover:bg-indigo-500
              px-4 py-1.5
              text-[13px] font-semibold text-white
              transition-all duration-150
              hover:scale-[1.02] active:scale-[0.98]
              shadow-sm
            "
          >
            Start free
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5"
              aria-hidden="true"
            >
              <path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>

        {/* ── Mobile: hamburger placeholder ────────────────────────────── */}
        <button
          className="flex items-center justify-center rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-zinc-100 transition-colors md:hidden"
          aria-label="Open menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

      </div>
    </header>
  )
}
