import { useState } from 'react'

interface Props {
  onBack: () => void
  onSend: (text: string, mode: string) => void
  isStreaming: boolean
}

type ClientKey = 'centene' | 'molina' | 'state_ca' | 'rural_tx'
type RightTab = 'modules' | 'journey' | 'outcomes'
type ModuleStatus = 'active' | 'inactive' | 'optional'

const CLIENTS: Record<ClientKey, { name: string; sub: string; members: string; active: number; color: string }> = {
  centene:  { name: 'Centene',             sub: 'Florida · Large MCO',        members: '85,000', active: 7, color: 'sky' },
  molina:   { name: 'Molina Healthcare',   sub: 'California · Mid MCO',       members: '40,000', active: 6, color: 'emerald' },
  state_ca: { name: 'State of CA — DHCS',  sub: 'California · State Program', members: '50,000', active: 5, color: 'violet' },
  rural_tx: { name: 'Small Rural MCO',     sub: 'Texas · Rural',              members: '10,000', active: 3, color: 'amber' },
}

interface ModuleConfig {
  status: ModuleStatus
  config: string
  outcome: string
}

const MODULE_DEFS = [
  { num: 1, id: 'engagement',  icon: '📱', title: 'Member Engagement',       tagline: 'Reaches every member — no matter what device they have', tools: ['Twilio', 'React Native', 'Android Kiosk', 'Firebase', 'SOTI MDM'] },
  { num: 2, id: 'sdoh',        icon: '🏘️', title: 'SDOH Screening + Referral', tagline: 'Finds what\'s really making members sick — and fixes it automatically', tools: ['Salesforce Flows', 'FindHelp API', 'LogistiCare', 'Tableau'] },
  { num: 3, id: 'hcbs',        icon: '🏠', title: 'HCBS Care Coordination',  tagline: 'Coordinates all home-based care — EVV compliant out of the box', tools: ['Salesforce Health Cloud', 'HHAeXchange', 'Withings', 'Zoom SDK'] },
  { num: 4, id: 'behavioral',  icon: '🧠', title: 'Behavioral Health',        tagline: 'Checks mental health at every touchpoint — 42 CFR Part 2 compliant', tools: ['SF Health Cloud Shield', 'PHQ-9 + GAD-7', 'Crisis Text Line', 'Twilio'] },
  { num: 5, id: 'compliance',  icon: '📊', title: 'Compliance Reporting',     tagline: 'Auto-generates every Medicaid report — zero manual work', tools: ['Salesforce Reports', 'Scheduled Flows', 'HHAeXchange', 'Tableau', 'SQL + Python'] },
  { num: 6, id: 'navigation',  icon: '🧭', title: 'Member Navigation',        tagline: 'Helps members understand and actually use their Medicaid benefits', tools: ['Salesforce Health Cloud', 'Claude API', 'Provider Directory', 'Twilio'] },
  { num: 7, id: 'ai_risk',     icon: '🤖', title: 'AI Risk Prediction',       tagline: 'Predicts health crises 30 days before they happen', tools: ['Python ML Models', 'Claude API', 'Salesforce Einstein', 'Tableau'] },
]

