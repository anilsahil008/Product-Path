import Navbar from '../components/Navbar'

// ── Trust stat ────────────────────────────────────────────────────────────────
function TrustStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-lg font-bold text-white">{value}</span>
      <span className="text-sm text-indigo-200/70 leading-tight">{label}</span>
    </div>
  )
}

// ── Form field ────────────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
        {label}
      </label>
      {children}
    </div>
  )
}

const inputCls = `
  w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5
  text-[13px] text-zinc-800 placeholder-zinc-400
  outline-none ring-0
  transition-colors duration-150
  focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100
`

// ── Enterprise hero ───────────────────────────────────────────────────────────
export default function EnterprisePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950">

      {/* ── Background gradient ─────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 select-none">
        {/* Primary bloom — top center */}
        <div className="absolute -top-32 left-1/2 h-[700px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[140px]" />
        {/* Secondary — left */}
        <div className="absolute left-[-10%] top-[15%] h-[500px] w-[500px] rounded-full bg-violet-700/15 blur-[120px]" />
        {/* Tertiary — right */}
        <div className="absolute right-[-5%] top-[5%] h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-[110px]" />
        {/* Subtle bottom wash */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-zinc-950/80 to-transparent" />
      </div>

      {/* ── Navbar ──────────────────────────────────────────────────── */}
      <Navbar />

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-20 lg:pt-28">
        <div className="flex flex-col items-start gap-16 lg:flex-row lg:items-center lg:gap-20">

          {/* ── LEFT: Text content ──────────────────────────────────── */}
          <div className="flex-1 space-y-8">

            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-indigo-300">
                Enterprise
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-1">
              <h1 className="text-5xl font-bold leading-[1.06] tracking-tight text-white sm:text-6xl lg:text-[64px]">
                AI product
              </h1>
              <h1 className="text-5xl font-bold leading-[1.06] tracking-tight text-white sm:text-6xl lg:text-[64px]">
                management
              </h1>
              <h1 className="text-5xl font-bold leading-[1.06] tracking-tight sm:text-6xl lg:text-[64px]">
                <span className="text-indigo-400">at scale.</span>
              </h1>
            </div>

            {/* Subheadline */}
            <p className="max-w-lg text-base leading-relaxed text-zinc-400 sm:text-[17px]">
              Give your entire product organization a trusted AI product partner.
              Enterprise security, team collaboration, and custom workflows built
              for teams that ship world-class products.
            </p>

            {/* Trust stats */}
            <div className="flex flex-wrap gap-x-8 gap-y-4 border-t border-white/[0.07] pt-8">
              <TrustStat value="10k+"     label="PMs trust us" />
              <div className="w-px self-stretch bg-white/[0.07]" />
              <TrustStat value="SOC 2"    label="Type II certified" />
              <div className="w-px self-stretch bg-white/[0.07]" />
              <TrustStat value="80%"      label="less doc time" />
            </div>

            {/* Social proof quote */}
            <figure className="max-w-md space-y-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5">
              <blockquote className="text-sm leading-relaxed text-zinc-300 italic">
                "Product Path has fundamentally changed how our team operates.
                We cut doc creation time by 80% while improving quality.
                It's the rare tool that both PMs and leadership love."
              </blockquote>
              <figcaption className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white flex-shrink-0">
                  VP
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-200">VP of Product</p>
                  <p className="text-[11px] text-zinc-500">Fortune 500 company</p>
                </div>
              </figcaption>
            </figure>

          </div>

          {/* ── RIGHT: Demo form card ────────────────────────────────── */}
          <div className="w-full flex-shrink-0 lg:w-[420px]">
            <div className="
              rounded-2xl border border-white/[0.09]
              bg-zinc-50 p-7
              shadow-[0_32px_80px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.06)]
            ">

              {/* Card header */}
              <div className="mb-6 space-y-1">
                <h2 className="text-xl font-bold text-zinc-900">
                  Talk to our team
                </h2>
                <p className="text-sm leading-relaxed text-zinc-500">
                  See how Product Path helps teams build products
                  with confidence.
                </p>
              </div>

              {/* Form — visual only */}
              <form className="space-y-4" onSubmit={e => e.preventDefault()}>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Full name">
                    <input
                      type="text"
                      placeholder="Jane Smith"
                      className={inputCls}
                      readOnly
                    />
                  </Field>
                  <Field label="Work email">
                    <input
                      type="email"
                      placeholder="jane@company.com"
                      className={inputCls}
                      readOnly
                    />
                  </Field>
                </div>

                <Field label="Company">
                  <input
                    type="text"
                    placeholder="Acme Corp"
                    className={inputCls}
                    readOnly
                  />
                </Field>

                <Field label="Team size">
                  <select className={`${inputCls} cursor-default appearance-none`} disabled>
                    <option value="">Select team size</option>
                    <option>1–10</option>
                    <option>11–50</option>
                    <option>51–200</option>
                    <option>200+</option>
                  </select>
                </Field>

                <Field label="What are you looking for?">
                  <textarea
                    rows={3}
                    placeholder="Tell us about your team's product challenges…"
                    className={`${inputCls} resize-none`}
                    readOnly
                  />
                </Field>

                {/* CTA */}
                <button
                  type="submit"
                  className="
                    mt-1 w-full rounded-xl
                    bg-indigo-600 hover:bg-indigo-500
                    px-5 py-3
                    text-[14px] font-semibold text-white
                    shadow-sm
                    transition-all duration-150
                    hover:scale-[1.01] active:scale-[0.99]
                  "
                >
                  Schedule a demo
                </button>

                <p className="text-center text-[11px] text-zinc-400">
                  No spam. We'll get back to you within one business day.
                </p>

              </form>
            </div>

            {/* Security badges below card */}
            <div className="mt-4 flex items-center justify-center gap-5">
              {[
                { icon: '🔒', text: 'SOC 2 Type II' },
                { icon: '🌍', text: 'GDPR compliant' },
                { icon: '🔐', text: 'Data never trains AI' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                  <span>{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

    </div>
  )
}
