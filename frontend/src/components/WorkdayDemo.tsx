import { useState } from 'react'

// ── Types ──────────────────────────────────────────────────────────────────────
type WDModule = 'home' | 'hcm' | 'payroll' | 'ta' | 'comp' | 'benefits' | 'ai'

interface ActionItem {
  id: string
  type: string
  title: string
  due: string
  priority: 'High' | 'Medium' | 'Low'
  module: string
}

interface PayRun {
  id: string
  name: string
  period: string
  employees: number
  grossPay: string
  status: 'Complete' | 'In Progress' | 'Exceptions' | 'Scheduled'
  exceptions: number
}

interface Requisition {
  id: string
  title: string
  dept: string
  location: string
  type: string
  openDays: number
  candidates: number
  stage: string
  status: 'Open' | 'On Hold' | 'Filled'
}

interface Employee {
  id: string
  name: string
  title: string
  dept: string
  manager: string
  location: string
  status: 'Active' | 'On Leave' | 'Terminated'
  startDate: string
}

// ── Constants ──────────────────────────────────────────────────────────────────
const WD_ORANGE = '#F36F21'

const ACTION_ITEMS: ActionItem[] = [
  { id: 'A1', type: 'Approval',    title: 'Approve merit increase — Sarah Chen (L6 → L7)',      due: 'Today',    priority: 'High',   module: 'Compensation' },
  { id: 'A2', type: 'Review',      title: 'Review payroll exceptions — April off-cycle run',     due: 'Today',    priority: 'High',   module: 'Payroll' },
  { id: 'A3', type: 'Approval',    title: 'Approve requisition — Senior SWE, Zillow Offers',     due: 'Tomorrow', priority: 'High',   module: 'Talent Acquisition' },
  { id: 'A4', type: 'Action',      title: 'Open enrollment closes in 3 days — 142 not elected',  due: 'Apr 30',   priority: 'High',   module: 'Benefits' },
  { id: 'A5', type: 'Review',      title: 'Review org change — StreetEasy restructure (47 FTE)', due: 'May 2',    priority: 'Medium', module: 'Core HCM' },
  { id: 'A6', type: 'Approval',    title: 'Approve remote work agreement — 12 pending',           due: 'May 3',    priority: 'Medium', module: 'Core HCM' },
  { id: 'A7', type: 'Action',      title: 'Update compensation bands — 2026 market refresh',     due: 'May 10',   priority: 'Medium', module: 'Compensation' },
  { id: 'A8', type: 'Review',      title: 'I-9 re-verification — 8 employees expiring',          due: 'May 15',   priority: 'Low',    module: 'Core HCM' },
]

const PAY_RUNS: PayRun[] = [
  { id: 'PR-042',  name: 'US Biweekly — All Employees',    period: 'Apr 14–27, 2026', employees: 6842, grossPay: '$42.1M',  status: 'In Progress', exceptions: 14 },
  { id: 'PR-041',  name: 'US Biweekly — All Employees',    period: 'Mar 31–Apr 13',   employees: 6839, grossPay: '$42.0M',  status: 'Complete',    exceptions: 0  },
  { id: 'PR-OFF1', name: 'Off-Cycle — Terminations',       period: 'Apr 22, 2026',    employees: 6,    grossPay: '$94.2K',  status: 'Exceptions',  exceptions: 3  },
  { id: 'PR-043',  name: 'US Biweekly — All Employees',    period: 'Apr 28–May 11',   employees: 6842, grossPay: 'TBD',     status: 'Scheduled',   exceptions: 0  },
  { id: 'PR-CA1',  name: 'CA Supplemental — RSU Vesting',  period: 'Apr 30, 2026',    employees: 312,  grossPay: '$2.8M',   status: 'Scheduled',   exceptions: 0  },
]

const REQUISITIONS: Requisition[] = [
  { id: 'REQ-1041', title: 'Senior Software Engineer',           dept: 'Zillow Offers',       location: 'Remote',       type: 'Full-time', openDays: 18, candidates: 142, stage: 'Interview',   status: 'Open'    },
  { id: 'REQ-1042', title: 'Senior Product Manager',             dept: 'CoreTech',            location: 'Remote',       type: 'Full-time', openDays: 12, candidates: 89,  stage: 'Screening',  status: 'Open'    },
  { id: 'REQ-1043', title: 'Staff Data Scientist',               dept: 'Zillow Home Loans',   location: 'Seattle, WA',  type: 'Full-time', openDays: 31, candidates: 64,  stage: 'Offer',      status: 'Open'    },
  { id: 'REQ-1044', title: 'Director, HR Business Partner',      dept: 'People Org',          location: 'Remote',       type: 'Full-time', openDays: 45, candidates: 28,  stage: 'Interview',   status: 'On Hold' },
  { id: 'REQ-1045', title: 'UX Designer II',                     dept: 'Design Systems',      location: 'San Jose, CA', type: 'Full-time', openDays: 8,  candidates: 201, stage: 'Screening',  status: 'Open'    },
  { id: 'REQ-1046', title: 'Senior Accountant',                  dept: 'Finance',             location: 'Remote',       type: 'Full-time', openDays: 22, candidates: 47,  stage: 'Offer Acc.', status: 'Filled'  },
]

