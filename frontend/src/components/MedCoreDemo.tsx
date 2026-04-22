import { useState } from 'react'

interface Props {
  onBack: () => void
  onSend: (text: string, mode: string) => void
  isStreaming: boolean
}

type MainTab = 'modules' | 'selector' | 'states' | 'onboard'

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
    prompt: 'Write a product requirements brief for an AI Risk Prediction module in a Medicaid care management platform. Include: minimum data requirements (6+ months, 5,000+ members, 3+ modules active), model inputs (SDOH flags, PHQ-9 scores, ER history, appointment no-shows, medication patterns), prediction outputs (30-day ER risk score, no-show probability), how predictions surface to care coordinators (daily priority list), care coordinator workflow integration, success metrics (ER reduction %, revenue recovered), and explicit criteria for when NOT to activate.',
  },
]

// ── States data ───────────────────────────────────────────────────────────────

interface StateData {
  state: string
  abbr: string
  evvModel: string
  evvVendor: string
  sdoh: boolean
  hcbs: boolean
  mcPct: string
  mcos: string[]
  notes: string
}

const STATES: StateData[] = [
  { state: 'California',      abbr: 'CA', evvModel: 'Hybrid',         evvVendor: 'CalEVV (Sandata)',        sdoh: true,  hcbs: true,  mcPct: '~82%', mcos: ['Anthem', 'Molina', 'Health Net', 'L.A. Care'],          notes: '1115 waiver active · SDOH required in MCO contracts · CalAIM reform ongoing' },
  { state: 'Texas',           abbr: 'TX', evvModel: 'Hybrid',         evvVendor: 'TMHP EVV Aggregator',     sdoh: true,  hcbs: true,  mcPct: '~88%', mcos: ['Centene (Superior)', 'Molina', 'UHC', 'Amerigroup'],    notes: 'STAR+PLUS for HCBS · Large rural population · No Medicaid expansion' },
  { state: 'Florida',         abbr: 'FL', evvModel: 'Hybrid',         evvVendor: 'Netsmart',                sdoh: true,  hcbs: true,  mcPct: '~72%', mcos: ['Centene (Sunshine)', 'Molina', 'UHC', 'Humana'],        notes: 'SDOH in MCO contracts · BH parity active · Large elderly HCBS population' },
  { state: 'New York',        abbr: 'NY', evvModel: 'Provider Choice', evvVendor: 'NY State EVV Aggregator', sdoh: true,  hcbs: true,  mcPct: '~78%', mcos: ['Molina', 'Fidelis', 'MetroPlus', 'Centene'],           notes: '1115 waiver · HRSN pilot · Largest HCBS population in US' },
  { state: 'Pennsylvania',    abbr: 'PA', evvModel: 'Open',           evvVendor: 'Sandata / DHS Aggregator', sdoh: true,  hcbs: true,  mcPct: '~86%', mcos: ['UPMC', 'Centene', 'Molina', 'Geisinger'],              notes: 'SDOH required · LTSS managed care · Strong BH integration requirements' },
  { state: 'Ohio',            abbr: 'OH', evvModel: 'Open',           evvVendor: 'Sandata',                 sdoh: true,  hcbs: true,  mcPct: '~89%', mcos: ['Centene (Buckeye)', 'Molina', 'CareSource', 'UHC'],    notes: 'MyCare Ohio for dual eligibles · SDOH required in contracts' },
  { state: 'Michigan',        abbr: 'MI', evvModel: 'Open',           evvVendor: 'HHAeXchange',             sdoh: true,  hcbs: true,  mcPct: '~83%', mcos: ['Molina', 'Meridian (Centene)', 'UHC', 'McLaren'],      notes: 'SDOH required · BH parity active · Integrated care model' },
  { state: 'Georgia',         abbr: 'GA', evvModel: 'Open',           evvVendor: 'Netsmart',                sdoh: false, hcbs: true,  mcPct: '~81%', mcos: ['Centene (Peach State)', 'Amerigroup', 'Molina'],       notes: 'No Medicaid expansion · SDOH not yet required · HCBS waiver active' },
  { state: 'North Carolina',  abbr: 'NC', evvModel: 'Hybrid',         evvVendor: 'Sandata',                 sdoh: true,  hcbs: true,  mcPct: '~87%', mcos: ['Centene', 'UHC', 'Aetna', 'WellCare'],                 notes: 'NC Medicaid Managed Care launched 2023 · SDOH required · BH integrated' },
  { state: 'Tennessee',       abbr: 'TN', evvModel: 'Hybrid',         evvVendor: 'Sandata / PPL',           sdoh: true,  hcbs: true,  mcPct: '~98%', mcos: ['Centene (BlueCare)', 'UHC (TennCare Select)', 'Amerigroup'], notes: 'TennCare — nearly 100% managed care · SDOH required · No expansion' },
  { state: 'Arizona',         abbr: 'AZ', evvModel: 'Open',           evvVendor: 'AHCCCS In-House',         sdoh: true,  hcbs: true,  mcPct: '~93%', mcos: ['Centene', 'UHC', 'Mercy Care', 'Banner'],              notes: 'AHCCCS — one of oldest managed care programs · SDOH required · 1115 waiver' },
  { state: 'Illinois',        abbr: 'IL', evvModel: 'Hybrid',         evvVendor: 'HHAeXchange',             sdoh: true,  hcbs: true,  mcPct: '~74%', mcos: ['Centene (IlliniCare)', 'Molina', 'Meridian', 'Aetna'], notes: 'SDOH required · BH parity · Medicaid expansion state' },
  { state: 'Virginia',        abbr: 'VA', evvModel: 'Provider Choice', evvVendor: 'N/A (provider selects)', sdoh: true,  hcbs: true,  mcPct: '~85%', mcos: ['Centene (Optima)', 'Molina', 'Aetna', 'UHC'],         notes: 'CCC Plus for LTSS · SDOH in contracts · BH parity active' },
  { state: 'Washington',      abbr: 'WA', evvModel: 'Provider Choice', evvVendor: 'ProviderOne',            sdoh: true,  hcbs: true,  mcPct: '~80%', mcos: ['Centene', 'Molina', 'UHC', 'Community Health Plan'],   notes: '1115 waiver · SDOH required · Strong HCBS program' },
  { state: 'Colorado',        abbr: 'CO', evvModel: 'Hybrid',         evvVendor: 'Sandata',                 sdoh: true,  hcbs: true,  mcPct: '~84%', mcos: ['Centene', 'UHC', 'Rocky Mountain Health Plans'],       notes: 'ACC Phase III · SDOH required · BH integrated into contracts' },
  { state: 'Missouri',        abbr: 'MO', evvModel: 'Open',           evvVendor: 'Sandata',                 sdoh: true,  hcbs: true,  mcPct: '~88%', mcos: ['Centene (Missouri Care)', 'Molina', 'UHC'],            notes: 'MO HealthNet · SDOH required post-2023 · Medicaid expansion 2021' },
  { state: 'Indiana',         abbr: 'IN', evvModel: 'Open',           evvVendor: 'Sandata',                 sdoh: true,  hcbs: true,  mcPct: '~91%', mcos: ['Centene (MDwise)', 'Molina', 'UHC', 'Anthem'],         notes: 'HIP 2.0 · SDOH required · HCBS waiver · Strong managed care penetration' },
  { state: 'Kentucky',        abbr: 'KY', evvModel: 'Hybrid',         evvVendor: 'Therap',                  sdoh: true,  hcbs: true,  mcPct: '~88%', mcos: ['Centene (Wellcare)', 'Molina', 'Aetna', 'UHC'],       notes: 'KY Medicaid · SDOH required · BH parity · Medicaid expansion state' },
  { state: 'Louisiana',       abbr: 'LA', evvModel: 'Open',           evvVendor: 'LaSRS',                   sdoh: true,  hcbs: true,  mcPct: '~89%', mcos: ['Centene (Healthy Blue)', 'Molina', 'Aetna', 'UHC'],   notes: 'Bayou Health · SDOH required · BH integration in contracts' },
  { state: 'Kansas',          abbr: 'KS', evvModel: 'Provider Choice', evvVendor: 'Fiserv',                 sdoh: false, hcbs: true,  mcPct: '~86%', mcos: ['Centene (Sunflower)', 'Molina', 'UHC'],               notes: 'KanCare · SDOH not yet required · HCBS waiver active' },
]

