import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

// ------------------------------------------
// 1. Social Links Configuration (আপনার দেওয়া ডাটা)
// ------------------------------------------
interface SocialLink {
  name: string;
  url: string;
  iconPath: string;
  viewBox?: string;
  colorClass: string;
}

const SOCIAL_LINKS: SocialLink[] = [
  {
    name: "GitHub",
    url: "https://github.com/rahimmishu",
    colorClass: "hover:text-gray-100",
    viewBox: "0 0 24 24",
    iconPath: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/@rahim.saroar",
    colorClass: "hover:text-red-600",
    viewBox: "0 0 24 24",
    iconPath: "M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/rahim_saroar_mishu/",
    colorClass: "hover:text-pink-600",
    viewBox: "0 0 24 24",
    iconPath: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
  },
  {
    name: "Telegram",
    url: "https://t.me/rahim_saroar_mishu",
    colorClass: "hover:text-sky-500",
    viewBox: "0 0 24 24",
    iconPath: "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"
  },
  {
    name: "Threads",
    url: "https://www.threads.net/@rahim_saroar_mishu",
    colorClass: "hover:text-white",
    viewBox: "0 0 24 24",
    iconPath: "M17.74 24.245C13.29 24.245 12 21.001 12 18.026V16.81C12 16.533 12.235 16.307 12.523 16.307H14.125C14.413 16.307 14.648 16.533 14.648 16.81V18.026C14.648 20.312 15.485 21.758 17.74 21.758C19.866 21.758 20.57 20.218 20.57 18.736V16.273C19.92 16.85 18.913 17.29 17.765 17.29C14.773 17.29 12.13 15.003 12.13 11.52C12.13 8.01 14.773 5.75 17.765 5.75C18.913 5.75 19.92 6.189 20.57 6.767V6.023C20.57 5.746 20.806 5.52 21.094 5.52H22.695C22.983 5.52 23.218 5.746 23.218 6.023V18.736C23.218 21.65 21.468 24.245 17.74 24.245ZM17.765 8.169C16.143 8.169 14.778 9.387 14.778 11.52C14.778 13.626 16.143 14.871 17.765 14.871C19.362 14.871 20.57 13.626 20.57 11.52C20.57 9.387 19.362 8.169 17.765 8.169ZM17.74 0.25C8.085 0.25 0.25 8.085 0.25 17.74C0.25 27.395 8.085 35.23 17.74 35.23C27.395 35.23 35.23 27.395 35.23 17.74C35.23 8.085 27.395 0.25 17.74 0.25Z"
  },
  {
    name: "TikTok",
    url: "https://www.tiktok.com/@rhythm_of_peace",
    colorClass: "hover:text-pink-500",
    viewBox: "0 0 24 24",
    iconPath: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.35-1.11 1.02-1.19 1.75-.24 1.33.24 2.8 1.37 3.65.86.68 2.05.8 3.1.51 1.02-.32 1.83-1.19 1.83-2.3 0-2.35 0-4.69.01-7.04.01-2.48-.01-4.96.01-7.44h4.05Z"
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/rahimsaroar",
    colorClass: "hover:text-blue-600",
    viewBox: "0 0 24 24",
    iconPath: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
  },
  {
    name: "WhatsApp",
    url: "https://wa.link/0smu34",
    colorClass: "hover:text-green-500",
    viewBox: "0 0 24 24",
    iconPath: "M.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
  }
];

