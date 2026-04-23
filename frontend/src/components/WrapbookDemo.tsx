import { useState } from 'react'

// ── Types ──────────────────────────────────────────────────────────────────────

type WrapTab = 'platform' | 'onboarding' | 'systems' | 'ai'

interface ProductArea {
  icon: string
  name: string
  description: string
  userTypes: string[]
  pmQuestions: string[]
  color: string
}

interface OnboardStep {
  num: number
  name: string
  painPoint: string
  goodLooksLike: string
  complianceFlags: string[]
  owner: string
}

interface SystemCard {
  name: string
  icon: string
  description: string
  complexity: string
  pmOwns: string[]
  color: string
}

// ── Data ───────────────────────────────────────────────────────────────────────

const PRODUCT_AREAS: ProductArea[] = [
  {
    icon: '🎬',
    name: 'Production Management',
    description: 'Create and manage productions (film, TV, commercial, theater). The core object every other feature hangs off of.',
    userTypes: ['Producer', 'UPM', 'Payroll Admin'],
    pmQuestions: [
      'How does a production get created and who has access by default?',
      'What triggers a production close-out workflow?',
      'How are budgets linked to productions vs departments?',
    ],
    color: 'indigo',
  },
  {
    icon: '👷',
    name: 'Worker Onboarding',
    description: 'Hire and onboard crew across union/non-union, W-2/1099, domestic/international. Most complex compliance surface area.',
    userTypes: ['Worker (Crew)', 'Payroll Admin', 'Production Office'],
    pmQuestions: [
      'What are the hardest steps workers abandon?',
      'How do union eligibility rules get enforced at offer stage?',
      'Where do I-9 verification failures spike?',
    ],
    color: 'violet',
  },
  {
    icon: '💰',
    name: 'Payroll & Timecards',
    description: 'Time entry, approval, payroll runs, check delivery. Integrates with union CBAs, state wage laws, and studio accounting.',
    userTypes: ['Worker (Crew)', 'Department Head', 'Payroll Admin', 'Accountant'],
    pmQuestions: [
      'What is the P0 failure mode — what breaks the pay run?',
      'How are union overtime rules encoded (daily vs weekly)?',
      'Who approves and what is the audit trail?',
    ],
    color: 'amber',
  },
  {
    icon: '📋',
    name: 'Benefits & Insurance',
    description: 'Qualified benefit plans, health/dental/vision enrollment, entertainment industry guild benefits (IATSE, SAG-AFTRA, Teamsters).',
    userTypes: ['Worker (Crew)', 'Payroll Admin'],
    pmQuestions: [
      'How does guild eligibility vs company eligibility differ?',
      'What triggers a qualifying life event re-enrollment?',
      'How do benefits follow a worker across multiple productions?',
    ],
    color: 'emerald',
  },
  {
    icon: '⚖️',
    name: 'Compliance & Tax',
    description: 'Multi-state tax withholding, WOTC, entertainment tax credits, state film incentives, year-end W-2/1099-NEC generation.',
    userTypes: ['Payroll Admin', 'Accountant', 'Production Office'],
    pmQuestions: [
      'Which states have the most frequent rule changes?',
      'How are film tax credit certifications tied to payroll data?',
      'What is the end-to-end W-2 generation and delivery flow?',
    ],
    color: 'rose',
  },
  {
    icon: '🔌',
    name: 'Integrations & Data',
    description: 'Studio accounting (Movie Magic, EP, Showbiz), background check (Checkr), banks (direct deposit), e-verify, and API platform.',
    userTypes: ['Payroll Admin', 'Accountant', 'Developer (API)'],
    pmQuestions: [
      'Which integration breaks most often and why?',
      'How does data flow from offer acceptance to the accounting system?',
      'What is the API strategy — internal tool or external partner?',
    ],
    color: 'sky',
  },
]