// ── Module Selector questions ─────────────────────────────────────────────────

interface Question {
  id: string
  text: string
  section: string
}

const QUESTIONS: Question[] = [
  // Section A — Client Basics
  { id: 'roster',    section: 'Client Basics',    text: 'Does the MCO have an active Medicaid member roster with contact data (phone/address)?' },
  { id: 'hipaa',     section: 'Client Basics',    text: 'Is a HIPAA Business Associate Agreement (BAA) signed with this client?' },
  { id: 'channel',   section: 'Client Basics',    text: 'Is at least one outreach channel available — SMS, mobile app, or kiosk?' },
  // Section B — Programs
  { id: 'sdoh_req',  section: 'Programs',         text: 'Does the state Medicaid contract or CMS waiver require SDOH screening?' },
  { id: 'findhelp',  section: 'Programs',         text: 'Is the FindHelp community resource network available in the service area?' },
  { id: 'care_team', section: 'Programs',         text: 'Does the client have a care coordinator team to act on referrals and alerts?' },
  { id: 'hcbs',      section: 'Programs',         text: 'Does this client run an HCBS or LTSS home-based care program?' },
  { id: 'evv',       section: 'Programs',         text: 'Is the state EVV (Electronic Visit Verification) mandate currently active?' },
  { id: 'bh_pop',    section: 'Programs',         text: 'Does the client serve a behavioral health Medicaid population?' },
  // Section C — Compliance
  { id: 'state_rpt', section: 'Compliance',       text: 'Does the state Medicaid contract require compliance reporting?' },
  { id: 'cfr42',     section: 'Compliance',       text: 'Has 42 CFR Part 2 compliance capability been confirmed (behavioral health data)?' },
  { id: 'crisis',    section: 'Compliance',       text: 'Is a crisis response protocol defined and operational?' },
  { id: 'mco_nav',   section: 'Compliance',       text: 'Is this an MCO-driven program (not a direct state program) with a digitized benefits catalog?' },
  // Section D — Data Readiness
  { id: 'data_6mo',  section: 'Data Readiness',   text: 'Does the client have at least 6 months of historical member data?' },
  { id: 'pop_5k',    section: 'Data Readiness',   text: 'Is the member population 5,000 or more?' },
  { id: 'consent',   section: 'Data Readiness',   text: 'Has member data sharing consent been obtained for AI / analytics use?' },
]

type Answer = 'yes' | 'no' | null
type Answers = Record<string, Answer>
type ModuleStatus = 'active' | 'optional' | 'off' | 'pending'