const Contact: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // 🔴 আপনার EmailJS এর আইডিগুলো এখানে বসাবেন
  const SERVICE_ID = "service_8d5vc4m";   // যেমন: service_xyz
  const TEMPLATE_ID = "template_tk3oc0r"; // যেমন: template_abc
  const PUBLIC_KEY = "venO-69iu_6ZPZi4L";   // যেমন: user_123xyz

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formRef.current) {
      emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
        .then((result) => {
            console.log(result.text);
            setLoading(false);
            setStatus('success');
            setTimeout(() => setStatus('idle'), 5000);
            formRef.current?.reset();
        }, (error) => {
            console.log(error.text);
            setLoading(false);
            setStatus('error');
        });
    }
  };

  return (
    <section id="contact" className="py-24 bg-slate-900 dark:bg-slate-950 text-white transition-colors duration-300 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-500/5 blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            Let's <span className="text-blue-500">Connect</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Have a project in mind, want to discuss technology, or just say hi? I'm always open to new opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-start">
          
          {/* 2. Left Side: Contact Info (Vertical Stack) */}
          <div className="flex flex-col gap-6">
             {/* Address */}
             <div className="bg-slate-800 dark:bg-slate-900 p-6 rounded-2xl flex items-center gap-6 border border-slate-700 dark:border-slate-800 hover:border-blue-500/50 transition-colors">
                <div className="w-14 h-14 bg-slate-900 dark:bg-slate-950 rounded-full flex items-center justify-center text-blue-500 shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Address</h3>
                  <p className="text-slate-400">Joypurhat, Bangladesh</p>
                </div>
             </div>

             {/* Phone */}
             <a href="tel:+8801749896809" className="bg-slate-800 dark:bg-slate-900 p-6 rounded-2xl flex items-center gap-6 border border-slate-700 dark:border-slate-800 hover:border-green-500/50 transition-colors group">
                <div className="w-14 h-14 bg-slate-900 dark:bg-slate-950 rounded-full flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Phone</h3>
                  <p className="text-slate-400 font-mono">+880 1749-896809</p>
                </div>
             </a>

             {/* Email */}
             <a href="mailto:rahimsaroarmishu@gmail.com" className="bg-slate-800 dark:bg-slate-900 p-6 rounded-2xl flex items-center gap-6 border border-slate-700 dark:border-slate-800 hover:border-orange-500/50 transition-colors group">
                <div className="w-14 h-14 bg-slate-900 dark:bg-slate-950 rounded-full flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Email</h3>
                  <p className="text-slate-400 text-sm break-all">rahimsaroarmishu@gmail.com</p>
                </div>
             </a>
          </div>

          {/* 3. Right Side: Message Form (New Feature) */}
          <div className="bg-slate-800 dark:bg-slate-900 p-8 rounded-2xl border border-slate-700 dark:border-slate-800 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>
            <form ref={formRef} onSubmit={sendEmail} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm text-slate-400 font-medium">Your Name</label>
                        <input 
                            type="text" 
                            name="user_name" 
                            required
                            placeholder="John Doe"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-slate-400 font-medium">Your Email</label>
                        <input 
                            type="email" 
                            name="user_email" 
                            required
                            placeholder="john@example.com"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-slate-400 font-medium">Message</label>
                    <textarea 
                        name="message" 
                        rows={4} 
                        required
                        placeholder="Hello, I'd like to talk about..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                    ></textarea>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>Sending <Loader2 size={20} className="animate-spin" /></>
                    ) : (
                        <>Send Message <Send size={20} /></>
                    )}
                </button>

                {/* Status Messages */}
                {status === 'success' && (
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3 text-green-400 animate-in fade-in slide-in-from-bottom-2">
                        <CheckCircle size={20} />
                        <span>Message sent successfully! I'll reply soon.</span>
                    </div>
                )}
                
                {status === 'error' && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 animate-in fade-in slide-in-from-bottom-2">
                        <AlertCircle size={20} />
                        <span>Something went wrong. Please check your IDs.</span>
                    </div>
                )}
            </form>
          </div>

        </div>

        {/* 4. Social Media Section (Exact same icons as before) */}
        <div className="border-t border-slate-800 pt-16 text-center">
            <h3 className="text-2xl font-bold mb-10 text-slate-200">Connect on Socials</h3>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                {SOCIAL_LINKS.map((link) => (
                    <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className={`text-slate-400 transition-all duration-300 transform hover:scale-110 ${link.colorClass}`}
                        aria-label={link.name}
                    >
                        <svg 
                            viewBox={link.viewBox} 
                            fill="currentColor" 
                            className="w-8 h-8 md:w-10 md:h-10"
                        >
                            <path d={link.iconPath} />
                        </svg>
                    </a>
                ))}
            </div>
        </div>

      </div>
    </section>
  );
};

export default Contact;