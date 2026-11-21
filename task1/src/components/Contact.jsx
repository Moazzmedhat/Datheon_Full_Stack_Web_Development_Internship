import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, Copy, Check, ArrowUpRight } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const containerRef = useRef(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact-header-anim', {
        scrollTrigger: {
          trigger: '.contact-header-anim',
          start: 'top 85%',
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });

      gsap.from('.contact-channels-anim', {
        scrollTrigger: {
          trigger: '.contact-channels-anim',
          start: 'top 85%',
        },
        x: -30,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
      });

      gsap.from('.contact-form-anim', {
        scrollTrigger: {
          trigger: '.contact-form-anim',
          start: 'top 85%',
        },
        x: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('moazmedhat028@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSubmitted(false), 6000);
  };

  const directContacts = [
    {
      label: 'moazmedhat028@gmail.com',
      href: 'mailto:moazmedhat028@gmail.com',
      icon: Mail,
      title: 'Email',
    },
    {
      label: '01003465397',
      href: 'tel:01003465397',
      icon: Phone,
      title: 'Phone / WhatsApp',
    },
    {
      label: 'linkedin.com/in/moaz-medhat',
      href: 'https://www.linkedin.com/in/moaz-medhat-33b681272/',
      icon: LinkedinIcon,
      title: 'LinkedIn',
    },
    {
      label: 'github.com/Moazzmedhat',
      href: 'https://github.com/Moazzmedhat',
      icon: GithubIcon,
      title: 'GitHub',
    },
  ];

  return (
    <section 
      id="contact" 
      ref={containerRef} 
      className="py-24 px-6 bg-zinc-50 dark:bg-[#09090b] border-t border-zinc-200 dark:border-white/[0.06] transition-colors duration-200"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="contact-header-anim mb-12 sm:mb-14">
          <p className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">
            Reach Out
          </p>
          <h2 className="text-2xl sm:text-4xl font-bold text-zinc-950 dark:text-white tracking-tight">
            Let&apos;s Connect
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2 text-sm sm:text-base max-w-xl">
            Have an open role, an exciting project, or a technical inquiry? Send a message or reach out directly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Direct channels */}
          <div className="contact-channels-anim md:col-span-5 space-y-3">
            {directContacts.map((c) => {
              const Icon = c.icon;
              return (
                <a
                  key={c.title}
                  href={c.href}
                  target={c.href.startsWith('http') ? '_blank' : undefined}
                  rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.06] hover:border-zinc-300 dark:hover:border-white/[0.14] shadow-sm transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-zinc-100 dark:bg-white/[0.04] text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-zinc-900 dark:text-white tracking-tight">{c.title}</div>
                      <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">{c.label}</div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors" />
                </a>
              );
            })}

            {/* Quick Copy Button */}
            <button
              onClick={handleCopyEmail}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white dark:bg-white/[0.03] hover:bg-zinc-100 dark:hover:bg-white/[0.06] text-xs font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-white/[0.06] shadow-sm transition-colors"
            >
              {copiedEmail ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-600 dark:text-emerald-400">Email Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Copy moazmedhat028@gmail.com</span>
                </>
              )}
            </button>
          </div>

          {/* Form */}
          <div className="contact-form-anim md:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="p-6 rounded-2xl bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/[0.06] shadow-sm space-y-4"
            >
              {submitted && (
                <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                  Thank you for reaching out! Your message has been recorded.
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-3.5 py-2.5 text-xs bg-zinc-50 dark:bg-white/[0.03] rounded-lg border border-zinc-200 dark:border-white/[0.08] text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-white/30 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="name@company.com"
                  className="w-full px-3.5 py-2.5 text-xs bg-zinc-50 dark:bg-white/[0.03] rounded-lg border border-zinc-200 dark:border-white/[0.08] text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-white/30 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Message
                </label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Hi Moaz, let's talk about..."
                  className="w-full px-3.5 py-2.5 text-xs bg-zinc-50 dark:bg-white/[0.03] rounded-lg border border-zinc-200 dark:border-white/[0.08] text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-400 dark:focus:border-white/30 transition-colors resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-medium text-xs rounded-lg transition-colors active:scale-95 shadow-sm"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
