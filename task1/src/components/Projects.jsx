import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Cpu, 
  Server, 
  Truck, 
  Calendar, 
  Users, 
  ShoppingBag, 
  Zap, 
  ArrowRight, 
  Layers, 
  Check, 
  Search,
  Sparkles,
  Activity
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const cvKeyProjects = [
  {
    id: 'wafrly',
    index: '01',
    title: 'Wafrly (وفّرلي)',
    tagline: 'AI Causal Behavioral Finance & Autonomous SMS Transaction Engine',
    category: 'AI & Mobile Engine',
    badge: 'Graduation Lead Project',
    icon: Cpu,
    accent: 'emerald',
    metrics: [
      { label: 'SMS Parse Latency', value: '< 30ms' },
      { label: 'Causal Model', value: 'EconML + SHAP' },
      { label: 'AI Synthesis', value: 'Google Gemini' },
      { label: 'Architecture', value: 'Microservices' },
    ],
    architecture: [
      'Zero-Latency SMS Bank Parser (Regex & String Tokenizer)',
      'Python Causal Inference Engine (EconML & SHAP Attribution)',
      'Bilingual React Native (Expo) Interface with Dynamic Dark Theme',
      'Express.js + Prisma ORM Backend with Automated Category Budgeting',
    ],
    liveInteractiveType: 'pipeline',
    bullets: [
      'Engineered an autonomous financial companion capturing, parsing, and categorizing bank transaction alerts in real time.',
      'Constructed a machine-learning causal pipeline to isolate spending impulse triggers and generate actionable reduction plans.',
      'Designed responsive Arabic & English RTL/LTR UI flows tailored for both iOS and Android platforms.',
    ],
  },
  {
    id: 'ticketing-system',
    index: '02',
    title: 'High-Concurrency Ticketing System',
    tagline: 'Real-Time Event Reservation Engine with Atomic WebSocket Seat Locking',
    category: 'Real-Time System',
    badge: 'Production Architecture',
    icon: Server,
    accent: 'indigo',
    metrics: [
      { label: 'Socket Latency', value: '12ms' },
      { label: 'Concurrency Lock', value: 'Atomic / Zero Race' },
      { label: 'Auth & Access', value: 'JWT + RBAC' },
      { label: 'Database', value: 'MongoDB Cluster' },
    ],
    architecture: [
      'Bi-directional Socket.IO Seat State Synchronization',
      'Automated 10-Minute Cart Reservation Expiration Timer',
      'Dynamic QR Code Event Check-in & Gate Verification Pipeline',
      'Modular RESTful Endpoints with Rate Limiting & Admin Auditing',
    ],
    liveInteractiveType: 'seats',
    bullets: [
      'Architected an atomic seat reservation system preventing double-booking anomalies during peak ticket drops.',
      'Implemented full role-based access control separating attendees from event organizers and venue managers.',
      'Generated encrypted, scan-ready QR codes client-side for rapid on-site entrance verification.',
    ],
  },
  {
    id: 'zowar-taiba',
    index: '03',
    title: 'Zowar Taiba (زوار طيبة)',
    tagline: 'Government-Compliant Land Transport Operations & Manifest System',
    category: 'Enterprise Logistics',
    badge: 'Live Saudi Client',
    icon: Truck,
    accent: 'amber',
    metrics: [
      { label: 'Document Engine', value: 'Client jsPDF' },
      { label: 'Backend Sync', value: 'Supabase Real-Time' },
      { label: 'Compliance', value: 'Saudi MOT Ready' },
      { label: 'Platform', value: 'Vercel Serverless' },
    ],
    architecture: [
      'Driver ID & License Plate Dual-Factor Authorization',
      'Dynamic 3-Page Passenger Manifest & Transport Contract Generation',
      'Cloud Supabase PostgreSQL Database with Instant Fleet Sync',
      'Fleet Manager CRUD Control Deck with Driver Assignment Logs',
    ],
    liveInteractiveType: 'manifest',
    bullets: [
      'Developed a mission-critical web application for a licensed Saudi transport fleet transporting pilgrims between Mecca and Medina.',
      'Eliminated manual paperwork by rendering signed, stamped official PDF packets client-side with zero server latency.',
      'Implemented real-time vehicle dispatch monitoring with offline-resilient local caching.',
    ],
  },
  {
    id: 'kickzone',
    index: '04',
    title: 'KickZone Football Arena',
    tagline: 'Multi-Pitch Stadium Booking Platform with Automated Slot Validation',
    category: 'Booking & Scheduling',
    badge: 'Sports Web App',
    icon: Calendar,
    accent: 'cyan',
    metrics: [
      { label: 'Slot Validation', value: 'Conflict-Free' },
      { label: 'Stack', value: 'Full-Stack JavaScript' },
      { label: 'Database', value: 'MongoDB / Mongoose' },
      { label: 'Pricing Model', value: 'Peak / Off-Peak' },
    ],
    architecture: [
      'Multi-Pitch Interactive Hourly Matrix Scheduler',
      'Dynamic Peak-Hours Pricing Calculator & Discount Codes',
      'Manager Booking Blackout & Maintenance Period Locking',
      'Customer Match Booking History & SMS Confirmation Hooks',
    ],
    liveInteractiveType: 'slots',
    bullets: [
      'Created an intuitive pitch booking platform allowing sports enthusiasts to reserve arenas across hourly time slots.',
      'Engineered automated scheduling conflict prevention to guarantee zero double-booked pitches.',
      'Built a management dashboard for arena owners to track daily revenue and schedule maintenance.',
    ],
  },
  {
    id: 'momento',
    index: '05',
    title: 'Momento Watch Party Hub',
    tagline: 'Matchday Companion & Community Watch Party Coordination Suite',
    category: 'Community & Sports',
    badge: 'Social Platform',
    icon: Users,
    accent: 'violet',
    metrics: [
      { label: 'Match Feed', value: 'Live Football API' },
      { label: 'RSVP Engine', value: 'Real-Time Sync' },
      { label: 'Coordination', value: 'Group Task Lists' },
      { label: 'Stack', value: 'Node + Express + Mongo' },
    ],
    architecture: [
      'Public Football Fixtures & Stadium Venue Feed Ingestion',
      'Matchday Food & Refreshments Shared Responsibility Tracker',
      'Live Attendee Headcount & Interactive Party RSVP Engine',
      'Fan Sentiment Voting & Match Outcome Prediction Boards',
    ],
    liveInteractiveType: 'match',
    bullets: [
      'Designed a social gathering application helping football fans coordinate watch parties with real-time match data.',
      'Integrated live stadium schedules, kickoff notifications, and attendee coordination checklists.',
    ],
  },
  {
    id: 'onat-bakery',
    index: '06',
    title: 'Onat Artisan Bakery',
    tagline: 'Bilingual Gourmet Bakery Catalog & Order Scheduling Interface',
    category: 'E-Commerce Platform',
    badge: 'Retail Web App',
    icon: ShoppingBag,
    accent: 'rose',
    metrics: [
      { label: 'Localization', value: 'Arabic & English' },
      { label: 'State Model', value: 'Reactive Cart' },
      { label: 'Performance', value: 'Lighthouse 98' },
      { label: 'UX Design', value: 'Mobile-First Touch' },
    ],
    architecture: [
      'Instant Dual-Language English/Arabic Toggle with RTL Adaptation',
      'Local Storage Synchronized Cart with Delivery Zone Cost Calculators',
      'Nutritional & Allergy Badge Tagging for Dietary Requirements',
      'Streamlined Multi-Step Checkout Flow with Pickup Window Selection',
    ],
    liveInteractiveType: 'bakery',
    bullets: [
      'Created a gourmet bakery showcase with responsive menus, custom dietary filtering, and real-time order calculations.',
      'Optimized performance for mobile shopping with sub-second page loads and fluid cart transitions.',
    ],
  },
];

