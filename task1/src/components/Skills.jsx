import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Smartphone, Server, Database, Cpu, CheckCircle2, Search, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const skillGroups = [
  {
    category: 'Frontend & Mobile',
    icon: Smartphone,
    desc: 'Responsive web applications, cross-platform mobile apps, and performant UI architectures.',
    skills: [
      { name: 'React Native & Expo', level: 'Production', highlight: true },
      { name: 'React.js (v18/19)', level: 'Advanced', highlight: true },
      { name: 'TypeScript', level: 'Production', highlight: true },
      { name: 'JavaScript (ES6+)', level: 'Expert', highlight: false },
      { name: 'Angular (MEAN)', level: 'Certified (90%)', highlight: true },
      { name: 'Next.js', level: 'Proficient', highlight: false },
      { name: 'Tailwind CSS', level: 'Advanced', highlight: false },
      { name: 'HTML5 & CSS3', level: 'Expert', highlight: false },
    ],
  },
  {
    category: 'Backend & APIs',
    icon: Server,
    desc: 'Distributed systems, event-driven architectures, WebSocket streams, and REST microservices.',
    skills: [
      { name: 'Node.js & Express.js', level: 'Production', highlight: true },
      { name: 'Socket.IO (Real-Time)', level: 'Advanced', highlight: true },
      { name: 'JWT & RBAC Security', level: 'Production', highlight: true },
      { name: 'RESTful Microservices', level: 'Advanced', highlight: true },
      { name: 'Python', level: 'APIs & Data', highlight: true },
      { name: 'PHP & C++', level: 'Core CS', highlight: false },
      { name: 'QR Code & Media APIs', level: 'Production', highlight: false },
    ],
  },
  {
    category: 'Databases & Cloud',
    icon: Database,
    desc: 'Relational & NoSQL persistence layers, cloud serverless endpoints, and ORM abstractions.',
    skills: [
      { name: 'MongoDB (Mongoose)', level: 'MEAN Track', highlight: true },
      { name: 'Prisma ORM', level: 'Production', highlight: true },
      { name: 'Supabase & PostgreSQL', level: 'Production', highlight: true },
      { name: 'MySQL & SQLite', level: 'Proficient', highlight: false },
      { name: 'Git & GitHub', level: 'Expert', highlight: false },
      { name: 'Postman & API Testing', level: 'Advanced', highlight: false },
      { name: 'Vercel Serverless', level: 'Deployment', highlight: false },
    ],
  },
  {
    category: 'AI & Data Science',
    icon: Cpu,
    desc: 'Generative AI integrations, causal machine learning, document OCR, and LLM reasoning pipelines.',
    skills: [
      { name: 'Google Gemini API', level: 'LLM Pipelines', highlight: true },
      { name: 'Python EconML', level: 'Causal Inference', highlight: true },
      { name: 'SHAP Interpretability', level: 'Attribution', highlight: false },
      { name: 'OCR Space & Vision AI', level: 'Document OCR', highlight: true },
      { name: 'Autonomous Agents', level: 'Applied AI', highlight: false },
    ],
  },
];

const coreStrengths = [
  { title: 'System Architecture', desc: 'Designing modular microservices, REST APIs, and type-safe data contracts.' },
  { title: 'Full-Stack Delivery', desc: 'Connecting fluid React & React Native interfaces with robust Node backends.' },
  { title: 'Applied AI Integration', desc: 'Leveraging LLMs and predictive causal models for pragmatic product features.' },
  { title: 'Code Quality & Reviews', desc: 'Writing documented, clean code with Git workflow and PR review discipline.' },
];

export default function Skills() {
  const containerRef = useRef(null);
  const [skillSearch, setSkillSearch] = useState('');

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Safe entrance animation with clearProps so elements can NEVER get stuck hidden
      gsap.fromTo(
        '.skills-header-anim',
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          clearProps: 'all',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 90%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        '.skill-card-anim',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power2.out',
          clearProps: 'all',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        '.strengths-card-anim',
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          clearProps: 'all',
          scrollTrigger: {
            trigger: '.strengths-card-anim',
            start: 'top 90%',
            once: true,
          },
        }
      );
    }, containerRef);

    // Refresh ScrollTrigger to ensure accurate layout calculations
    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="skills" 
      ref={containerRef} 
      className="py-24 px-6 bg-zinc-50 dark:bg-[#09090b] border-t border-zinc-200 dark:border-white/[0.06] transition-colors duration-200"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="skills-header-anim mb-12 sm:mb-14 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">
              Capabilities
            </p>
            <h2 className="text-2xl sm:text-4xl font-bold text-zinc-950 dark:text-white tracking-tight">
              Technical Stack &amp; Skills
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mt-2 text-sm sm:text-base max-w-xl">
              A comprehensive catalog of languages, frameworks, databases, and applied AI tools I work with daily.
            </p>
          </div>

          {/* Quick Skill Filter / Search */}
          <div className="w-full sm:w-64 relative">
            <input
              type="text"
              value={skillSearch}
              onChange={(e) => setSkillSearch(e.target.value)}
              placeholder="Search skills (e.g. React, Node, AI)..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-white/[0.03] rounded-lg border border-zinc-200 dark:border-white/[0.08] text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-white/30 transition-colors shadow-sm"
            />
            <Search className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* 4 Skill Categories Grid */}
        <div className="skill-cards-grid grid grid-cols-1 md:grid-cols-2 gap-5 mb-12 sm:mb-14">
          {skillGroups.map((group) => {
            const Icon = group.icon;
            const filteredSkills = skillSearch.trim() === ''
              ? group.skills
              : group.skills.filter((s) => s.name.toLowerCase().includes(skillSearch.toLowerCase()));

            if (skillSearch.trim() !== '' && filteredSkills.length === 0) return null;

            return (
              <div
                key={group.category}
                className="skill-card-anim p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111114] border border-zinc-200 dark:border-white/[0.08] hover:border-zinc-300 dark:hover:border-white/[0.16] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-2 pb-3 border-b border-zinc-100 dark:border-white/[0.06]">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-zinc-100 dark:bg-white/[0.04] text-zinc-800 dark:text-zinc-200">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-white tracking-tight">
                        {group.category}
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
                      {filteredSkills.length} skills
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-4 line-clamp-1">
                    {group.desc}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {filteredSkills.map((skill) => (
                      <div
                        key={skill.name}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-50 dark:bg-white/[0.02] border border-zinc-100 dark:border-white/[0.04] hover:border-zinc-300 dark:hover:border-white/[0.1] transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          {skill.highlight && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]"></span>
                          )}
                          <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
                            {skill.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 bg-white dark:bg-black/40 px-1.5 py-0.5 rounded border border-zinc-200/50 dark:border-white/[0.05]">
                          {skill.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Core Strengths */}
        <div className="strengths-card-anim p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#111114] border border-zinc-200 dark:border-white/[0.08] shadow-sm">
          <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Engineering Methodology &amp; Discipline</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {coreStrengths.map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-200 mb-1">{item.title}</h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
