import React, { useState, useRef, useEffect } from "react";
import {
  Search, HelpCircle, Wrench, Briefcase, Clipboard,
  ChevronDown, Send, Zap, MessageCircle, ExternalLink,
  CheckCircle, ArrowRight, Sparkles, Bot, Clock
} from "lucide-react";

const faqs = [
  {
    q: "How do I regenerate my secure API keys?",
    a: "Navigate to Settings → API Keys, click 'Regenerate'. Your old key is instantly invalidated. Copy the new key immediately — it won't be shown again.",
    tag: "API",
  },
  {
    q: "Can I upgrade my monthly token limit?",
    a: "Yes. Go to Billing → Plans, choose your tier upgrade. Limits refresh every 1st of the month. Enterprise plans offer custom quotas.",
    tag: "Billing",
  },
  {
    q: "What data is used for model training?",
    a: "By default, your prompts are not used for training. You can review and adjust data preferences in Settings → Privacy anytime.",
    tag: "Privacy",
  },
  {
    q: "How do I integrate the API with my application?",
    a: "Check our Quickstart docs under Developer → Integration. We provide SDKs for Python, Node.js, and REST endpoints with full Swagger docs.",
    tag: "Dev",
  },
  {
    q: "What is the SLA for uptime guarantees?",
    a: "All paid tiers receive 99.9% uptime SLA. Enterprise tiers get dedicated infrastructure with 99.99% guarantees and priority incident response.",
    tag: "Infra",
  },
];

const categories = [
  { icon: Wrench, label: "Technical", sub: "API & Integration", color: "from-blue-500 to-cyan-400" },
  { icon: Briefcase, label: "Business", sub: "Sales & Growth", color: "from-purple-500 to-pink-500" },
  { icon: Clipboard, label: "Report Bug", sub: "Glitches & Issues", color: "from-orange-500 to-red-500" },
  { icon: MessageCircle, label: "Live Chat", sub: "Avg. 3 min reply", color: "from-emerald-400 to-teal-500" },
];

