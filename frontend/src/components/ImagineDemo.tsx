import { useState } from 'react'

interface Props {
  onSend: (text: string, mode: string) => void
  isStreaming: boolean
  onClose: () => void
}

// ── Mock BI Data ──────────────────────────────────────────────────────────────

const KPI_CARDS = [
  { label: 'Active Students',        value: '18.4M',  change: '+12%',  up: true,  color: 'text-indigo-400',  bg: 'bg-indigo-500/10' },
  { label: 'US Districts Served',    value: '8,200+', change: '+8%',   up: true,  color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { label: 'Curriculum Adoption',    value: '73%',    change: '+5pts', up: true,  color: 'text-teal-400',    bg: 'bg-teal-500/10' },
  { label: 'Active Teachers',        value: '142K',   change: '+18%',  up: true,  color: 'text-violet-400',  bg: 'bg-violet-500/10' },
  { label: 'Student Growth Pctile',  value: '68th',   change: '+3pts', up: true,  color: 'text-amber-400',   bg: 'bg-amber-500/10' },
  { label: 'District NPS',           value: '72',     change: '+4',    up: true,  color: 'text-sky-400',     bg: 'bg-sky-500/10' },
  { label: 'Data Quality Score',     value: '84%',    change: '-2pts', up: false, color: 'text-rose-400',    bg: 'bg-rose-500/10' },
  { label: 'Avg Time to Insight',    value: '2.3d',   change: 'Target: 4hr', up: false, color: 'text-orange-400', bg: 'bg-orange-500/10' },
]

const PRODUCT_ADOPTION = [
  { name: 'Imagine Math',            pct: 78, color: 'bg-indigo-500' },
  { name: 'Imagine Language & Lit',  pct: 71, color: 'bg-violet-500' },
  { name: 'StudySync',               pct: 58, color: 'bg-teal-500' },
  { name: 'Edgenuity Courseware',    pct: 45, color: 'bg-amber-500' },
  { name: 'Imagine Reading',         pct: 65, color: 'bg-sky-500' },
  { name: 'Twig Science',            pct: 39, color: 'bg-emerald-500' },
]

const PIPELINE = [
  { stage: 'Prospect',   count: 234,   color: 'bg-zinc-600' },
  { stage: 'Demo',       count: 89,    color: 'bg-sky-600' },
  { stage: 'Proposal',   count: 52,    color: 'bg-indigo-600' },
  { stage: 'Contract',   count: 34,    color: 'bg-violet-600' },
  { stage: 'Onboarding', count: 28,    color: 'bg-teal-600' },
  { stage: 'Active',     count: 8200,  color: 'bg-emerald-600' },
]

const ROADMAP = [
  {
    phase: 'Now',
    color: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
    dot: 'bg-emerald-400',
    items: [
      'Salesforce → Snowflake data sync (lead-to-cash pipeline)',
      'District Admin Dashboard v1 (Power BI)',
      'Data quality scoring framework',
      'Curriculum adoption reporting',
    ],
  },
  {
    phase: 'Next',
    color: 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300',
    dot: 'bg-indigo-400',
    items: [
      'Teacher effectiveness analytics',
      'Self-serve BI for district admins',
      'NetSuite → Snowflake revenue integration',
      'Automated data quality alerts',
    ],
  },
  {
    phase: 'Later',
    color: 'bg-zinc-700/40 border-zinc-600/40 text-zinc-400',
    dot: 'bg-zinc-400',
    items: [
      'Predictive intervention alerts (AI)',
      'Superintendent ROI & outcome attribution',
      'AI-powered curriculum recommendation engine',
      'Real-time BI (sub-4hr time to insight)',
    ],
  },
]

const QUICK_PROMPTS = [
  {
    label: 'Write District Analytics PRD',
    icon: '📄',
    bg: 'bg-indigo-500/15 border-indigo-500/30',
    prompt: "Write a detailed PRD for a District Analytics Dashboard for Imagine Learning. The dashboard is for K-12 district administrators and superintendents. It should surface: curriculum adoption rates by product (Imagine Math, StudySync, Edgenuity), student growth percentile trends, teacher active usage, intervention effectiveness, and district-level NPS. Data comes from Snowflake (sourced from Salesforce, NetSuite, and product event streams). Visualized in Power BI. Include: problem statement, user personas, success metrics, functional requirements, data requirements, and launch criteria.",
  },
  {
    label: '90-Day BI Roadmap',
    icon: '🗺️',
    bg: 'bg-violet-500/15 border-violet-500/30',
    prompt: "Create a detailed 90-day roadmap for a Senior BI Product Manager joining Imagine Learning. The focus is building BI capabilities across the lead-to-cash lifecycle (Salesforce → NetSuite → Snowflake → Power BI). Structure it as: Days 1-30 (listen, assess, identify quick wins), Days 31-60 (deliver first BI increment, establish data quality baseline), Days 61-90 (expand self-serve analytics, align with VP of Business Transformation on H2 roadmap). Include stakeholder mapping, key risks, and success metrics for each phase.",
  },
  {
    label: 'Lead-to-Cash User Stories',
    icon: '📝',
    bg: 'bg-teal-500/15 border-teal-500/30',
    prompt: "Write 8 detailed user stories for the lead-to-cash BI initiative at Imagine Learning. The tech stack is: Salesforce (CRM/pipeline), NetSuite (finance/revenue), Snowflake (data warehouse), Power BI (reporting). Cover stories for: sales pipeline visibility, district contract revenue tracking, curriculum adoption → renewal correlation, data quality monitoring, and self-serve reporting for district ops managers. Include acceptance criteria for each story.",
  },
  {
    label: 'Data Quality Initiative Brief',
    icon: '✅',
    bg: 'bg-amber-500/15 border-amber-500/30',
    prompt: "Write an initiative brief for a Data Quality improvement program at Imagine Learning. The current state: data flows from Salesforce and product event streams into Snowflake, but quality issues (duplicates, latency, schema drift) are reducing trust in Power BI dashboards. Target state: 95%+ data accuracy, <4hr latency, automated quality scoring. Cover: problem statement, business impact, proposed solution (data contracts, quality checks, alerting), success metrics, effort estimate, and stakeholder alignment plan for the VP of Business Transformation.",
  },
  {
    label: 'Prep VP Stakeholder Meeting',
    icon: '🎤',
    bg: 'bg-rose-500/15 border-rose-500/30',
    prompt: "Help me prepare for a monthly BI roadmap review with the VP of Business Transformation and Enterprise Systems at Imagine Learning. I'll present: current sprint status, 3 key decisions needed, risks to Q2 delivery, and the H2 roadmap. What should I prepare, what questions will the VP likely ask, how do I frame technical progress in business terms, and what does a strong vs. weak executive BI roadmap presentation look like? Give me an agenda and talking points.",
  },
  {
    label: 'Curriculum-Informed AI Brief',
    icon: '🤖',
    bg: 'bg-sky-500/15 border-sky-500/30',
    prompt: "Write a product brief for how Imagine Learning's Curriculum-Informed AI approach should inform the BI and analytics platform. Imagine Learning's differentiation is that AI is shaped by vetted K-12 curriculum — not generic LLMs. How should this philosophy apply to: automated insight generation, intervention recommendations, teacher coaching suggestions, and district performance predictions? What guardrails, data governance policies, and educator-approval workflows should the BI PM build into the platform to maintain instructional integrity?",
  },
]

// ── News ──────────────────────────────────────────────────────────────────────

const NEWS = [
  {
    source: 'HRTech Series',
    date: 'Apr 17, 2026 · 3 days ago',
    badge: '🔴 Breaking',
    badgeColor: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    headline: 'Imagine Learning Introduces Enhancements Across Curriculum, Assessment, and Services for Back to School 2026',
    summary: 'Imagine Learning announced major updates across its curriculum, courseware, assessment, and services portfolio ahead of the 2026–27 school year. Enhancements span Imagine Math, Imagine Reading, Edgenuity, and new AI-powered assessment integrations.',
    biRelevance: 'Back-to-School launches = spike in new district onboardings, product adoption metrics, and renewal pipeline. BI PM must ensure dashboards reflect new product lines and track adoption velocity from day 1.',
    prompt: "Imagine Learning just launched Back to School 2026 enhancements across curriculum, assessment, and services. As the BI PM, what metrics should I add to the District Analytics Dashboard to track adoption of new features? How do I update the Snowflake data model and Power BI reports to reflect new product lines? What does the ideal launch-week BI monitoring setup look like?",
  },
  {
    source: 'PR Newswire',
    date: 'Jan 15, 2026',
    badge: '🤝 Partnership',
    badgeColor: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    headline: 'Imagine Learning and Eedi Launch the First Curriculum-Embedded AI Assessments for U.S. Math Classrooms',
    summary: 'Imagine Learning announced a strategic partnership with Eedi Labs (UK-based AI learning pioneer) to launch Curriculum-Embedded AI Assessments — the first of its kind for U.S. Math. AI diagnostics are embedded directly inside math curriculum, not bolted on as a separate tool.',
    biRelevance: 'This partnership creates a new assessment data stream. BI PM needs to define how Eedi assessment data flows into Snowflake, how it joins with Imagine Math usage data, and what teacher/district dashboards need to show AI assessment results alongside curriculum progress.',
    prompt: "Imagine Learning just partnered with Eedi to launch Curriculum-Embedded AI Assessments for U.S. Math. As the BI PM, how should I design the data pipeline for this new assessment data source? What new metrics should district admin dashboards surface (assessment completion, diagnostic accuracy, intervention trigger rates)? How do I write the data requirements spec for integrating Eedi assessment results into our Snowflake warehouse and Power BI dashboards?",
  },
  {
    source: 'Yahoo Finance',
    date: 'Mar 2026',
    badge: '📈 Growth',
    badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    headline: 'Imagine Learning Partners with Modern Classrooms Project to Drive Stronger Math Outcomes Through Improved Implementation',
    summary: 'Imagine Learning partnered with Modern Classrooms Project to improve blended instruction implementation for Imagine Math. Focus: professional learning for teachers on mastery-based pacing, self-paced video instruction, and data-driven small group coaching.',
    biRelevance: 'Professional learning = new engagement metric. BI PM must track teacher PD completion rates, correlation between PD hours and student growth percentile, and implementation fidelity scores — new dimensions on existing dashboards.',
    prompt: "Imagine Learning partnered with Modern Classrooms Project on blended instruction implementation for math. As the BI PM, what new metrics should I add to teacher dashboards to track implementation fidelity? How do I correlate professional development completion data with student outcome data in Snowflake? What does the data model look like for linking teacher PD events to class-level student growth metrics?",
  },
  {
    source: 'PR Newswire',
    date: 'Dec 2024',
    badge: '🏢 Acquisition',
    badgeColor: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
    headline: 'Imagine Learning Acquires Pango Education to Advance AI-Powered Personalized K-12 Solutions',
    summary: 'Imagine Learning acquired Pango Education, accelerating their proprietary Curriculum-Informed AI™ platform. Pango brings AI tools for lesson planning, professional learning, and personalized instruction that integrate directly with curriculum content.',
    biRelevance: 'M&A = data integration challenge. BI PM must assess Pango data systems, define integration architecture into Snowflake, ensure Pango usage metrics appear in unified dashboards, and track post-acquisition product adoption for reporting to the board.',
    prompt: "Imagine Learning acquired Pango Education. As the new BI PM joining the company, what is my data integration roadmap for bringing Pango's data systems into the Imagine Learning data warehouse (Snowflake)? What are the key risks in M&A data integration? How do I define a unified data model that allows cross-product reporting across Imagine Learning's native products and Pango? What KPIs should I track to measure post-acquisition product integration success?",
  },
  {
    source: 'EdTech Breakthrough Awards',
    date: '2024',
    badge: '🏆 Award',
    badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    headline: 'Imagine Learning Wins Overall STEM Education Solution of the Year — EdTech Breakthrough Awards 2024',
    summary: 'Imagine Learning won the top EdTech industry award for STEM education, recognizing their Twig Science platform and AI-integrated curriculum approach. Judges cited measurable student outcome improvements across math and science.',
    biRelevance: 'Award is based on measurable outcomes — meaning IL\'s BI and analytics capabilities are what prove product efficacy. The BI PM\'s work is directly what generates the data story that wins awards and drives renewals.',
    prompt: "Imagine Learning won the STEM Education Solution of the Year award based on measurable student outcomes. As the BI PM, how do I build an Outcomes Analytics capability that can clearly demonstrate product efficacy to districts, school boards, and award committees? What metrics matter most (student growth percentile, assessment score lift, teacher usage correlation), how should they be visualized, and how do I ensure data integrity so the numbers can be shared publicly?",
  },
]

// ── LinkedIn Profile ──────────────────────────────────────────────────────────

const LINKEDIN = {
  employees: '2,200+',
  founded: '2009',
  hq: 'Tempe, AZ (HQ) + Austin TX, Petaluma CA, Rock Rapids IA, Bloomington MN',
  industry: 'E-Learning / Educational Technology / K-12 EdTech',
  ceo: 'Eric Shackleton',
  followers: '35K+',
  type: 'Private (Weld North Education portfolio)',
  hiring: ['Senior Data Engineers', 'AI/ML Engineers', 'Product Managers', 'Curriculum Specialists', 'Implementation Consultants'],
  recentPosts: [
    'Launched Curriculum-Informed AI assessments with Eedi for U.S. Math classrooms',
    'Back to School 2026: new features across Math, Reading, Edgenuity & Twig Science',
    'Partnership with Modern Classrooms Project — improving blended instruction fidelity',
    'Hiring: Senior BI Product Manager, Data Engineers, AI Engineers',
    'Mission post: "Technology should support educators, not replace them"',
  ],
  culture: [
    'Remote-first across U.S. with 5 office hubs',
    'Mission-driven — "Empower Potential" in students & educators',
    '16 paid holidays + winter shutdown Dec 24–Jan 1',
    'Tuition reimbursement + professional development budget',
    'Glassdoor: 3.8★ — leadership transparency scores high',
  ],
}

// ── Tabs ──────────────────────────────────────────────────────────────────────

type DemoTab = 'overview' | 'dashboard' | 'roadmap' | 'actions' | 'news'

export default function ImagineDemo({ onSend, isStreaming, onClose }: Props) {
  const [tab, setTab] = useState<DemoTab>('overview')

  const TABS: { key: DemoTab; label: string }[] = [
    { key: 'overview',  label: '🏢 Overview' },
    { key: 'news',      label: '📰 News' },
    { key: 'dashboard', label: '📊 BI Dashboard' },
    { key: 'roadmap',   label: '🗺️ Roadmap' },
    { key: 'actions',   label: '⚡ Quick Actions' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border border-zinc-700 bg-zinc-950 shadow-2xl shadow-black/60 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-gradient-to-r from-indigo-950/60 to-zinc-950 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-sm font-black text-white">IL</div>
            <div>
              <p className="text-sm font-bold text-zinc-100">Imagine Learning</p>
              <p className="text-[11px] text-zinc-500">Senior Enterprise Systems PM · Business Intelligence · <span className="text-amber-400">⚠ Demo data — not live</span></p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition-colors p-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1.5 px-6 py-3 border-b border-zinc-800 flex-shrink-0 flex-wrap">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={[
                'px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all',
                tab === t.key
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-zinc-800/60 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200',
              ].join(' ')}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* ── Overview ── */}
          {tab === 'overview' && (
            <div className="space-y-4">

              {/* LinkedIn profile card */}
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-white text-[10px] font-black">in</div>
                  <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">LinkedIn Company Profile</p>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                  {[
                    { label: 'Employees', value: LINKEDIN.employees },
                    { label: 'Founded', value: LINKEDIN.founded },
                    { label: 'CEO', value: LINKEDIN.ceo },
                    { label: 'Followers', value: LINKEDIN.followers },
                    { label: 'Type', value: LINKEDIN.type },
                    { label: 'Industry', value: LINKEDIN.industry },
                  ].map(row => (
                    <div key={row.label} className="flex items-baseline gap-2">
                      <span className="text-[10px] text-zinc-500 w-16 flex-shrink-0">{row.label}</span>
                      <span className="text-[11px] font-semibold text-zinc-300">{row.value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-blue-500/10">
                  <p className="text-[10px] text-zinc-500 mb-1.5">📍 {LINKEDIN.hq}</p>
                  <p className="text-[10px] font-semibold text-blue-400 mb-1">Actively hiring:</p>
                  <div className="flex flex-wrap gap-1">
                    {LINKEDIN.hiring.map(h => (
                      <span key={h} className="text-[9px] text-blue-300 bg-blue-500/10 border border-blue-500/20 rounded-full px-2 py-0.5">{h}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* About + BI Stack */}
              <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
                <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">About Imagine Learning</p>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  The leading K–12 digital curriculum provider serving <span className="text-white font-semibold">18.4M students</span> across <span className="text-white font-semibold">50%+ of US school districts</span>. Their <span className="text-indigo-400 font-semibold">Curriculum-Informed AI™</span> approach grounds AI in vetted, research-backed curricula — educators lead, technology supports. <span className="text-white font-semibold">3 AI acquisitions in 2024</span> (Pango Education, CueThink, EarlyBird) plus an Eedi partnership in Jan 2026 signal aggressive AI-powered expansion. Part of <span className="text-zinc-300">Weld North Education</span> portfolio.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { title: 'Core Products', items: ['Imagine Math, Reading, Language & Literacy', 'StudySync (ELA/ELL curriculum)', 'Edgenuity (online courseware)', 'Twig Science · CueThink · Pango AI', 'EarlyBird (K-3 dyslexia screening)'] },
                  { title: 'Enterprise Tech Stack', items: ['Salesforce → CRM & lead pipeline', 'NetSuite → Finance & revenue', 'Snowflake → Data warehouse', 'Power BI → Self-serve reporting', 'Eedi API → AI assessment data'] },
                  { title: 'Key Personas', items: ['Teachers (coaching & blended learning)', 'Principals (usage & progress dashboards)', 'Superintendents (ROI & district outcomes)', 'District Ops (curriculum adoption data)', 'Sales/CS (renewal risk signals)'] },
                  { title: 'Culture Signals', items: LINKEDIN.culture },
                ].map(box => (
                  <div key={box.title} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                    <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide mb-2">{box.title}</p>
                    <ul className="space-y-1">
                      {box.items.map(item => (
                        <li key={item} className="flex items-start gap-2 text-xs text-zinc-400">
                          <span className="w-1 h-1 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* LinkedIn recent posts */}
              <div className="rounded-xl border border-blue-500/20 bg-zinc-900 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-4 h-4 rounded bg-blue-600 flex items-center justify-center text-white text-[8px] font-black">in</div>
                  <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide">Recent LinkedIn Activity</p>
                </div>
                <ul className="space-y-2">
                  {LINKEDIN.recentPosts.map(post => (
                    <li key={post} className="flex items-start gap-2 text-xs text-zinc-400">
                      <span className="text-blue-500 mt-0.5 flex-shrink-0">↗</span>
                      {post}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">What they're hiring for in this role</p>
                <div className="grid grid-cols-3 gap-2">
                  {['BI roadmap strategy', 'Lead-to-cash BI', 'Salesforce + NetSuite', 'Snowflake + Power BI', 'Data quality', 'AI & automation', 'Agile / CSPO', 'Stakeholder comms', 'Speed to insight', 'Cross-functional', 'Greenfield builds', 'Enterprise systems'].map(skill => (
                    <span key={skill} className="text-[10px] font-medium text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2 py-1.5 text-center">{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── News ── */}
          {tab === 'news' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-zinc-200">Latest Imagine Learning News</p>
                <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-2.5 py-1 font-semibold">⚠ Curated research — not live feed</span>
              </div>
              {NEWS.map(n => (
                <div key={n.headline} className="rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${n.badgeColor}`}>{n.badge}</span>
                        <span className="text-[10px] text-zinc-500">{n.source}</span>
                        <span className="text-[10px] text-zinc-600">·</span>
                        <span className="text-[10px] text-zinc-500">{n.date}</span>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-zinc-200 leading-snug mb-2">{n.headline}</p>
                    <p className="text-xs text-zinc-400 leading-relaxed mb-3">{n.summary}</p>
                    <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3">
                      <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wide mb-1">📊 BI PM Relevance</p>
                      <p className="text-[11px] text-zinc-400 leading-snug">{n.biRelevance}</p>
                    </div>
                  </div>
                  <div className="border-t border-zinc-800 px-4 py-2.5">
                    <button
                      onClick={() => { onSend(n.prompt, 'pm'); onClose() }}
                      disabled={isStreaming}
                      className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors disabled:opacity-40"
                    >
                      Ask Product Path AI about this →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Dashboard ── */}
          {tab === 'dashboard' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-zinc-200">District Analytics Dashboard</p>
                <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-2.5 py-1 font-semibold">⚠ Demo data</span>
              </div>
              <div className="grid grid-cols-4 gap-2.5">
                {KPI_CARDS.map(k => (
                  <div key={k.label} className={`rounded-xl border border-zinc-800 ${k.bg} p-3`}>
                    <p className="text-[10px] text-zinc-500 mb-1">{k.label}</p>
                    <p className={`text-xl font-black ${k.color}`}>{k.value}</p>
                    <p className={`text-[10px] font-semibold mt-1 ${k.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {k.up ? '↑' : '↓'} {k.change}
                    </p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wide mb-3">Curriculum Adoption by Product</p>
                <div className="space-y-2.5">
                  {PRODUCT_ADOPTION.map(p => (
                    <div key={p.name} className="flex items-center gap-3">
                      <span className="text-xs text-zinc-400 w-40 flex-shrink-0">{p.name}</span>
                      <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${p.color}`} style={{ width: `${p.pct}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-zinc-300 w-8 text-right">{p.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wide mb-3">Lead-to-Cash Pipeline (Salesforce → NetSuite)</p>
                <div className="flex items-end gap-2">
                  {PIPELINE.map((p, i) => (
                    <div key={p.stage} className="flex-1 flex flex-col items-center gap-1.5">
                      <span className="text-xs font-bold text-zinc-300">{p.count.toLocaleString()}</span>
                      <div className={`w-full rounded-t-lg ${p.color}`} style={{ height: `${Math.max(8, Math.min(60, i === 5 ? 60 : (p.count / 234) * 60))}px` }} />
                      <span className="text-[9px] text-zinc-500 text-center leading-tight">{p.stage}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Roadmap ── */}
          {tab === 'roadmap' && (
            <div className="space-y-4">
              <p className="text-sm font-bold text-zinc-200">BI Capabilities Roadmap · 2025–2026</p>
              <p className="text-xs text-zinc-500">Lead-to-cash BI across Salesforce → NetSuite → Snowflake → Power BI</p>
              <div className="grid grid-cols-3 gap-3">
                {ROADMAP.map(phase => (
                  <div key={phase.phase} className={`rounded-xl border p-4 ${phase.color}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`w-2 h-2 rounded-full ${phase.dot}`} />
                      <span className="text-xs font-black uppercase tracking-wider">{phase.phase}</span>
                    </div>
                    <ul className="space-y-2">
                      {phase.items.map(item => (
                        <li key={item} className="text-[11px] leading-snug opacity-90">· {item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wide mb-2">First 90 Days · Priority Focus</p>
                <div className="space-y-2">
                  {[
                    { days: 'Days 1–30', focus: 'Listen & assess — stakeholder interviews, audit current Salesforce→Snowflake data flows, identify top 3 BI pain points, map existing Power BI reports' },
                    { days: 'Days 31–60', focus: 'Deliver — launch District Dashboard v1, fix top data quality issue in lead-to-cash pipeline, define metrics framework, first sprint retro' },
                    { days: 'Days 61–90', focus: 'Scale — expand self-serve analytics for district ops, align H2 roadmap with VP of Business Transformation, define AI/automation quick wins' },
                  ].map(row => (
                    <div key={row.days} className="flex gap-3">
                      <span className="text-[10px] font-bold text-indigo-400 w-20 flex-shrink-0 mt-0.5">{row.days}</span>
                      <span className="text-xs text-zinc-400 leading-snug">{row.focus}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Quick Actions ── */}
          {tab === 'actions' && (
            <div className="space-y-3">
              <p className="text-sm font-bold text-zinc-200">Generate Imagine Learning–specific PM artifacts</p>
              <p className="text-xs text-zinc-500">Click any card — Product Path AI generates a real artifact tailored to this role live</p>
              <div className="grid grid-cols-2 gap-3">
                {QUICK_PROMPTS.map(p => (
                  <button
                    key={p.label}
                    onClick={() => { onSend(p.prompt, 'pm'); onClose() }}
                    disabled={isStreaming}
                    className={`flex items-start gap-3 px-4 py-4 rounded-2xl border text-left transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-black/30 disabled:opacity-40 disabled:cursor-not-allowed group ${p.bg}`}
                  >
                    <span className="text-2xl flex-shrink-0">{p.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-zinc-200 group-hover:text-white transition-colors leading-tight">{p.label}</p>
                      <p className="text-[10px] text-zinc-500 mt-1 group-hover:text-zinc-400 transition-colors">Click to generate with Product Path AI →</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