const EMPLOYEES: Employee[] = [
  { id: 'E0042', name: 'Sarah Chen',       title: 'Principal PM',          dept: 'CoreTech',          manager: 'David Park',      location: 'Remote — WA',  status: 'Active',     startDate: 'Mar 2021' },
  { id: 'E0118', name: 'Marcus Johnson',   title: 'Staff SWE',             dept: 'Zillow Offers',     manager: 'Priya Mehta',     location: 'Seattle, WA',  status: 'Active',     startDate: 'Jan 2020' },
  { id: 'E0234', name: 'Lin Wei',          title: 'Data Scientist II',     dept: 'Analytics',         manager: 'Tom Bradley',     location: 'Remote — CA',  status: 'Active',     startDate: 'Jul 2022' },
  { id: 'E0301', name: 'James Okafor',     title: 'Sr. HR Business Partner',dept: 'People Org',       manager: 'Jessica Torres',  location: 'Remote — TX',  status: 'Active',     startDate: 'Nov 2019' },
  { id: 'E0412', name: 'Priya Nair',       title: 'UX Designer II',        dept: 'Design Systems',    manager: 'Alex Kim',        location: 'San Jose, CA', status: 'On Leave',   startDate: 'Apr 2023' },
  { id: 'E0519', name: 'Devon Clarke',     title: 'Senior Accountant',     dept: 'Finance',           manager: 'Maria Santos',    location: 'Remote — NY',  status: 'Active',     startDate: 'Aug 2021' },
]

const COMP_CYCLES = [
  { name: '2026 Annual Merit',        status: 'Active',    deadline: 'May 15, 2026',  eligible: 5840, submitted: 3201, pct: 55,  budget: '$18.4M', used: '$9.8M'  },
  { name: '2026 Equity Refresh',      status: 'Upcoming',  deadline: 'Jun 1, 2026',   eligible: 2100, submitted: 0,    pct: 0,   budget: '$24M',   used: '—'      },
  { name: '2025 Annual Merit',        status: 'Complete',  deadline: 'May 12, 2025',  eligible: 5720, submitted: 5720, pct: 100, budget: '$17.1M', used: '$16.9M' },
]

const BENEFITS_PLANS = [
  { plan: 'Medical — Anthem PPO',       enrolled: 4821, eligible: 5840, pct: 83, cost: '$2.1M/mo',  status: 'Open Enrollment' },
  { plan: 'Medical — Kaiser HMO (CA)', enrolled: 892,  eligible: 1240, pct: 72, cost: '$340K/mo',   status: 'Open Enrollment' },
  { plan: 'Dental — Guardian',          enrolled: 5102, eligible: 5840, pct: 87, cost: '$180K/mo',   status: 'Open Enrollment' },
  { plan: 'Vision — VSP',               enrolled: 4980, eligible: 5840, pct: 85, cost: '$42K/mo',    status: 'Open Enrollment' },
  { plan: '401(k) — Fidelity',          enrolled: 5511, eligible: 5840, pct: 94, cost: '$3.8M/mo',   status: 'Active'          },
  { plan: 'HSA — HealthEquity',         enrolled: 2140, eligible: 2800, pct: 76, cost: '$89K/mo',    status: 'Active'          },
]

