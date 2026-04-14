/**
 * Navbar — public marketing site only.
 * Mount inside LandingPage (and any future public pages).
 * Do NOT render inside /app/* routes — the app has its own Sidebar.
 */

import type { ReactNode, MouseEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ProductDropdown from './ProductDropdown'

// Anchor links scroll to a section on the landing page.
// If we're already on '/', just scroll. Otherwise navigate there first.
function AnchorLink({ hash, children }: { hash: string; children: ReactNode }) {
  const location = useLocation()

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const el = document.getElementById(hash)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    } else if (location.pathname !== '/') {
      // Not on landing page — navigate there with hash so it scrolls after load
      window.location.href = `/#${hash}`
    }
  }

  return (
    <a
      href={`#${hash}`}
      onClick={handleClick}
      className="px-3.5 py-2 text-[13px] font-medium leading-none text-zinc-400 transition-colors duration-150 hover:text-zinc-100"
    >
      {children}
    </a>
  )
}

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-zinc-950/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[54px] max-w-[1280px] items-center justify-between px-5">

        {/* ── Left: logo ─────────────────────────────────────────────── */}
        <Link to="/" className="flex flex-shrink-0 items-center select-none">
          <img src="/logo-dark.svg" alt="Product Path" className="h-[26px] w-auto" />
        </Link>

        {/* ── Centre: nav links ───────────────────────────────────────── */}
        <nav className="hidden items-center md:flex" aria-label="Main navigation">

          {/* Product — with dropdown on hover */}
          <div className="group relative">
            <a
              href="#"
              className="flex items-center gap-1 px-3.5 py-2 text-[13px] font-medium leading-none text-zinc-400 transition-colors duration-150 hover:text-zinc-100"
            >
              Product
              <svg
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                strokeWidth={2.5} stroke="currentColor"
                className="h-3 w-3 opacity-50 transition-transform duration-200 group-hover:rotate-180"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </a>

            {/* Dropdown — visible on group hover, CSS only */}
            <div className="invisible absolute opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100">
              <ProductDropdown />
            </div>
          </div>

          {/* Enterprise — page route */}
          <Link
            to="/enterprise"
            className="px-3.5 py-2 text-[13px] font-medium leading-none text-zinc-400 transition-colors duration-150 hover:text-zinc-100"
          >
            Enterprise
          </Link>

          {/* Anchor links — scroll to section on landing page */}
          <AnchorLink hash="reviews">Customers</AnchorLink>
          <Link
            to="/pricing"
            className="px-3.5 py-2 text-[13px] font-medium leading-none text-zinc-400 transition-colors duration-150 hover:text-zinc-100"
          >
            Pricing
          </Link>

          {/* Resources — placeholder page */}
          <Link
            to="/resources"
            className="px-3.5 py-2 text-[13px] font-medium leading-none text-zinc-400 transition-colors duration-150 hover:text-zinc-100"
          >
            Resources
          </Link>

          <AnchorLink hash="reviews">Reviews</AnchorLink>
          <Link
            to="/how-it-works"
            className="px-3.5 py-2 text-[13px] font-medium leading-none text-zinc-400 transition-colors duration-150 hover:text-zinc-100"
          >
            How it works
          </Link>
          <Link
            to="/how-ai-works"
            className="px-3.5 py-2 text-[13px] font-medium leading-none text-zinc-400 transition-colors duration-150 hover:text-zinc-100"
          >
            How AI works
          </Link>
        </nav>

        {/* ── Right: actions ──────────────────────────────────────────── */}
        <div className="flex items-center gap-1">
          <Link
            to="/login"
            className="hidden sm:block px-3.5 py-1.5 text-[13px] font-medium text-zinc-400 transition-colors duration-150 hover:text-zinc-100"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="ml-1 flex items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-1.5 text-[13px] font-semibold text-white shadow-sm transition-all duration-150 hover:bg-indigo-500 hover:scale-[1.02] active:scale-[0.98]"
          >
            Start free
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {/* ── Mobile hamburger ────────────────────────────────────────── */}
        <button
          className="flex items-center justify-center rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-zinc-100 transition-colors md:hidden"
          aria-label="Open menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

      </div>
    </header>
  )
}
