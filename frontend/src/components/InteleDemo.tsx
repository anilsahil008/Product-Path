import { useState } from 'react'
import {
  Star, Bell, ChevronDown, Search, X, Copy, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle, Clock, DollarSign, Ship, Hotel, Shield,
  ArrowRight, Loader2, Zap, MapPin, Calendar, Plus
} from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from 'recharts'

// ── API Key ────────────────────────────────────────────────────────────────────
const ANTHROPIC_API_KEY = '' // Add your Anthropic API key here

// ── Theme constants ────────────────────────────────────────────────────────────
const BG    = '#06090f'
const CARD  = '#0d1524'
const BORDER= '#132040'
const TEAL  = '#00d4ff'
const ORANGE= '#ff6b35'
const GREEN = '#00e676'
const PURPLE= '#b388ff'
const AMBER = '#ffb300'

// ── Types ──────────────────────────────────────────────────────────────────────
type MainTab = 'dashboard' | 'builder' | 'clients' | 'quote' | 'analytics'

interface PipelineCard {
  id: string; client: string; line: string; dest: string
  dates: string; badges: string[]; commission: number; stage: string
}
interface CruiseResult {
  id: string; ship: string; line: string; itinerary: string
  port: string; date: string; nights: number
  prices: { Interior: number; 'Ocean View': number; Balcony: number; Suite: number }
}
interface PortHotel {
  name: string; stars: number; dist: string; perNight: number; preferred: boolean
}
interface ClientProfile {
  id: string; initials: string; color: string; name: string
  lastBooking: string; lastDate: string; cabin: string
  bed: string; dining: string; requests: string
  loyalty: { program: string; level: string; number: string }[]
  insurance: string; notes: string
  history: { trip: string; date: string; value: string; commission: string }[]
}

// ── Data ───────────────────────────────────────────────────────────────────────
const PIPELINE: PipelineCard[] = [
  { id:'B01', client:'James & Diana Thornton', line:'Royal Caribbean', dest:'Eastern Caribbean', dates:'Jul 12–19, 2026', badges:['Cruise','Hotel'], commission:412, stage:'quote' },
  { id:'B02', client:'Marcus Williams',        line:'Carnival',         dest:'Bahamas 5-Night',  dates:'Aug 3–8, 2026',   badges:['Cruise'],         commission:187, stage:'quote' },
  { id:'B03', client:'The Rodriguez Family',   line:'Norwegian',        dest:'Western Caribbean',dates:'Jun 28–Jul 5',    badges:['Cruise','Air'],    commission:621, stage:'quote' },
  { id:'B04', client:'Eleanor Hawkins',        line:'Celebrity',        dest:'Mediterranean',    dates:'Sep 14–28, 2026', badges:['Cruise','Hotel','Insurance'], commission:1840, stage:'deposit' },
  { id:'B05', client:'Patricia Moore',         line:'MSC',              dest:'Caribbean',        dates:'Jul 4–11, 2026',  badges:['Cruise','Hotel'],  commission:533, stage:'deposit' },
  { id:'B06', client:'Thomas & Grace Lee',     line:'Royal Caribbean',  dest:'Alaska',           dates:'Jun 5–12, 2026',  badges:['Cruise','Insurance'], commission:398, stage:'booked' },
  { id:'B07', client:'Sandra Bell',            line:'Carnival',         dest:'Bahamas',          dates:'May 30–Jun 3',    badges:['Cruise'],          commission:144, stage:'booked' },
  { id:'B08', client:'David & Cheryl Kim',     line:'Norwegian',        dest:'Hawaii',           dates:'Jul 20–27, 2026', badges:['Cruise','Hotel'],  commission:712, stage:'booked' },
  { id:'B09', client:'Robert Nguyen',          line:'Celebrity',        dest:'Alaska',           dates:'Jun 14–21, 2026', badges:['Cruise','Air'],    commission:489, stage:'booked' },
  { id:'B10', client:'Amanda Foster',          line:'Royal Caribbean',  dest:'Bermuda',          dates:'May 18–25',       badges:['Cruise','Hotel','Insurance'], commission:623, stage:'complete' },
  { id:'B11', client:'Kevin & Lisa Park',      line:'Carnival',         dest:'Mexico',           dates:'Apr 5–12',        badges:['Cruise'],          commission:218, stage:'complete' },
  { id:'B12', client:'Jennifer Walsh',         line:'Norwegian',        dest:'Caribbean',        dates:'Mar 22–29',       badges:['Cruise','Hotel'],  commission:381, stage:'complete' },
  { id:'B13', client:'Charles & Ann Cooper',   line:'MSC',              dest:'Mediterranean',    dates:'Mar 8–22',        badges:['Cruise','Hotel','Insurance'], commission:1124, stage:'complete' },
  { id:'B14', client:'Maria Gonzalez',         line:'Celebrity',        dest:'Caribbean',        dates:'Feb 14–21',       badges:['Cruise'],          commission:291, stage:'complete' },
]

const CRUISES: CruiseResult[] = [
  {
    id:'C1', ship:'Symphony of the Seas', line:'Royal Caribbean', port:'Miami',
    itinerary:'Eastern Caribbean — Nassau, St. Thomas, St. Maarten',
    date:'Jul 12, 2026', nights:7,
    prices:{ Interior:1247, 'Ocean View':1547, Balcony:1847, Suite:3240 },
  },
  {
    id:'C2', ship:'Norwegian Encore', line:'Norwegian Cruise Line', port:'Miami',
    itinerary:'Western Caribbean — Cozumel, Roatán, Belize City, Costa Maya',
    date:'Jul 19, 2026', nights:7,
    prices:{ Interior:1098, 'Ocean View':1398, Balcony:1698, Suite:2980 },
  },
  {
    id:'C3', ship:'Carnival Celebration', line:'Carnival Cruise Line', port:'Miami',
    itinerary:'Southern Caribbean — Aruba, Bonaire, Curaçao, Grand Turk',
    date:'Aug 2, 2026', nights:10,
    prices:{ Interior:1389, 'Ocean View':1689, Balcony:1989, Suite:3450 },
  },
]