const ONBOARD_STEPS: OnboardStep[] = [
  {
    num: 1,
    name: 'Invite Sent',
    painPoint: 'Wrong email, wrong role, or invite goes to spam — worker never starts',
    goodLooksLike: 'Smart role matching from offer letter + SMS fallback + re-send in one click',
    complianceFlags: ['FCRA authorization must precede background check consent'],
    owner: 'Payroll Admin',
  },
  {
    num: 2,
    name: 'Account Creation',
    painPoint: 'Workers create duplicate accounts across productions, breaking identity graph',
    goodLooksLike: 'Phone-number-based deduplication; existing workers skip re-entry',
    complianceFlags: [],
    owner: 'Worker',
  },
  {
    num: 3,
    name: 'Personal Info',
    painPoint: 'Mobile-unfriendly forms, workers on set with spotty signal abandon mid-flow',
    goodLooksLike: 'Autosave every field; offline-tolerant; address autocomplete',
    complianceFlags: ['SSN must be encrypted at rest; display masked after save'],
    owner: 'Worker',
  },
  {
    num: 4,
    name: 'I-9 Verification',
    painPoint: 'Physical document review requires in-person or third-party notary — biggest drop-off',
    goodLooksLike: 'Remote I-9 via authorized representative flow + E-Verify auto-submit within 3 days',
    complianceFlags: ['Must complete within 3 business days of first day of work (USCIS)', 'Retain I-9 3 years after hire OR 1 year after termination, whichever is later'],
    owner: 'Production Office',
  },
  {
    num: 5,
    name: 'W-4 / State Withholding',
    painPoint: 'Workers work in multiple states simultaneously — unclear which state forms apply',
    goodLooksLike: 'Auto-detect work state from production location; surface only required state forms',
    complianceFlags: ['Employees may claim exempt from withholding — must be re-filed each year', 'States with their own withholding forms: CA, NY, NJ, IL, MA, GA, VT, MN, OK'],
    owner: 'Worker',
  },
  {
    num: 6,
    name: 'Direct Deposit',
    painPoint: 'Routing/account errors cause failed ACH, delay pay by 3–5 days',
    goodLooksLike: 'Bank validation via micro-deposit or instant verify (Plaid); live "test deposit" CTA',
    complianceFlags: ['Cannot mandate direct deposit in CA, TX, and several other states'],
    owner: 'Worker',
  },
  {
    num: 7,
    name: 'Union / Guild Setup',
    painPoint: 'Union eligibility is look-up table that production office manages manually in spreadsheets',
    goodLooksLike: 'Integration with guild directories (IATSE, SAG-AFTRA, Teamsters) + CBA rule engine',
    complianceFlags: ['Scale wages, overtime rules, pension/health contributions vary per CBA', 'Low-budget waivers and modified agreements must be tracked separately'],
    owner: 'Payroll Admin',
  },
  {
    num: 8,
    name: 'Approval / Review',
    painPoint: 'Admin must manually verify every packet before activating — bottleneck at scale',
    goodLooksLike: 'Risk-scored auto-approval for clean packets; human review queue for flagged items',
    complianceFlags: ['Background check adverse action notice must be sent before final rejection (FCRA)'],
    owner: 'Payroll Admin',
  },
  {
    num: 9,
    name: 'Active (Ready to Pay)',
    painPoint: 'Worker active but timecard system not synced — first payroll run fails silently',
    goodLooksLike: 'Activation triggers payroll system sync + confirmation email with timecard instructions',
    complianceFlags: [],
    owner: 'System',
  },
]

const SYSTEM_CARDS: SystemCard[] = [
  {
    name: 'RBAC & Identity',
    icon: '🔐',
    description: 'Company → Production → Department → Role → Worker. Each level narrows permissions. A worker on Production A cannot see Production B — even within the same company.',
    complexity: 'Every new feature must answer: which roles see this? which productions? Can a UPM grant access they don\'t have?',
    pmOwns: [
      'Define permission model before building any feature',
      'Audit log requirements (who changed what, when)',
      'Self-service role assignment vs admin-only',
    ],
    color: 'indigo',
  },
  {
    name: 'Approval Workflows',
    icon: '✅',
    description: 'Multi-step approval chains for timecards, offers, and payroll runs. Approvers can be dynamic (department head of the worker) or static (named person).',
    complexity: 'Approval chains must survive approver being out of office, fired, or reassigned mid-production.',
    pmOwns: [
      'Escalation rules: who approves if primary is unavailable?',
      'Bulk approval UX for department heads with 50+ crew',
      'Mobile-first approval (on-set use case)',
    ],
    color: 'emerald',
  },
  {
    name: 'Multi-Tenant Architecture',
    icon: '🏢',
    description: 'Studios, production companies, and lenders are separate tenants. Data must be fully isolated. A payroll admin at Studio A cannot cross-query Studio B data.',
    complexity: 'Lender (financing entity) may own the production company which owns the production. Three-tier tenancy.',
    pmOwns: [
      'Cross-tenant sharing rules (e.g., shared worker database)',
      'White-label vs branded experience per tenant',
      'SLA tiers per tenant size',
    ],
    color: 'violet',
  },
  {
    name: 'Compliance Engine',
    icon: '⚖️',
    description: 'Rules that encode state wage laws, union CBAs, and federal regs. Any payroll run validates against the active ruleset for that production\'s work locations.',
    complexity: 'Rules change. California AB5, NYC salary transparency, annual FLSA updates — the engine must be updateable without a code deploy.',
    pmOwns: [
      'Rule versioning and effective-dating strategy',
      'Proactive notification when a new rule affects active productions',
      'Override capability for edge cases (with audit trail)',
    ],
    color: 'amber',
  },
]

