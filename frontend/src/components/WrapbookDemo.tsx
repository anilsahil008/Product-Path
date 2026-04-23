import { useState } from 'react'

// ── Types ──────────────────────────────────────────────────────────────────────

type WrapTab = 'productions' | 'onboard' | 'timecards' | 'compliance'

interface Production {
  id: string
  name: string
  type: string
  status: 'Active' | 'Pre-Production' | 'Wrapped'
  crew: number
  budget: string
  state: string
  startDate: string
  union: string
}

interface Worker {
  name: string
  role: string
  union: string
  status: 'Pending' | 'In Progress' | 'Complete' | 'Blocked'
  step: number
  flag?: string
}

interface Timecard {
  id: string
  worker: string
  role: string
  week: string
  regular: number
  overtime: number
  total: string
  status: 'Pending Approval' | 'Approved' | 'Rejected'
  flag?: string
}

interface ComplianceItem {
  worker: string
  type: string
  status: 'OK' | 'Due Soon' | 'Overdue' | 'Blocked'
  detail: string
  dueDate?: string
}

// ── Data ───────────────────────────────────────────────────────────────────────

const PRODUCTIONS: Production[] = [
  { id: 'P001', name: 'The Last Circuit', type: 'Feature Film', status: 'Active', crew: 142, budget: '$18M', state: 'CA', startDate: 'Jan 15, 2026', union: 'IATSE + SAG-AFTRA' },
  { id: 'P002', name: 'Harbor Street S2', type: 'TV Series', status: 'Active', crew: 89, budget: '$4.2M/ep', state: 'NY', startDate: 'Feb 3, 2026', union: 'IATSE + SAG-AFTRA + Teamsters' },
  { id: 'P003', name: 'Sunburst Commercial', type: 'Commercial', status: 'Pre-Production', crew: 24, budget: '$400K', state: 'TX', startDate: 'May 1, 2026', union: 'Non-Union' },
  { id: 'P004', name: 'Cold Harbor', type: 'Feature Film', status: 'Wrapped', crew: 198, budget: '$32M', state: 'GA', startDate: 'Sep 2024', union: 'IATSE + SAG-AFTRA + Teamsters' },
]

const WORKERS: Worker[] = [
  { name: 'Maria Santos', role: 'Camera Operator', union: 'IATSE Local 600', status: 'Blocked', step: 4, flag: 'I-9 document expired' },
  { name: 'James Okafor', role: 'Grip', union: 'IATSE Local 80', status: 'In Progress', step: 6 },
  { name: 'Lin Wei', role: 'Script Supervisor', union: 'IATSE Local 871', status: 'In Progress', step: 5 },
  { name: 'Devon Clarke', role: 'SAG Actor', union: 'SAG-AFTRA', status: 'Complete', step: 9 },
  { name: 'Priya Nair', role: 'Production Assistant', union: 'Non-Union', status: 'Pending', step: 1 },
  { name: 'Tom Reeves', role: 'Teamster Driver', union: 'Teamsters Local 399', status: 'In Progress', step: 7 },
]

const TIMECARDS: Timecard[] = [
  { id: 'TC-1041', worker: 'James Okafor', role: 'Grip', week: 'Apr 14–20', regular: 40, overtime: 12, total: '$3,840', status: 'Pending Approval', flag: '12 hrs OT · CA daily OT rule' },
  { id: 'TC-1042', worker: 'Lin Wei', role: 'Script Supervisor', week: 'Apr 14–20', regular: 40, overtime: 4, total: '$2,960', status: 'Pending Approval' },
  { id: 'TC-1043', worker: 'Maria Santos', role: 'Camera Operator', week: 'Apr 14–20', regular: 40, overtime: 8, total: '$4,120', status: 'Pending Approval', flag: '6th day penalty applies' },
  { id: 'TC-1044', worker: 'Devon Clarke', role: 'SAG Actor', week: 'Apr 7–13', regular: 40, overtime: 0, total: '$2,100', status: 'Approved' },
  { id: 'TC-1045', worker: 'Tom Reeves', role: 'Teamster Driver', week: 'Apr 7–13', regular: 40, overtime: 16, total: '$3,280', status: 'Approved' },
  { id: 'TC-1046', worker: 'Priya Nair', role: 'PA', week: 'Apr 7–13', regular: 40, overtime: 0, total: '$1,200', status: 'Rejected', flag: 'Missing department approval' },
]

