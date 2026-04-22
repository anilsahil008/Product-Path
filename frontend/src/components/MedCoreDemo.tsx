import { useState } from 'react'

interface Props {
  onBack: () => void
  onSend: (text: string, mode: string) => void
  isStreaming: boolean
}

const MODULES = [
  {
    num: 1, icon: '📱', title: 'Member Engagement',
    tagline: 'Reaches every Medicaid member — no matter what device they have',
    color: 'indigo',
    mustHave: [
      'Active Medicaid member roster',
      'Member contact data — phone or address',
      'HIPAA BAA signed with client',
      'At least one channel available — SMS, app, or kiosk',
      'Language requirements defined',
    ],
    turnsOff: [
      'No member contact data available',
      'Client uses a different engagement vendor',
      'State has restrictions on member outreach',
      'HIPAA agreement not yet signed',
    ],
    addOns: [
      'Incentive program — rewards for engagement',
      'Multi-language beyond English + Spanish',
      'Branded MCO experience',
      'Kiosk hardware deployment',
      'In-home tablet program',
    ],
    example: 'Molina California — 40,000 member roster, phone numbers for 60% of members, HIPAA BAA signed, needs EN + ES, no incentive program yet. → Module ON: SMS + kiosk, EN + ES, incentives OFF until funded.',
    prompt: 'Write a detailed PRD for a Member Engagement module in a configurable Medicaid platform. Cover: activation requirements, channel configurations (SMS via Twilio, React Native app, Android kiosk, in-home tablet), language and accessibility requirements, optional add-ons (incentive program, branded MCO experience), success metrics (engagement rate, no-show reduction), and a rollout plan. Format as a professional PM PRD.',
  },
  {
    num: 2, icon: '🏘️', title: 'SDOH Screening + Referral',
    tagline: 'Finds what\'s really making members sick — and fixes it automatically',
    color: 'emerald',
    mustHave: [
      'State Medicaid program requires SDOH screening',
      'CMS waiver includes SDOH requirements',
      'MCO has community resource budget',
      'FindHelp network available in service area',
      'Care coordinator team exists to act on referrals',
      'Member consent for SDOH data collection',
    ],
    turnsOff: [
      'State does not require SDOH reporting',
      'No community resources in service area',
      'No care team to follow up on referrals',
      'Client uses separate SDOH vendor',
      'Budget not approved for community resources',
    ],
    addOns: [
      'Auto-NEMT booking via LogistiCare',
      'Housing navigator integration',
      'Food bank direct ordering',
      'CMS closed-loop reporting',
      'SDOH outcome dashboard for executives',
    ],
    example: 'State of California — CMS Section 1115 waiver requires SDOH outcome data, FindHelp statewide, coordinators at all 12 sites, CMS deadline in 90 days. → Module ON immediately, all add-ons including auto-NEMT and CMS reporting activated.',
    prompt: 'Write a product brief for an SDOH Screening and Referral module in a Medicaid platform. Include: screening question sets (food, housing, transportation, safety), FindHelp API integration approach, automated NEMT booking via LogistiCare, closed-loop referral tracking, CMS reporting requirements, care coordinator workflow, and success metrics (% connected within 48 hours, CMS compliance rate).',
  },
  {
    num: 3, icon: '🏠', title: 'HCBS Care Coordination',
    tagline: 'Coordinates all home-based care in one place — EVV compliant out of the box',
    color: 'teal',
    mustHave: [
      'Client runs HCBS or LTSS Medicaid program',
      'State EVV mandate is active',
      'Home health workers exist in the program',
      'HHAeXchange integration approved',
      'Member care plans exist or will be created',
      'Care coordinator team assigned',
    ],
    turnsOff: [
      'Client does not run HCBS program',
      'State EVV not yet mandated',
      'No home health workers in program',
      'Client uses different EVV vendor',
      'Managed care only — no home services',
    ],
    addOns: [
      'Remote monitoring — Withings devices',
      'In-home tablet deployment',
      'Family caregiver portal',
      'Telehealth via Zoom SDK',
      'Real-time vitals dashboard',
    ],
    example: 'Molina California — HCBS program for 40,000 elderly members, CA EVV mandate active, 500 home health workers, HHAeXchange already in use. → Module ON: CA EVV format, remote monitoring for 3,200 highest-need members, in-home tablets for homebound only.',
    prompt: 'Write a product requirements brief for an HCBS Care Coordination module in a configurable Medicaid platform. Cover: federal EVV mandate requirements, state-by-state EVV format differences (Florida, California, Texas), HHAeXchange integration data flow, remote monitoring via Withings devices, care plan management, care team alert workflows, and what happens when a state changes their EVV format (should take days to reconfigure, not months).',
  },
  {
    num: 4, icon: '🧠', title: 'Behavioral Health',
    tagline: 'Checks on mental health at every touchpoint — 42 CFR Part 2 compliant',
    color: 'violet',
    mustHave: [
      'Client serves behavioral health Medicaid population',
      'State behavioral health parity requirements exist',
      '42 CFR Part 2 compliance capability confirmed',
      'Separate member consent for BH data',
      'Behavioral health providers in network',
      'Crisis response protocol defined',
    ],
    turnsOff: [
      'Client does not serve BH population',
      'Separate BH vendor already contracted',
      '42 CFR Part 2 compliance not yet set up',
      'No crisis response protocol in place',
      'State manages BH separately from MCO',
    ],
    addOns: [
      'PHQ-9 depression screening',
      'GAD-7 anxiety screening',
      'AUDIT-C substance use screening',
      'Crisis Text Line API integration',
      'BH + physical health integration',
    ],
    example: 'Centene Florida — serves BH Medicaid population, FL parity requirements active, 42 CFR Part 2 confirmed, crisis protocol defined with local centers. → Module ON: PHQ-9 + GAD-7, Crisis Text Line integrated, BH + physical health integration ON.',
    prompt: 'Write a compliance specification for a Behavioral Health module in a Medicaid SaaS platform. Include: 42 CFR Part 2 data protection requirements (what it covers, how it differs from standard HIPAA), member consent workflow, data segregation architecture, PHQ-9 and GAD-7 automated screening triggers, Crisis Text Line API integration for 24/7 crisis response, and how BH data integrates with the physical health record while maintaining 42 CFR Part 2 protections.',
  },
  {
    num: 5, icon: '📊', title: 'Compliance Reporting',
    tagline: 'Auto-generates every Medicaid report — zero manual work',
    color: 'amber',
    mustHave: [
      'State Medicaid contract requires reporting',
      'EVV mandate active in state',
      'CMS federal reporting requirements exist',
      'Client has compliance team to receive reports',
      'Data sources connected — EVV, member, SDOH',
      'Report formats defined by state',
    ],
    turnsOff: [
      'Client has separate reporting vendor',
      'State reporting not yet required',
      'Data sources not yet connected',
      'Client manages compliance manually by choice',
    ],
    addOns: [
      'Executive Tableau dashboard',
      'HEDIS measure tracking',
      'Star Ratings monitoring',
      'Audit preparation package',
      'CMS federal closed-loop reporting',
    ],
    example: 'Almost always ON for every client. Every MCO and state program has compliance requirements. Variable is which reports: EVV format per state, HEDIS per MCO, CMS templates per waiver. Configuration takes days — module is already built.',
    prompt: 'Write a product brief for an automated Compliance Reporting module in a Medicaid platform. Cover: how reports are auto-generated from live platform data (Salesforce Scheduled Flows + SQL pipelines), state-by-state EVV report format differences, HEDIS measure tracking, Star Ratings monitoring, CMS federal reporting, audit preparation workflows, and how the system handles state format changes without engineering sprints. Include the business case: 15 hours per week eliminated, audit prep 3 weeks to 2 days.',
  },
  {
    num: 6, icon: '🧭', title: 'Member Navigation',
    tagline: 'Helps members understand and actually use their Medicaid benefits',
    color: 'sky',
    mustHave: [
      'MCO has defined benefits catalog',
      'Provider network directory available',
      'Member-facing digital channel exists',
      'Benefits data API or feed available',
      'MCO wants members to self-serve',
      'Language requirements defined',
    ],
    turnsOff: [
      'State program — not MCO driven',
      'Benefits managed by separate member portal',
      'No digital channel for members',
      'MCO has call center handling all navigation',
      'Benefits catalog not yet digitized',
    ],
    addOns: [
      'Claude AI conversational navigator',
      'Benefit expiration alerts',
      'Appointment scheduling integration',
      'Provider distance and language filter',
      'Multi-language support beyond 2 languages',
    ],
    example: 'Centene Florida — full benefits catalog, provider directory API available, wants self-serve to reduce call center volume. → Module ON: Claude AI navigator, EN + ES + Creole, scheduling + benefit alerts ON. CA State Program → Module OFF: state does not run MCO benefits.',
    prompt: 'Write a PRD for a Member Navigation module in a Medicaid platform powered by the Claude API as a conversational AI navigator. Cover: benefits discovery flow, provider finder with language and distance filter, appointment scheduling integration, benefit expiration alert logic, how the Claude API navigator handles member questions in plain language (no medical jargon), multi-language support, and why this module is OFF for state programs vs ON for MCOs. Include success metrics.',
  },
  {
    num: 7, icon: '🤖', title: 'AI Risk Prediction',
    tagline: 'Predicts health crises before they happen — moves care from reactive to proactive',
    color: 'rose',
    mustHave: [
      'Minimum 6 months of member data exists',
      'At least 3 other modules already active',
      'Care coordinator team exists to act on alerts',
      'Client has ER utilization reduction goal',
      'Data science capability or partnership',
      'Member data sharing consent obtained',
      'Minimum member population — 5,000+',
    ],
    turnsOff: [
      'Less than 6 months member data',
      'Population too small — under 5,000',
      'No care team to act on predictions',
      'No data sharing consent',
      'Client not ready for AI — trust not built',
      'Fewer than 3 modules active — not enough data',
    ],
    addOns: [
      'ER visit prediction model',
      'No-show prediction model',
      'Behavioral health crisis prediction',
      'Medication non-adherence prediction',
      'Population health dashboard',
    ],
    example: 'Molina California — 2 years of data, modules 1+3+5 active, 200 coordinators, ER reduction is #1 goal, 40,000 members. → Module ON: ER + no-show prediction active. New MCO with 3,000 members → Module OFF until population and data grow.',
    prompt: 'Write a product requirements brief for an AI Risk Prediction module in a Medicaid care management platform. Include: minimum data requirements (6+ months, 5,000+ members, 3+ modules active), model inputs (SDOH flags, PHQ-9 scores, ER history, appointment no-shows, medication patterns), prediction outputs (30-day ER risk score, no-show probability), how predictions surface to care coordinators (daily priority list), care coordinator workflow integration, success metrics (ER reduction %, revenue recovered), and explicit criteria for when NOT to activate — including what happens if a client activates too early.',
  },
]

