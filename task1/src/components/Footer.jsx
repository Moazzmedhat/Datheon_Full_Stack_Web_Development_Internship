import { ArrowUp } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';

export default function Footer() {
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-zinc-50 dark:bg-[#09090b] text-zinc-500 py-12 px-6 border-t border-zinc-200 dark:border-white/[0.06] transition-colors duration-200">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs">
        {/* Brand & Copyright */}
        <div className="text-center sm:text-left">
          <div className="text-zinc-900 dark:text-white font-medium mb-1">
            Moaz Medhat Mahmoud
          </div>
          <div className="text-zinc-500 dark:text-zinc-400">
            &copy; {year} &bull; Built with React &amp; Tailwind CSS &bull; Cairo, Egypt
          </div>
        </div>

        {/* Links & Controls */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/Moazzmedhat"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-white/[0.08] transition-colors"
            title="GitHub"
          >
            <GithubIcon className="w-4 h-4" />
          </a>

          <a
            href="https://www.linkedin.com/in/moaz-medhat-33b681272/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/60 dark:hover:bg-white/[0.08] transition-colors"
            title="LinkedIn"
          >
            <LinkedinIcon className="w-4 h-4" />
          </a>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-white/[0.03] hover:bg-zinc-200 dark:hover:bg-white/[0.08] text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-white/[0.06] transition-colors"
          >
            <span>Top</span>
            <ArrowUp className="w-3 h-3" />
          </button>
        </div>
      </div>
    </footer>
  );
}