const PORT_HOTELS: Record<string, PortHotel[]> = {
  Miami: [
    { name:'Hyatt Regency Miami',    stars:4, dist:'1.2 mi from Port', perNight:219, preferred:true  },
    { name:'InterContinental Miami', stars:4, dist:'0.8 mi from Port', perNight:249, preferred:false },
    { name:'Hampton Inn Brickell',   stars:3, dist:'2.1 mi from Port', perNight:149, preferred:false },
  ],
}

const CLIENTS: ClientProfile[] = [
  {
    id:'CL1', initials:'JT', color:'#00d4ff', name:'James & Diana Thornton',
    lastBooking:'Royal Caribbean — Eastern Caribbean', lastDate:'Jul 12, 2026', cabin:'Balcony', bed:'King',
    dining:'Anytime', requests:'Anniversary setup, champagne on arrival', insurance:'Always',
    loyalty:[{ program:'Royal Caribbean Crown & Anchor', level:'Emerald', number:'RC-441892' }],
    notes:'Always books balcony or above. Celebrate anniversary every July. Diana is vegetarian.',
    history:[
      { trip:'Royal Caribbean — Bahamas', date:'Jul 2023', value:'$3,240', commission:'$388' },
      { trip:'Norwegian — Caribbean',     date:'Feb 2024', value:'$4,120', commission:'$494' },
      { trip:'Royal Caribbean — Alaska',  date:'Jul 2024', value:'$5,840', commission:'$701' },
    ],
  },
  {
    id:'CL2', initials:'MW', color:'#ff6b35', name:'Marcus Williams',
    lastBooking:'Carnival — Bahamas 5-Night', lastDate:'Aug 3, 2026', cabin:'Interior', bed:'Two Twins',
    dining:'Early (6pm)', requests:'Budget-conscious, solo cabin rate important', insurance:'Sometimes',
    loyalty:[{ program:'Royal Caribbean Crown & Anchor', level:'Diamond', number:'RC-228341' }],
    notes:'Solo traveler. Very price sensitive. Loyal to Royal Caribbean but will switch for value.',
    history:[
      { trip:'Carnival — Bahamas',         date:'Mar 2024', value:'$1,120', commission:'$134' },
      { trip:'Royal Caribbean — Bermuda',  date:'Aug 2024', value:'$1,480', commission:'$178' },
    ],
  },
  {
    id:'CL3', initials:'RF', color:'#00e676', name:'The Rodriguez Family',
    lastBooking:'Norwegian — Western Caribbean', lastDate:'Jun 28, 2026', cabin:'Balcony', bed:'Connecting',
    dining:'Late (8:30pm)', requests:'Connecting cabins, vegetarian options for all', insurance:'Always',
    loyalty:[{ program:'Norwegian Latitudes', level:'Silver', number:'NCL-774210' }],
    notes:'Family of 4. Two teens. Always need connecting cabins. All vegetarian.',
    history:[
      { trip:'Norwegian — Caribbean',      date:'Jun 2023', value:'$6,480', commission:'$778' },
      { trip:'Norwegian — Bahamas',        date:'Mar 2025', value:'$4,920', commission:'$590' },
    ],
  },
  {
    id:'CL4', initials:'EH', color:'#b388ff', name:'Eleanor Hawkins',
    lastBooking:'Celebrity — Mediterranean', lastDate:'Sep 14, 2026', cabin:'Suite', bed:'King',
    dining:'Anytime', requests:'Butler service, private transfer, specialty dining every night', insurance:'Always',
    loyalty:[{ program:"Celebrity Captain's Club", level:'Zenith', number:'CEL-119042' }],
    notes:'Luxury only. Suite or nothing. Celebrity loyalist. Never flies economy.',
    history:[
      { trip:'Celebrity — Mediterranean',  date:'Sep 2023', value:'$14,200', commission:'$1,704' },
      { trip:'Celebrity — Caribbean',      date:'Jan 2024', value:'$9,800',  commission:'$1,176' },
      { trip:'Celebrity — Alaska',         date:'Jun 2024', value:'$11,400', commission:'$1,368' },
    ],
  },
]

const CONVERSION_DATA = [
  { month:'Nov', quotes:28, bookings:8  },
  { month:'Dec', quotes:34, bookings:11 },
  { month:'Jan', quotes:22, bookings:7  },
  { month:'Feb', quotes:29, bookings:9  },
  { month:'Mar', quotes:38, bookings:12 },
  { month:'Apr', quotes:41, bookings:14 },
]

const REVENUE_DATA = [
  { vertical:'Cruise',    revenue:18400 },
  { vertical:'Hotel',     revenue:2100  },
  { vertical:'Air',       revenue:890   },
  { vertical:'Insurance', revenue:620   },
  { vertical:'Tours',     revenue:340   },
]

// ── Badge colors ───────────────────────────────────────────────────────────────
const BADGE_STYLE: Record<string,string> = {
  Cruise:    'bg-blue-900/60 text-blue-300 border-blue-700/50',
  Hotel:     'bg-purple-900/60 text-purple-300 border-purple-700/50',
  Air:       'bg-sky-900/60 text-sky-300 border-sky-700/50',
  Insurance: 'bg-emerald-900/60 text-emerald-300 border-emerald-700/50',
}

const STAGE_COLS: { key:string; label:string; count:(p:PipelineCard[])=>number }[] = [
  { key:'quote',    label:'Quote Sent',       count:p=>p.filter(x=>x.stage==='quote').length    },
  { key:'deposit',  label:'Deposit Received', count:p=>p.filter(x=>x.stage==='deposit').length  },
  { key:'booked',   label:'Fully Booked',     count:p=>p.filter(x=>x.stage==='booked').length   },
  { key:'complete', label:'Travel Complete',  count:p=>p.filter(x=>x.stage==='complete').length },
]

// ── Cabin type tabs ────────────────────────────────────────────────────────────
type CabinType = 'Interior' | 'Ocean View' | 'Balcony' | 'Suite'
const CABIN_TYPES: CabinType[] = ['Interior', 'Ocean View', 'Balcony', 'Suite']

// ── Helpers ────────────────────────────────────────────────────────────────────

