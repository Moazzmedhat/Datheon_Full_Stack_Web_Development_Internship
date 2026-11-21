import { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, FileText } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { GithubIcon, LinkedinIcon } from './Icons';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('about');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Smooth active section tracking
      const sections = ['about', 'skills', 'projects', 'experience', 'education', 'contact'];
      const scrollPosition = window.scrollY + 120;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 dark:bg-[#09090b]/85 backdrop-blur-md border-b border-zinc-200/80 dark:border-white/[0.08] py-3.5 shadow-sm'
          : 'bg-transparent py-5'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Brand */}
        <a
          href="#about"
          className="group inline-flex items-center gap-2.5 text-zinc-900 dark:text-white font-semibold text-sm tracking-tight"
        >
          <span className="w-6 h-6 rounded-md bg-zinc-900 dark:bg-white text-white dark:text-black font-bold text-xs flex items-center justify-center tracking-tighter shadow-sm">
            M
          </span>
          <span>Moaz Medhat</span>
          <span className="hidden sm:inline-block text-xs font-normal text-zinc-500 font-mono">
            / full-stack
          </span>
        </a>

        {/* Center Nav Links with active indicator */}
        <div className="hidden md:flex items-center gap-1 bg-zinc-100/80 dark:bg-white/[0.03] p-1 rounded-full border border-zinc-200/60 dark:border-white/[0.06]">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.substring(1);
            return (
              <a
                key={link.href}
                href={link.href}
                className={`text-xs font-medium px-3.5 py-1.5 rounded-full transition-all ${
                  isActive
                    ? 'bg-white dark:bg-white/10 text-zinc-900 dark:text-white shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        {/* Right Actions: Theme Toggle + Resume + Contact */}
        <div className="flex items-center gap-2.5">
          {/* Dark / Light Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-white/[0.08] border border-zinc-200 dark:border-white/[0.08] transition-colors"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-700" />
            )}
          </button>

          {/* Social Links */}
          <a
            href="https://github.com/Moazzmedhat"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-flex p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-white/[0.08] border border-zinc-200 dark:border-white/[0.08] transition-colors"
            title="GitHub Profile"
          >
            <GithubIcon className="w-3.5 h-3.5" />
          </a>

          <a
            href="https://www.linkedin.com/in/moaz-medhat-33b681272/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:inline-flex p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-white/[0.08] border border-zinc-200 dark:border-white/[0.08] transition-colors"
            title="LinkedIn Profile"
          >
            <LinkedinIcon className="w-3.5 h-3.5" />
          </a>

          {/* Resume Download Link */}
          <a
            href="/Moaz_Medhat_CV.pdf"
            download="Moaz_Medhat_CV.pdf"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-lg text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-white/[0.04] hover:bg-zinc-200 dark:hover:bg-white/[0.08] border border-zinc-200 dark:border-white/[0.08] transition-colors"
            title="Download CV"
          >
            <FileText className="w-3.5 h-3.5 text-zinc-500" />
            <span>CV</span>
          </a>

          {/* Contact Button */}
          <a
            href="#contact"
            className="hidden sm:inline-flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black font-medium text-xs px-4 py-2 rounded-lg transition-colors active:scale-95 shadow-sm"
          >
            Get in Touch
          </a>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-white/[0.05] transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-[#09090b] border-b border-zinc-200 dark:border-white/[0.08] px-6 py-4 space-y-2 shadow-lg">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.05] transition-colors"
            >
              {link.label}
            </a>
          ))}
          {/* Mobile Theme Switcher */}
          <div className="pt-1">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-white/[0.04] text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-white/[0.08] transition-colors"
            >
              <span>Theme: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-zinc-700" />
              )}
            </button>
          </div>

          {/* Mobile Social Links */}
          <div className="flex items-center gap-2 pt-1">
            <a
              href="https://github.com/Moazzmedhat"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.08]"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/moaz-medhat-33b681272/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-white/[0.04] border border-zinc-200 dark:border-white/[0.08]"
            >
              <LinkedinIcon className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
            </a>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <a
              href="/Moaz_Medhat_CV.pdf"
              download="Moaz_Medhat_CV.pdf"
              onClick={() => setMenuOpen(false)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-white/[0.04] text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-white/[0.08]"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Download CV</span>
            </a>
            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="flex-1 inline-flex items-center justify-center bg-zinc-900 dark:bg-white text-white dark:text-black font-medium py-2.5 rounded-lg text-xs shadow-sm"
            >
              Get in Touch
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