const CLIENT_MODULES: Record<ClientKey, Record<string, ModuleConfig>> = {
  centene: {
    engagement: { status: 'active',   config: 'SMS + Mobile + Kiosk + In-Home · EN / ES / Creole · Incentive program ON',         outcome: 'No-show 34% → 11% in 90 days' },
    sdoh:       { status: 'active',   config: 'Full suite · Auto-NEMT · Housing navigator · CMS closed-loop reporting',             outcome: '61% connected to resource in 48 hrs' },
    hcbs:       { status: 'active',   config: 'Florida EVV format · In-home tablets · Remote monitoring all HCBS members',          outcome: 'Vitals alerted in 15 min. EVV change in 4 days' },
    behavioral: { status: 'active',   config: 'PHQ-9 + GAD-7 + AUDIT-C · Crisis Text Line · BH + Physical integrated',             outcome: 'Engagement 6% → 31% in 60 days' },
    compliance: { status: 'active',   config: 'Florida EVV · HEDIS · Tableau exec dashboard · Audit package',                       outcome: '15 hrs/week eliminated. Audit prep 3 wks → 2 days' },
    navigation: { status: 'active',   config: 'Claude AI navigator · EN / ES / Creole · Scheduling + benefit expiration alerts',    outcome: '24/7 answers. Members discover unused benefits' },
    ai_risk:    { status: 'active',   config: 'ER prediction + BH crisis + no-show model · Population health dashboard',            outcome: 'ER visits -22%. $1.2M revenue recovered' },
  },
  molina: {
    engagement: { status: 'active',   config: 'SMS + Kiosk · EN / ES · Rural cellular SIM · No incentives yet',                    outcome: 'No-show 34% → 11% in 90 days' },
    sdoh:       { status: 'active',   config: 'Core screening + NEMT · Rural CA questions · Food + housing focus',                  outcome: '61% connected in 48 hrs' },
    hcbs:       { status: 'active',   config: 'California EVV format · Remote monitoring 3,200 highest-need members',              outcome: 'EVV format changed in 4 days. Zero state penalties' },
    behavioral: { status: 'active',   config: 'PHQ-9 only · California 42 CFR consent · No AUDIT-C yet',                           outcome: 'BH screening at every touchpoint' },
    compliance: { status: 'active',   config: 'CA EVV · Molina Star Ratings · CMS reporting · Auto every Monday',                  outcome: '15 hrs/week eliminated' },
    navigation: { status: 'inactive', config: 'OFF — no digitized benefits catalog yet',                                            outcome: '—' },
    ai_risk:    { status: 'active',   config: 'ER prediction + no-show model · 40K members · 2 years data',                        outcome: 'ER visits -22%' },
  },
  state_ca: {
    engagement: { status: 'optional', config: 'Optional — county-managed outreach. State can activate statewide if needed',         outcome: 'Pilot: 74% adoption in 90 days' },
    sdoh:       { status: 'active',   config: 'Full suite · CMS 1115 waiver closed-loop · Statewide FindHelp · NEMT',              outcome: 'CMS federal funding secured in 90 days' },
    hcbs:       { status: 'active',   config: 'Statewide EVV · Unified member record across all 58 counties',                      outcome: 'Zero care gaps when member moves county' },
    behavioral: { status: 'inactive', config: 'OFF — behavioral health managed by county mental health departments',                 outcome: '—' },
    compliance: { status: 'active',   config: 'CMS federal reports · 1115 waiver compliance · All state EVV formats',              outcome: 'Audit prep 3 wks → 2 days statewide' },
    navigation: { status: 'inactive', config: 'OFF — state does not run MCO benefits directly',                                     outcome: '—' },
    ai_risk:    { status: 'active',   config: 'Population health model · Statewide 50K members · County-level risk scoring',       outcome: '$200M in projected statewide savings' },
  },
  rural_tx: {
    engagement: { status: 'active',   config: 'SMS only · EN / ES · Rural cellular SIM · No app or kiosk yet',                    outcome: 'Members reached with zero Wi-Fi or smartphone' },
    sdoh:       { status: 'inactive', config: 'OFF — no care coordinator team to act on referrals yet',                             outcome: '—' },
    hcbs:       { status: 'active',   config: 'Basic EVV only · Texas format · No remote monitoring yet',                          outcome: 'EVV compliant. State contract penalty avoided' },
    behavioral: { status: 'inactive', config: 'OFF — county manages behavioral health separately',                                   outcome: '—' },
    compliance: { status: 'active',   config: 'Basic EVV reports · Texas format · Minimal state reporting',                        outcome: 'Manual reporting eliminated' },
    navigation: { status: 'inactive', config: 'OFF — population too small and benefits not yet digitized',                          outcome: '—' },
    ai_risk:    { status: 'inactive', config: 'OFF — under 5,000 member minimum threshold for AI model',                           outcome: '—' },
  },
}

const JOURNEY_STEPS = [
  { icon: '🎯', step: 1, title: 'Member Identified',    desc: 'Enrolled in Medicaid. Added to the platform member roster.' },
  { icon: '📋', step: 2, title: 'Profile Built',         desc: 'Phone number, language, accessibility needs, and program type captured.' },
  { icon: '📡', step: 3, title: 'Right Channel Assigned', desc: 'SMS, mobile app, kiosk, or in-home tablet — based on member access.' },
  { icon: '🏘️', step: 4, title: 'SDOH Screening',       desc: 'Food, housing, transportation, and safety needs checked automatically.' },
  { icon: '🏠', step: 5, title: 'Care Coordination',     desc: 'Home visits scheduled, EVV tracked, care team notified in real time.' },
  { icon: '💬', step: 6, title: 'Proactive Engagement',  desc: 'Appointment reminders and benefit alerts sent in their language.' },
  { icon: '🤖', step: 7, title: 'AI Monitors Risk',      desc: 'Risk of ER visit predicted 30 days ahead. Care coordinator alerted.' },
  { icon: '✅', step: 8, title: 'Outcome',               desc: 'Member stays healthy. ER visit avoided. MCO Star Rating improves.' },
]

