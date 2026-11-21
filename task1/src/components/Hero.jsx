import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowDown, FileText } from 'lucide-react';

const techStack = [
  'React.js',
  'React Native',
  'TypeScript',
  'Node.js',
  'Express.js',
  'Next.js',
  'Python',
  'MongoDB',
  'PostgreSQL',
  'Supabase',
  'Prisma ORM',
  'Socket.IO',
  'Redis',
  'Gemini AI',
  'Tailwind CSS',
];

export default function Hero() {
  const containerRef = useRef(null);
  const stat1Ref = useRef(null);
  const stat2Ref = useRef(null);
  const stat3Ref = useRef(null);
  const stat4Ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Elements Staggered Reveal
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.hero-badge', {
        y: -20,
        opacity: 0,
        duration: 0.7,
      })
      .from('.hero-title', {
        y: 40,
        opacity: 0,
        duration: 0.9,
      }, '-=0.4')
      .from('.hero-subtitle', {
        y: 25,
        opacity: 0,
        duration: 0.8,
      }, '-=0.5')
      .from('.hero-cta', {
        y: 20,
        opacity: 0,
        duration: 0.7,
      }, '-=0.4')
      .from('.hero-stats', {
        opacity: 0,
        y: 20,
        duration: 0.7,
      }, '-=0.3');

      // Animated Stat Counters
      const countUp = (el, target, suffix = '', decimals = 0) => {
        if (!el) return;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.8,
          ease: 'power2.out',
          delay: 0.6,
          onUpdate: () => {
            el.innerText = obj.val.toFixed(decimals) + suffix;
          },
        });
      };

      countUp(stat1Ref.current, 4, '+');
      countUp(stat2Ref.current, 10, '+');
      countUp(stat3Ref.current, 90, '%');
      countUp(stat4Ref.current, 3.6, '', 2);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative min-h-[92vh] flex flex-col justify-between pt-32 sm:pt-36 pb-0 overflow-hidden bg-zinc-50 dark:bg-[#09090b] transition-colors duration-200"
    >
      {/* Subtle minimal grid background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.04] dark:opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(#71717a 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      ></div>

      {/* Hero Content */}
      <div className="relative max-w-5xl mx-auto px-6 z-10 w-full flex-1 flex flex-col justify-center py-10 sm:py-16">
        {/* Availability Badge */}
        <div className="hero-badge mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.08] text-xs text-zinc-700 dark:text-zinc-300 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Available for full-time roles &amp; contract engineering</span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="hero-title text-4xl sm:text-6xl md:text-7xl font-bold text-zinc-950 dark:text-white tracking-tight leading-[1.08] mb-6 max-w-4xl">
          Building clean, performant web &amp; mobile applications.
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed max-w-2xl mb-10">
          Hi, I&apos;m <span className="text-zinc-900 dark:text-zinc-200 font-medium">Moaz Medhat</span> — a Full-Stack Developer based in Cairo, Egypt. 
          I engineer full-stack systems with React, React Native, TypeScript, and Node.js, focusing on clean architecture, intuitive interfaces, and real-world performance.
        </p>

        {/* Action Buttons */}
        <div className="hero-cta flex flex-wrap items-center gap-3.5 mb-16">
          <a
            href="#projects"
            className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-medium text-sm px-6 py-3 rounded-lg transition-colors active:scale-95 shadow-sm"
          >
            <span>View Architecture Catalog</span>
            <ArrowDown className="w-4 h-4" />
          </a>

          <a
            href="/Moaz_Medhat_CV.pdf"
            download="Moaz_Medhat_CV.pdf"
            className="inline-flex items-center gap-2 bg-white hover:bg-zinc-100 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-zinc-800 dark:text-zinc-200 font-medium text-sm px-6 py-3 rounded-lg border border-zinc-200 dark:border-white/[0.08] hover:border-zinc-300 dark:hover:border-white/[0.16] transition-colors active:scale-95 shadow-sm"
          >
            <FileText className="w-4 h-4 text-zinc-500" />
            <span>Download Resume</span>
          </a>
        </div>

        {/* Minimal Highlight Stats with GSAP Counters */}
        <div className="hero-stats grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-zinc-200 dark:border-white/[0.08]">
          <div>
            <div ref={stat1Ref} className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight font-mono">0</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Years of Coding</div>
          </div>
          <div>
            <div ref={stat2Ref} className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight font-mono">0</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Projects Delivered</div>
          </div>
          <div>
            <div ref={stat3Ref} className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight font-mono">0</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">NTI-ITIDA Track Score</div>
          </div>
          <div>
            <div ref={stat4Ref} className="text-3xl font-bold text-zinc-900 dark:text-white tracking-tight font-mono">0.00</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Sinai University GPA (out of 4.0)</div>
          </div>
        </div>
      </div>

      {/* Minimal Tech Ticker Bar */}
      <div className="relative w-full border-t border-zinc-200 dark:border-white/[0.06] bg-zinc-100/50 dark:bg-[#09090b] py-3.5 overflow-hidden z-20">
        <div className="animate-marquee flex items-center gap-10">
          {[...techStack, ...techStack].map((tech, idx) => (
            <div
              key={idx}
              className="flex items-center gap-10 text-xs font-mono text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors cursor-default whitespace-nowrap"
            >
              <span>{tech}</span>
              <span className="text-zinc-300 dark:text-zinc-700">&bull;</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
