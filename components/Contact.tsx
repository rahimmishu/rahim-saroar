import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

// ------------------------------------------
// Social Links Configuration
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
  },
  {
    name: "Telegram",
    url: "https://t.me/rahim_saroar_mishu",
    colorClass: "hover:text-sky-500",
    viewBox: "0 0 24 24",
    iconPath: "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"
  },
  {
    name: "TikTok",
    url: "https://www.tiktok.com/@rhythm_of_peace",
    colorClass: "hover:text-pink-500",
    viewBox: "0 0 24 24",
    iconPath: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.35-1.11 1.02-1.19 1.75-.24 1.33.24 2.8 1.37 3.65.86.68 2.05.8 3.1.51 1.02-.32 1.83-1.19 1.83-2.3 0-2.35 0-4.69.01-7.04.01-2.48-.01-4.96.01-7.44h4.05Z"
  }
];

const Contact: React.FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const SERVICE_ID = "service_8d5vc4m"; 
  const TEMPLATE_ID = "template_tk3oc0r"; 
  const PUBLIC_KEY = "venO-69iu_6ZPZi4L"; 

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
    // 🔥 Update 1: Reduced py-24 to py-12 for mobile
    <section id="contact" className="relative py-12 overflow-hidden text-white transition-colors duration-300 md:py-24 bg-slate-900 dark:bg-slate-950">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-500/5 blur-[100px] pointer-events-none"></div>

      <div className="container relative z-10 px-4 mx-auto md:px-8">
        
        {/* Header */}
        <div className="mb-10 text-center md:mb-16">
          {/* 🔥 Update 2: Reduced font size for mobile */}
          <h2 className="mb-3 text-2xl font-extrabold text-white md:text-5xl md:mb-4">
            Let's <span className="text-blue-500">Connect</span>
          </h2>
          <p className="max-w-xl mx-auto text-sm text-slate-400 md:text-base">
            Have a project in mind, want to discuss technology, or just say hi? I'm always open to new opportunities.
          </p>
        </div>

        <div className="grid items-start grid-cols-1 gap-8 mb-10 lg:grid-cols-2 md:gap-12 md:mb-16">
          
          {/* 2. Left Side: Contact Info (COMPACT FOR MOBILE) */}
          <div className="flex flex-col gap-4 md:gap-6">
             {/* Address */}
             {/* 🔥 Update 3: p-4 and smaller icons for mobile */}
             <div className="flex items-center gap-4 p-4 transition-colors border bg-slate-800 dark:bg-slate-900 md:p-6 rounded-2xl md:gap-6 border-slate-700 dark:border-slate-800 hover:border-blue-500/50">
                <div className="flex items-center justify-center w-10 h-10 text-blue-500 rounded-full md:w-14 md:h-14 bg-slate-900 dark:bg-slate-950 shrink-0">
                  <MapPin size={20} className="md:w-6 md:h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white md:text-lg">Address</h3>
                  <p className="text-sm text-slate-400 md:text-base">Joypurhat, Bangladesh</p>
                </div>
             </div>

             {/* Phone */}
             <a href="tel:+8801749896809" className="flex items-center gap-4 p-4 transition-colors border bg-slate-800 dark:bg-slate-900 md:p-6 rounded-2xl md:gap-6 border-slate-700 dark:border-slate-800 hover:border-green-500/50 group">
                <div className="flex items-center justify-center w-10 h-10 text-green-500 transition-transform rounded-full md:w-14 md:h-14 bg-slate-900 dark:bg-slate-950 group-hover:scale-110 shrink-0">
                  <Phone size={20} className="md:w-6 md:h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white md:text-lg">Phone</h3>
                  <p className="font-mono text-sm text-slate-400 md:text-base">+880 1749-896809</p>
                </div>
             </a>

             {/* Email */}
             <a href="mailto:rahimsaroarmishu@gmail.com" className="flex items-center gap-4 p-4 transition-colors border bg-slate-800 dark:bg-slate-900 md:p-6 rounded-2xl md:gap-6 border-slate-700 dark:border-slate-800 hover:border-orange-500/50 group">
                <div className="flex items-center justify-center w-10 h-10 text-orange-500 transition-transform rounded-full md:w-14 md:h-14 bg-slate-900 dark:bg-slate-950 group-hover:scale-110 shrink-0">
                  <Mail size={20} className="md:w-6 md:h-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-white md:text-lg">Email</h3>
                  <p className="text-xs break-all text-slate-400 md:text-sm">rahimsaroarmishu@gmail.com</p>
                </div>
             </a>
          </div>

          {/* 3. Right Side: Message Form (COMPACT FOR MOBILE) */}
          <div className="p-5 border shadow-2xl bg-slate-800 dark:bg-slate-900 md:p-8 rounded-2xl border-slate-700 dark:border-slate-800">
            <h3 className="mb-4 text-xl font-bold text-white md:text-2xl md:mb-6">Send a Message</h3>
            <form ref={formRef} onSubmit={sendEmail} className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Your Name</label>
                        <input 
                            type="text" 
                            name="user_name" 
                            required
                            placeholder="John Doe"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 md:py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm md:text-base"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400">Your Email</label>
                        <input 
                            type="email" 
                            name="user_email" 
                            required
                            placeholder="john@example.com"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 md:py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm md:text-base"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">Message</label>
                    <textarea 
                        name="message" 
                        rows={4} 
                        required
                        placeholder="Hello, I'd like to talk about..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 md:py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none text-sm md:text-base"
                    ></textarea>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="flex items-center justify-center w-full gap-2 py-3 text-sm font-bold text-white transition-all bg-blue-600 rounded-lg md:py-4 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed md:text-base"
                >
                    {loading ? (
                        <>Sending <Loader2 size={18} className="animate-spin" /></>
                    ) : (
                        <>Send Message <Send size={18} /></>
                    )}
                </button>

                {status === 'success' && (
                    <div className="flex items-center gap-3 p-3 text-sm text-green-400 border rounded-lg md:p-4 bg-green-500/10 border-green-500/20 md:text-base">
                        <CheckCircle size={18} />
                        <span>Message sent successfully! I'll reply soon.</span>
                    </div>
                )}
                
                {status === 'error' && (
                    <div className="flex items-center gap-3 p-3 text-sm text-red-400 border rounded-lg md:p-4 bg-red-500/10 border-red-500/20 md:text-base">
                        <AlertCircle size={18} />
                        <span>Something went wrong. Please check your IDs.</span>
                    </div>
                )}
            </form>
          </div>

        </div>

        {/* 4. Social Media Section */}
        <div className="pt-8 text-center border-t border-slate-800 md:pt-16">
            <h3 className="mb-6 text-xl font-bold md:text-2xl md:mb-10 text-slate-200">Connect on Socials</h3>
            
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-12">
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