const AI_AGENTS = [
  {
    name: 'Workday Illuminate',
    icon: '✨',
    status: 'Live',
    description: 'Surfaces anomalies in payroll transactions, flags compensation outliers, and auto-routes routine approvals based on 800B annual transaction patterns.',
    metrics: [{ label: 'Payroll exceptions caught', val: '94%' }, { label: 'Auto-approved transactions', val: '61%' }, { label: 'Avg resolution time', val: '4 min' }],
    color: 'orange',
  },
  {
    name: 'Employee Service Agent',
    icon: '🤖',
    status: 'Live',
    description: 'Natural language Q&A for benefits, PTO, policy, and onboarding via Slack/Teams. Powered by Workday + Salesforce partnership. Handles 78% of Tier-1 HR questions without human escalation.',
    metrics: [{ label: 'Tier-1 deflection rate', val: '78%' }, { label: 'Avg response time', val: '8 sec' }, { label: 'CSAT score', val: '4.6/5' }],
    color: 'blue',
  },
  {
    name: 'Recruiting AI (HiredScore)',
    icon: '🎯',
    status: 'Live',
    description: 'Screens inbound candidates against job requirements, surfaces top 10% for recruiter review, flags potential bias in job descriptions, and auto-schedules interviews via Paradox.',
    metrics: [{ label: 'Time-to-screen', val: '-68%' }, { label: 'Diverse slate rate', val: '+34%' }, { label: 'Recruiter hrs saved/wk', val: '12 hrs' }],
    color: 'green',
  },
  {
    name: 'Workday Extend (Custom Apps)',
    icon: '🔌',
    status: 'In Build',
    description: 'Low-code platform to build custom Zillow-specific workflows on top of Workday. Current build: Internal mobility matcher — surfaces open reqs to employees based on skills graph.',
    metrics: [{ label: 'Apps in production', val: '3' }, { label: 'Apps in build', val: '2' }, { label: 'Avg build time', val: '6 wks' }],
    color: 'purple',
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────────
const PR_STYLE: Record<string, string> = {
  'Complete':    'bg-emerald-900/50 text-emerald-300 border-emerald-700/50',
  'In Progress': 'bg-blue-900/50 text-blue-300 border-blue-700/50',
  'Exceptions':  'bg-rose-900/50 text-rose-300 border-rose-700/50',
  'Scheduled':   'bg-zinc-800 text-zinc-400 border-zinc-700',
}
const REQ_STYLE: Record<string, string> = {
  'Open':    'bg-emerald-900/50 text-emerald-300 border-emerald-700/50',
  'On Hold': 'bg-amber-900/40 text-amber-300 border-amber-700/50',
  'Filled':  'bg-zinc-800 text-zinc-400 border-zinc-700',
}
const EMP_STYLE: Record<string, string> = {
  'Active':     'bg-emerald-900/50 text-emerald-300 border-emerald-700/50',
  'On Leave':   'bg-amber-900/40 text-amber-300 border-amber-700/50',
  'Terminated': 'bg-zinc-800 text-zinc-400 border-zinc-700',
}
const PRI_STYLE: Record<string, string> = {
  'High':   'text-rose-400',
  'Medium': 'text-amber-400',
  'Low':    'text-zinc-500',
}
const CYCLE_STYLE: Record<string, string> = {
  'Active':   'bg-blue-900/50 text-blue-300 border-blue-700/50',
  'Upcoming': 'bg-amber-900/40 text-amber-300 border-amber-700/50',
  'Complete': 'bg-emerald-900/50 text-emerald-300 border-emerald-700/50',
}
const AI_COLOR: Record<string, { ring: string; text: string; badge: string }> = {
  orange: { ring: 'border-orange-700/60', text: 'text-orange-300', badge: 'bg-orange-900/40 border-orange-700/50 text-orange-300' },
  blue:   { ring: 'border-blue-700/60',   text: 'text-blue-300',   badge: 'bg-blue-900/40 border-blue-700/50 text-blue-300'     },
  green:  { ring: 'border-emerald-700/60',text: 'text-emerald-300',badge: 'bg-emerald-900/40 border-emerald-700/50 text-emerald-300' },
  purple: { ring: 'border-violet-700/60', text: 'text-violet-300', badge: 'bg-violet-900/40 border-violet-700/50 text-violet-300' },
}

const NAV_ITEMS: { key: WDModule; icon: string; label: string }[] = [
  { key: 'home',     icon: '⊞',  label: 'Home'               },
  { key: 'hcm',     icon: '👥',  label: 'Core HCM'           },
  { key: 'payroll',  icon: '💰',  label: 'Payroll'            },
  { key: 'ta',       icon: '🎯',  label: 'Talent Acquisition' },
  { key: 'comp',     icon: '⚖️',  label: 'Compensation'       },
  { key: 'benefits', icon: '🏥',  label: 'Benefits'           },
  { key: 'ai',       icon: '✨',  label: 'AI & Illuminate'    },
]

// ── MiniBar ────────────────────────────────────────────────────────────────────
function MiniBar({ pct, color = WD_ORANGE }: { pct: number; color?: string }) {
  return (
    <div className="w-full h-1.5 bg-zinc-700 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  )
}

// ── Component ──────────────────────────────────────────────────────────────────
interface Props { onBack: () => void }

export default function WorkdayDemo({ onBack }: Props) {
  const [module, setModule] = useState<WDModule>('home')
  const [dismissed, setDismissed] = useState<string[]>([])
  const [approved, setApproved] = useState<string[]>([])

  const visibleActions = ACTION_ITEMS.filter(a => !dismissed.includes(a.id))

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>

      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 h-12 flex items-center justify-between px-4 border-b border-zinc-800" style={{ backgroundColor: '#1a1a1a' }}>
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors mr-2">← Product Path</button>
          {/* Workday-style logo */}
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-black" style={{ backgroundColor: WD_ORANGE }}>W</div>
            <span className="text-sm font-bold text-white">Workday</span>
            <span className="text-xs text-zinc-500 ml-1">· Zillow Group</span>
          </div>
        </div>
        {/* Search */}
        <div className="flex-1 max-w-sm mx-6">
          <div className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5">
            <span className="text-zinc-500 text-sm">🔍</span>
            <span className="text-xs text-zinc-500">Search Workday...</span>
          </div>
        </div>
        {/* Right icons */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="text-lg cursor-pointer">🔔</span>
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ backgroundColor: WD_ORANGE }}>
              {visibleActions.filter(a => a.priority === 'High').length}
            </span>
          </div>
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: WD_ORANGE }}>AK</div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* ── Left sidebar ────────────────────────────────────────────────────── */}
        <div className="w-52 flex-shrink-0 border-r border-zinc-800 flex flex-col py-2" style={{ backgroundColor: '#111111' }}>
          {NAV_ITEMS.map(n => (
            <button
              key={n.key}
              onClick={() => setModule(n.key)}
              className={[
                'flex items-center gap-3 px-4 py-2.5 text-xs font-semibold transition-all text-left border-l-2',
                module === n.key
                  ? 'text-white border-l-2'
                  : 'text-zinc-500 border-transparent hover:text-zinc-300 hover:bg-zinc-800/40',
              ].join(' ')}
              style={module === n.key ? { borderLeftColor: WD_ORANGE, backgroundColor: '#1f1f1f', color: 'white' } : {}}
            >
              <span className="text-base w-5 text-center">{n.icon}</span>
              {n.label}
            </button>
          ))}

          <div className="mt-auto px-4 pb-4 border-t border-zinc-800 pt-3">
            <div className="text-[10px] text-zinc-600 mb-1">Logged in as</div>
            <div className="text-xs text-zinc-300 font-semibold">Anil K.</div>
            <div className="text-[10px] text-zinc-500">Senior PM · People Tech</div>
          </div>
        </div>

        {/* ── Main content ────────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto bg-zinc-950 p-6">

          {/* ── HOME ───────────────────────────────────────────────────────────── */}
          {module === 'home' && (
            <div>
              <div className="mb-5">
                <h1 className="text-lg font-bold text-zinc-100">Good morning, Anil.</h1>
                <p className="text-xs text-zinc-500 mt-0.5">Monday, April 28, 2026 · Zillow Group · People Org — CoreTech</p>
              </div>

              {/* KPI worklets */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { label: 'Total Headcount', val: '6,842', sub: '+38 this month', color: WD_ORANGE },
                  { label: 'Open Requisitions', val: '127', sub: 'Avg 24 days open', color: '#3b82f6' },
                  { label: 'Payroll Exceptions', val: '17', sub: 'Needs resolution', color: '#ef4444' },
                  { label: 'Benefits Not Enrolled', val: '142', sub: 'Enrollment closes Apr 30', color: '#f59e0b' },
                ].map(k => (
                  <div key={k.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                    <div className="text-2xl font-bold mb-0.5" style={{ color: k.color }}>{k.val}</div>
                    <div className="text-xs font-semibold text-zinc-200 mb-1">{k.label}</div>
                    <div className="text-[10px] text-zinc-500">{k.sub}</div>
                  </div>
                ))}
              </div>

              {/* Headcount trend (CSS sparkline) */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-zinc-200">Headcount Trend — 12 months</span>
                    <span className="text-[10px] text-emerald-400">▲ +4.2% YoY</span>
                  </div>
                  <div className="flex items-end gap-1 h-16">
                    {[6420, 6480, 6510, 6550, 6580, 6620, 6680, 6710, 6750, 6790, 6820, 6842].map((v, i) => (
                      <div key={i} className="flex-1 rounded-t-sm transition-all" style={{ height: `${((v - 6400) / 450) * 100}%`, backgroundColor: i === 11 ? WD_ORANGE : '#3f3f46' }} />
                    ))}
                  </div>
                  <div className="flex justify-between text-[9px] text-zinc-600 mt-1">
                    <span>May '25</span><span>Apr '26</span>
                  </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-zinc-200">Time-to-Fill — Avg Days</span>
                    <span className="text-[10px] text-rose-400">▲ 24d (target: 20d)</span>
                  </div>
                  <div className="flex items-end gap-1 h-16">
                    {[18, 19, 22, 21, 20, 23, 25, 26, 24, 22, 23, 24].map((v, i) => (
                      <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${(v / 30) * 100}%`, backgroundColor: v > 20 ? '#ef444460' : '#22c55e60', border: i === 11 ? `1px solid ${WD_ORANGE}` : 'none' }} />
                    ))}
                  </div>
                  <div className="flex justify-between text-[9px] text-zinc-600 mt-1">
                    <span>May '25</span><span>Apr '26</span>
                  </div>
                </div>
              </div>

              {/* Action items */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl">
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                  <span className="text-xs font-bold text-zinc-200">Action Items ({visibleActions.length})</span>
                  <span className="text-[10px] text-zinc-500">{visibleActions.filter(a => a.priority === 'High').length} high priority</span>
                </div>
                {visibleActions.map(a => (
                  <div key={a.id} className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800/50 last:border-0">
                    <span className={`text-[10px] font-bold w-12 flex-shrink-0 ${PRI_STYLE[a.priority]}`}>{a.priority}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-zinc-200 truncate">{a.title}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-zinc-500">{a.module}</span>
                        <span className="text-[10px] text-zinc-600">·</span>
                        <span className={`text-[10px] font-semibold ${a.due === 'Today' ? 'text-rose-400' : a.due === 'Tomorrow' ? 'text-amber-400' : 'text-zinc-500'}`}>Due {a.due}</span>
                      </div>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      {!approved.includes(a.id) ? (
                        <button
                          onClick={() => setApproved(x => [...x, a.id])}
                          className="text-[10px] px-2.5 py-1 rounded-lg font-semibold text-white transition-colors"
                          style={{ backgroundColor: WD_ORANGE }}
                        >
                          {a.type === 'Approval' ? 'Approve' : 'Review'}
                        </button>
                      ) : (
                        <span className="text-[10px] text-emerald-400 font-semibold">✓ Done</span>
                      )}
                      <button
                        onClick={() => setDismissed(x => [...x, a.id])}
                        className="text-[10px] px-2 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── CORE HCM ───────────────────────────────────────────────────────── */}
          {module === 'hcm' && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h1 className="text-lg font-bold text-zinc-100">Core HCM</h1>
                  <p className="text-xs text-zinc-500 mt-0.5">Employee data, org structure, and workforce management</p>
                </div>
                <button className="text-xs text-white px-3.5 py-1.5 rounded-lg font-semibold" style={{ backgroundColor: WD_ORANGE }}>+ Add Worker</button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-3 mb-5">
                {[
                  { label: 'Active Employees', val: '6,712' },
                  { label: 'On Leave', val: '94' },
                  { label: 'Contractors', val: '284' },
                  { label: 'New Hires (30d)', val: '38' },
                ].map(s => (
                  <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center">
                    <div className="text-xl font-bold text-zinc-100 mb-0.5">{s.val}</div>
                    <div className="text-[11px] text-zinc-500">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Dept breakdown */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-4">
                <p className="text-xs font-bold text-zinc-200 mb-3">Headcount by Department</p>
                <div className="space-y-2">
                  {[
                    { dept: 'Engineering',        count: 2840, pct: 41 },
                    { dept: 'Sales & Operations', count: 1420, pct: 21 },
                    { dept: 'Product & Design',   count: 980,  pct: 14 },
                    { dept: 'People Org',         count: 420,  pct: 6  },
                    { dept: 'Finance & Legal',    count: 380,  pct: 6  },
                    { dept: 'Marketing',          count: 340,  pct: 5  },
                    { dept: 'Other',              count: 462,  pct: 7  },
                  ].map(d => (
                    <div key={d.dept} className="flex items-center gap-3">
                      <span className="text-xs text-zinc-400 w-40 flex-shrink-0">{d.dept}</span>
                      <div className="flex-1"><MiniBar pct={d.pct} /></div>
                      <span className="text-xs text-zinc-300 font-semibold w-14 text-right flex-shrink-0">{d.count.toLocaleString()}</span>
                      <span className="text-[10px] text-zinc-600 w-8 flex-shrink-0">{d.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Employee table */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-200">Workers</span>
                  <span className="text-[10px] text-zinc-500">Showing 6 of 6,842</span>
                </div>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      {['ID', 'Name', 'Title', 'Department', 'Manager', 'Location', 'Status', 'Start Date'].map(h => (
                        <th key={h} className="text-left text-zinc-500 px-4 py-2.5 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {EMPLOYEES.map(e => (
                      <tr key={e.id} className="border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/20 transition-colors">
                        <td className="px-4 py-3 text-zinc-500">{e.id}</td>
                        <td className="px-4 py-3 font-semibold text-zinc-100">{e.name}</td>
                        <td className="px-4 py-3 text-zinc-400">{e.title}</td>
                        <td className="px-4 py-3 text-zinc-400">{e.dept}</td>
                        <td className="px-4 py-3 text-zinc-400">{e.manager}</td>
                        <td className="px-4 py-3 text-zinc-400">{e.location}</td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${EMP_STYLE[e.status]}`}>{e.status}</span>
                        </td>
                        <td className="px-4 py-3 text-zinc-500">{e.startDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── PAYROLL ────────────────────────────────────────────────────────── */}
          {module === 'payroll' && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h1 className="text-lg font-bold text-zinc-100">Payroll</h1>
                  <p className="text-xs text-zinc-500 mt-0.5">Pay runs, exceptions, and compliance — US biweekly + off-cycle</p>
                </div>
                <button className="text-xs text-white px-3.5 py-1.5 rounded-lg font-semibold" style={{ backgroundColor: WD_ORANGE }}>+ Off-Cycle Run</button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-3 mb-5">
                {[
                  { label: 'YTD Gross Payroll', val: '$336.8M', color: WD_ORANGE },
                  { label: 'Active Pay Groups', val: '8', color: 'white' },
                  { label: 'Open Exceptions', val: '17', color: '#ef4444' },
                  { label: 'Next Run', val: 'Apr 28', color: '#3b82f6' },
                ].map(s => (
                  <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center">
                    <div className="text-xl font-bold mb-0.5" style={{ color: s.color }}>{s.val}</div>
                    <div className="text-[11px] text-zinc-500">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Pay runs */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden mb-4">
                <div className="px-4 py-3 border-b border-zinc-800">
                  <span className="text-xs font-bold text-zinc-200">Pay Runs</span>
                </div>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      {['Run ID', 'Name', 'Period', 'Employees', 'Gross Pay', 'Status', 'Exceptions', 'Actions'].map(h => (
                        <th key={h} className="text-left text-zinc-500 px-4 py-2.5 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {PAY_RUNS.map(r => (
                      <tr key={r.id} className="border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/20 transition-colors">
                        <td className="px-4 py-3 text-zinc-500 font-mono text-[10px]">{r.id}</td>
                        <td className="px-4 py-3 font-semibold text-zinc-100">{r.name}</td>
                        <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">{r.period}</td>
                        <td className="px-4 py-3 text-zinc-300">{r.employees.toLocaleString()}</td>
                        <td className="px-4 py-3 text-zinc-300 font-semibold">{r.grossPay}</td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${PR_STYLE[r.status]}`}>{r.status}</span>
                        </td>
                        <td className="px-4 py-3">
                          {r.exceptions > 0
                            ? <span className="text-rose-400 font-bold">{r.exceptions}</span>
                            : <span className="text-zinc-600">—</span>}
                        </td>
                        <td className="px-4 py-3">
                          <button className="text-[10px] px-2.5 py-1 rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors">
                            {r.status === 'In Progress' ? 'Complete Run' : r.status === 'Exceptions' ? 'Resolve' : 'View'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Exceptions detail */}
              <div className="bg-rose-950/20 border border-rose-800/40 rounded-xl p-4">
                <p className="text-xs font-bold text-rose-300 mb-3">⚠️ Open Exceptions — Require Resolution Before Run Closes</p>
                <div className="space-y-2">
                  {[
                    { type: 'Missing Tax Form',         employee: 'Devon Clarke (E0519)',    detail: 'CA DE-4 not on file — state withholding blocked',          action: 'Send reminder' },
                    { type: 'Retro Pay Mismatch',       employee: 'Marcus Johnson (E0118)',  detail: 'Merit increase effective Apr 1 — retroactive delta $4,200', action: 'Calculate retro' },
                    { type: 'Garnishment Update',       employee: 'James Okafor (E0301)',    detail: 'Child support order updated — new deduction amount pending', action: 'Update order' },
                    { type: 'Direct Deposit Failed',    employee: 'Lin Wei (E0234)',         detail: 'ACH return code R03 — account closed',                      action: 'Re-verify bank' },
                  ].map((ex, i) => (
                    <div key={i} className="flex items-start gap-3 bg-zinc-900/60 border border-zinc-800 rounded-lg px-3 py-2.5">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-bold text-rose-400">{ex.type}</span>
                          <span className="text-[10px] text-zinc-500">· {ex.employee}</span>
                        </div>
                        <p className="text-xs text-zinc-400">{ex.detail}</p>
                      </div>
                      <button className="text-[10px] px-2.5 py-1 rounded-lg text-white flex-shrink-0" style={{ backgroundColor: WD_ORANGE }}>{ex.action}</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── TALENT ACQUISITION ─────────────────────────────────────────────── */}
          {module === 'ta' && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h1 className="text-lg font-bold text-zinc-100">Talent Acquisition</h1>
                  <p className="text-xs text-zinc-500 mt-0.5">Requisitions, pipeline, and hiring metrics across Zillow Group</p>
                </div>
                <button className="text-xs text-white px-3.5 py-1.5 rounded-lg font-semibold" style={{ backgroundColor: WD_ORANGE }}>+ New Requisition</button>
              </div>

              {/* Pipeline funnel */}
              <div className="grid grid-cols-5 gap-2 mb-5">
                {[
                  { stage: 'Applied',     count: 4821, color: '#3b82f6' },
                  { stage: 'Screening',   count: 892,  color: WD_ORANGE },
                  { stage: 'Interview',   count: 284,  color: '#8b5cf6' },
                  { stage: 'Offer',       count: 47,   color: '#10b981' },
                  { stage: 'Hired',       count: 21,   color: '#22c55e' },
                ].map(s => (
                  <div key={s.stage} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center">
                    <div className="text-xl font-bold mb-1" style={{ color: s.color }}>{s.count.toLocaleString()}</div>
                    <div className="text-[11px] text-zinc-500">{s.stage}</div>
                    <div className="mt-2 h-1 rounded-full" style={{ backgroundColor: s.color, opacity: 0.3 }} />
                  </div>
                ))}
              </div>

              {/* Metrics row */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                  <p className="text-[10px] text-zinc-500 mb-1">Avg Time-to-Fill</p>
                  <p className="text-2xl font-bold text-zinc-100">24 <span className="text-sm font-normal text-zinc-500">days</span></p>
                  <p className="text-[10px] text-rose-400 mt-1">▲ 4d over target (20d)</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                  <p className="text-[10px] text-zinc-500 mb-1">Offer Acceptance Rate</p>
                  <p className="text-2xl font-bold text-zinc-100">87<span className="text-sm font-normal text-zinc-500">%</span></p>
                  <p className="text-[10px] text-emerald-400 mt-1">▲ +3% vs last quarter</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                  <p className="text-[10px] text-zinc-500 mb-1">Diverse Slate Rate</p>
                  <p className="text-2xl font-bold text-zinc-100">71<span className="text-sm font-normal text-zinc-500">%</span></p>
                  <p className="text-[10px] text-emerald-400 mt-1">↑ Target: 70%</p>
                </div>
              </div>

              {/* Requisitions */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-zinc-800">
                  <span className="text-xs font-bold text-zinc-200">Open Requisitions</span>
                </div>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      {['Req ID', 'Title', 'Department', 'Location', 'Days Open', 'Candidates', 'Stage', 'Status'].map(h => (
                        <th key={h} className="text-left text-zinc-500 px-4 py-2.5 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {REQUISITIONS.map(r => (
                      <tr key={r.id} className="border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/20 transition-colors cursor-pointer">
                        <td className="px-4 py-3 text-zinc-500 font-mono text-[10px]">{r.id}</td>
                        <td className="px-4 py-3 font-semibold text-zinc-100">{r.title}</td>
                        <td className="px-4 py-3 text-zinc-400">{r.dept}</td>
                        <td className="px-4 py-3 text-zinc-400">{r.location}</td>
                        <td className={`px-4 py-3 font-semibold ${r.openDays > 30 ? 'text-rose-400' : r.openDays > 20 ? 'text-amber-400' : 'text-emerald-400'}`}>{r.openDays}d</td>
                        <td className="px-4 py-3 text-zinc-300">{r.candidates}</td>
                        <td className="px-4 py-3 text-zinc-400">{r.stage}</td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${REQ_STYLE[r.status]}`}>{r.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── COMPENSATION ───────────────────────────────────────────────────── */}
          {module === 'comp' && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h1 className="text-lg font-bold text-zinc-100">Compensation</h1>
                  <p className="text-xs text-zinc-500 mt-0.5">Merit cycles, equity refresh, and compensation band management</p>
                </div>
                <button className="text-xs text-white px-3.5 py-1.5 rounded-lg font-semibold" style={{ backgroundColor: WD_ORANGE }}>View Comp Bands</button>
              </div>

              {/* Comp cycles */}
              <div className="space-y-3 mb-5">
                {COMP_CYCLES.map(c => (
                  <div key={c.name} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-zinc-100">{c.name}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${CYCLE_STYLE[c.status]}`}>{c.status}</span>
                      </div>
                      <span className="text-xs text-zinc-500">Deadline: {c.deadline}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-4 mb-3">
                      {[
                        { label: 'Eligible', val: c.eligible.toLocaleString() },
                        { label: 'Submitted', val: c.submitted.toLocaleString() },
                        { label: 'Budget', val: c.budget },
                        { label: 'Used', val: c.used },
                      ].map(f => (
                        <div key={f.label}>
                          <div className="text-[10px] text-zinc-600 mb-0.5">{f.label}</div>
                          <div className="text-sm font-bold text-zinc-200">{f.val}</div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <MiniBar pct={c.pct} color={c.status === 'Complete' ? '#22c55e' : WD_ORANGE} />
                      <span className="text-xs text-zinc-400 flex-shrink-0">{c.pct}% complete</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pay equity */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <p className="text-xs font-bold text-zinc-200 mb-3">Pay vs. Market — Band Utilization</p>
                <div className="space-y-2.5">
                  {[
                    { level: 'L3 — Associate',   min: '$72K',  mid: '$88K',  max: '$104K', avg: '$86K', pct: 68 },
                    { level: 'L4 — Senior',       min: '$104K', mid: '$128K', max: '$152K', avg: '$131K',pct: 75 },
                    { level: 'L5 — Staff',        min: '$140K', mid: '$172K', max: '$204K', avg: '$168K',pct: 70 },
                    { level: 'L6 — Principal',    min: '$180K', mid: '$224K', max: '$268K', avg: '$240K',pct: 85 },
                    { level: 'L7 — Distinguished',min: '$240K', mid: '$300K', max: '$360K', avg: '$295K',pct: 80 },
                  ].map(b => (
                    <div key={b.level} className="flex items-center gap-3">
                      <span className="text-xs text-zinc-400 w-40 flex-shrink-0">{b.level}</span>
                      <div className="flex-1 relative h-4 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${b.pct}%`, backgroundColor: WD_ORANGE + '60' }} />
                        <div className="absolute inset-y-0 rounded-full w-1" style={{ left: `${b.pct}%`, backgroundColor: WD_ORANGE }} />
                      </div>
                      <span className="text-xs text-zinc-300 w-16 text-right flex-shrink-0">{b.avg} avg</span>
                      <span className="text-[10px] text-zinc-600 w-8 flex-shrink-0">{b.pct}%</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-zinc-600 mt-2">% of band midpoint. Target: 80–95% compa-ratio range.</p>
              </div>
            </div>
          )}

          {/* ── BENEFITS ───────────────────────────────────────────────────────── */}
          {module === 'benefits' && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h1 className="text-lg font-bold text-zinc-100">Benefits</h1>
                  <p className="text-xs text-zinc-500 mt-0.5">Open enrollment, plan elections, and carrier management</p>
                </div>
                <div className="flex gap-2">
                  <button className="text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg">Send Reminder</button>
                  <button className="text-xs text-white px-3.5 py-1.5 rounded-lg font-semibold" style={{ backgroundColor: WD_ORANGE }}>Manage Plans</button>
                </div>
              </div>

              {/* Open enrollment alert */}
              <div className="bg-amber-950/30 border border-amber-700/50 rounded-xl p-4 mb-5 flex items-center gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="text-sm font-bold text-amber-300">Open Enrollment closes April 30, 2026 — 2 days remaining</p>
                  <p className="text-xs text-amber-400/80 mt-0.5">142 eligible employees have not elected benefits. Auto-enrollment in waived status if no action taken.</p>
                </div>
                <button className="ml-auto text-xs text-white px-3 py-1.5 rounded-lg font-semibold flex-shrink-0" style={{ backgroundColor: WD_ORANGE }}>Send Bulk Reminder</button>
              </div>

              {/* Plans table */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-zinc-800">
                  <span className="text-xs font-bold text-zinc-200">Benefit Plans — Enrollment Status</span>
                </div>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      {['Plan', 'Enrolled', 'Eligible', 'Enrollment %', 'Monthly Cost', 'Status'].map(h => (
                        <th key={h} className="text-left text-zinc-500 px-4 py-2.5 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {BENEFITS_PLANS.map(p => (
                      <tr key={p.plan} className="border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/20 transition-colors">
                        <td className="px-4 py-3 font-semibold text-zinc-100">{p.plan}</td>
                        <td className="px-4 py-3 text-zinc-300">{p.enrolled.toLocaleString()}</td>
                        <td className="px-4 py-3 text-zinc-400">{p.eligible.toLocaleString()}</td>
                        <td className="px-4 py-3 w-40">
                          <div className="flex items-center gap-2">
                            <div className="flex-1"><MiniBar pct={p.pct} color={p.pct >= 90 ? '#22c55e' : p.pct >= 75 ? WD_ORANGE : '#ef4444'} /></div>
                            <span className="text-zinc-300 font-semibold w-8 text-right">{p.pct}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-zinc-300">{p.cost}</td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${p.status === 'Open Enrollment' ? 'bg-amber-900/40 border-amber-700/50 text-amber-300' : 'bg-emerald-900/50 border-emerald-700/50 text-emerald-300'}`}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── AI & ILLUMINATE ────────────────────────────────────────────────── */}
          {module === 'ai' && (
            <div>
              <div className="mb-5">
                <h1 className="text-lg font-bold text-zinc-100">AI & Workday Illuminate</h1>
                <p className="text-xs text-zinc-500 mt-0.5">AI agents, automation, and Extend platform across all modules</p>
              </div>

              {/* AI impact summary */}
              <div className="grid grid-cols-4 gap-3 mb-5">
                {[
                  { label: 'Transactions Auto-Processed', val: '61%', color: WD_ORANGE },
                  { label: 'HR Tier-1 Deflection', val: '78%', color: '#3b82f6' },
                  { label: 'Exceptions Caught by AI', val: '94%', color: '#22c55e' },
                  { label: 'Recruiter Hrs Saved/Wk', val: '12 hrs', color: '#8b5cf6' },
                ].map(s => (
                  <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold mb-0.5" style={{ color: s.color }}>{s.val}</div>
                    <div className="text-[11px] text-zinc-500">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* AI agent cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {AI_AGENTS.map(agent => {
                  const c = AI_COLOR[agent.color]
                  return (
                    <div key={agent.name} className={`bg-zinc-900 border rounded-xl p-5 ${c.ring}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{agent.icon}</span>
                          <span className={`text-sm font-bold ${c.text}`}>{agent.name}</span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${agent.status === 'Live' ? 'bg-emerald-900/50 border-emerald-700/50 text-emerald-300' : 'bg-amber-900/40 border-amber-700/50 text-amber-300'}`}>
                          {agent.status}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed mb-4">{agent.description}</p>
                      <div className="grid grid-cols-3 gap-2">
                        {agent.metrics.map(m => (
                          <div key={m.label} className="bg-zinc-800/60 border border-zinc-700/40 rounded-lg px-2 py-2 text-center">
                            <div className={`text-sm font-bold ${c.text}`}>{m.val}</div>
                            <div className="text-[9px] text-zinc-500 mt-0.5 leading-tight">{m.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* PM roadmap for AI */}
              <div className="mt-5 bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <p className="text-xs font-bold text-zinc-200 mb-3">AI Roadmap — PM Ownership</p>
                <div className="space-y-2">
                  {[
                    { quarter: 'Q2 2026', item: 'Launch internal mobility AI matcher (Workday Extend)',    status: 'In Build',  owner: 'CoreTech PM' },
                    { quarter: 'Q2 2026', item: 'Expand Employee Service Agent to cover Comp & Benefits Q&A', status: 'Planned',   owner: 'CoreTech PM' },
                    { quarter: 'Q3 2026', item: 'AI-driven compensation anomaly detection at merit cycle',  status: 'Planned',   owner: 'CoreTech PM' },
                    { quarter: 'Q3 2026', item: 'Predictive attrition model integrated into HCM dashboard', status: 'Exploring', owner: 'Analytics PM' },
                    { quarter: 'Q4 2026', item: 'Payroll exception auto-resolution for low-risk patterns',  status: 'Exploring', owner: 'CoreTech PM' },
                  ].map((r, i) => (
                    <div key={i} className="flex items-center gap-3 bg-zinc-800/40 border border-zinc-700/30 rounded-lg px-3 py-2.5">
                      <span className="text-[10px] font-bold text-zinc-500 w-16 flex-shrink-0">{r.quarter}</span>
                      <span className="flex-1 text-xs text-zinc-300">{r.item}</span>
                      <span className="text-[10px] text-zinc-500 flex-shrink-0">{r.owner}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold flex-shrink-0 ${r.status === 'In Build' ? 'bg-blue-900/50 border-blue-700/50 text-blue-300' : r.status === 'Planned' ? 'bg-violet-900/40 border-violet-700/50 text-violet-300' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}>
                        {r.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