function KpiCard({ icon, label, value, sub, subColor='text-zinc-500' }: { icon:React.ReactNode; label:string; value:string; sub:string; subColor?:string }) {
  return (
    <div className="rounded-xl p-4 border" style={{ backgroundColor:CARD, borderColor:BORDER }}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-zinc-500">{icon}</span>
        <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white mb-0.5">{value}</div>
      <div className={`text-[11px] ${subColor}`}>{sub}</div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function InteleDemo({ onBack }: { onBack:()=>void }) {
  const [tab, setTab] = useState<MainTab>('dashboard')

  // Builder state
  const [selectedCruise, setSelectedCruise] = useState<CruiseResult|null>(null)
  const [selectedCabin, setSelectedCabin] = useState<Record<string,CabinType>>({})
  const [selectedHotel, setSelectedHotel] = useState<PortHotel|null>(null)
  const [insureChecked, setInsureChecked] = useState(true)

  // Client modal state
  const [activeClient, setActiveClient] = useState<ClientProfile|null>(null)
  const [clientTab, setClientTab] = useState<'overview'|'history'|'preferences'|'upcoming'>('overview')

  // Quote state
  const [quoteName, setQuoteName] = useState('')
  const [quoteDest, setQuoteDest] = useState('')
  const [quoteDates, setQuoteDates] = useState('')
  const [quoteBudget, setQuoteBudget] = useState(3000)
  const [quoteTravelers, setQuoteTravelers] = useState(2)
  const [quoteOccasion, setQuoteOccasion] = useState('None')
  const [quoteNotes, setQuoteNotes] = useState('')
  const [quoteLoading, setQuoteLoading] = useState(false)
  const [quoteResult, setQuoteResult] = useState('')
  const [quoteCopied, setQuoteCopied] = useState(false)

  // Computed builder totals
  const cabin = selectedCruise ? (selectedCabin[selectedCruise.id] ?? 'Balcony') : 'Balcony'
  const cruisePrice = selectedCruise ? selectedCruise.prices[cabin] : 0
  const hotelPrice = selectedHotel ? selectedHotel.perNight * 1 : 0
  const insurePrice = insureChecked ? 89 * quoteTravelers : 0
  const totalPrice = cruisePrice + hotelPrice + insurePrice
  const commissionEst = Math.round(totalPrice * 0.12)

  async function generateQuote() {
    if (!quoteName || !quoteDest) return
    setQuoteLoading(true)
    setQuoteResult('')
    try {
      const userMsg = `Generate a cruise quote for ${quoteName} traveling to ${quoteDest} on ${quoteDates || 'flexible dates'} with a budget of $${quoteBudget} for ${quoteTravelers} traveler(s). ${quoteOccasion !== 'None' ? `Special occasion: ${quoteOccasion}.` : ''} Notes: ${quoteNotes || 'None.'}`
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version':'2023-06-01',
          'anthropic-dangerous-direct-browser-access':'true',
        },
        body: JSON.stringify({
          model:'claude-sonnet-4-20250514',
          max_tokens:1000,
          system:"You are an expert InteleTravel advisor assistant. Generate a professional, personalized travel quote email for a travel advisor to send to their client. Include: 3 cruise options with ship names, itineraries, and prices; a recommended hotel add-on at the embarkation port; travel insurance recommendation; estimated IntelePerks points for the booking; and a personalized note referencing any special occasion. Use InteleTravel's tone: warm, expert, trustworthy. Format with clear sections. Keep to 400 words.",
          messages:[{ role:'user', content:userMsg }],
        }),
      })
      const data = await res.json()
      setQuoteResult(data?.content?.[0]?.text ?? 'No response received. Check your API key.')
    } catch {
      setQuoteResult('API call failed. Add your Anthropic API key to the ANTHROPIC_API_KEY constant.')
    }
    setQuoteLoading(false)
  }

  function copyQuote() {
    navigator.clipboard.writeText(quoteResult)
    setQuoteCopied(true)
    setTimeout(() => setQuoteCopied(false), 2000)
  }

  function openClientAndQuote(c: ClientProfile) {
    setQuoteName(c.name)
    setTab('quote')
  }

  function selectCruiseAndNavigate(cruise: CruiseResult) {
    setSelectedCruise(cruise)
    setSelectedHotel(PORT_HOTELS[cruise.port]?.[0] ?? null)
  }

  const TABS: { key:MainTab; label:string; dot?:boolean }[] = [
    { key:'dashboard', label:'Dashboard',        dot:true  },
    { key:'builder',   label:'Cruise Builder'               },
    { key:'clients',   label:'Client Profiles'              },
    { key:'quote',     label:'AI Quote Generator'           },
    { key:'analytics', label:'Analytics'                    },
  ]

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor:BG, fontFamily:'Plus Jakarta Sans, sans-serif' }}>

      {/* ── Top bar ─────────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 border-b flex items-center justify-between px-6 h-14" style={{ backgroundColor:CARD, borderColor:BORDER }}>
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">← Product Path</button>
          <div className="w-px h-5 bg-zinc-700" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white" style={{ background:`linear-gradient(135deg, ${TEAL}, #0099bb)` }}>i</div>
            <span className="text-sm font-bold text-white">InteleDash</span>
            <span className="text-[10px] text-zinc-500 ml-1">Advisor Intelligence Platform</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* IntelePerks */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border" style={{ borderColor:BORDER, backgroundColor:'#1a0f2e' }}>
            <Star size={12} style={{ color:PURPLE }} />
            <span className="text-xs font-bold" style={{ color:PURPLE }}>12,450 pts</span>
          </div>
          {/* Bell */}
          <div className="relative cursor-pointer">
            <Bell size={16} className="text-zinc-400" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold text-white" style={{ backgroundColor:ORANGE }}>2</span>
          </div>
          {/* Avatar */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor:TEAL }}>SM</div>
            <div className="text-xs">
              <div className="text-white font-semibold">Sarah Mitchell</div>
              <div className="text-zinc-500 text-[10px]">Independent Advisor</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Nav tabs ────────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 border-b flex px-6 gap-1" style={{ backgroundColor:CARD, borderColor:BORDER }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="relative px-4 py-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5"
            style={tab===t.key ? { borderBottomColor:TEAL, color:TEAL } : { borderBottomColor:'transparent', color:'#6b7280' }}
          >
            {t.label}
            {t.dot && (
              <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ backgroundColor:ORANGE }}>2</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Body ────────────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-6">

        {/* ══ TAB 1: DASHBOARD ════════════════════════════════════════════════ */}
        {tab==='dashboard' && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h1 className="text-lg font-bold text-white">Welcome back, Sarah 👋</h1>
                <p className="text-xs text-zinc-500 mt-0.5">Tuesday, April 29, 2026 · You have 2 quotes expiring today</p>
              </div>
              <button
                onClick={() => setTab('builder')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white transition-colors"
                style={{ backgroundColor:TEAL, color:'#06090f' }}
              >
                <Plus size={14} /> New Booking
              </button>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              <KpiCard icon={<Ship size={14}/>}     label="Bookings This Month" value="14"      sub="↑ +3 vs last month"       subColor="text-emerald-400" />
              <KpiCard icon={<DollarSign size={14}/>}label="Commission Earned"   value="$3,247"  sub="↑ +$420 vs last month"    subColor="text-emerald-400" />
              <KpiCard icon={<Hotel size={14}/>}     label="Hotel Attachment"    value="11%"     sub="↓ Below 28% benchmark"    subColor={`text-[${AMBER}]`} />
              <KpiCard icon={<Clock size={14}/>}     label="Avg Time-to-Quote"   value="3.8 hrs" sub="↓ Target: under 2 hrs"    subColor={`text-[${AMBER}]`} />
            </div>

            {/* Pipeline */}
            <div className="mb-4">
              <h2 className="text-sm font-bold text-white mb-3">Booking Pipeline</h2>
              <div className="grid grid-cols-4 gap-3">
                {STAGE_COLS.map(col => (
                  <div key={col.key}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wide">{col.label}</span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor:BORDER, color:TEAL }}>{col.count(PIPELINE)}</span>
                    </div>
                    <div className="space-y-2">
                      {PIPELINE.filter(p=>p.stage===col.key).map(p=>(
                        <div key={p.id} className="rounded-xl p-3 border cursor-pointer hover:border-zinc-600 transition-all" style={{ backgroundColor:CARD, borderColor:BORDER }}>
                          <div className="text-xs font-bold text-white mb-0.5 truncate">{p.client}</div>
                          <div className="text-[10px] text-zinc-500 mb-1.5">{p.line} · {p.dest}</div>
                          <div className="flex items-center gap-1 mb-1.5 flex-wrap">
                            {p.badges.map(b=>(
                              <span key={b} className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${BADGE_STYLE[b]}`}>{b}</span>
                            ))}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-zinc-500">{p.dates}</span>
                            <span className="text-[11px] font-bold" style={{ color:GREEN }}>${p.commission}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* IntelePerks banner */}
            <div className="rounded-xl p-4 border flex items-center gap-4" style={{ background:`linear-gradient(135deg, #1a0f2e, #0d1524)`, borderColor:'#3d2060' }}>
              <Star size={20} style={{ color:PURPLE }} />
              <div className="flex-1">
                <span className="text-xs font-bold text-white">IntelePerks Opportunity — </span>
                <span className="text-xs text-zinc-300">Register your next booking within 24 hours to earn </span>
                <span className="text-xs font-bold" style={{ color:PURPLE }}>500 bonus points</span>
              </div>
              <button className="text-xs font-bold px-3 py-1.5 rounded-lg" style={{ backgroundColor:PURPLE, color:'#06090f' }}>Earn Points</button>
            </div>
          </div>
        )}

        {/* ══ TAB 2: CRUISE BUILDER ═══════════════════════════════════════════ */}
        {tab==='builder' && (
          <div className="flex gap-4">
            {/* Left: search + results */}
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-white mb-4">Cruise Bundle Builder</h1>

              {/* Filters */}
              <div className="rounded-xl p-4 border mb-5 grid grid-cols-3 gap-3" style={{ backgroundColor:CARD, borderColor:BORDER }}>
                {[
                  { label:'Cruise Line',    type:'select', opts:['All Lines','Royal Caribbean','Carnival','Norwegian','MSC','Celebrity'] },
                  { label:'Departure Port', type:'select', opts:['All Ports','Miami','Port Canaveral','Galveston','Baltimore'] },
                  { label:'Duration',       type:'select', opts:['Any Duration','3–7 nights','7–10 nights','10–14 nights'] },
                ].map(f=>(
                  <div key={f.label}>
                    <label className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider block mb-1">{f.label}</label>
                    <div className="relative">
                      <select className="w-full text-xs rounded-lg px-3 py-2 pr-7 border appearance-none focus:outline-none" style={{ backgroundColor:'#111827', borderColor:BORDER, color:'#e5e7eb' }}>
                        {f.opts.map(o=><option key={o}>{o}</option>)}
                      </select>
                      <ChevronDown size={12} className="absolute right-2 top-2.5 text-zinc-500 pointer-events-none" />
                    </div>
                  </div>
                ))}
                <div>
                  <label className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider block mb-1">Max Budget / person</label>
                  <div className="flex items-center gap-2">
                    <input type="range" min={500} max={5000} defaultValue={3000} className="flex-1 accent-teal-400" />
                    <span className="text-xs text-white font-semibold w-16">$3,000</span>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider block mb-1">Travel Dates</label>
                  <input type="date" className="w-full text-xs rounded-lg px-3 py-2 border focus:outline-none" style={{ backgroundColor:'#111827', borderColor:BORDER, color:'#e5e7eb' }} />
                </div>
                <div className="flex items-end">
                  <button className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold" style={{ backgroundColor:TEAL, color:'#06090f' }}>
                    <Search size={13}/> Search Cruises
                  </button>
                </div>
              </div>

              {/* Cruise results */}
              <div className="space-y-3">
                {CRUISES.map(c=>{
                  const activeCabin = selectedCabin[c.id] ?? 'Balcony'
                  const isSelected = selectedCruise?.id === c.id
                  return (
                    <div key={c.id} className="rounded-xl border overflow-hidden transition-all" style={{ backgroundColor:CARD, borderColor: isSelected ? TEAL : BORDER }}>
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-sm font-bold text-white">{c.ship}</span>
                              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor:'#002a1a', color:GREEN, border:`1px solid ${GREEN}40` }}>
                                <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor:GREEN }}/>Live Availability
                              </span>
                            </div>
                            <div className="text-xs text-zinc-400">{c.line} · {c.itinerary}</div>
                            <div className="flex items-center gap-3 mt-1 text-[11px] text-zinc-500">
                              <span className="flex items-center gap-1"><Calendar size={10}/>{c.date}</span>
                              <span className="flex items-center gap-1"><Clock size={10}/>{c.nights} nights</span>
                              <span className="flex items-center gap-1"><MapPin size={10}/>{c.port}</span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-xl font-bold text-white">${c.prices[activeCabin].toLocaleString()}</div>
                            <div className="text-[10px] text-zinc-500">per person</div>
                          </div>
                        </div>
                        {/* Cabin tabs */}
                        <div className="flex gap-1 mb-3">
                          {CABIN_TYPES.map(ct=>(
                            <button
                              key={ct}
                              onClick={()=>setSelectedCabin(s=>({...s,[c.id]:ct}))}
                              className="flex-1 text-[10px] font-semibold py-1.5 rounded-lg border transition-all"
                              style={activeCabin===ct
                                ? { backgroundColor:TEAL+'20', borderColor:TEAL, color:TEAL }
                                : { backgroundColor:'transparent', borderColor:BORDER, color:'#6b7280' }}
                            >{ct}</button>
                          ))}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-[11px]" style={{ color:PURPLE }}>
                            <Star size={11}/>
                            <span>~{c.prices[activeCabin]} IntelePerks points</span>
                          </div>
                          <button
                            onClick={()=>selectCruiseAndNavigate(c)}
                            className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
                            style={isSelected ? { backgroundColor:TEAL, color:'#06090f' } : { backgroundColor:BORDER, color:'white' }}
                          >
                            {isSelected ? <><CheckCircle size={12}/>Selected</> : <>Select <ArrowRight size={12}/></>}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right: Complete This Trip panel */}
            {selectedCruise && (
              <div className="w-80 flex-shrink-0">
                <div className="rounded-xl border sticky top-0" style={{ backgroundColor:CARD, borderColor:TEAL+'40' }}>
                  <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor:BORDER }}>
                    <span className="text-sm font-bold text-white">Complete This Trip</span>
                    <button onClick={()=>setSelectedCruise(null)}><X size={14} className="text-zinc-500"/></button>
                  </div>
                  <div className="p-4 space-y-4">
                    {/* Selected cruise summary */}
                    <div className="rounded-lg p-3 border" style={{ backgroundColor:'#0a1020', borderColor:TEAL+'30' }}>
                      <div className="text-[10px] text-zinc-500 mb-0.5">Selected Cruise</div>
                      <div className="text-xs font-bold text-white">{selectedCruise.ship}</div>
                      <div className="text-[10px] text-zinc-400">{selectedCruise.itinerary}</div>
                      <div className="text-sm font-bold mt-1" style={{ color:TEAL }}>${selectedCruise.prices[cabin].toLocaleString()}/pp</div>
                    </div>

                    {/* Port hotels */}
                    <div>
                      <div className="text-[11px] font-bold text-zinc-300 mb-2 flex items-center gap-1"><Hotel size={11}/> Add Pre-Cruise Hotel · {selectedCruise.port}</div>
                      <div className="space-y-2">
                        {(PORT_HOTELS[selectedCruise.port]??[]).map(h=>(
                          <button
                            key={h.name}
                            onClick={()=>setSelectedHotel(selectedHotel?.name===h.name?null:h)}
                            className="w-full text-left rounded-lg p-2.5 border transition-all"
                            style={selectedHotel?.name===h.name
                              ? { backgroundColor:PURPLE+'15', borderColor:PURPLE }
                              : { backgroundColor:'#0a1020', borderColor:BORDER }}
                          >
                            <div className="flex items-start justify-between gap-1">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1 flex-wrap">
                                  <span className="text-[11px] font-bold text-white truncate">{h.name}</span>
                                  {h.preferred && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border flex-shrink-0" style={{ backgroundColor:PURPLE+'20', borderColor:PURPLE+'60', color:PURPLE }}>★ Preferred</span>}
                                </div>
                                <div className="text-[10px] text-zinc-500">{'⭐'.repeat(h.stars)} · {h.dist}</div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <div className="text-xs font-bold text-white">${h.perNight}</div>
                                <div className="text-[9px] text-zinc-500">/night</div>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Insurance */}
                    <div className="rounded-lg p-3 border" style={{ backgroundColor:insureChecked?'#001a0d':'#0a1020', borderColor:insureChecked?GREEN+'40':BORDER }}>
                      <div className="flex items-start gap-2">
                        <input type="checkbox" checked={insureChecked} onChange={e=>setInsureChecked(e.target.checked)} className="mt-0.5 accent-emerald-400" />
                        <div className="flex-1">
                          <div className="flex items-center gap-1">
                            <Shield size={11} style={{ color:GREEN }}/>
                            <span className="text-[11px] font-bold text-white">Protect Your Trip</span>
                          </div>
                          <div className="text-[10px] text-zinc-400 mt-0.5">$89/person · <span style={{ color:GREEN }}>You earn $52 commission</span></div>
                        </div>
                      </div>
                    </div>

                    {/* Running total */}
                    <div className="rounded-lg p-3 border space-y-1" style={{ backgroundColor:'#0a1020', borderColor:BORDER }}>
                      <div className="flex justify-between text-[11px] text-zinc-400"><span>Cruise</span><span>${cruisePrice.toLocaleString()}</span></div>
                      {selectedHotel && <div className="flex justify-between text-[11px] text-zinc-400"><span>Hotel (1 night)</span><span>${hotelPrice}</span></div>}
                      {insureChecked && <div className="flex justify-between text-[11px] text-zinc-400"><span>Insurance</span><span>${insurePrice}</span></div>}
                      <div className="border-t pt-1 flex justify-between text-xs font-bold text-white" style={{ borderColor:BORDER }}>
                        <span>Total</span><span>${totalPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-[11px] font-bold" style={{ color:GREEN }}>
                        <span>Your Commission</span><span>~${commissionEst}</span>
                      </div>
                    </div>

                    {/* IntelePerks chip */}
                    <div className="flex items-center gap-1 text-[11px]" style={{ color:PURPLE }}>
                      <Star size={11}/> This booking earns ~{totalPrice} IntelePerks points
                    </div>

                    <button
                      onClick={()=>{ setQuoteDest(selectedCruise.itinerary); setTab('quote') }}
                      className="w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2"
                      style={{ backgroundColor:TEAL, color:'#06090f' }}
                    >
                      <Zap size={13}/> Generate Quote
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ TAB 3: CLIENT PROFILES ══════════════════════════════════════════ */}
        {tab==='clients' && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h1 className="text-lg font-bold text-white">Client Profiles</h1>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold" style={{ backgroundColor:TEAL, color:'#06090f' }}>
                <Plus size={13}/> Add New Client
              </button>
            </div>
            <div className="relative mb-5">
              <Search size={14} className="absolute left-3 top-2.5 text-zinc-500" />
              <input
                placeholder="Search clients by name or email..."
                className="w-full pl-9 pr-4 py-2 rounded-lg border text-sm focus:outline-none"
                style={{ backgroundColor:CARD, borderColor:BORDER, color:'#e5e7eb' }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {CLIENTS.map(c=>(
                <div key={c.id} className="rounded-xl border p-4 flex items-start gap-3" style={{ backgroundColor:CARD, borderColor:BORDER }}>
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ backgroundColor:c.color }}>
                    {c.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-white mb-0.5">{c.name}</div>
                    <div className="text-[11px] text-zinc-400 mb-0.5">{c.cabin} · {c.loyalty[0]?.program.split(' ')[0]} {c.loyalty[0]?.level}</div>
                    <div className="text-[11px] text-zinc-500 mb-2 truncate">Last: {c.lastBooking}</div>
                    <button
                      onClick={()=>{ setActiveClient(c); setClientTab('overview') }}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors"
                      style={{ borderColor:TEAL+'50', color:TEAL }}
                    >View Profile</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Client modal */}
            {activeClient && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ backgroundColor:'#06090fcc' }}>
                <div className="w-full max-w-2xl rounded-2xl border overflow-hidden" style={{ backgroundColor:CARD, borderColor:BORDER }}>
                  {/* Modal header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor:BORDER }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor:activeClient.color }}>{activeClient.initials}</div>
                      <div>
                        <div className="text-base font-bold text-white">{activeClient.name}</div>
                        <div className="text-[11px] text-zinc-500">{activeClient.loyalty[0]?.program} · {activeClient.loyalty[0]?.level}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={()=>openClientAndQuote(activeClient)} className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg" style={{ backgroundColor:TEAL, color:'#06090f' }}>
                        <Zap size={12}/> Start Quote
                      </button>
                      <button onClick={()=>setActiveClient(null)}><X size={16} className="text-zinc-500"/></button>
                    </div>
                  </div>
                  {/* Modal tabs */}
                  <div className="flex border-b px-6 gap-1" style={{ borderColor:BORDER }}>
                    {(['overview','history','preferences','upcoming'] as const).map(t=>(
                      <button
                        key={t}
                        onClick={()=>setClientTab(t)}
                        className="capitalize text-xs font-semibold px-3 py-2.5 border-b-2 transition-all"
                        style={clientTab===t ? { borderBottomColor:TEAL, color:TEAL } : { borderBottomColor:'transparent', color:'#6b7280' }}
                      >{t}</button>
                    ))}
                  </div>
                  {/* Modal body */}
                  <div className="p-6 max-h-96 overflow-y-auto">
                    {clientTab==='overview' && (
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { label:'Last Booking', val:activeClient.lastBooking },
                          { label:'Travel Date',  val:activeClient.lastDate },
                          { label:'Cabin Preference', val:activeClient.cabin },
                          { label:'Bed Config', val:activeClient.bed },
                          { label:'Dining', val:activeClient.dining },
                          { label:'Insurance', val:activeClient.insurance },
                        ].map(f=>(
                          <div key={f.label} className="rounded-lg p-3 border" style={{ backgroundColor:'#0a1020', borderColor:BORDER }}>
                            <div className="text-[10px] text-zinc-500 mb-1">{f.label}</div>
                            <div className="text-xs font-semibold text-white">{f.val}</div>
                          </div>
                        ))}
                        <div className="col-span-2 rounded-lg p-3 border" style={{ backgroundColor:'#0a1020', borderColor:BORDER }}>
                          <div className="text-[10px] text-zinc-500 mb-1">Advisor Notes</div>
                          <div className="text-xs text-zinc-300">{activeClient.notes}</div>
                        </div>
                      </div>
                    )}
                    {clientTab==='history' && (
                      <div className="space-y-2">
                        {activeClient.history.map((h,i)=>(
                          <div key={i} className="flex items-center justify-between rounded-lg p-3 border" style={{ backgroundColor:'#0a1020', borderColor:BORDER }}>
                            <div>
                              <div className="text-xs font-semibold text-white">{h.trip}</div>
                              <div className="text-[10px] text-zinc-500">{h.date}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-zinc-300">{h.value}</div>
                              <div className="text-[11px] font-bold" style={{ color:GREEN }}>{h.commission}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {clientTab==='preferences' && (
                      <div className="space-y-3">
                        {[
                          { label:'Cabin Type', val:activeClient.cabin },
                          { label:'Bed Configuration', val:activeClient.bed },
                          { label:'Dining', val:activeClient.dining },
                          { label:'Special Requests', val:activeClient.requests },
                          { label:'Travel Insurance', val:activeClient.insurance },
                          { label:'Loyalty Program', val:`${activeClient.loyalty[0]?.program} — ${activeClient.loyalty[0]?.level} (${activeClient.loyalty[0]?.number})` },
                        ].map(f=>(
                          <div key={f.label} className="flex items-start gap-3">
                            <span className="text-[10px] text-zinc-500 w-32 flex-shrink-0 pt-0.5">{f.label}</span>
                            <span className="text-xs text-white flex-1">{f.val}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {clientTab==='upcoming' && (
                      <div className="text-center py-8 text-zinc-500 text-sm">No upcoming trips scheduled yet.</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══ TAB 4: AI QUOTE GENERATOR ═══════════════════════════════════════ */}
        {tab==='quote' && (
          <div className="flex gap-6">
            {/* Left: form */}
            <div className="w-80 flex-shrink-0">
              <h1 className="text-lg font-bold text-white mb-4">AI Quote Generator</h1>
              <div className="rounded-xl border p-4 space-y-3" style={{ backgroundColor:CARD, borderColor:BORDER }}>
                {[
                  { label:'Client Name', val:quoteName, set:setQuoteName, placeholder:'e.g. James & Diana Thornton' },
                  { label:'Destination', val:quoteDest, set:setQuoteDest, placeholder:'e.g. Eastern Caribbean' },
                  { label:'Travel Dates', val:quoteDates, set:setQuoteDates, placeholder:'e.g. July 12–19, 2026' },
                ].map(f=>(
                  <div key={f.label}>
                    <label className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider block mb-1">{f.label}</label>
                    <input
                      value={f.val}
                      onChange={e=>f.set(e.target.value)}
                      placeholder={f.placeholder}
                      className="w-full text-xs rounded-lg px-3 py-2 border focus:outline-none"
                      style={{ backgroundColor:'#111827', borderColor:BORDER, color:'#e5e7eb' }}
                    />
                  </div>
                ))}

                <div>
                  <label className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider block mb-1">Budget Range: ${quoteBudget.toLocaleString()}</label>
                  <input type="range" min={500} max={10000} value={quoteBudget} onChange={e=>setQuoteBudget(+e.target.value)} className="w-full accent-teal-400" />
                  <div className="flex justify-between text-[9px] text-zinc-600 mt-0.5"><span>$500</span><span>$10,000</span></div>
                </div>

                <div>
                  <label className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider block mb-1">Travelers</label>
                  <div className="flex items-center gap-2">
                    <button onClick={()=>setQuoteTravelers(Math.max(1,quoteTravelers-1))} className="w-8 h-8 rounded-lg border text-white font-bold" style={{ borderColor:BORDER, backgroundColor:'#111827' }}>-</button>
                    <span className="text-sm font-bold text-white flex-1 text-center">{quoteTravelers}</span>
                    <button onClick={()=>setQuoteTravelers(Math.min(10,quoteTravelers+1))} className="w-8 h-8 rounded-lg border text-white font-bold" style={{ borderColor:BORDER, backgroundColor:'#111827' }}>+</button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider block mb-1">Special Occasion</label>
                  <div className="relative">
                    <select value={quoteOccasion} onChange={e=>setQuoteOccasion(e.target.value)} className="w-full text-xs rounded-lg px-3 py-2 border appearance-none focus:outline-none pr-7" style={{ backgroundColor:'#111827', borderColor:BORDER, color:'#e5e7eb' }}>
                      {['None','Anniversary','Birthday','Honeymoon','Graduation'].map(o=><option key={o}>{o}</option>)}
                    </select>
                    <ChevronDown size={12} className="absolute right-2 top-2.5 text-zinc-500 pointer-events-none"/>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider block mb-1">Special Notes</label>
                  <textarea
                    value={quoteNotes}
                    onChange={e=>setQuoteNotes(e.target.value)}
                    rows={3}
                    placeholder="Dietary restrictions, cabin preferences, loyalty programs..."
                    className="w-full text-xs rounded-lg px-3 py-2 border focus:outline-none resize-none"
                    style={{ backgroundColor:'#111827', borderColor:BORDER, color:'#e5e7eb' }}
                  />
                </div>

                <button
                  onClick={generateQuote}
                  disabled={quoteLoading || !quoteName || !quoteDest}
                  className="w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-opacity disabled:opacity-50"
                  style={{ backgroundColor:TEAL, color:'#06090f' }}
                >
                  {quoteLoading ? <><Loader2 size={13} className="animate-spin"/> Generating...</> : <><Zap size={13}/> Generate Quote</>}
                </button>
              </div>
            </div>

            {/* Right: quote preview */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-white">Quote Preview</h2>
                {quoteResult && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-1 rounded-lg border" style={{ backgroundColor:GREEN+'15', borderColor:GREEN+'40', color:GREEN }}>
                      Commission Est. ~${Math.round(quoteBudget*0.12*quoteTravelers)}
                    </span>
                    <button
                      onClick={copyQuote}
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors"
                      style={{ borderColor:TEAL+'60', color:TEAL }}
                    >
                      <Copy size={12}/>{quoteCopied?'Copied!':'Copy Quote'}
                    </button>
                  </div>
                )}
              </div>

              <div className="rounded-xl border min-h-64 p-5" style={{ backgroundColor:CARD, borderColor:BORDER }}>
                {quoteLoading && (
                  <div className="flex flex-col items-center justify-center h-40 gap-3">
                    <Loader2 size={24} className="animate-spin" style={{ color:TEAL }}/>
                    <span className="text-xs text-zinc-400">Crafting your personalized quote...</span>
                  </div>
                )}
                {!quoteLoading && !quoteResult && (
                  <div className="flex flex-col items-center justify-center h-40 gap-2 text-zinc-600">
                    <Zap size={24}/>
                    <span className="text-xs">Fill in the form and click Generate Quote</span>
                  </div>
                )}
                {!quoteLoading && quoteResult && (
                  <>
                    {/* Email header */}
                    <div className="border-b pb-3 mb-4" style={{ borderColor:BORDER }}>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor:TEAL }}>SM</div>
                        <div>
                          <div className="text-xs font-bold text-white">Sarah Mitchell · InteleTravel Independent Advisor</div>
                          <div className="text-[10px] text-zinc-500">sarah.mitchell@inteletravel.com · To: {quoteName}</div>
                        </div>
                      </div>
                    </div>
                    <pre className="text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed font-sans">{quoteResult}</pre>
                    {/* Content Concierge chip */}
                    <div className="mt-4 pt-4 border-t flex items-center gap-2" style={{ borderColor:BORDER }}>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border cursor-pointer hover:opacity-80 transition-opacity" style={{ backgroundColor:PURPLE+'15', borderColor:PURPLE+'50', color:PURPLE }}>
                        ✨ Content Concierge — Turn this into a social post →
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══ TAB 5: ANALYTICS ════════════════════════════════════════════════ */}
        {tab==='analytics' && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h1 className="text-lg font-bold text-white">Analytics</h1>
                <p className="text-xs text-zinc-500 mt-0.5">Performance · April 2026 · Last 6 months</p>
              </div>
              <select className="text-xs rounded-lg px-3 py-2 border focus:outline-none" style={{ backgroundColor:CARD, borderColor:BORDER, color:'#e5e7eb' }}>
                <option>Last 6 Months</option><option>Last 12 Months</option><option>YTD</option>
              </select>
            </div>

            {/* KPI row */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              {[
                { label:'Look-to-Book Rate',   val:'34%', trend:'+6pp vs 6mo ago', up:true,  warn:false },
                { label:'Hotel Attachment',    val:'11%', trend:'↓ Below 28% target', up:false, warn:true  },
                { label:'Avg Order Value',     val:'$2,140',trend:'↑ +$280 vs 6mo ago',up:true, warn:false },
                { label:'Insurance Attach',    val:'8%',  trend:'↓ Below 18% target', up:false, warn:true  },
              ].map(k=>(
                <div key={k.label} className="rounded-xl p-4 border" style={{ backgroundColor:CARD, borderColor:k.warn?AMBER+'40':BORDER }}>
                  <div className="flex items-center gap-1 mb-1">
                    {k.warn ? <AlertTriangle size={12} style={{ color:AMBER }}/> : k.up ? <TrendingUp size={12} style={{ color:GREEN }}/> : <TrendingDown size={12} style={{ color:ORANGE }}/>}
                    <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">{k.label}</span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-0.5">{k.val}</div>
                  <div className={`text-[11px] ${k.warn?`text-[${AMBER}]`:k.up?'text-emerald-400':'text-rose-400'}`}>{k.trend}</div>
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="rounded-xl border p-4" style={{ backgroundColor:CARD, borderColor:BORDER }}>
                <div className="text-xs font-bold text-white mb-4">Booking Conversion Trend — Last 6 Months</div>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={CONVERSION_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
                    <XAxis dataKey="month" tick={{ fill:'#6b7280', fontSize:10 }} axisLine={false} tickLine={false}/>
                    <YAxis tick={{ fill:'#6b7280', fontSize:10 }} axisLine={false} tickLine={false}/>
                    <Tooltip contentStyle={{ backgroundColor:CARD, border:`1px solid ${BORDER}`, borderRadius:8, fontSize:11 }}/>
                    <Legend wrapperStyle={{ fontSize:11 }}/>
                    <Line type="monotone" dataKey="quotes"   stroke={TEAL}  strokeWidth={2} dot={{ r:3 }} name="Quotes Sent"/>
                    <Line type="monotone" dataKey="bookings" stroke={GREEN} strokeWidth={2} dot={{ r:3 }} name="Bookings Confirmed"/>
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="rounded-xl border p-4" style={{ backgroundColor:CARD, borderColor:BORDER }}>
                <div className="text-xs font-bold text-white mb-4">Revenue by Vertical</div>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={REVENUE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke={BORDER}/>
                    <XAxis dataKey="vertical" tick={{ fill:'#6b7280', fontSize:10 }} axisLine={false} tickLine={false}/>
                    <YAxis tick={{ fill:'#6b7280', fontSize:10 }} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/>
                    <Tooltip contentStyle={{ backgroundColor:CARD, border:`1px solid ${BORDER}`, borderRadius:8, fontSize:11 }} formatter={(v)=>[`$${Number(v).toLocaleString()}`,'Revenue']}/>
                    <Bar dataKey="revenue" fill={TEAL} radius={[4,4,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Benchmark comparison */}
            <div className="rounded-xl border p-5 mb-4" style={{ backgroundColor:CARD, borderColor:BORDER }}>
              <div className="text-xs font-bold text-white mb-4">Performance vs. Benchmark</div>
              <div className="space-y-3">
                {[
                  { label:'Hotel Attachment Rate', mine:11, bench:28, unit:'%' },
                  { label:'Insurance Attach Rate', mine:8,  bench:18, unit:'%' },
                  { label:'Look-to-Book Rate',      mine:34, bench:42, unit:'%' },
                ].map(r=>(
                  <div key={r.label} className="grid grid-cols-3 gap-4 items-center">
                    <span className="text-xs text-zinc-400">{r.label}</span>
                    <div>
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span style={{ color:r.mine<r.bench?AMBER:GREEN }}>Mine: {r.mine}{r.unit}</span>
                        <span className="text-zinc-500">Benchmark: {r.bench}{r.unit}</span>
                      </div>
                      <div className="relative h-2 rounded-full overflow-hidden" style={{ backgroundColor:BORDER }}>
                        <div className="absolute h-full rounded-full" style={{ width:`${(r.mine/50)*100}%`, backgroundColor:r.mine<r.bench?AMBER:GREEN }}/>
                        <div className="absolute h-full w-0.5" style={{ left:`${(r.bench/50)*100}%`, backgroundColor:'#ffffff30' }}/>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle size={11} style={{ color:AMBER }}/>
                      <span className="text-[11px]" style={{ color:AMBER }}>Gap: {r.bench-r.mine}{r.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Opportunity callout */}
            <div className="rounded-xl border p-4 flex items-start gap-3" style={{ backgroundColor:'#0d1a0d', borderColor:GREEN+'30' }}>
              <CheckCircle size={18} style={{ color:GREEN }} className="flex-shrink-0 mt-0.5"/>
              <div>
                <span className="text-xs font-bold text-white">Opportunity: </span>
                <span className="text-xs text-zinc-300">Increasing hotel attachment from 11% to 22% on your current booking volume adds </span>
                <span className="text-xs font-bold" style={{ color:GREEN }}>~$890/month in commission</span>
                <span className="text-xs text-zinc-300">. Start by offering the pre-cruise hotel bundle to every cruise client at quote time.</span>
              </div>
              <button onClick={()=>setTab('builder')} className="flex-shrink-0 flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg" style={{ backgroundColor:GREEN, color:'#06090f' }}>
                Try Now <ArrowRight size={11}/>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