const OUTCOMES = [
  { label: 'HCBS No-Show Rate',          before: '34%',         after: '11%',    direction: 'down', color: 'emerald' },
  { label: 'SDOH Members Connected',     before: 'Manual',      after: '61% / 48 hrs', direction: 'up', color: 'sky' },
  { label: 'Manual Reporting Eliminated', before: '15 hrs/wk',  after: '0 hrs',  direction: 'down', color: 'violet' },
  { label: 'ER Visits Reduced',          before: 'Baseline',    after: '−22%',   direction: 'down', color: 'emerald' },
  { label: 'Platform Adoption',          before: '0%',          after: '74% / 90 days', direction: 'up', color: 'sky' },
  { label: 'Revenue Recovered',          before: '$0',          after: '$1.2M',  direction: 'up', color: 'amber' },
  { label: 'Statewide Projected Savings', before: 'Status quo', after: '$200M',  direction: 'up', color: 'violet' },
  { label: 'Audit Prep Time',            before: '3 weeks',     after: '2 days', direction: 'down', color: 'emerald' },
]

const STATUS_STYLES: Record<ModuleStatus, { badge: string; dot: string; label: string }> = {
  active:   { badge: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30', dot: 'bg-emerald-400', label: 'Active' },
  inactive: { badge: 'bg-zinc-800 text-zinc-500 border border-zinc-700',               dot: 'bg-zinc-600',    label: 'Inactive' },
  optional: { badge: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',      dot: 'bg-amber-400',   label: 'Optional' },
}

const CLIENT_BORDER: Record<ClientKey, string> = {
  centene:  'border-sky-500/60 bg-sky-500/10',
  molina:   'border-emerald-500/60 bg-emerald-500/10',
  state_ca: 'border-violet-500/60 bg-violet-500/10',
  rural_tx: 'border-amber-500/60 bg-amber-500/10',
}

const CLIENT_DOT: Record<ClientKey, string> = {
  centene:  'bg-sky-400',
  molina:   'bg-emerald-400',
  state_ca: 'bg-violet-400',
  rural_tx: 'bg-amber-400',
}

export default function MedCoreDemo({ onBack, onSend, isStreaming }: Props) {
  const [activeClient, setActiveClient] = useState<ClientKey>('centene')
  const [rightTab, setRightTab] = useState<RightTab>('modules')

  const clientKeys = Object.keys(CLIENTS) as ClientKey[]
  const modules = CLIENT_MODULES[activeClient]

  return (
    <div className="flex flex-col h-full bg-zinc-950 select-none">

      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800/80 bg-slate-950/60 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            Back
          </button>
          <span className="text-zinc-700">|</span>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-sky-600 flex items-center justify-center text-[10px] font-black text-white">MC</span>
            <span className="text-sm font-bold text-zinc-100">MedCore</span>
            <span className="text-xs text-zinc-500">— Medicaid Platform Configurator</span>
          </div>
        </div>
        <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-2 py-0.5 font-semibold">⚠ Demo — not live data</span>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left sidebar — client selection */}
        <div className="w-52 flex-shrink-0 border-r border-slate-800/80 bg-slate-950/40 flex flex-col p-3 gap-2 overflow-y-auto">
          <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider px-1 mb-1">Select Client</p>
          {clientKeys.map(ck => {
            const c = CLIENTS[ck]
            const isActive = activeClient === ck
            return (
              <button
                key={ck}
                onClick={() => setActiveClient(ck)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  isActive
                    ? `${CLIENT_BORDER[ck]} border`
                    : 'border-slate-800/60 bg-slate-900/40 hover:bg-slate-800/40 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isActive ? CLIENT_DOT[ck] : 'bg-zinc-600'}`} />
                  <span className="text-xs font-bold text-zinc-200 leading-tight">{c.name}</span>
                </div>
                <p className="text-[10px] text-zinc-500 mb-2 pl-4">{c.sub}</p>
                <div className="pl-4 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-zinc-600">Members</span>
                    <span className="text-[10px] font-semibold text-zinc-300">{c.members}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-zinc-600">Modules</span>
                    <span className={`text-[10px] font-bold ${c.active === 7 ? 'text-emerald-400' : c.active >= 5 ? 'text-sky-400' : c.active >= 4 ? 'text-violet-400' : 'text-amber-400'}`}>
                      {c.active} / 7
                    </span>
                  </div>
                  {/* mini module dots */}
                  <div className="flex gap-0.5 mt-0.5">
                    {MODULE_DEFS.map(m => {
                      const s = CLIENT_MODULES[ck][m.id].status
                      return (
                        <span key={m.id} className={`w-2 h-2 rounded-full ${STATUS_STYLES[s].dot}`} />
                      )
                    })}
                  </div>
                </div>
              </button>
            )
          })}

          {/* Legend */}
          <div className="mt-auto pt-3 border-t border-slate-800/50 space-y-1.5 px-1">
            <p className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider">Status</p>
            {(['active', 'optional', 'inactive'] as ModuleStatus[]).map(s => (
              <div key={s} className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${STATUS_STYLES[s].dot}`} />
                <span className="text-[10px] text-zinc-500 capitalize">{STATUS_STYLES[s].label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Right tab bar */}
          <div className="flex items-center gap-1.5 px-5 py-3 border-b border-slate-800/80 flex-shrink-0">
            {([
              { key: 'modules', label: '📦 Modules' },
              { key: 'journey', label: '🗺️ Member Journey' },
              { key: 'outcomes', label: '📈 Outcomes' },
            ] as { key: RightTab; label: string }[]).map(t => (
              <button
                key={t.key}
                onClick={() => setRightTab(t.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  rightTab === t.key
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-800/60 text-zinc-400 hover:text-zinc-200 hover:bg-slate-800'
                }`}
              >
                {t.label}
              </button>
            ))}
            <span className="ml-auto text-[10px] text-zinc-600">
              Showing: <span className="text-zinc-400 font-semibold">{CLIENTS[activeClient].name} · {CLIENTS[activeClient].sub}</span>
            </span>
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-5">

            {/* MODULES TAB */}
            {rightTab === 'modules' && (
              <div className="grid grid-cols-2 gap-3">
                {MODULE_DEFS.map(m => {
                  const cfg = modules[m.id]
                  const st = STATUS_STYLES[cfg.status]
                  const isOn = cfg.status === 'active'
                  return (
                    <div
                      key={m.id}
                      className={`rounded-xl border p-4 transition-all ${
                        isOn
                          ? 'bg-slate-900/70 border-slate-700/60'
                          : 'bg-slate-900/30 border-slate-800/40 opacity-60'
                      }`}
                    >
                      {/* Module header */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{m.icon}</span>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-zinc-600 font-mono">0{m.num}</span>
                              <span className="text-xs font-bold text-zinc-100">{m.title}</span>
                            </div>
                            <p className="text-[10px] text-zinc-500 leading-tight mt-0.5">{m.tagline}</p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${st.badge}`}>
                          {st.label}
                        </span>
                      </div>

                      {/* Config */}
                      <div className="bg-slate-800/50 rounded-lg px-3 py-2 mb-2">
                        <p className="text-[10px] text-zinc-400 leading-relaxed">{cfg.config}</p>
                      </div>

                      {/* Tools */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        {m.tools.map(t => (
                          <span key={t} className="text-[9px] text-sky-400 bg-sky-500/10 border border-sky-500/20 rounded-full px-1.5 py-0.5 font-medium">
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Outcome */}
                      {isOn && cfg.outcome !== '—' && (
                        <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-2.5 py-1.5">
                          <span className="text-emerald-400 text-[10px]">●</span>
                          <p className="text-[10px] text-emerald-400 font-semibold">{cfg.outcome}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* MEMBER JOURNEY TAB */}
            {rightTab === 'journey' && (
              <div className="max-w-2xl mx-auto">
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-zinc-100 mb-1">How a Medicaid member gets help through the platform</h3>
                  <p className="text-xs text-zinc-500">From enrollment to outcome — 8 steps, fully automated.</p>
                </div>
                <div className="space-y-2">
                  {JOURNEY_STEPS.map((step, idx) => (
                    <div key={step.step} className="relative">
                      <div className="flex items-start gap-4 bg-slate-900/70 border border-slate-700/50 rounded-xl p-4">
                        <div className="flex flex-col items-center gap-1 flex-shrink-0">
                          <span className="w-9 h-9 rounded-xl bg-sky-600/20 border border-sky-500/30 flex items-center justify-center text-lg">
                            {step.icon}
                          </span>
                          <span className="text-[9px] text-zinc-600 font-mono">Step {step.step}</span>
                        </div>
                        <div className="flex-1 pt-0.5">
                          <p className="text-xs font-bold text-zinc-100 mb-1">{step.title}</p>
                          <p className="text-xs text-zinc-400 leading-relaxed">{step.desc}</p>
                        </div>
                      </div>
                      {idx < JOURNEY_STEPS.length - 1 && (
                        <div className="flex justify-start ml-[22px] py-1">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-sky-600/50">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25-7.5 7.5-7.5-7.5" />
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* OUTCOMES TAB */}
            {rightTab === 'outcomes' && (
              <div className="space-y-5">
                {/* Big number cards */}
                <div>
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Real Platform Outcomes</p>
                  <div className="grid grid-cols-4 gap-3">
                    {OUTCOMES.map(o => (
                      <div key={o.label} className="bg-slate-900/70 border border-slate-700/50 rounded-xl p-3">
                        <p className="text-[10px] text-zinc-500 mb-2 leading-tight">{o.label}</p>
                        <div className="flex items-end gap-2 mb-1">
                          <span className={`text-lg font-black ${
                            o.color === 'emerald' ? 'text-emerald-400' :
                            o.color === 'sky' ? 'text-sky-400' :
                            o.color === 'violet' ? 'text-violet-400' : 'text-amber-400'
                          }`}>{o.after}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className={`text-[9px] ${o.direction === 'down' ? 'text-emerald-500' : 'text-sky-500'}`}>
                            {o.direction === 'down' ? '↓' : '↑'}
                          </span>
                          <span className="text-[9px] text-zinc-600">from {o.before}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comparison matrix */}
                <div>
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Module × Client Matrix</p>
                  <div className="bg-slate-900/70 border border-slate-700/50 rounded-xl overflow-hidden">
                    {/* Header */}
                    <div className="grid grid-cols-5 border-b border-slate-700/50">
                      <div className="px-3 py-2.5 text-[10px] font-semibold text-zinc-500">Module</div>
                      {clientKeys.map(ck => (
                        <div key={ck} className="px-3 py-2.5 text-center">
                          <p className="text-[10px] font-bold text-zinc-300">{CLIENTS[ck].name}</p>
                          <p className="text-[9px] text-zinc-600">{CLIENTS[ck].sub.split('·')[0].trim()}</p>
                        </div>
                      ))}
                    </div>
                    {/* Rows */}
                    {MODULE_DEFS.map((m, idx) => (
                      <div key={m.id} className={`grid grid-cols-5 ${idx < MODULE_DEFS.length - 1 ? 'border-b border-slate-800/60' : ''}`}>
                        <div className="px-3 py-2.5 flex items-center gap-2">
                          <span className="text-sm">{m.icon}</span>
                          <span className="text-[10px] font-semibold text-zinc-300">{m.title}</span>
                        </div>
                        {clientKeys.map(ck => {
                          const s = CLIENT_MODULES[ck][m.id].status
                          return (
                            <div key={ck} className="px-3 py-2.5 flex items-center justify-center">
                              <span className={`w-2.5 h-2.5 rounded-full ${STATUS_STYLES[s].dot}`} title={s} />
                            </div>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                  {/* Legend */}
                  <div className="flex items-center gap-4 mt-2 px-1">
                    {(['active', 'optional', 'inactive'] as ModuleStatus[]).map(s => (
                      <div key={s} className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${STATUS_STYLES[s].dot}`} />
                        <span className="text-[10px] text-zinc-500 capitalize">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Interview quote bar */}
      <div className="flex-shrink-0 bg-slate-900 border-t border-slate-700/60 px-6 py-3 flex items-center justify-center">
        <p className="text-xs text-slate-300 text-center italic leading-relaxed">
          "Three Medicaid clients. Three different state programs. Mobile, kiosk, and in-home. One platform. That is how I think."
        </p>
      </div>

    </div>
  )
}