function deriveModules(a: Answers): Record<number, ModuleStatus> {
  const yes = (id: string) => a[id] === 'yes'
  const no  = (id: string) => a[id] === 'no'
  const pending = (ids: string[]) => ids.some(id => a[id] === null)

  const m1: ModuleStatus = pending(['roster','hipaa','channel']) ? 'pending'
    : yes('roster') && yes('hipaa') && yes('channel') ? 'active'
    : yes('roster') && yes('hipaa') && no('channel') ? 'optional'
    : 'off'

  const m2: ModuleStatus = pending(['sdoh_req','findhelp','care_team']) ? 'pending'
    : yes('sdoh_req') && yes('findhelp') && yes('care_team') ? 'active'
    : yes('sdoh_req') && yes('findhelp') && no('care_team') ? 'optional'
    : 'off'

  const m3: ModuleStatus = pending(['hcbs','evv']) ? 'pending'
    : yes('hcbs') && yes('evv') ? 'active'
    : yes('hcbs') && no('evv') ? 'optional'
    : 'off'

  const m4: ModuleStatus = pending(['bh_pop','cfr42','crisis']) ? 'pending'
    : yes('bh_pop') && yes('cfr42') && yes('crisis') ? 'active'
    : yes('bh_pop') && no('cfr42') ? 'optional'
    : 'off'

  const m5: ModuleStatus = pending(['state_rpt']) ? 'pending'
    : yes('state_rpt') ? 'active'
    : 'optional'

  const m6: ModuleStatus = pending(['mco_nav']) ? 'pending'
    : yes('mco_nav') ? 'active'
    : 'off'

  const activeCount = [m1,m2,m3,m4,m5].filter(s => s === 'active').length
  const m7: ModuleStatus = pending(['data_6mo','pop_5k','consent']) ? 'pending'
    : yes('data_6mo') && yes('pop_5k') && yes('consent') && activeCount >= 3 ? 'active'
    : yes('data_6mo') && yes('pop_5k') && yes('consent') && activeCount < 3 ? 'optional'
    : 'off'

  return { 1: m1, 2: m2, 3: m3, 4: m4, 5: m5, 6: m6, 7: m7 }
}