const COLOR_MAP: Record<string, { header: string; dot: string; mustHave: string; turnsOff: string; addOn: string; example: string; btn: string }> = {
  indigo:  { header: 'bg-indigo-500/10 border-indigo-500/20',  dot: 'bg-indigo-400',  mustHave: 'text-indigo-400',  turnsOff: 'text-rose-400',   addOn: 'text-amber-400',   example: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300',  btn: 'bg-indigo-600/20 border-indigo-500/40 text-indigo-400 hover:bg-indigo-600/30' },
  emerald: { header: 'bg-emerald-500/10 border-emerald-500/20', dot: 'bg-emerald-400', mustHave: 'text-emerald-400', turnsOff: 'text-rose-400',   addOn: 'text-amber-400',   example: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300', btn: 'bg-emerald-600/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-600/30' },
  teal:    { header: 'bg-teal-500/10 border-teal-500/20',      dot: 'bg-teal-400',    mustHave: 'text-teal-400',    turnsOff: 'text-rose-400',   addOn: 'text-amber-400',   example: 'bg-teal-500/10 border-teal-500/20 text-teal-300',        btn: 'bg-teal-600/20 border-teal-500/40 text-teal-400 hover:bg-teal-600/30' },
  violet:  { header: 'bg-violet-500/10 border-violet-500/20',  dot: 'bg-violet-400',  mustHave: 'text-violet-400',  turnsOff: 'text-rose-400',   addOn: 'text-amber-400',   example: 'bg-violet-500/10 border-violet-500/20 text-violet-300',  btn: 'bg-violet-600/20 border-violet-500/40 text-violet-400 hover:bg-violet-600/30' },
  amber:   { header: 'bg-amber-500/10 border-amber-500/20',    dot: 'bg-amber-400',   mustHave: 'text-amber-400',   turnsOff: 'text-rose-400',   addOn: 'text-amber-400',   example: 'bg-amber-500/10 border-amber-500/20 text-amber-300',    btn: 'bg-amber-600/20 border-amber-500/40 text-amber-400 hover:bg-amber-600/30' },
  sky:     { header: 'bg-sky-500/10 border-sky-500/20',        dot: 'bg-sky-400',     mustHave: 'text-sky-400',     turnsOff: 'text-rose-400',   addOn: 'text-amber-400',   example: 'bg-sky-500/10 border-sky-500/20 text-sky-300',          btn: 'bg-sky-600/20 border-sky-500/40 text-sky-400 hover:bg-sky-600/30' },
  rose:    { header: 'bg-rose-500/10 border-rose-500/20',      dot: 'bg-rose-400',    mustHave: 'text-rose-400',    turnsOff: 'text-rose-400',   addOn: 'text-amber-400',   example: 'bg-rose-500/10 border-rose-500/20 text-rose-300',        btn: 'bg-rose-600/20 border-rose-500/40 text-rose-400 hover:bg-rose-600/30' },
}

export default function MedCoreDemo({ onBack, onSend, isStreaming }: Props) {
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <div className="flex flex-col h-full bg-zinc-950 select-none">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800 flex-shrink-0">
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
          <span className="text-sm font-bold text-zinc-100">Medicaid Platform</span>
          <span className="text-xs text-zinc-500">— 7 Modules · Activation Requirements</span>
        </div>
        <span className="text-[10px] text-zinc-500">Click any module to expand</span>
      </div>

      {/* Module grid */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
          {MODULES.map(m => {
            const c = COLOR_MAP[m.color]
            const isOpen = expanded === m.num
            return (
              <div
                key={m.num}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden transition-all"
              >
                {/* Tile header — always visible */}
                <button
                  className="w-full text-left p-4 hover:bg-zinc-800/40 transition-colors"
                  onClick={() => setExpanded(isOpen ? null : m.num)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl border flex-shrink-0 ${c.header}`}>
                        {m.icon}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] text-zinc-600 font-mono">0{m.num}</span>
                          <span className="text-sm font-bold text-zinc-100">{m.title}</span>
                        </div>
                        <p className="text-xs text-zinc-400 leading-snug">{m.tagline}</p>
                      </div>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                      strokeWidth={2} stroke="currentColor"
                      className={`w-4 h-4 text-zinc-600 flex-shrink-0 mt-1 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </button>

                {/* Expanded content */}
                {isOpen && (
                  <div className="px-4 pb-4 border-t border-zinc-800 pt-4 space-y-4">

                    {/* 3-column requirements */}
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <p className="text-[10px] font-semibold text-emerald-500 uppercase tracking-wider mb-2">Must have to turn ON</p>
                        <ul className="space-y-1.5">
                          {m.mustHave.map(r => (
                            <li key={r} className="flex gap-2 text-xs text-zinc-300 leading-snug">
                              <span className="text-emerald-500 flex-shrink-0 mt-0.5">✓</span>{r}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-rose-500 uppercase tracking-wider mb-2">Turns OFF if</p>
                        <ul className="space-y-1.5">
                          {m.turnsOff.map(r => (
                            <li key={r} className="flex gap-2 text-xs text-zinc-400 leading-snug">
                              <span className="text-rose-500 flex-shrink-0 mt-0.5">✕</span>{r}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-amber-500 uppercase tracking-wider mb-2">Optional add-ons</p>
                        <ul className="space-y-1.5">
                          {m.addOns.map(r => (
                            <li key={r} className="flex gap-2 text-xs text-zinc-400 leading-snug">
                              <span className="text-amber-500 flex-shrink-0 mt-0.5">+</span>{r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Real example */}
                    <div className={`rounded-xl border px-3 py-2.5 ${c.example}`}>
                      <p className="text-[10px] font-semibold uppercase tracking-wider mb-1 opacity-70">Real decision example</p>
                      <p className="text-xs leading-relaxed">{m.example}</p>
                    </div>

                    {/* Ask AI button */}
                    <button
                      onClick={() => onSend(m.prompt, 'pm')}
                      disabled={isStreaming}
                      className={`w-full py-2 rounded-xl border text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${c.btn}`}
                    >
                      Ask Product Path AI about Module {m.num} →
                    </button>

                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
