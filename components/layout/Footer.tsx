import React from 'react';
import { Heart, Github, Linkedin, Twitter, Mail, ArrowUp, Code2, Sparkles, Zap } from 'lucide-react';

const footerStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;900&display=swap');

  #footer { font-family: 'Cabinet Grotesk', sans-serif; }

  /* Shimmer text */
  @keyframes shimmer-pan {
    0%   { background-position: 0% center; }
    100% { background-position: 200% center; }
  }
  .footer-shimmer {
    background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer-pan 5s linear infinite;
  }

  /* Heart beat */
  @keyframes heartbeat {
    0%, 100% { transform: scale(1); }
    10%, 30% { transform: scale(1.1); }
    20%, 40% { transform: scale(0.95); }
  }
  .footer-heart { animation: heartbeat 1.5s ease-in-out infinite; }

  /* Social icon hover */
  .footer-social {
    transition: all 0.3s ease;
  }
  .footer-social:hover {
    transform: translateY(-4px) scale(1.1) rotate(5deg);
  }

  /* Link hover */
  .footer-link {
    position: relative;
    transition: color 0.3s ease;
  }
  .footer-link::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
    transition: width 0.3s ease;
  }
  .footer-link:hover::after { width: 100%; }

  /* Back to top button */
  .footer-top-btn {
    transition: all 0.3s ease;
  }
  .footer-top-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(59,130,246,0.3);
  }

  /* Orb pulse */
  @keyframes orb-pulse {
    0%, 100% { opacity: 0.08; transform: scale(1); }
    50%       { opacity: 0.15; transform: scale(1.05); }
  }
  .footer-orb { animation: orb-pulse 8s ease-in-out infinite; }
`;

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    explore: [
      { name: 'Home', href: '#home' },
      { name: 'About', href: '#about' },
      { name: 'Projects', href: '#projects' },
      { name: 'Contact', href: '#contact' },
      { name: 'Help & Support', href: '/support' },
      { name: 'Terms & Conditions', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
    ],
    social: [
      { icon: Github, href: 'https://github.com/rahimmishu/rahim-saroar', label: 'GitHub' },
      { icon: Linkedin, href: 'https://www.linkedin.com/in/rahim-saroar/', label: 'LinkedIn' },
      { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
      { icon: Mail, href: 'mailto:rahimsaroarmishu@gmail.com', label: 'Email' },
    ],
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: footerStyles }} />

      <footer
        id="footer"
        className="relative py-16 overflow-hidden transition-colors duration-500 border-t bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-black dark:via-zinc-950 dark:to-black border-slate-200/80 dark:border-white/8"
      >
        {/* Background Glows */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="footer-orb absolute -top-20 left-[10%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]" />
          <div className="footer-orb absolute -bottom-20 right-[10%] w-[350px] h-[350px] bg-purple-500/10 rounded-full blur-[90px]" />
          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="container relative z-10 px-4 mx-auto md:px-8">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 gap-12 pb-12 border-b md:grid-cols-3 border-slate-200/60 dark:border-zinc-800/60">
            
            {/* Brand Section */}
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                  <Code2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  Rahim <span className="footer-shimmer">Saroar</span>
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Transforming ideas into reality through code. Building the future, one project at a time.
              </p>
              <div className="flex items-center justify-center gap-2 mt-4 text-sm md:justify-start text-slate-500 dark:text-slate-500">
                <Zap size={14} className="text-yellow-400" />
                <span className="font-semibold">Available for Freelance Work</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="text-center">
              <h4 className="text-[11px] font-bold tracking-[0.3em] text-slate-400 uppercase mb-4 flex items-center justify-center gap-2">
                <Sparkles size={11} />
                Explore
              </h4>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-3 max-w-[280px] mx-auto">
            {footerLinks.explore.map((link, i) => (
              <li key={i}>
                    <a
                      href={link.href}
                      className="inline-block text-sm font-semibold footer-link text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social & Contact */}
            <div className="text-center md:text-right">
              <h4 className="text-[11px] font-bold tracking-[0.3em] text-slate-400 uppercase mb-4 flex items-center justify-center md:justify-end gap-2">
                <Sparkles size={11} />
                Connect
              </h4>
              <div className="flex justify-center gap-3 mb-4 md:justify-end">
                {footerLinks.social.map((social, i) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={i}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="p-3 bg-white border footer-social dark:bg-zinc-900/70 border-slate-200 dark:border-zinc-800 rounded-xl text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-400/50 dark:hover:border-blue-500/40"
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-500">
                Let's build something amazing together
              </p>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col items-center justify-between gap-4 pt-8 md:flex-row">
            <p className="text-sm text-slate-500 dark:text-slate-500">
              © 2026{' '}
              <span className="font-bold text-slate-700 dark:text-slate-400">Rahim Saroar Mishu</span>. Made
              with{' '}
              <Heart className="inline w-4 h-4 footer-heart text-rose-500" fill="currentColor" /> and{' '}
              <span className="font-bold text-blue-500">React</span>
            </p>

            {/* Back to Top Button */}
            <button
              onClick={scrollToTop}
              className="footer-top-btn inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg"
              aria-label="Back to top"
            >
              Back to Top
              <ArrowUp size={14} />
            </button>
          </div>

          {/* Tech Stack Badge */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-8 mt-8 border-t border-slate-200/60 dark:border-zinc-800/60">
            <span className="text-[10px] font-semibold text-slate-400 tracking-wider">BUILT WITH:</span>
            {['React', 'TypeScript', 'Tailwind CSS', 'Lucide Icons'].map((tech, i) => (
              <span
                key={i}
                className="px-3 py-1 text-[10px] font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;