const COMPLIANCE: ComplianceItem[] = [
  { worker: 'Maria Santos', type: 'I-9 Verification', status: 'Blocked', detail: 'Passport expired during production. Remote re-verification required.', dueDate: 'Immediate' },
  { worker: 'Priya Nair', type: 'W-4 / CA DE-4', status: 'Due Soon', detail: 'State withholding form not yet submitted.', dueDate: 'Apr 30, 2026' },
  { worker: 'Tom Reeves', type: 'Background Check', status: 'OK', detail: 'Checkr clear · completed Mar 12, 2026' },
  { worker: 'James Okafor', type: 'Direct Deposit', status: 'OK', detail: 'ACH validated · Chase ••4821' },
  { worker: 'Lin Wei', type: 'Union Eligibility', status: 'OK', detail: 'IATSE Local 871 · dues current through Jun 2026' },
  { worker: 'Devon Clarke', type: 'SAG Contract', status: 'Due Soon', detail: 'Modified Low Budget Agreement renewal due.', dueDate: 'May 15, 2026' },
]

const ONBOARD_STEPS = [
  { num: 1, label: 'Invite Sent', icon: '📨' },
  { num: 2, label: 'Account', icon: '👤' },
  { num: 3, label: 'Personal Info', icon: '📋' },
  { num: 4, label: 'I-9', icon: '🪪' },
  { num: 5, label: 'W-4', icon: '📄' },
  { num: 6, label: 'Direct Deposit', icon: '🏦' },
  { num: 7, label: 'Union Setup', icon: '🤝' },
  { num: 8, label: 'Approval', icon: '✅' },
  { num: 9, label: 'Active', icon: '🟢' },
]

// ── Status helpers ─────────────────────────────────────────────────────────────

const PROD_STATUS: Record<string, string> = {
  'Active':          'bg-emerald-900/50 text-emerald-300 border-emerald-700/50',
  'Pre-Production':  'bg-amber-900/40 text-amber-300 border-amber-700/50',
  'Wrapped':         'bg-zinc-800 text-zinc-400 border-zinc-700',
}

const WORKER_STATUS: Record<string, string> = {
  'Complete':    'bg-emerald-900/50 text-emerald-300 border-emerald-700/50',
  'In Progress': 'bg-indigo-900/50 text-indigo-300 border-indigo-700/50',
  'Blocked':     'bg-rose-900/50 text-rose-300 border-rose-700/50',
  'Pending':     'bg-zinc-800 text-zinc-400 border-zinc-700',
}

const TC_STATUS: Record<string, string> = {
  'Pending Approval': 'bg-amber-900/40 text-amber-300 border-amber-700/50',
  'Approved':         'bg-emerald-900/50 text-emerald-300 border-emerald-700/50',
  'Rejected':         'bg-rose-900/50 text-rose-300 border-rose-700/50',
}

const COMP_STATUS: Record<string, string> = {
  'OK':        'bg-emerald-900/50 text-emerald-300 border-emerald-700/50',
  'Due Soon':  'bg-amber-900/40 text-amber-300 border-amber-700/50',
  'Overdue':   'bg-rose-900/50 text-rose-300 border-rose-700/50',
  'Blocked':   'bg-rose-900/70 text-rose-200 border-rose-600/70',
}

// ── Component ──────────────────────────────────────────────────────────────────

interface Props { onBack: () => void }