const AI_BEFORES = [
  { task: 'Research union CBA overtime rules for IATSE Local 600', before: '3–4 hrs', after: '15 min', method: 'Claude reads CBA PDF + generates summary table' },
  { task: 'Write PRD for new timecard approval flow', before: '1 day', after: '2 hrs', method: 'Claude drafts from interview notes; you refine edge cases' },
  { task: 'Competitive analysis (Caast, Greenslate, EP, Media Services)', before: '1 week', after: '3 hrs', method: 'Structured prompting + screenshot walkthroughs' },
  { task: 'Map worker onboarding states to compliance requirements', before: '2 days', after: '45 min', method: 'Build interactive reference like this page' },
  { task: 'Interview prep for PM role at payroll/compliance company', before: '2 days', after: '2 hrs', method: 'Claude builds domain-specific briefing (← this page)' },
]

const AI_PM_AREAS = [
  {
    icon: '✅',
    label: 'AI replaces',
    items: ['First-draft PRDs and specs', 'Competitive research summaries', 'Compliance research (starting point)', 'Meeting summary and action items', 'SQL query writing for data pulls'],
    color: 'emerald',
  },
  {
    icon: '🤝',
    label: 'AI augments',
    items: ['User story writing (you add edge cases)', 'Stakeholder communication drafts (you add context)', 'Prioritization frameworks (you add business judgment)', 'Root cause analysis (you validate hypotheses)'],
    color: 'indigo',
  },
  {
    icon: '🚫',
    label: 'AI does not replace',
    items: ['Relationship building with eng/design/ops', 'Deciding what matters (strategy)', 'Reading the room in difficult stakeholder convos', 'Trusting your gut when data is ambiguous', 'Accountability when something ships broken'],
    color: 'rose',
  },
]

const INTERVIEW_QUESTIONS = [
  { q: 'Tell me about a time you shipped a compliance-critical feature under a hard deadline.', hint: "Frame: IATSE/SAG contract dates are fixed. CA AB5 deadlines don't move. Show you've worked in systems where 'ship late' = legal exposure." },
  { q: 'How do you decide what goes into MVP vs later phases?', hint: "Wrapbook sells to productions. A production starts, films, wraps. Show you understand the job-to-be-done timeline drives prioritization, not arbitrary effort buckets." },
  { q: 'How do you work with a payroll operations team that owns the compliance knowledge?', hint: "Ops is the domain expert. PM is the translator and decision-maker. Show you listen, document, and build trust — not 'I own the roadmap.'" },
  { q: 'A large studio customer wants a feature that only 5% of users need. How do you handle it?', hint: "Studios drive ACV. This is a config/enterprise customization decision. Show you understand multi-tenant product strategy, not just feature voting." },
  { q: "Walk me through a complex workflow you've designed end-to-end.", hint: "Pick worker onboarding or timecard approval. Hit: user types, happy path, failure modes, compliance checkpoints, and what you'd do differently." },
]

// ── Color helpers ──────────────────────────────────────────────────────────────