export default function Projects() {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedSeat, setSelectedSeat] = useState(6);
  const [pipelineStep, setPipelineStep] = useState(2);

  const categories = ['All', 'AI & Mobile Engine', 'Real-Time System', 'Enterprise Logistics', 'Booking & Scheduling'];

  const filtered = cvKeyProjects.filter((p) => {
    const matchesCategory = filter === 'All' || p.category === filter;
    const matchesSearch =
      search.trim() === '' ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tagline.toLowerCase().includes(search.toLowerCase()) ||
      p.architecture.some((a) => a.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // GSAP Entrance & ScrollTrigger Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Animation
      gsap.from('.projects-header-anim', {
        scrollTrigger: {
          trigger: '.projects-header-anim',
          start: 'top 85%',
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });

      // Cards Stagger
      gsap.from(cardsRef.current.filter(Boolean), {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        },
        y: 40,
        opacity: 0,
        scale: 0.98,
        stagger: 0.12,
        duration: 0.7,
        ease: 'power2.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, [filtered.length]);

  // GSAP 3D Interactive Card Tilt
  const handleMouseMove = (e, cardEl) => {
    if (!cardEl) return;
    const rect = cardEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    gsap.to(cardEl, {
      rotateX,
      rotateY,
      transformPerspective: 1000,
      duration: 0.4,
      ease: 'power1.out',
    });

    const glow = cardEl.querySelector('.card-glow');
    if (glow) {
      gsap.to(glow, {
        x: x - 150,
        y: y - 150,
        opacity: 1,
        duration: 0.2,
      });
    }
  };

  const handleMouseLeave = (cardEl) => {
    if (!cardEl) return;
    gsap.to(cardEl, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: 'power2.out',
    });
    const glow = cardEl.querySelector('.card-glow');
    if (glow) {
      gsap.to(glow, {
        opacity: 0,
        duration: 0.4,
      });
    }
  };

  return (
    <section 
      id="projects" 
      ref={containerRef} 
      className="py-28 px-6 bg-zinc-50 dark:bg-[#09090b] border-t border-zinc-200 dark:border-white/[0.06] transition-colors duration-200 relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="projects-header-anim mb-14">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <p className="text-xs font-mono uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
              Selected Works &bull; Engineering Catalog
            </p>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-zinc-950 dark:text-white tracking-tight">
            Architected &amp; Built
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mt-3 text-sm sm:text-base max-w-2xl">
            Real software systems, distributed services, and client applications. Each project represents pragmatic problem-solving, clean code, and zero compromises on performance.
          </p>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-12">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`text-xs font-medium px-4 py-2 rounded-xl transition-all ${
                  filter === c
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-black font-semibold shadow-sm scale-102'
                    : 'bg-white dark:bg-white/[0.03] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.06] border border-zinc-200 dark:border-white/[0.06]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="w-full sm:w-72 relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by architecture or tech..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-white/[0.03] rounded-xl border border-zinc-200 dark:border-white/[0.08] text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-white/30 transition-colors shadow-sm"
            />
            <Search className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Dynamic Project Cards Grid (NO Photos, NO GitHub links, Interactive High-End Style) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filtered.map((project, idx) => {
            const Icon = project.icon;
            return (
              <div
                key={project.id}
                ref={(el) => (cardsRef.current[idx] = el)}
                onMouseMove={(e) => handleMouseMove(e, cardsRef.current[idx])}
                onMouseLeave={() => handleMouseLeave(cardsRef.current[idx])}
                className="relative rounded-3xl bg-white dark:bg-[#111114] border border-zinc-200/90 dark:border-white/[0.08] hover:border-zinc-300 dark:hover:border-white/[0.18] p-7 sm:p-9 shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between overflow-hidden group cursor-default"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Mouse-Follow Ambient Glow (GSAP controlled) */}
                <div 
                  className="card-glow absolute w-72 h-72 rounded-full pointer-events-none opacity-0 blur-3xl transition-opacity duration-300"
                  style={{
                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, rgba(99, 102, 241, 0.04) 50%, transparent 70%)'
                  }}
                ></div>

                {/* Top Bar: Index + Icon + Category Badge */}
                <div>
                  <div className="flex items-center justify-between gap-4 mb-6 pb-5 border-b border-zinc-100 dark:border-white/[0.06]">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold text-zinc-400 dark:text-zinc-600">
                        {project.index}
                      </span>
                      <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-white/[0.04] text-zinc-800 dark:text-zinc-200 border border-zinc-200/60 dark:border-white/[0.06]">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-mono">
                        {project.category}
                      </span>
                    </div>

                    <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-zinc-100 dark:bg-white/[0.04] text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-white/[0.08]">
                      {project.badge}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-2xl font-bold text-zinc-950 dark:text-white tracking-tight mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                    {project.tagline}
                  </p>

                  {/* Dynamic Interactive Architectural Sandbox */}
                  <div className="mb-6 rounded-2xl bg-zinc-50 dark:bg-black/40 border border-zinc-200/70 dark:border-white/[0.06] p-4.5">
                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 mb-3 pb-2 border-b border-zinc-200/50 dark:border-white/[0.04]">
                      <span className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 font-semibold">
                        <Activity className="w-3.5 h-3.5 text-emerald-500" />
                        Live Architecture Preview
                      </span>
                      <span>Interactive</span>
                    </div>

                    {/* Project Specific Interactive Sandboxes */}
                    {project.liveInteractiveType === 'pipeline' && (
                      <div className="space-y-2.5 font-mono text-xs">
                        <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                          {[
                            { name: '1. Bank SMS', sub: 'Zero-Latency Parse' },
                            { name: '2. Causal Model', sub: 'EconML + SHAP' },
                            { name: '3. Gemini AI', sub: 'Action Plan' },
                          ].map((step, i) => (
                            <button
                              key={i}
                              onClick={() => setPipelineStep(i + 1)}
                              className={`p-2 rounded-xl border transition-all ${
                                pipelineStep === i + 1
                                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold'
                                  : 'bg-white dark:bg-white/[0.02] border-zinc-200 dark:border-white/[0.05] text-zinc-500'
                              }`}
                            >
                              <div>{step.name}</div>
                              <div className="text-[9px] opacity-70 mt-0.5">{step.sub}</div>
                            </button>
                          ))}
                        </div>
                        <div className="p-2.5 rounded-xl bg-white dark:bg-white/[0.02] border border-zinc-200/60 dark:border-white/[0.04] text-[11px] text-zinc-600 dark:text-zinc-300">
                          {pipelineStep === 1 && 'Parsed Transaction: -350.00 EGP (Groceries) at 14:22:01. Categorized in < 18ms.'}
                          {pipelineStep === 2 && 'Causal Inference: Identified weekend recurring impulse trigger (+28% probability).'}
                          {pipelineStep === 3 && 'Gemini Recommendation: Shifted auto-budget allocation to safeguard savings goal.'}
                        </div>
                      </div>
                    )}

                    {project.liveInteractiveType === 'seats' && (
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono mb-2">
                          <span>Click any seat to simulate real-time lock:</span>
                          <span className="text-emerald-500 font-bold">12ms Ping</span>
                        </div>
                        <div className="grid grid-cols-8 gap-1.5 max-w-xs mx-auto py-1">
                          {Array.from({ length: 16 }).map((_, i) => {
                            const isSelected = selectedSeat === i;
                            const isReserved = i === 1 || i === 8 || i === 13;
                            return (
                              <button
                                key={i}
                                disabled={isReserved}
                                onClick={() => setSelectedSeat(i)}
                                className={`h-6 rounded-lg text-[9px] font-mono font-bold transition-all flex items-center justify-center border ${
                                  isSelected
                                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-sm scale-105'
                                    : isReserved
                                    ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 border-transparent cursor-not-allowed'
                                    : 'bg-white dark:bg-white/[0.04] border-zinc-200 dark:border-white/[0.1] text-zinc-700 dark:text-zinc-300 hover:border-emerald-500'
                                }`}
                              >
                                {i + 1}
                              </button>
                            );
                          })}
                        </div>
                        <div className="mt-2 text-center text-[10px] font-mono text-zinc-500">
                          Seat #{selectedSeat + 1} atomically held via Socket.IO mutex
                        </div>
                      </div>
                    )}

                    {project.liveInteractiveType === 'manifest' && (
                      <div className="font-mono text-xs space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-zinc-700 dark:text-zinc-300">
                          <span>Route: Medina &rarr; Mecca Highway</span>
                          <span className="text-emerald-500 font-bold">Verified Manifest</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white dark:bg-white/[0.02] border border-zinc-200/60 dark:border-white/[0.04] text-[11px] flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                          <span>MOT Compliance Stamp: #KSA-49102-MOT</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">Generated in 120ms</span>
                        </div>
                      </div>
                    )}

                    {project.liveInteractiveType === 'slots' && (
                      <div className="font-mono text-xs">
                        <div className="grid grid-cols-4 gap-1.5 text-center text-[10px]">
                          {['18:00 - 19:00', '19:00 - 20:00', '20:00 - 21:00', '21:00 - 22:00'].map((slot, i) => (
                            <div
                              key={i}
                              className={`p-1.5 rounded-lg border ${
                                i === 2
                                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold'
                                  : 'bg-white dark:bg-white/[0.02] border-zinc-200 dark:border-white/[0.05] text-zinc-500'
                              }`}
                            >
                              {slot}
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 text-[10px] text-zinc-500 text-center">
                          Zero-conflict booking matrix validated with MongoDB atomic check
                        </div>
                      </div>
                    )}

                    {project.liveInteractiveType === 'match' && (
                      <div className="font-mono text-xs flex items-center justify-between p-2 rounded-xl bg-white dark:bg-white/[0.02] border border-zinc-200/60 dark:border-white/[0.04]">
                        <span className="text-zinc-800 dark:text-zinc-200 font-bold">Matchday RSVP: 14 Attending</span>
                        <span className="text-emerald-500 font-semibold">Live Fixture Feed Active</span>
                      </div>
                    )}

                    {project.liveInteractiveType === 'bakery' && (
                      <div className="font-mono text-xs flex items-center justify-between p-2 rounded-xl bg-white dark:bg-white/[0.02] border border-zinc-200/60 dark:border-white/[0.04]">
                        <span className="text-zinc-800 dark:text-zinc-200">Bilingual Engine: AR &harr; EN</span>
                        <span className="text-emerald-500 font-semibold">Reactive Cart Sync</span>
                      </div>
                    )}
                  </div>

                  {/* Architecture Specifications */}
                  <div className="space-y-2 mb-6">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 block">
                      Core Architecture:
                    </span>
                    <ul className="space-y-1.5">
                      {project.architecture.map((item, aIdx) => (
                        <li key={aIdx} className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Metrics Grid */}
                <div className="pt-5 border-t border-zinc-100 dark:border-white/[0.06] mt-auto">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {project.metrics.map((m, mIdx) => (
                      <div key={mIdx} className="p-2 rounded-xl bg-zinc-50 dark:bg-white/[0.02] border border-zinc-200/50 dark:border-white/[0.04]">
                        <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-tight">{m.label}</div>
                        <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200 mt-0.5 truncate">{m.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