export default function WrapbookDemo({ onBack }: Props) {
  const [activeTab, setActiveTab] = useState<WrapTab>('productions')
  const [selectedProd, setSelectedProd] = useState<Production>(PRODUCTIONS[0])
  const [tcStatuses, setTcStatuses] = useState<Record<string, Timecard['status']>>(
    Object.fromEntries(TIMECARDS.map(t => [t.id, t.status]))
  )

  const approveTC = (id: string) => setTcStatuses(s => ({ ...s, [id]: 'Approved' }))
  const rejectTC  = (id: string) => setTcStatuses(s => ({ ...s, [id]: 'Rejected' }))

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">

      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
            ← Product Path
          </button>
          <span className="text-zinc-700">|</span>
          <span className="text-sm font-bold text-violet-400">🎬 Wrapbook</span>
          <span className="text-xs text-zinc-500">· Demo</span>
        </div>
        {/* Production selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">Production:</span>
          <select
            value={selectedProd.id}
            onChange={e => setSelectedProd(PRODUCTIONS.find(p => p.id === e.target.value)!)}
            className="text-xs bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-violet-600"
          >
            {PRODUCTIONS.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Tab bar ─────────────────────────────────────────────────────────── */}
      <div className="bg-zinc-900/60 border-b border-zinc-800 px-6">
        <div className="flex gap-0">
          {([
            { key: 'productions', label: '🎬 Productions' },
            { key: 'onboard',     label: '👷 Onboard Crew' },
            { key: 'timecards',   label: '⏱️ Timecards' },
            { key: 'compliance',  label: '⚖️ Compliance' },
          ] as { key: WrapTab; label: string }[]).map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={[
                'px-4 py-3 text-xs font-semibold border-b-2 transition-all',
                activeTab === t.key
                  ? 'border-violet-500 text-violet-300'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300',
              ].join(' ')}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────────── */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-6">

        {/* ── Productions ───────────────────────────────────────────────────── */}
        {activeTab === 'productions' && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-zinc-100">Productions</h2>
                <p className="text-xs text-zinc-500 mt-0.5">All productions under your company account</p>
              </div>
              <button className="text-xs bg-violet-600 hover:bg-violet-500 text-white px-3.5 py-1.5 rounded-lg font-semibold transition-colors">
                + New Production
              </button>
            </div>

            {/* Summary tiles */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              {[
                { label: 'Active', val: '2', color: 'text-emerald-400' },
                { label: 'Total Crew', val: '453', color: 'text-violet-400' },
                { label: 'Pre-Production', val: '1', color: 'text-amber-400' },
                { label: 'Wrapped', val: '1', color: 'text-zinc-400' },
              ].map(s => (
                <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
                  <div className={`text-xl font-bold ${s.color}`}>{s.val}</div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Productions table */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900/80">
                    <th className="text-left text-zinc-500 px-4 py-3 font-semibold">Production</th>
                    <th className="text-left text-zinc-500 px-4 py-3 font-semibold">Type</th>
                    <th className="text-left text-zinc-500 px-4 py-3 font-semibold">Status</th>
                    <th className="text-left text-zinc-500 px-4 py-3 font-semibold">Crew</th>
                    <th className="text-left text-zinc-500 px-4 py-3 font-semibold">Budget</th>
                    <th className="text-left text-zinc-500 px-4 py-3 font-semibold">State</th>
                    <th className="text-left text-zinc-500 px-4 py-3 font-semibold">Union</th>
                  </tr>
                </thead>
                <tbody>
                  {PRODUCTIONS.map((p) => (
                    <tr
                      key={p.id}
                      onClick={() => setSelectedProd(p)}
                      className={[
                        'border-b border-zinc-800/50 last:border-0 cursor-pointer transition-colors',
                        selectedProd.id === p.id ? 'bg-violet-950/30' : 'hover:bg-zinc-800/30',
                      ].join(' ')}
                    >
                      <td className="px-4 py-3">
                        <div className="font-semibold text-zinc-100">{p.name}</div>
                        <div className="text-zinc-600 text-[10px]">{p.startDate}</div>
                      </td>
                      <td className="px-4 py-3 text-zinc-400">{p.type}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${PROD_STATUS[p.status]}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-300 font-semibold">{p.crew}</td>
                      <td className="px-4 py-3 text-zinc-300">{p.budget}</td>
                      <td className="px-4 py-3 text-zinc-400">{p.state}</td>
                      <td className="px-4 py-3 text-zinc-400">{p.union}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Selected production detail */}
            <div className="mt-4 bg-zinc-900/60 border border-violet-800/30 rounded-xl p-4">
              <p className="text-[10px] font-bold text-violet-400 uppercase tracking-wider mb-3">Selected · {selectedProd.name}</p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 text-xs">
                {[
                  { label: 'Type', val: selectedProd.type },
                  { label: 'Status', val: selectedProd.status },
                  { label: 'State', val: selectedProd.state },
                  { label: 'Crew', val: String(selectedProd.crew) },
                  { label: 'Budget', val: selectedProd.budget },
                  { label: 'Union', val: selectedProd.union },
                ].map(f => (
                  <div key={f.label}>
                    <div className="text-zinc-600 text-[10px] mb-0.5">{f.label}</div>
                    <div className="text-zinc-200 font-semibold">{f.val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Onboard Crew ──────────────────────────────────────────────────── */}
        {activeTab === 'onboard' && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-zinc-100">Onboard Crew · {selectedProd.name}</h2>
                <p className="text-xs text-zinc-500 mt-0.5">Track each worker through the 9-step onboarding flow</p>
              </div>
              <button className="text-xs bg-violet-600 hover:bg-violet-500 text-white px-3.5 py-1.5 rounded-lg font-semibold transition-colors">
                + Invite Worker
              </button>
            </div>

            {/* Step legend */}
            <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-5">
              {ONBOARD_STEPS.map((s, i) => (
                <div key={s.num} className="flex items-center flex-shrink-0">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-sm">
                      {s.icon}
                    </div>
                    <span className="text-[9px] text-zinc-600 whitespace-nowrap">{s.label}</span>
                  </div>
                  {i < ONBOARD_STEPS.length - 1 && <div className="w-4 h-px bg-zinc-700 mx-1 mb-3" />}
                </div>
              ))}
            </div>

            {/* Workers */}
            <div className="space-y-2">
              {WORKERS.map(w => (
                <div key={w.name} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-zinc-100">{w.name}</span>
                        <span className="text-[10px] text-zinc-500">{w.role}</span>
                        <span className="text-[10px] bg-zinc-800 border border-zinc-700 text-zinc-400 px-1.5 py-0.5 rounded-full">{w.union}</span>
                        {w.flag && (
                          <span className="text-[10px] bg-rose-900/50 border border-rose-700/50 text-rose-300 px-1.5 py-0.5 rounded-full">⚠️ {w.flag}</span>
                        )}
                      </div>
                      {/* Progress bar */}
                      <div className="flex items-center gap-1">
                        {ONBOARD_STEPS.map(s => (
                          <div
                            key={s.num}
                            className={[
                              'h-1.5 flex-1 rounded-full transition-all',
                              s.num < w.step  ? 'bg-violet-500' :
                              s.num === w.step && w.status === 'Blocked' ? 'bg-rose-500' :
                              s.num === w.step ? 'bg-amber-500' :
                              'bg-zinc-700',
                            ].join(' ')}
                          />
                        ))}
                        <span className="text-[10px] text-zinc-500 ml-1 whitespace-nowrap">
                          Step {w.step}/9 · {ONBOARD_STEPS[w.step - 1]?.label}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-[10px] px-2 py-1 rounded-full border font-semibold ${WORKER_STATUS[w.status]}`}>
                        {w.status}
                      </span>
                      {w.status === 'Blocked' && (
                        <button className="text-[10px] bg-rose-800/60 hover:bg-rose-700/60 border border-rose-700/50 text-rose-300 px-2.5 py-1 rounded-lg transition-colors font-semibold">
                          Resolve
                        </button>
                      )}
                      {w.status !== 'Complete' && w.status !== 'Blocked' && (
                        <button className="text-[10px] bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 px-2.5 py-1 rounded-lg transition-colors">
                          Nudge
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Timecards ─────────────────────────────────────────────────────── */}
        {activeTab === 'timecards' && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-zinc-100">Timecards · {selectedProd.name}</h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {TIMECARDS.filter(t => tcStatuses[t.id] === 'Pending Approval').length} pending approval
                </p>
              </div>
              <div className="flex gap-2">
                <button className="text-xs bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg transition-colors">
                  Export CSV
                </button>
                <button className="text-xs bg-emerald-700 hover:bg-emerald-600 text-white px-3.5 py-1.5 rounded-lg font-semibold transition-colors">
                  Run Payroll
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: 'Pending', val: String(TIMECARDS.filter(t => tcStatuses[t.id] === 'Pending Approval').length), color: 'text-amber-400' },
                { label: 'Approved', val: String(TIMECARDS.filter(t => tcStatuses[t.id] === 'Approved').length), color: 'text-emerald-400' },
                { label: 'Rejected', val: String(TIMECARDS.filter(t => tcStatuses[t.id] === 'Rejected').length), color: 'text-rose-400' },
              ].map(s => (
                <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-center">
                  <div className={`text-2xl font-bold ${s.color}`}>{s.val}</div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Timecard rows */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left text-zinc-500 px-4 py-3 font-semibold">Worker</th>
                    <th className="text-left text-zinc-500 px-4 py-3 font-semibold">Week</th>
                    <th className="text-right text-zinc-500 px-4 py-3 font-semibold">Reg hrs</th>
                    <th className="text-right text-zinc-500 px-4 py-3 font-semibold">OT hrs</th>
                    <th className="text-right text-zinc-500 px-4 py-3 font-semibold">Total</th>
                    <th className="text-left text-zinc-500 px-4 py-3 font-semibold">Status</th>
                    <th className="text-left text-zinc-500 px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {TIMECARDS.map(tc => {
                    const status = tcStatuses[tc.id]
                    return (
                      <tr key={tc.id} className="border-b border-zinc-800/50 last:border-0">
                        <td className="px-4 py-3">
                          <div className="font-semibold text-zinc-100">{tc.worker}</div>
                          <div className="text-zinc-600 text-[10px]">{tc.role}</div>
                          {tc.flag && (
                            <div className="text-[10px] text-amber-400 mt-0.5">⚠️ {tc.flag}</div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-zinc-400 whitespace-nowrap">{tc.week}</td>
                        <td className="px-4 py-3 text-right text-zinc-300">{tc.regular}h</td>
                        <td className={`px-4 py-3 text-right font-semibold ${tc.overtime > 0 ? 'text-amber-400' : 'text-zinc-500'}`}>
                          {tc.overtime > 0 ? `${tc.overtime}h` : '—'}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-zinc-100">{tc.total}</td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${TC_STATUS[status]}`}>
                            {status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {status === 'Pending Approval' && (
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => approveTC(tc.id)}
                                className="text-[10px] bg-emerald-800/60 hover:bg-emerald-700/60 border border-emerald-700/50 text-emerald-300 px-2.5 py-1 rounded-lg transition-colors font-semibold"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => rejectTC(tc.id)}
                                className="text-[10px] bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-400 px-2.5 py-1 rounded-lg transition-colors"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                          {status !== 'Pending Approval' && (
                            <span className="text-[10px] text-zinc-600">—</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Compliance ────────────────────────────────────────────────────── */}
        {activeTab === 'compliance' && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-zinc-100">Compliance · {selectedProd.name}</h2>
                <p className="text-xs text-zinc-500 mt-0.5">I-9, W-4, background checks, union eligibility</p>
              </div>
              <button className="text-xs bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg transition-colors">
                Export Report
              </button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-4 gap-3 mb-5">
              {(
                [
                  { label: 'Blocked', key: 'Blocked', color: 'text-rose-400' },
                  { label: 'Due Soon', key: 'Due Soon', color: 'text-amber-400' },
                  { label: 'OK', key: 'OK', color: 'text-emerald-400' },
                  { label: 'Total Items', key: 'all', color: 'text-zinc-300' },
                ] as { label: string; key: string; color: string }[]
              ).map(s => (
                <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-center">
                  <div className={`text-2xl font-bold ${s.color}`}>
                    {s.key === 'all' ? COMPLIANCE.length : COMPLIANCE.filter(c => c.status === s.key).length}
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Compliance items */}
            <div className="space-y-2">
              {COMPLIANCE.map(item => (
                <div
                  key={`${item.worker}-${item.type}`}
                  className={[
                    'border rounded-xl px-4 py-3.5 flex items-start gap-4',
                    item.status === 'Blocked' ? 'bg-rose-950/20 border-rose-800/40' :
                    item.status === 'Due Soon' ? 'bg-amber-950/20 border-amber-800/40' :
                    'bg-zinc-900 border-zinc-800',
                  ].join(' ')}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-zinc-100">{item.worker}</span>
                      <span className="text-[10px] text-zinc-500">{item.type}</span>
                      {item.dueDate && (
                        <span className="text-[10px] text-zinc-500">· Due {item.dueDate}</span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-400">{item.detail}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${COMP_STATUS[item.status]}`}>
                      {item.status}
                    </span>
                    {(item.status === 'Blocked' || item.status === 'Due Soon') && (
                      <button className="text-[10px] bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 px-2.5 py-1 rounded-lg transition-colors">
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