const AREA_COLORS: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  indigo: { bg: 'bg-indigo-950/50', border: 'border-indigo-800/60', text: 'text-indigo-300', dot: 'bg-indigo-500' },
  violet: { bg: 'bg-violet-950/50', border: 'border-violet-800/60', text: 'text-violet-300', dot: 'bg-violet-500' },
  amber:  { bg: 'bg-amber-950/40',  border: 'border-amber-800/50',  text: 'text-amber-300',  dot: 'bg-amber-500'  },
  emerald:{ bg: 'bg-emerald-950/40',border: 'border-emerald-800/50',text: 'text-emerald-300',dot: 'bg-emerald-500'},
  rose:   { bg: 'bg-rose-950/40',   border: 'border-rose-800/50',   text: 'text-rose-300',   dot: 'bg-rose-500'   },
  sky:    { bg: 'bg-sky-950/40',    border: 'border-sky-800/50',    text: 'text-sky-300',    dot: 'bg-sky-500'    },
}

// ── Component ──────────────────────────────────────────────────────────────────

interface Props {
  onBack: () => void
}

export default function WrapbookDemo({ onBack }: Props) {
  const [activeTab, setActiveTab] = useState<WrapTab>('platform')
  const [expandedStep, setExpandedStep] = useState<number | null>(null)
  const [expandedArea, setExpandedArea] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-slate-900 to-zinc-950 border-b border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-900/10 via-transparent to-indigo-900/10 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 pt-6 pb-8">

          {/* Back */}
          <button
            onClick={onBack}
            className="mb-5 flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            ← Back to Product Path
          </button>

          {/* Title row */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2.5 mb-1">
                <span className="text-2xl">🎬</span>
                <span className="text-xs font-bold tracking-widest text-violet-400 uppercase">Wrapbook · Interview Prep</span>
              </div>
              <h1 className="text-3xl font-bold text-zinc-50 tracking-tight leading-tight">
                Entertainment Payroll Platform
              </h1>
              <p className="text-sm text-zinc-400 mt-1.5">
                Senior PM · Domain briefing — production, crew, compliance, and platform systems
              </p>
            </div>
            <div className="flex gap-3 text-center flex-shrink-0">
              {[
                { label: 'Product Areas', val: '6' },
                { label: 'Onboarding Steps', val: '9' },
                { label: 'Unions Supported', val: '3+' },
                { label: 'States', val: '50' },
              ].map(s => (
                <div key={s.label} className="bg-zinc-800/60 border border-zinc-700/50 rounded-xl px-3 py-2 min-w-[64px]">
                  <div className="text-lg font-bold text-violet-300">{s.val}</div>
                  <div className="text-[10px] text-zinc-500 leading-tight mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {([
              { key: 'platform',   label: '🗺️ Platform Map' },
              { key: 'onboarding', label: '👷 Worker Onboarding' },
              { key: 'systems',    label: '⚙️ Platform Systems' },
              { key: 'ai',         label: '🤖 AI in PM Work' },
            ] as { key: WrapTab; label: string }[]).map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={[
                  'px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all',
                  activeTab === t.key
                    ? 'bg-violet-600 text-white shadow-sm shadow-violet-500/30'
                    : 'bg-zinc-800/60 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200',
                ].join(' ')}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────────── */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">

        {/* ── Platform Map ─────────────────────────────────────────────────── */}
        {activeTab === 'platform' && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-bold text-zinc-100 mb-1">Platform Map — 6 Product Areas</h2>
              <p className="text-sm text-zinc-400">Click any area to see PM questions and user types. Know this cold before the interview.</p>
            </div>

            {/* User types legend */}
            <div className="flex flex-wrap gap-2 mb-6">
              {['Producer / UPM', 'Payroll Admin', 'Worker (Crew)', 'Accountant'].map(u => (
                <span key={u} className="text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 px-2.5 py-1 rounded-full">{u}</span>
              ))}
              <span className="text-xs text-zinc-500 self-center ml-1">— primary user types across the platform</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PRODUCT_AREAS.map((area, i) => {
                const c = AREA_COLORS[area.color]
                const open = expandedArea === i
                return (
                  <div key={area.name} className={`border rounded-xl transition-all ${c.bg} ${c.border}`}>
                    <button
                      className="w-full text-left px-5 py-4 flex items-start gap-3"
                      onClick={() => setExpandedArea(open ? null : i)}
                    >
                      <span className="text-2xl mt-0.5 flex-shrink-0">{area.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`font-semibold text-sm ${c.text}`}>{area.name}</span>
                          <span className="text-zinc-500 text-xs flex-shrink-0">{open ? '▲' : '▼'}</span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{area.description}</p>
                        <div className="flex gap-1.5 mt-2 flex-wrap">
                          {area.userTypes.map(u => (
                            <span key={u} className="text-[10px] bg-zinc-800/80 border border-zinc-700/50 text-zinc-400 px-2 py-0.5 rounded-full">{u}</span>
                          ))}
                        </div>
                      </div>
                    </button>

                    {open && (
                      <div className="px-5 pb-5 border-t border-zinc-700/40 pt-4">
                        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">PM Questions to Know Cold</p>
                        <ul className="space-y-2">
                          {area.pmQuestions.map((q, qi) => (
                            <li key={qi} className="flex gap-2 text-xs text-zinc-300">
                              <span className={`mt-0.5 w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold text-white ${c.dot}`}>{qi + 1}</span>
                              <span>{q}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Cross-cutting systems */}
            <div className="mt-6 bg-zinc-900/60 border border-zinc-700/50 rounded-xl p-5">
              <p className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-3">Cross-Cutting Systems (affect every feature)</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: '🔐', name: 'RBAC / Auth', note: 'Who can see what, per production' },
                  { icon: '✅', name: 'Approval Workflows', note: 'Multi-step chains with escalation' },
                  { icon: '🔔', name: 'Notifications', note: 'Email, SMS, in-app — triggered by state changes' },
                  { icon: '📦', name: 'Integrations', note: 'Accounting, background check, banks, e-Verify' },
                ].map(s => (
                  <div key={s.name} className="bg-zinc-800/60 border border-zinc-700/40 rounded-lg px-3 py-3">
                    <div className="text-lg mb-1">{s.icon}</div>
                    <div className="text-xs font-semibold text-zinc-200 mb-0.5">{s.name}</div>
                    <div className="text-[11px] text-zinc-500">{s.note}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Worker Onboarding Flow ────────────────────────────────────────── */}
        {activeTab === 'onboarding' && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-bold text-zinc-100 mb-1">Worker Onboarding — 9-Step Journey</h2>
              <p className="text-sm text-zinc-400">The highest-friction product surface. Compliance failures here = legal exposure. Click each step for details.</p>
            </div>

            {/* Progress bar */}
            <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-2">
              {ONBOARD_STEPS.map((step, i) => (
                <div key={step.num} className="flex items-center flex-shrink-0">
                  <button
                    onClick={() => setExpandedStep(expandedStep === i ? null : i)}
                    className={[
                      'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all',
                      expandedStep === i
                        ? 'bg-violet-600 border-violet-500 text-white scale-110'
                        : step.complianceFlags.length > 0
                          ? 'bg-amber-900/40 border-amber-600/60 text-amber-300 hover:border-amber-500'
                          : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200',
                    ].join(' ')}
                  >
                    {step.num}
                  </button>
                  {i < ONBOARD_STEPS.length - 1 && (
                    <div className="w-6 h-0.5 bg-zinc-700 mx-0.5" />
                  )}
                </div>
              ))}
              <div className="ml-4 flex items-center gap-3 text-[10px] text-zinc-500 flex-shrink-0">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-700 inline-block" />Compliance flag</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-zinc-700 inline-block" />Standard step</span>
              </div>
            </div>

            {/* Steps list */}
            <div className="space-y-2">
              {ONBOARD_STEPS.map((step, i) => {
                const open = expandedStep === i
                const hasCompliance = step.complianceFlags.length > 0
                return (
                  <div
                    key={step.num}
                    className={[
                      'border rounded-xl transition-all',
                      hasCompliance
                        ? 'bg-amber-950/20 border-amber-800/40'
                        : 'bg-zinc-900/50 border-zinc-800/50',
                    ].join(' ')}
                  >
                    <button
                      className="w-full text-left px-5 py-3.5 flex items-center gap-4"
                      onClick={() => setExpandedStep(open ? null : i)}
                    >
                      <span className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${hasCompliance ? 'bg-amber-800/60 text-amber-300' : 'bg-zinc-800 text-zinc-400'}`}>
                        {step.num}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-zinc-100">{step.name}</span>
                          {hasCompliance && <span className="text-[10px] bg-amber-900/60 border border-amber-700/50 text-amber-300 px-1.5 py-0.5 rounded-full">⚠️ Compliance</span>}
                          <span className="text-[10px] bg-zinc-800 border border-zinc-700 text-zinc-500 px-1.5 py-0.5 rounded-full ml-auto flex-shrink-0">{step.owner}</span>
                        </div>
                        {!open && <p className="text-xs text-zinc-500 mt-0.5 truncate">{step.painPoint}</p>}
                      </div>
                      <span className="text-zinc-600 text-xs flex-shrink-0">{open ? '▲' : '▼'}</span>
                    </button>

                    {open && (
                      <div className="px-5 pb-5 border-t border-zinc-800/50 pt-4 space-y-4">
                        <div>
                          <p className="text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-1">Pain Point</p>
                          <p className="text-sm text-zinc-300">{step.painPoint}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">What Good Looks Like</p>
                          <p className="text-sm text-zinc-300">{step.goodLooksLike}</p>
                        </div>
                        {hasCompliance && (
                          <div>
                            <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">Compliance Flags</p>
                            <ul className="space-y-1">
                              {step.complianceFlags.map((f, fi) => (
                                <li key={fi} className="flex gap-2 text-xs text-amber-300/90">
                                  <span className="flex-shrink-0">⚠️</span>
                                  <span>{f}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Platform Systems ──────────────────────────────────────────────── */}
        {activeTab === 'systems' && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-bold text-zinc-100 mb-1">Platform Systems — Cross-Cutting Complexity</h2>
              <p className="text-sm text-zinc-400">Every feature decision touches one or more of these. Know the PM ownership model for each.</p>
            </div>

            {/* RBAC diagram */}
            <div className="bg-zinc-900/60 border border-zinc-700/50 rounded-xl p-5 mb-6">
              <p className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-3">Permission Hierarchy</p>
              <div className="flex items-center gap-2 flex-wrap text-xs">
                {['Company', 'Production', 'Department', 'Role', 'Worker'].map((level, i, arr) => (
                  <div key={level} className="flex items-center gap-2">
                    <span className={[
                      'px-3 py-1.5 rounded-lg font-semibold border',
                      i === 0 ? 'bg-violet-900/50 border-violet-700 text-violet-300' :
                      i === 1 ? 'bg-indigo-900/50 border-indigo-700 text-indigo-300' :
                      i === 2 ? 'bg-sky-900/50 border-sky-700 text-sky-300' :
                      i === 3 ? 'bg-emerald-900/50 border-emerald-700 text-emerald-300' :
                               'bg-zinc-800 border-zinc-700 text-zinc-300',
                    ].join(' ')}>{level}</span>
                    {i < arr.length - 1 && <span className="text-zinc-600">→</span>}
                  </div>
                ))}
              </div>
              <p className="text-xs text-zinc-500 mt-3">Each level inherits and narrows. A UPM can grant any role up to but not exceeding their own permissions. Production-level isolation is hard — workers on Production A cannot see Production B even within the same company.</p>
            </div>

            {/* System cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SYSTEM_CARDS.map(card => {
                const c = AREA_COLORS[card.color]
                return (
                  <div key={card.name} className={`border rounded-xl p-5 ${c.bg} ${c.border}`}>
                    <div className="flex items-center gap-2.5 mb-3">
                      <span className="text-2xl">{card.icon}</span>
                      <span className={`font-bold text-sm ${c.text}`}>{card.name}</span>
                    </div>
                    <p className="text-xs text-zinc-300 mb-3 leading-relaxed">{card.description}</p>
                    <div className="bg-zinc-900/60 border border-zinc-700/40 rounded-lg p-3 mb-3">
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Why It's Complex</p>
                      <p className="text-xs text-zinc-400">{card.complexity}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">PM Owns</p>
                      <ul className="space-y-1">
                        {card.pmOwns.map((o, i) => (
                          <li key={i} className="flex gap-2 text-xs text-zinc-300">
                            <span className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} />
                            {o}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Interview questions */}
            <div className="mt-6 bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
              <p className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-4">Likely Interview Questions + How to Answer</p>
              <div className="space-y-3">
                {INTERVIEW_QUESTIONS.map((item, i) => (
                  <div key={i} className="bg-zinc-800/50 border border-zinc-700/40 rounded-lg p-4">
                    <p className="text-xs font-semibold text-zinc-200 mb-2">Q{i + 1}: {item.q}</p>
                    <p className="text-xs text-zinc-400 leading-relaxed"><span className="text-violet-400 font-semibold">Hint:</span> {item.hint}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── AI in PM Work ─────────────────────────────────────────────────── */}
        {activeTab === 'ai' && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-bold text-zinc-100 mb-1">AI in PM Work</h2>
              <p className="text-sm text-zinc-400">This demo is living proof. Here's the honest breakdown of where AI accelerates vs where it can't replace PM judgment.</p>
            </div>

            {/* Time savings table */}
            <div className="bg-zinc-900/60 border border-zinc-700/50 rounded-xl p-5 mb-6">
              <p className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-3">Before / After: AI-Assisted PM Research</p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-zinc-700">
                      <th className="text-left text-zinc-500 pb-2 pr-4 font-semibold">Task</th>
                      <th className="text-center text-zinc-500 pb-2 px-3 font-semibold whitespace-nowrap">Without AI</th>
                      <th className="text-center text-zinc-500 pb-2 px-3 font-semibold whitespace-nowrap">With AI</th>
                      <th className="text-left text-zinc-500 pb-2 pl-4 font-semibold">Method</th>
                    </tr>
                  </thead>
                  <tbody>
                    {AI_BEFORES.map((row, i) => (
                      <tr key={i} className="border-b border-zinc-800/50 last:border-0">
                        <td className="py-2.5 pr-4 text-zinc-300 leading-snug">{row.task}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="text-rose-400 font-semibold whitespace-nowrap">{row.before}</span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="text-emerald-400 font-semibold whitespace-nowrap">{row.after}</span>
                        </td>
                        <td className="py-2.5 pl-4 text-zinc-500 leading-snug">{row.method}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Replaces / Augments / Doesn't replace */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {AI_PM_AREAS.map(area => {
                const c = AREA_COLORS[area.color]
                return (
                  <div key={area.label} className={`border rounded-xl p-4 ${c.bg} ${c.border}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">{area.icon}</span>
                      <span className={`text-xs font-bold ${c.text} uppercase tracking-wider`}>{area.label}</span>
                    </div>
                    <ul className="space-y-1.5">
                      {area.items.map((item, i) => (
                        <li key={i} className="flex gap-2 text-xs text-zinc-300">
                          <span className={`mt-1.5 w-1 h-1 rounded-full flex-shrink-0 ${c.dot}`} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>

            {/* PM workflow */}
            <div className="bg-zinc-900/60 border border-zinc-700/50 rounded-xl p-5">
              <p className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-4">AI-Augmented PM Workflow — How This Demo Was Built</p>
              <div className="flex flex-col sm:flex-row gap-2">
                {[
                  { step: '1', label: 'Research', detail: 'Studied Wrapbook JD + entertainment payroll domain', icon: '📖' },
                  { step: '2', label: 'Structure', detail: 'Mapped product areas, user types, compliance surface', icon: '🗺️' },
                  { step: '3', label: 'Build', detail: 'Claude generated React + Tailwind interactive briefing', icon: '⚡' },
                  { step: '4', label: 'Refine', detail: 'PM judgment on what interviewers actually care about', icon: '🎯' },
                  { step: '5', label: 'Ship', detail: 'Live on Product Path — zero slide deck needed', icon: '🚀' },
                ].map((s, i, arr) => (
                  <div key={s.step} className="flex sm:flex-col items-center gap-2 flex-1">
                    <div className="bg-violet-900/50 border border-violet-700/50 rounded-lg p-3 flex-1 w-full text-center">
                      <div className="text-xl mb-1">{s.icon}</div>
                      <div className="text-xs font-bold text-violet-300 mb-0.5">{s.label}</div>
                      <div className="text-[10px] text-zinc-400 leading-snug">{s.detail}</div>
                    </div>
                    {i < arr.length - 1 && (
                      <span className="text-zinc-600 text-sm sm:hidden">→</span>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-zinc-500 mt-4 text-center">
                Total time from JD → live demo: ~2 hours. A traditional deck would be 2 days and half as useful in the room.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
