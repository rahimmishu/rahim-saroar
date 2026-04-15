import React, { useState, useEffect, useRef } from 'react';
import { Mail, MessageSquare, Send, Github, Linkedin, Twitter, Phone, MapPin, Sparkles, Zap, CheckCircle2 } from 'lucide-react';

const contactStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;900&display=swap');

  #contact { font-family: 'Cabinet Grotesk', sans-serif; }

  /* Shimmer heading */
  @keyframes shimmer-pan {
    0%   { background-position: 0% center; }
    100% { background-position: 200% center; }
  }
  .contact-shimmer-text {
    background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer-pan 5s linear infinite;
  }

  /* Floating badges */
  @keyframes float-a {
    0%, 100% { transform: translateY(0) rotate(-1deg); }
    50%       { transform: translateY(-12px) rotate(2deg); }
  }
  @keyframes float-b {
    0%, 100% { transform: translateY(0) rotate(1deg); }
    50%       { transform: translateY(-16px) rotate(-2deg); }
  }
  .contact-badge-a { animation: float-a 4s ease-in-out infinite; }
  .contact-badge-b { animation: float-b 5s ease-in-out infinite; animation-delay: -2.5s; }

  /* Rotating ring */
  @keyframes spin-slow { to { transform: rotate(360deg); } }
  .contact-ring { animation: spin-slow 12s linear infinite; }

  /* Orb pulse */
  @keyframes orb-pulse {
    0%, 100% { opacity: 0.12; transform: scale(1); }
    50%       { opacity: 0.22; transform: scale(1.08); }
  }
  .contact-orb-1 { animation: orb-pulse 7s ease-in-out infinite; }
  .contact-orb-2 { animation: orb-pulse 9s ease-in-out infinite; animation-delay: -4s; }

  /* Submit button shine */
  .contact-submit-btn {
    position: relative;
    overflow: hidden;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }
  .contact-submit-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transform: translateX(-100%);
    transition: transform 0.5s ease;
  }
  .contact-submit-btn:hover::after  { transform: translateX(100%); }
  .contact-submit-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(59,130,246,0.4); }

  /* Input focus effect */
  .contact-input {
    transition: all 0.3s ease;
  }
  .contact-input:focus {
    border-color: rgb(59 130 246 / 0.5);
    box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
  }

  /* Card hover */
  .contact-card {
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  }
  .contact-card:hover { transform: translateY(-3px); }

  /* Social icon hover */
  .contact-social {
    transition: all 0.3s ease;
  }
  .contact-social:hover {
    transform: translateY(-4px) scale(1.1);
  }

  /* Status dot */
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
  .contact-dot { animation: blink 1.8s ease-in-out infinite; }

  /* Success message slide */
  @keyframes slide-in {
    from { transform: translateY(-10px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  .contact-success {
    animation: slide-in 0.4s ease-out;
  }
`;

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  // ✅ Track timeout ref for cleanup
  const submitTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ✅ Clear any existing timeout before creating new one
    if (submitTimeoutRef.current) clearTimeout(submitTimeoutRef.current);
    
    // Handle form submission here
    setIsSubmitted(true);
    
    // ✅ Set timeout and store reference for cleanup
    submitTimeoutRef.current = setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
      submitTimeoutRef.current = null;
    }, 3000);
  };

  // ✅ Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (submitTimeoutRef.current) {
        clearTimeout(submitTimeoutRef.current);
        submitTimeoutRef.current = null;
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      value: 'rahimsaroarmishu@gmail.com',
      link: 'rahimsaroarmishu@gmail.com',
      color: 'blue'
    },
    {
      icon: Phone,
      title: 'Phone',
      value: '+880 1749-896809',
      link: 'tel:+8801749896809',
      color: 'purple'
    },
    {
      icon: MapPin,
      title: 'Location',
      value: 'Joypurhat, Bangladesh',
      link: '#',
      color: 'pink'
    }
  ];

  const socialLinks = [
    { icon: Github, link: 'https://github.com/rahimmishu/rahim-saroar', color: 'hover:text-slate-900 dark:hover:text-white' },
    { icon: Linkedin, link: 'https://www.linkedin.com/in/rahim-saroar/', color: 'hover:text-blue-600' },
    { icon: Twitter, link: 'https://twitter.com', color: 'hover:text-sky-500' },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: contactStyles }} />

      <section
        id="contact"
        className="relative py-32 overflow-hidden transition-colors duration-500 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-black dark:via-zinc-950 dark:to-black"
      >

        {/* ── Background Glows ── */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="contact-orb-1 absolute top-10 left-[-10%] w-[550px] h-[550px] bg-blue-500/10 rounded-full blur-[130px]" />
          <div className="contact-orb-2 absolute bottom-10 right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
          {/* Subtle grid lines */}
          <div className="absolute inset-0 opacity-[0.018] dark:opacity-[0.035]"
            style={{
              backgroundImage: 'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)',
              backgroundSize: '70px 70px'
            }}
          />
        </div>

        <div className="container relative z-10 px-4 mx-auto md:px-8">

          {/* ── Section Label ── */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex items-center gap-2 px-5 py-2 text-[10px] font-bold tracking-[0.3em] text-blue-600 dark:text-blue-400 uppercase border border-blue-200/70 dark:border-blue-800/50 rounded-full bg-blue-50/80 dark:bg-blue-900/15 backdrop-blur-sm">
              <Sparkles size={12} className="animate-pulse" />
              Get In Touch
              <Sparkles size={12} className="animate-pulse" />
            </div>
          </div>

          {/* ── Main Card Container ── */}
          <div className="flex flex-col lg:flex-row gap-8 p-8 md:p-12 lg:p-16 bg-white/70 dark:bg-zinc-900/40 backdrop-blur-2xl border border-slate-200/80 dark:border-white/8 rounded-[2.5rem] shadow-2xl shadow-slate-200/60 dark:shadow-[0_0_60px_rgba(0,0,0,0.6)]">

            {/* ╔═══ Left: Contact Info & Decorations ═══╗ */}
            <div className="relative flex flex-col w-full space-y-8 lg:w-2/5">

              {/* Decorative spinning ring */}
              <div className="contact-ring absolute top-20 left-1/2 -translate-x-1/2 w-[280px] h-[280px] rounded-full border border-dashed border-purple-400/20 dark:border-purple-500/15 pointer-events-none" />

              {/* Heading */}
              <div className="relative z-10 text-center lg:text-left">
                <h2 className="text-4xl font-black leading-tight md:text-5xl text-slate-900 dark:text-white">
                  Let's <span className="contact-shimmer-text">Connect</span>
                </h2>
                <p className="flex items-center justify-center gap-2 mt-3 text-base font-medium lg:justify-start text-slate-500 dark:text-slate-400">
                  <Zap size={14} className="text-yellow-400 shrink-0" />
                  I'm always open to discussing new projects & ideas
                </p>
              </div>

              {/* Contact Methods */}
              <div className="relative z-10 space-y-4">
                {contactMethods.map((method, i) => {
                  const Icon = method.icon;
                  const colorMap: Record<string, string> = {
                    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-400/50 dark:border-blue-500/40',
                    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-400/50 dark:border-purple-500/40',
                    pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 border-pink-400/50 dark:border-pink-500/40'
                  };

                  return (
                    <a
                      key={i}
                      href={method.link}
                      className="flex items-center gap-4 p-5 bg-white border contact-card dark:bg-zinc-900/50 border-slate-200 dark:border-zinc-800 rounded-2xl hover:shadow-lg group"
                    >
                      <div className={`p-3 rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${colorMap[method.color]}`}>
                        <Icon size={22} />
                      </div>
                      <div className="text-left">
                        <h4 className="text-sm font-black text-slate-900 dark:text-white">{method.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">{method.value}</p>
                      </div>
                    </a>
                  );
                })}
              </div>

              {/* Social Links */}
              <div className="relative z-10">
                <p className="text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase mb-3 text-center lg:text-left">
                  Connect on Social
                </p>
                <div className="flex justify-center gap-3 lg:justify-start">
                  {socialLinks.map((social, i) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={i}
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`contact-social p-3.5 bg-white dark:bg-zinc-900/70 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-400 ${social.color}`}
                      >
                        <Icon size={20} />
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Availability Status */}
              <div className="relative z-10 flex items-center justify-center gap-2 px-4 py-3 text-sm border lg:justify-start bg-emerald-50/80 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800/50 rounded-2xl">
                <span className="inline-block w-2 h-2 rounded-full contact-dot bg-emerald-400" />
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Available for Projects</span>
              </div>

              

              {/* Floating Badge 2 */}
              <div className="contact-badge-b absolute z-20 top-5 -right-5 hidden lg:flex items-center gap-2.5 px-4 py-3 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-700/80 rounded-2xl shadow-xl shadow-purple-100/60 dark:shadow-black/50">
                <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-xl">
                  <Zap className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-medium">Projects Done</p>
                  <p className="text-xs font-black text-slate-800 dark:text-white">15+ Successful</p>
                </div>
              </div>

            </div>

            {/* ╔═══ Right: Contact Form ═══╗ */}
            <div className="w-full lg:w-3/5">
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Name & Email Row */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block mb-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="contact-input w-full px-4 py-3.5 bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none"
                      placeholder="Rahim Saroar"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="contact-input w-full px-4 py-3.5 bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block mb-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="contact-input w-full px-4 py-3.5 bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none"
                    placeholder="Project collaboration opportunity"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block mb-2 text-sm font-bold text-slate-700 dark:text-slate-300">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="contact-input w-full px-4 py-3.5 bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none resize-none"
                    placeholder="Tell me about your project or idea..."
                  />
                </div>

                {/* Success Message */}
                {isSubmitted && (
                  <div className="flex items-center gap-3 p-4 border contact-success bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                      Message sent successfully! I'll get back to you soon.
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="inline-flex items-center justify-center w-full gap-2 px-10 py-4 text-base font-bold text-white contact-submit-btn md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl"
                >
                  Send Message <Send size={16} />
                </button>

              </form>
            </div>

          </div>

          {/* ── Bottom Note ── */}
          <div className="mt-10 text-center">
            <p className="text-sm text-slate-400 dark:text-slate-600">
              Prefer a quick chat? Email me directly at{' '}
              <a href="mailto:rahimsaroarmishu@gmail.com" className="font-bold text-blue-500 hover:underline">
                rahimsaroarmishu@gmail.com
              </a>
            </p>
          </div>

        </div>
      </section>
    </>
  );
};

export default Contact;