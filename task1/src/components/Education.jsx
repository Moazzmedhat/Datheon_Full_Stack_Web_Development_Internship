import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GraduationCap, Award } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const certifications = [
  {
    title: 'Certificate of Achievement: Front-End Internship',
    issuer: 'Elevvo',
    year: '2025',
    tag: 'Internship',
  },
  {
    title: 'Certificate of Training: MEAN-Stack Web Development',
    issuer: 'National Telecommunication Institute (NTI-ITIDA)',
    year: '2025',
    detail: 'Score: 90%',
    tag: 'Gov Track',
  },
  {
    title: 'Advanced Front-End Web Development',
    issuer: 'Information Technology Institute (ITI)',
    year: '2024',
    tag: 'Gov Institute',
  },
  {
    title: 'Freelancing Basics & Market Entry',
    issuer: 'Information Technology Institute (ITI)',
    year: '2024',
    tag: 'Professional',
  },
  {
    title: 'UI & UX Advanced Training Program',
    issuer: 'ITIDA, TIEC, Creativa & KAAF',
    year: '50 Hours',
    tag: 'Design',
  },
  {
    title: 'Tech to Market Workshop Endorsement',
    issuer: 'Sinai University',
    year: '2026',
    tag: 'Commercialization',
  },
  {
    title: 'AI Finance Hackathon: Participation Certificate',
    issuer: 'AI Finance Hackathon',
    year: '2025',
    tag: 'AI Hackathon',
  },
];

export default function Education() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.edu-header-anim', {
        scrollTrigger: {
          trigger: '.edu-header-anim',
          start: 'top 85%',
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });

      gsap.from('.edu-degree-anim', {
        scrollTrigger: {
          trigger: '.edu-degree-anim',
          start: 'top 85%',
        },
        y: 35,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });

      gsap.from('.edu-cert-anim', {
        scrollTrigger: {
          trigger: '.edu-certs-grid',
          start: 'top 85%',
        },
        y: 30,
        opacity: 0,
        stagger: 0.08,
        duration: 0.6,
        ease: 'power2.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="education" 
      ref={containerRef} 
      className="py-24 px-6 bg-zinc-50 dark:bg-[#09090b] border-t border-zinc-200 dark:border-white/[0.06] transition-colors duration-200"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="edu-header-anim mb-12 sm:mb-14">
          <p className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">
            Credentials
          </p>
          <h2 className="text-2xl sm:text-4xl font-bold text-zinc-950 dark:text-white tracking-tight">
            Education &amp; Certifications
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2 text-sm sm:text-base max-w-xl">
            Academic degree and certified professional training programs.
          </p>
        </div>

        {/* Degree Card */}
        <div className="edu-degree-anim p-6 sm:p-8 rounded-2xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.06] hover:border-zinc-300 dark:hover:border-white/[0.12] shadow-sm transition-colors mb-10">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="p-3 rounded-xl bg-zinc-100 dark:bg-white/[0.04] text-zinc-800 dark:text-white shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                <h3 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-white tracking-tight">
                  Bachelor of Science in Information Technology
                </h3>
                <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400 px-2.5 py-0.5 rounded bg-zinc-100 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.06] w-fit">
                  Graduation: May 2026
                </span>
              </div>

              <div className="text-sm text-zinc-600 dark:text-zinc-400 font-medium mb-3">
                Sinai University — Faculty of Information Technology &amp; Computer Science
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-2.5 py-1 rounded">
                  Cumulative GPA: 3.60 / 4.0
                </span>
                <span className="text-zinc-300 dark:text-zinc-700">&bull;</span>
                <span className="text-zinc-500 dark:text-zinc-400 font-mono">Arish, Egypt</span>
              </div>
            </div>
          </div>
        </div>

        {/* Certifications Grid */}
        <div>
          <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-5 flex items-center gap-2">
            <Award className="w-3.5 h-3.5" />
            <span>Professional Certifications</span>
          </h3>

          <div className="edu-certs-grid grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {certifications.map((c, idx) => (
              <div
                key={idx}
                className="edu-cert-anim p-4 rounded-xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.06] hover:border-zinc-300 dark:hover:border-white/[0.1] shadow-sm transition-colors flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-200 leading-snug mb-1">
                    {c.title}
                  </h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">{c.issuer}</p>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-zinc-100 dark:border-white/[0.04] text-[10px] font-mono text-zinc-500">
                  <span>{c.tag}</span>
                  <span>{c.detail ? c.detail : c.year}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