const STATUS_STYLE: Record<ModuleStatus, { badge: string; dot: string; label: string }> = {
  active:  { badge: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30', dot: 'bg-emerald-400', label: 'Active' },
  optional:{ badge: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',       dot: 'bg-amber-400',   label: 'Optional' },
  off:     { badge: 'bg-zinc-800 text-zinc-500 border border-zinc-700',                dot: 'bg-zinc-600',    label: 'OFF' },
  pending: { badge: 'bg-zinc-800/50 text-zinc-600 border border-zinc-800',             dot: 'bg-zinc-700',    label: '?' },
}

const COLOR_MAP: Record<string, { header: string; mustHave: string; example: string; btn: string }> = {
  indigo:  { header: 'bg-indigo-500/10 border-indigo-500/20',  mustHave: 'text-indigo-400',  example: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300',  btn: 'bg-indigo-600/20 border-indigo-500/40 text-indigo-400 hover:bg-indigo-600/30' },
  emerald: { header: 'bg-emerald-500/10 border-emerald-500/20', mustHave: 'text-emerald-400', example: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300', btn: 'bg-emerald-600/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-600/30' },
  teal:    { header: 'bg-teal-500/10 border-teal-500/20',      mustHave: 'text-teal-400',    example: 'bg-teal-500/10 border-teal-500/20 text-teal-300',        btn: 'bg-teal-600/20 border-teal-500/40 text-teal-400 hover:bg-teal-600/30' },
  violet:  { header: 'bg-violet-500/10 border-violet-500/20',  mustHave: 'text-violet-400',  example: 'bg-violet-500/10 border-violet-500/20 text-violet-300',  btn: 'bg-violet-600/20 border-violet-500/40 text-violet-400 hover:bg-violet-600/30' },
  amber:   { header: 'bg-amber-500/10 border-amber-500/20',    mustHave: 'text-amber-400',   example: 'bg-amber-500/10 border-amber-500/20 text-amber-300',    btn: 'bg-amber-600/20 border-amber-500/40 text-amber-400 hover:bg-amber-600/30' },
  sky:     { header: 'bg-sky-500/10 border-sky-500/20',        mustHave: 'text-sky-400',     example: 'bg-sky-500/10 border-sky-500/20 text-sky-300',          btn: 'bg-sky-600/20 border-sky-500/40 text-sky-400 hover:bg-sky-600/30' },
  rose:    { header: 'bg-rose-500/10 border-rose-500/20',      mustHave: 'text-rose-400',    example: 'bg-rose-500/10 border-rose-500/20 text-rose-300',        btn: 'bg-rose-600/20 border-rose-500/40 text-rose-400 hover:bg-rose-600/30' },
}

const SECTIONS = ['Client Basics', 'Programs', 'Compliance', 'Data Readiness']

// ── Onboard types ─────────────────────────────────────────────────────────────

interface OnboardForm {
  mcoName: string
  state: string
  memberCount: string
  adults: string
  children: string
  elderly: string
  disabilities: string
  dualEligible: string
  pregnant: string
  hasHCBS: boolean
  hasBH: boolean
  hasLTSS: boolean
  hasDual: boolean
  coordinators: string
  dataMonths: string
  hipaa: boolean
}

const BLANK_FORM: OnboardForm = {
  mcoName: '', state: '', memberCount: '', adults: '', children: '',
  elderly: '', disabilities: '', dualEligible: '', pregnant: '',
  hasHCBS: false, hasBH: false, hasLTSS: false, hasDual: false,
  coordinators: '', dataMonths: '', hipaa: false,
}

const SAMPLE_MEMBERS = [
  { id: 'M-4821', name: 'Maria G.',  age: 67, program: 'HCBS',          risk: 'High',   flag: 'ER visit predicted in 14 days',      riskColor: 'text-rose-400',   dotColor: 'bg-rose-400' },
  { id: 'M-2093', name: 'James T.',  age: 45, program: 'Behavioral Health', risk: 'Medium', flag: 'PHQ-9 score elevated — follow up needed', riskColor: 'text-amber-400',  dotColor: 'bg-amber-400' },
  { id: 'M-7741', name: 'Rosa M.',   age: 52, program: 'Dual Eligible',  risk: 'Low',    flag: 'Care plan current — next visit in 12 days', riskColor: 'text-emerald-400', dotColor: 'bg-emerald-400' },
  { id: 'M-3318', name: 'David K.',  age: 38, program: 'Adult Expansion', risk: 'Medium', flag: 'SDOH flag — housing instability reported', riskColor: 'text-amber-400',  dotColor: 'bg-amber-400' },
  { id: 'M-9902', name: 'Linda P.',  age: 71, program: 'LTSS',           risk: 'High',   flag: 'No-show pattern — 3 missed visits',  riskColor: 'text-rose-400',   dotColor: 'bg-rose-400' },
]

export default function MedCoreDemo({ onBack, onSend, isStreaming }: Props) {
  const [mainTab, setMainTab]   = useState<MainTab>('modules')
  const [expanded, setExpanded] = useState<number | null>(null)
  const [answers, setAnswers]   = useState<Answers>(
    Object.fromEntries(QUESTIONS.map(q => [q.id, null]))
  )
  const [onboardStep, setOnboardStep] = useState(1)
  const [form, setForm]               = useState<OnboardForm>(BLANK_FORM)
  const [showPortal, setShowPortal]   = useState(false)

  const stateData = STATES.find(s => s.state === form.state)

  const setF = (field: keyof OnboardForm, val: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: val }))

  const totalMembers   = parseInt(form.memberCount.replace(/,/g, '')) || 0
  const sdohScreenings = Math.round(totalMembers * 0.15)
  const evvVisits      = form.hasHCBS ? Math.round(totalMembers * 0.08) : 0
  const riskAlerts     = Math.round(totalMembers * 0.03)
  const coordinators   = parseInt(form.coordinators) || Math.max(1, Math.round(totalMembers / 200))

  const derivedModuleStatus = (): Record<number, ModuleStatus> => ({
    1: form.memberCount && form.hipaa ? 'active' : 'optional',
    2: stateData?.sdoh ? 'active' : (form.hasHCBS ? 'optional' : 'off'),
    3: form.hasHCBS ? 'active' : 'off',
    4: form.hasBH ? 'active' : 'off',
    5: 'active',
    6: !stateData || form.mcoName ? 'active' : 'off',
    7: parseInt(form.dataMonths) >= 6 && totalMembers >= 5000 ? 'active' : 'off',
  })

  const moduleResults = deriveModules(answers)
  const answered      = Object.values(answers).filter(v => v !== null).length
  const totalQ        = QUESTIONS.length
  const activeModules = Object.values(moduleResults).filter(s => s === 'active').length

  const resetAnswers = () => setAnswers(Object.fromEntries(QUESTIONS.map(q => [q.id, null])))

  const summaryLine = () => {
    const active   = MODULES.filter(m => moduleResults[m.num] === 'active').map(m => m.title)
    const optional = MODULES.filter(m => moduleResults[m.num] === 'optional').map(m => m.title)
    const off      = MODULES.filter(m => moduleResults[m.num] === 'off').map(m => m.title)
    if (active.length === 0 && optional.length === 0) return null
    const parts = []
    if (active.length)   parts.push(`${active.join(', ')} → Active`)
    if (optional.length) parts.push(`${optional.join(', ')} → Optional when ready`)
    if (off.length)      parts.push(`${off.join(', ')} → OFF`)
    return parts.join('. ') + '.'
  }

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
        </div>
        <div className="flex gap-1.5">
          {([
            { key: 'modules',  label: '📦 7 Modules' },
            { key: 'selector', label: '⚙️ Module Selector' },
            { key: 'states',   label: '🗺️ States' },
            { key: 'onboard',  label: '🚀 Onboard MCO' },
          ] as { key: MainTab; label: string }[]).map(t => (
            <button
              key={t.key}
              onClick={() => setMainTab(t.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                mainTab === t.key
                  ? 'bg-indigo-600 text-white'
                  : 'bg-zinc-800/60 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── MODULES TAB ── */}
      {mainTab === 'modules' && (
        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid grid-cols-2 gap-4 max-w-4xl mx-auto">
            {MODULES.map(m => {
              const c = COLOR_MAP[m.color]
              const isOpen = expanded === m.num
              return (
                <div key={m.num} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
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
                          <p className="text-sm font-bold text-zinc-100 mb-0.5">{m.title}</p>
                          <p className="text-xs text-zinc-400 leading-snug">{m.tagline}</p>
                        </div>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
                        className={`w-4 h-4 text-zinc-600 flex-shrink-0 mt-1 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 border-t border-zinc-800 pt-4 space-y-4">
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
                      <div className={`rounded-xl border px-3 py-2.5 ${c.example}`}>
                        <p className="text-[10px] font-semibold uppercase tracking-wider mb-1 opacity-70">Real decision example</p>
                        <p className="text-xs leading-relaxed">{m.example}</p>
                      </div>
                      <button
                        onClick={() => onSend(m.prompt, 'pm')}
                        disabled={isStreaming}
                        className={`w-full py-2 rounded-xl border text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${c.btn}`}
                      >
                        Ask Product Path AI about {m.title} →
                      </button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── MODULE SELECTOR TAB ── */}
      {mainTab === 'selector' && (
        <div className="flex-1 overflow-hidden flex gap-0">

          {/* Left — Questions */}
          <div className="flex-1 overflow-y-auto p-5 border-r border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-zinc-100">Discovery Questionnaire</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Answer each question to determine which modules this MCO should receive.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-500">{answered} / {totalQ} answered</span>
                <button
                  onClick={resetAnswers}
                  className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors border border-zinc-800 hover:border-zinc-700 px-2.5 py-1 rounded-lg"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="space-y-5 max-w-xl">
              {SECTIONS.map(section => (
                <div key={section}>
                  <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2.5">{section}</p>
                  <div className="space-y-2">
                    {QUESTIONS.filter(q => q.section === section).map(q => (
                      <div key={q.id} className={`rounded-xl border p-3.5 transition-all ${
                        answers[q.id] === 'yes' ? 'bg-emerald-500/5 border-emerald-500/30'
                        : answers[q.id] === 'no' ? 'bg-rose-500/5 border-rose-500/20'
                        : 'bg-zinc-900 border-zinc-800'
                      }`}>
                        <p className="text-xs text-zinc-200 mb-2.5 leading-relaxed">{q.text}</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setAnswers(prev => ({ ...prev, [q.id]: answers[q.id] === 'yes' ? null : 'yes' }))}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                              answers[q.id] === 'yes'
                                ? 'bg-emerald-500 text-white border-emerald-500'
                                : 'bg-zinc-800/60 text-zinc-400 border-zinc-700 hover:border-emerald-500/50 hover:text-emerald-400'
                            }`}
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setAnswers(prev => ({ ...prev, [q.id]: answers[q.id] === 'no' ? null : 'no' }))}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                              answers[q.id] === 'no'
                                ? 'bg-rose-500 text-white border-rose-500'
                                : 'bg-zinc-800/60 text-zinc-400 border-zinc-700 hover:border-rose-500/50 hover:text-rose-400'
                            }`}
                          >
                            No
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Live module results */}
          <div className="w-64 flex-shrink-0 overflow-y-auto p-4 flex flex-col gap-3">
            <div>
              <h3 className="text-xs font-bold text-zinc-100 mb-0.5">Module Activation</h3>
              <p className="text-[10px] text-zinc-500">Updates as you answer</p>
            </div>

            {/* Module status cards */}
            <div className="space-y-2">
              {MODULES.map(m => {
                const status = moduleResults[m.num]
                const st = STATUS_STYLE[status]
                return (
                  <div key={m.num} className={`rounded-xl border p-3 transition-all ${
                    status === 'active' ? 'bg-emerald-500/5 border-emerald-500/20'
                    : status === 'optional' ? 'bg-amber-500/5 border-amber-500/20'
                    : status === 'off' ? 'bg-zinc-900/50 border-zinc-800/50 opacity-50'
                    : 'bg-zinc-900 border-zinc-800'
                  }`}>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{m.icon}</span>
                        <span className="text-xs font-semibold text-zinc-200 leading-tight">{m.title}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ${st.badge}`}>
                        {st.label}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Summary */}
            {answered >= 8 && (
              <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-3 mt-1">
                <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  Summary · {activeModules} of 7 active
                </p>
                <p className="text-[11px] text-zinc-300 leading-relaxed italic">
                  "{summaryLine()}"
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── ONBOARD TAB ── */}
      {mainTab === 'onboard' && !showPortal && (
        <div className="flex-1 overflow-y-auto p-5">
          <div className="max-w-3xl mx-auto space-y-6">

            {/* Step indicator */}
            <div className="flex items-center gap-2">
              {[1,2,3,4].map(s => (
                <div key={s} className="flex items-center gap-2">
                  <button
                    onClick={() => setOnboardStep(s)}
                    className={`w-7 h-7 rounded-full text-xs font-bold border transition-all flex items-center justify-center ${
                      onboardStep === s ? 'bg-indigo-600 text-white border-indigo-500' :
                      onboardStep > s  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' :
                      'bg-zinc-900 text-zinc-600 border-zinc-700'
                    }`}
                  >{s}</button>
                  {s < 4 && <div className={`h-px w-8 ${onboardStep > s ? 'bg-emerald-500/40' : 'bg-zinc-800'}`} />}
                </div>
              ))}
              <span className="ml-2 text-xs text-zinc-500">
                {onboardStep === 1 ? 'MCO Info' : onboardStep === 2 ? 'Population & Eligibility' : onboardStep === 3 ? 'Programs & Team' : 'Review & Launch'}
              </span>
            </div>

            {/* ── STEP 1: MCO Info + State auto-load ── */}
            {onboardStep === 1 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-zinc-100 mb-1">MCO Information</h3>
                  <p className="text-xs text-zinc-500">Select your state and we'll pre-load all Medicaid requirements automatically.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 mb-1.5 block">MCO Name</label>
                    <input
                      type="text"
                      value={form.mcoName}
                      onChange={e => setF('mcoName', e.target.value)}
                      placeholder="e.g. Molina Healthcare"
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 mb-1.5 block">State</label>
                    <select
                      value={form.state}
                      onChange={e => setF('state', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500 transition-colors"
                    >
                      <option value="">Select state…</option>
                      {STATES.map(s => <option key={s.abbr} value={s.state}>{s.state}</option>)}
                    </select>
                  </div>
                </div>

                {/* Auto-loaded state requirements */}
                {stateData && (
                  <div className="bg-zinc-900 border border-indigo-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">State Requirements Auto-Loaded — {stateData.state}</span>
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5">✓ Pre-filled</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-zinc-500">EVV Mandate</span>
                          <span className="text-xs font-semibold text-emerald-400">Active ✓</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-zinc-500">EVV Vendor</span>
                          <span className="text-xs font-semibold text-zinc-300">{stateData.evvVendor}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-zinc-500">EVV Model</span>
                          <span className="text-xs font-semibold text-zinc-300">{stateData.evvModel}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-zinc-500">SDOH Required</span>
                          <span className={`text-xs font-semibold ${stateData.sdoh ? 'text-emerald-400' : 'text-zinc-500'}`}>{stateData.sdoh ? 'Yes ✓' : 'No'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-zinc-500">HCBS Program</span>
                          <span className={`text-xs font-semibold ${stateData.hcbs ? 'text-emerald-400' : 'text-zinc-500'}`}>{stateData.hcbs ? 'Active ✓' : 'Not active'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-zinc-500">Managed Care</span>
                          <span className="text-xs font-semibold text-sky-400">{stateData.mcPct} penetration</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-zinc-800">
                      <p className="text-[10px] text-zinc-500">{stateData.notes}</p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" checked={form.hipaa} onChange={e => setF('hipaa', e.target.checked)}
                      className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 accent-indigo-600" />
                    <span className="text-xs text-zinc-300">HIPAA BAA signed with this MCO</span>
                  </label>
                </div>

                <button
                  onClick={() => setOnboardStep(2)}
                  disabled={!form.mcoName || !form.state}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl transition-colors"
                >
                  Next → Population & Eligibility
                </button>
              </div>
            )}

            {/* ── STEP 2: Population & Eligibility ── */}
            {onboardStep === 2 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-zinc-100 mb-1">Population & Eligibility</h3>
                  <p className="text-xs text-zinc-500">Enter total enrollment and break down by eligibility group. This determines module priorities.</p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-400 mb-1.5 block">Total Members Enrolled</label>
                  <input
                    type="text"
                    value={form.memberCount}
                    onChange={e => setF('memberCount', e.target.value)}
                    placeholder="e.g. 40000"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold text-zinc-400 mb-2">Eligibility Group Breakdown <span className="text-zinc-600 font-normal">(optional — enter numbers or leave blank)</span></p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { field: 'adults',       label: 'Adults (19–64)',          icon: '👤' },
                      { field: 'children',     label: 'Children / CHIP',         icon: '👶' },
                      { field: 'elderly',      label: 'Elderly (65+)',            icon: '🧓' },
                      { field: 'disabilities', label: 'People w/ Disabilities',  icon: '♿' },
                      { field: 'dualEligible', label: 'Dual Eligibles',          icon: '🔄' },
                      { field: 'pregnant',     label: 'Pregnant Women',          icon: '🤰' },
                    ].map(g => (
                      <div key={g.field}>
                        <label className="text-[10px] text-zinc-500 mb-1 flex items-center gap-1 block">
                          <span>{g.icon}</span>{g.label}
                        </label>
                        <input
                          type="text"
                          value={form[g.field as keyof OnboardForm] as string}
                          onChange={e => setF(g.field as keyof OnboardForm, e.target.value)}
                          placeholder="0"
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setOnboardStep(1)} className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-xl transition-colors">← Back</button>
                  <button
                    onClick={() => setOnboardStep(3)}
                    disabled={!form.memberCount}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl transition-colors"
                  >
                    Next → Programs & Team
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3: Programs & Team ── */}
            {onboardStep === 3 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-zinc-100 mb-1">Programs & Team Readiness</h3>
                  <p className="text-xs text-zinc-500">Which programs does this MCO run? This determines which modules activate.</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-zinc-400 mb-2.5">Active Medicaid Programs</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { field: 'hasHCBS', label: 'HCBS / Home-Based Care',    desc: 'Activates EVV + Care Coordination module', icon: '🏠' },
                      { field: 'hasBH',   label: 'Behavioral Health',          desc: 'Activates BH module with 42 CFR Part 2',  icon: '🧠' },
                      { field: 'hasLTSS', label: 'LTSS / Long-Term Services',  desc: 'Extended care coordination requirements', icon: '🔄' },
                      { field: 'hasDual', label: 'Dual Eligible (Medicare+)',   desc: 'Integrated care coordination required',   icon: '♾️' },
                    ].map(p => (
                      <label key={p.field} className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                        form[p.field as keyof OnboardForm]
                          ? 'bg-indigo-500/10 border-indigo-500/40'
                          : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                      }`}>
                        <input type="checkbox"
                          checked={form[p.field as keyof OnboardForm] as boolean}
                          onChange={e => setF(p.field as keyof OnboardForm, e.target.checked)}
                          className="mt-0.5 w-4 h-4 rounded border-zinc-600 bg-zinc-800 accent-indigo-600 flex-shrink-0"
                        />
                        <div>
                          <p className="text-xs font-semibold text-zinc-200">{p.icon} {p.label}</p>
                          <p className="text-[10px] text-zinc-500 mt-0.5">{p.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 mb-1.5 block">Care Coordinators on Team</label>
                    <input
                      type="text"
                      value={form.coordinators}
                      onChange={e => setF('coordinators', e.target.value)}
                      placeholder={`~${Math.max(1, Math.round((parseInt(form.memberCount) || 0) / 200))} (estimated)`}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 mb-1.5 block">Months of Historical Member Data</label>
                    <select
                      value={form.dataMonths}
                      onChange={e => setF('dataMonths', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500 transition-colors"
                    >
                      <option value="">Select…</option>
                      <option value="3">Less than 6 months</option>
                      <option value="6">6–12 months</option>
                      <option value="12">1–2 years</option>
                      <option value="24">2+ years</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setOnboardStep(2)} className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-xl transition-colors">← Back</button>
                  <button onClick={() => setOnboardStep(4)} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors">
                    Next → Review & Launch
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 4: Review + Module Recommendations ── */}
            {onboardStep === 4 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-zinc-100 mb-1">Module Recommendations for {form.mcoName || 'This MCO'}</h3>
                  <p className="text-xs text-zinc-500">Based on your answers — here is the recommended module configuration.</p>
                </div>

                {/* Summary row */}
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: 'MCO',      value: form.mcoName || '—' },
                    { label: 'State',    value: form.state || '—' },
                    { label: 'Members',  value: parseInt(form.memberCount || '0').toLocaleString() || '—' },
                    { label: 'Programs', value: [form.hasHCBS && 'HCBS', form.hasBH && 'BH', form.hasLTSS && 'LTSS', form.hasDual && 'Dual'].filter(Boolean).join(', ') || 'None selected' },
                  ].map(s => (
                    <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
                      <p className="text-[10px] text-zinc-600 mb-0.5">{s.label}</p>
                      <p className="text-xs font-bold text-zinc-200 truncate">{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Module recommendations */}
                <div className="space-y-2">
                  {MODULES.map(m => {
                    const status = derivedModuleStatus()[m.num]
                    const st = STATUS_STYLE[status]
                    const reasons: Record<number, string> = {
                      1: form.hipaa ? 'HIPAA BAA signed + member roster confirmed' : 'Activate after HIPAA BAA is signed',
                      2: stateData?.sdoh ? `${stateData.state} requires SDOH screening in MCO contracts` : 'State does not require — activate when budget approved',
                      3: form.hasHCBS ? 'HCBS program confirmed — EVV mandate applies' : 'Not applicable — no HCBS program selected',
                      4: form.hasBH ? 'Behavioral health program confirmed' : 'Not applicable — no BH population selected',
                      5: 'State Medicaid contract requires compliance reporting',
                      6: form.mcoName ? 'MCO-driven program — benefits catalog required before activation' : 'Confirm benefits catalog is digitized',
                      7: parseInt(form.dataMonths) >= 6 && totalMembers >= 5000
                        ? `${form.dataMonths}+ months data + ${totalMembers.toLocaleString()} members meets threshold`
                        : 'Needs 6+ months data and 5,000+ members — revisit in 6 months',
                    }
                    return (
                      <div key={m.num} className={`flex items-center gap-3 p-3.5 rounded-xl border ${
                        status === 'active' ? 'bg-emerald-500/5 border-emerald-500/20' :
                        status === 'optional' ? 'bg-amber-500/5 border-amber-500/20' :
                        'bg-zinc-900/50 border-zinc-800/50 opacity-60'
                      }`}>
                        <span className="text-base flex-shrink-0">{m.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-zinc-200">{m.title}</p>
                          <p className="text-[10px] text-zinc-500 mt-0.5 leading-snug">{reasons[m.num]}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${st.badge}`}>{st.label}</span>
                      </div>
                    )
                  })}
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setOnboardStep(3)} className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-xl transition-colors">← Back</button>
                  <button
                    onClick={() => setShowPortal(true)}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    🚀 Launch Portal Preview →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── PORTAL PREVIEW ── */}
      {mainTab === 'onboard' && showPortal && (
        <div className="flex-1 overflow-y-auto bg-zinc-950">
          {/* Portal header */}
          <div className="bg-slate-900 border-b border-slate-700/60 px-6 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-xs font-black text-white">
                {form.mcoName ? form.mcoName[0].toUpperCase() : 'M'}
              </span>
              <div>
                <p className="text-sm font-bold text-white">{form.mcoName || 'MCO'} — MedCore Portal</p>
                <p className="text-[10px] text-slate-400">{form.state} · {parseInt(form.memberCount || '0').toLocaleString()} members · {[form.hasHCBS && 'HCBS', form.hasBH && 'BH', form.hasLTSS && 'LTSS'].filter(Boolean).join(' · ')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-2 py-0.5">⚠ Demo preview</span>
              <button onClick={() => setShowPortal(false)} className="text-xs text-slate-500 hover:text-slate-300 transition-colors border border-slate-700 hover:border-slate-600 px-2.5 py-1 rounded-lg">← Back to Setup</button>
            </div>
          </div>

          <div className="p-5 space-y-5">
            {/* Module status bar */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] text-zinc-600 font-semibold uppercase tracking-wider">Active Modules:</span>
              {MODULES.map(m => {
                const status = derivedModuleStatus()[m.num]
                return (
                  <span key={m.num} className={`text-[10px] font-semibold px-2 py-1 rounded-full border flex items-center gap-1 ${
                    status === 'active' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                    status === 'optional' ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' :
                    'bg-zinc-800/50 text-zinc-600 border-zinc-800 opacity-50'
                  }`}>
                    {m.icon} {m.title}
                  </span>
                )
              })}
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Total Members',         value: parseInt(form.memberCount || '0').toLocaleString(), sub: `${form.state} program`, color: 'text-indigo-400' },
                { label: 'Care Coordinators',     value: coordinators.toLocaleString(),                      sub: 'assigned to platform',  color: 'text-sky-400' },
                { label: 'SDOH Screenings',       value: stateData?.sdoh ? sdohScreenings.toLocaleString() : '—', sub: 'this month',       color: 'text-emerald-400' },
                { label: 'EVV Visits Logged',     value: form.hasHCBS ? evvVisits.toLocaleString() : '—',  sub: 'this month',             color: 'text-violet-400' },
                { label: 'Risk Alerts Today',     value: riskAlerts.toLocaleString(),                        sub: 'need coordinator action', color: 'text-rose-400' },
                { label: 'Active Care Plans',     value: Math.round(totalMembers * 0.22).toLocaleString(),   sub: 'members enrolled',       color: 'text-teal-400' },
                { label: 'BH Screenings',         value: form.hasBH ? Math.round(totalMembers * 0.12).toLocaleString() : '—', sub: 'PHQ-9 + GAD-7 this month', color: 'text-violet-400' },
                { label: 'Compliance Reports',    value: '4',                                                sub: 'auto-generated this week', color: 'text-amber-400' },
              ].map(k => (
                <div key={k.label} className="bg-slate-900/70 border border-slate-700/50 rounded-xl p-3.5">
                  <p className="text-[10px] text-slate-400 mb-1.5">{k.label}</p>
                  <p className={`text-xl font-black ${k.color} mb-0.5`}>{k.value}</p>
                  <p className="text-[10px] text-slate-600">{k.sub}</p>
                </div>
              ))}
            </div>

            {/* Member list + Activity feed */}
            <div className="grid grid-cols-2 gap-4">
              {/* Priority member list */}
              <div className="bg-slate-900/70 border border-slate-700/50 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-700/50">
                  <p className="text-xs font-bold text-slate-200">Priority Members — Today's List</p>
                  <p className="text-[10px] text-slate-500">AI-ranked by risk score</p>
                </div>
                <div className="divide-y divide-slate-800/60">
                  {SAMPLE_MEMBERS.map(m => (
                    <div key={m.id} className="px-4 py-3 flex items-start gap-3">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${m.dotColor}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-semibold text-slate-200">{m.name} <span className="text-slate-600 font-normal">· {m.age} · {m.program}</span></p>
                          <span className={`text-[10px] font-bold flex-shrink-0 ${m.riskColor}`}>{m.risk}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{m.flag}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity feed */}
              <div className="bg-slate-900/70 border border-slate-700/50 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-700/50">
                  <p className="text-xs font-bold text-slate-200">Recent Activity</p>
                  <p className="text-[10px] text-slate-500">Live platform events</p>
                </div>
                <div className="divide-y divide-slate-800/60">
                  {[
                    { time: '2m ago',  icon: '🤖', text: `Member M-4821 flagged — ER risk score 87%` },
                    { time: '8m ago',  icon: '✅', text: `EVV visit logged — Home health worker #334` },
                    { time: '14m ago', icon: '🏘️', text: `SDOH referral completed — M-3318 housing` },
                    { time: '31m ago', icon: '📊', text: `${stateData?.evvVendor || 'EVV'} compliance report auto-generated` },
                    { time: '1h ago',  icon: '💬', text: `M-2093 responded to PHQ-9 screening — score 14` },
                    { time: '2h ago',  icon: '🧭', text: `M-9902 benefit alert sent — plan renewal in 30 days` },
                  ].map((a, i) => (
                    <div key={i} className="px-4 py-2.5 flex items-start gap-2.5">
                      <span className="text-sm flex-shrink-0">{a.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-slate-300 leading-snug">{a.text}</p>
                        <p className="text-[10px] text-slate-600 mt-0.5">{a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── STATES TAB ── */}
      {mainTab === 'states' && (
        <div className="flex-1 overflow-y-auto p-5">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h3 className="text-sm font-bold text-zinc-100 mb-1">State Medicaid Requirements</h3>
              <p className="text-xs text-zinc-500">Top 20 managed care states — EVV vendor, SDOH mandate, penetration rate, and active MCOs. When an MCO says their state — you already know what modules activate.</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 ml-4">
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /><span className="text-[10px] text-zinc-500">Required</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-zinc-600" /><span className="text-[10px] text-zinc-500">Not required</span></div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[140px_1fr_80px_80px_60px_1fr] bg-zinc-900 border-b border-zinc-800 px-4 py-2.5 gap-3">
              {['State', 'EVV Vendor', 'SDOH', 'HCBS', 'MC %', 'Active MCOs'].map(h => (
                <p key={h} className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">{h}</p>
              ))}
            </div>

            {/* Rows */}
            {STATES.map((s, idx) => (
              <div
                key={s.abbr}
                className={`grid grid-cols-[140px_1fr_80px_80px_60px_1fr] px-4 py-3 gap-3 items-start transition-colors hover:bg-zinc-800/30 ${idx < STATES.length - 1 ? 'border-b border-zinc-800/60' : ''}`}
              >
                {/* State */}
                <div>
                  <p className="text-xs font-bold text-zinc-100">{s.state}</p>
                  <p className="text-[10px] text-zinc-600 font-mono">{s.abbr}</p>
                </div>

                {/* EVV */}
                <div>
                  <p className="text-xs text-zinc-300">{s.evvVendor}</p>
                  <p className="text-[10px] text-zinc-600">{s.evvModel}</p>
                </div>

                {/* SDOH */}
                <div className="flex items-center">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.sdoh ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-800 text-zinc-600 border border-zinc-700'}`}>
                    {s.sdoh ? 'Yes' : 'No'}
                  </span>
                </div>

                {/* HCBS */}
                <div className="flex items-center">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.hcbs ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-zinc-800 text-zinc-600 border border-zinc-700'}`}>
                    {s.hcbs ? 'Yes' : 'No'}
                  </span>
                </div>

                {/* MC % */}
                <div>
                  <p className="text-xs font-semibold text-sky-400">{s.mcPct}</p>
                </div>

                {/* MCOs */}
                <div>
                  <div className="flex flex-wrap gap-1 mb-1">
                    {s.mcos.map(m => (
                      <span key={m} className="text-[9px] text-zinc-400 bg-zinc-800/80 border border-zinc-700 rounded-full px-1.5 py-0.5">{m}</span>
                    ))}
                  </div>
                  <p className="text-[10px] text-zinc-600 leading-snug">{s.notes}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-3">
            <p className="text-[10px] text-zinc-500 leading-relaxed">
              <span className="text-zinc-400 font-semibold">Sources:</span> EVV vendor data from CMS / Timeero state tracker (Oct 2025) · SDOH requirements from KFF 50-State Survey FY 2024-2025 · Managed care penetration from MACPAC MACStats Dec 2024 · MCO data from state Medicaid agency websites
            </p>
          </div>
        </div>
      )}

    </div>
  )
}
