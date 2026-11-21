import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, MapPin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const experienceAndTraining = [
  {
    role: 'Front-End Web Development Intern',
    organization: 'Elevvo',
    location: 'Remote',
    date: 'August 2025',
    tag: 'Internship',
    bullets: [
      'Built and maintained responsive web interfaces following modern accessibility and usability guidelines.',
      'Collaborated with senior engineers to optimize front-end UI performance and streamline component lifecycles.',
      'Participated in Git pull requests, branch management, and peer code reviews.',
    ],
  },
  {
    role: 'Summer Training: MEAN-Stack Web Development',
    organization: 'National Telecommunication Institute (NTI-ITIDA)',
    location: 'Egypt',
    date: 'August 2025',
    tag: '120-Hour Track • Score 90%',
    bullets: [
      'Completed an intensive 120-hour professional track (90 hrs technical instruction + 30 hrs freelancing methodology) with a final grade of 90%.',
      'Architected, tested, and deployed full-stack web applications using MongoDB, Express.js, Angular, and Node.js.',
    ],
  },
  {
    role: 'Summer Training: Front-End Web Development',
    organization: 'Information Technology Institute (ITI)',
    location: 'Remote',
    date: 'July - August 2024',
    tag: 'Engineering Training',
    bullets: [
      'Converted complex client wireframes into responsive, cross-browser web interfaces using modern HTML5, CSS3, and JavaScript.',
      'Refactored legacy codebases to improve execution speed and DOM rendering performance.',
    ],
  },
  {
    role: 'UI & UX Advanced Training Program',
    organization: 'ITIDA, TIEC, Creativa & KAAF',
    location: 'Egypt',
    date: '50 Hours Intensive',
    tag: 'Design Systems',
    bullets: [
      'Studied user-centered research, information architecture, wireframing, and interactive design prototypes.',
    ],
  },
  {
    role: 'Tech to Market Workshop',
    organization: 'Sinai University',
    location: 'Egypt',
    date: 'May 2026',
    tag: 'Product Strategy',
    bullets: [
      'Engaged in product commercialization, market readiness assessments, and developer-to-market workflows.',
    ],
  },
];

export default function Experience() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.exp-header-anim', {
        scrollTrigger: {
          trigger: '.exp-header-anim',
          start: 'top 85%',
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });

      gsap.from('.exp-item-anim', {
        scrollTrigger: {
          trigger: '.exp-timeline-anim',
          start: 'top 80%',
        },
        x: -25,
        opacity: 0,
        stagger: 0.15,
        duration: 0.7,
        ease: 'power2.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="experience" 
      ref={containerRef} 
      className="py-24 px-6 bg-zinc-50 dark:bg-[#09090b] border-t border-zinc-200 dark:border-white/[0.06] transition-colors duration-200"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="exp-header-anim mb-12 sm:mb-14">
          <p className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">
            History
          </p>
          <h2 className="text-2xl sm:text-4xl font-bold text-zinc-950 dark:text-white tracking-tight">
            Experience &amp; Training
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2 text-sm sm:text-base max-w-xl">
            My professional internships, institute fellowships, and engineering tracks.
          </p>
        </div>

        {/* Minimal Timeline */}
        <div className="exp-timeline-anim relative pl-6 sm:pl-8 border-l border-zinc-200 dark:border-white/[0.08] space-y-8 sm:space-y-10">
          {experienceAndTraining.map((item, idx) => (
            <div key={idx} className="exp-item-anim relative">
              {/* Dot */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3 h-3 rounded-full bg-zinc-300 dark:bg-zinc-700 border-2 border-zinc-50 dark:border-[#09090b]"></div>

              <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.06] hover:border-zinc-300 dark:hover:border-white/[0.12] shadow-sm transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-white tracking-tight">
                    {item.role}
                  </h3>
                  <span className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400 px-2.5 py-0.5 rounded bg-zinc-100 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.06] w-fit">
                    {item.tag}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-zinc-500 font-mono mb-4">
                  <span className="text-zinc-700 dark:text-zinc-300 font-medium">{item.organization}</span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
                    {item.date}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
                    {item.location}
                  </span>
                </div>

                <ul className="space-y-1.5">
                  {item.bullets.map((b, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      <span className="text-zinc-400 dark:text-zinc-600 mt-0.5">&bull;</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