const statuses = [
  { label: "API Gateway", ok: true },
  { label: "Model Inference", ok: true },
  { label: "Dashboard", ok: true },
  { label: "Webhooks", ok: false },
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (!query.trim()) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
    setQuery("");
  };

  return (
    <div className="relative min-h-screen p-4 md:p-8 overflow-hidden bg-[#050505] text-slate-200">
      
      {/* 🌌 IMMERSIVE BACKGROUND ORBS */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-600/20 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-blue-600/20 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <section className="relative z-10 flex flex-col w-full max-w-4xl gap-10 pt-12 mx-auto md:pt-20">

        {/* ── Header ── */}
        <div className="flex flex-col items-center text-center duration-700 animate-in fade-in slide-in-from-bottom-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 text-xs font-bold tracking-widest uppercase rounded-full bg-white/5 border border-white/10 text-slate-300 mb-6 backdrop-blur-md">
            <HelpCircle size={14} className="text-purple-400" />
            Support Center
          </div>
          <h1 className="mb-4 text-4xl font-black tracking-tight text-transparent md:text-6xl bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500">
            How can we help?
          </h1>
          <p className="max-w-lg mx-auto text-slate-400">
            Search our knowledge base or browse categories below to find the answers you need.
          </p>
        </div>

        {/* ── Hero Search ── */}
        <div className="relative z-20 w-full max-w-2xl mx-auto duration-700 delay-100 animate-in fade-in slide-in-from-bottom-8">
          <div className="absolute transition duration-500 opacity-50 -inset-1 rounded-3xl bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-pink-500/20 blur-lg group-hover:opacity-100"></div>
          <div className="relative flex items-center gap-4 p-3 transition-all duration-300 border shadow-2xl bg-black/40 border-white/10 rounded-2xl backdrop-blur-2xl focus-within:border-purple-500/50 focus-within:bg-black/60">
            <div className="p-3 bg-white/5 rounded-xl text-slate-400">
              <Search size={20} />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              placeholder="Search for documentation, guides, or issues..."
              className="w-full text-base font-medium text-white bg-transparent border-none outline-none placeholder:text-slate-500"
            />
            {query && (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-white font-bold bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all active:scale-95"
              >
                {submitted ? <CheckCircle size={18} /> : <ArrowRight size={18} />}
                <span className="hidden sm:inline">{submitted ? "Searched" : "Search"}</span>
              </button>
            )}
          </div>
          <div className="absolute -top-4 -right-2 flex items-center gap-1.5 px-3 py-1.5 bg-black/60 border border-purple-500/30 rounded-full text-[10px] text-purple-300 font-bold tracking-widest uppercase backdrop-blur-xl shadow-[0_0_15px_rgba(139,92,246,0.2)] animate-bounce">
            <Bot size={12} />
            AI-Powered
          </div>
        </div>

        {/* ── Category Cards ── */}
        <div className="grid grid-cols-1 gap-4 duration-700 delay-200 sm:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom-10">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <div
                key={i}
                className="group relative p-6 cursor-pointer bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-xl hover:bg-white/[0.04] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.5)] overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                <div className={`inline-flex items-center justify-center w-12 h-12 mb-4 rounded-2xl bg-gradient-to-br ${cat.color} bg-opacity-10 relative z-10`}>
                  <div className="absolute inset-0 transition-all bg-white/20 rounded-2xl blur-sm group-hover:bg-white/40"></div>
                  <Icon size={22} className="relative z-20 text-white transition-transform duration-300 group-hover:scale-110" strokeWidth={2} />
                </div>
                <h3 className="relative z-10 mb-1 text-lg font-bold text-slate-100 group-hover:text-white">{cat.label}</h3>
                <p className="relative z-10 text-sm transition-colors text-slate-500 group-hover:text-slate-300">{cat.sub}</p>
              </div>
            );
          })}
        </div>

        {/* ── System Status ── */}
        <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300">
          <div className="flex flex-col items-start justify-between gap-4 mb-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 border bg-emerald-500/10 rounded-xl border-emerald-500/20">
                <Zap size={18} className="text-emerald-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">System Status</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <Clock size={10} /> Updated 2 mins ago
                </p>
              </div>
            </div>
            <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-wide flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              All systems operational
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {statuses.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-xl bg-black/40 border-white/5">
                <span className="text-sm font-medium text-slate-300">{s.label}</span>
                {s.ok ? (
                  <CheckCircle size={16} className="text-emerald-400" />
                ) : (
                  <span className="text-xs font-bold text-red-400 bg-red-400/10 px-2 py-0.5 rounded-md">DEGRADED</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── FAQ ── */}
        <div className="mb-10 duration-700 delay-500 animate-in fade-in slide-in-from-bottom-14">
          <div className="flex items-center gap-2 px-2 mb-6 text-sm font-bold tracking-widest uppercase text-slate-400">
            <Sparkles size={16} className="text-purple-400" />
            Frequently Asked Questions
          </div>
          
          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="overflow-hidden bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-md transition-all duration-300 hover:border-purple-500/30 hover:bg-white/[0.04]"
              >
                <button
                  className="flex items-center w-full gap-4 p-5 text-left focus:outline-none"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="px-3 py-1 text-[10px] font-black tracking-wider uppercase rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
                    {faq.tag}
                  </span>
                  <span className="flex-1 text-sm font-semibold md:text-base text-slate-200">{faq.q}</span>
                  <div className={`p-1.5 rounded-full bg-white/5 text-slate-400 transition-transform duration-300 ${openFaq === i ? "rotate-180 bg-purple-500/20 text-purple-400" : ""}`}>
                    <ChevronDown size={16} />
                  </div>
                </button>
                
                <div 
                  className={`px-5 text-sm leading-relaxed text-slate-400 transition-all duration-300 ease-in-out ${openFaq === i ? "max-h-40 pb-5 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <div className="h-px mb-4 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  <p className="pl-14">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Contact CTA ── */}
        <div className="relative p-10 overflow-hidden text-center duration-700 delay-700 border md:p-14 bg-gradient-to-b from-purple-900/20 to-black/40 border-purple-500/20 rounded-3xl backdrop-blur-2xl animate-in fade-in slide-in-from-bottom-16">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay"></div>
          <div className="relative z-10">
            <h3 className="mb-3 text-2xl font-black text-white md:text-3xl">
              Still need help?
            </h3>
            <p className="max-w-md mx-auto mb-8 text-slate-400">
              Our support team is available 24/7 to assist you with any technical issues or general inquiries.
            </p>
            <button className="group relative inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-bold text-sm hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]">
              <MessageCircle size={18} className="group-hover:animate-bounce" />
              Chat with Support
              <ExternalLink size={14} className="opacity-50" />
            </button>
          </div>
        </div>

      </section>
    </div>
  );
}