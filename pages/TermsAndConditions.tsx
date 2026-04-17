import React, { useState, useRef, useEffect } from "react";
import {
  Shield, FileText, User, Database, XCircle,
  Bot, ChevronRight, Download, Clock, Eye, Lock,
  CheckCircle2, AlertTriangle, Sparkles
} from "lucide-react";

const sections = [
  {
    id: 0,
    num: "01",
    label: "General Terms",
    icon: FileText,
    color: "#8b5cf6", // Purple
    badge: "Core",
    readTime: "2 min",
    progress: 100,
    title: "General Terms of Service",
    content: [
      {
        type: "text",
        value:
          "These Terms of Service govern your access to and use of Nexus AI's platform, APIs, and all associated services. By creating an account or using any part of the service, you agree to be bound by these terms.",
      },
      {
        type: "highlight",
        icon: CheckCircle2,
        color: "#10b981",
        value: "These terms apply to all users — individual developers, teams, and enterprise accounts.",
      },
      {
        type: "text",
        value:
          "Nexus AI reserves the right to update or modify these Terms at any time. Continued use of the service after such modifications constitutes your acceptance of the new Terms.",
      },
      {
        type: "highlight",
        icon: AlertTriangle,
        color: "#f59e0b",
        value: "Users will be notified of significant changes via email or in-app notification at least 14 days in advance.",
      },
    ],
  },
  {
    id: 1,
    num: "02",
    label: "AI Usage Rules",
    icon: Bot,
    color: "#06b6d4", // Cyan
    badge: "Important",
    readTime: "3 min",
    progress: 80,
    title: "AI Usage Guidelines",
    content: [
      {
        type: "text",
        value:
          "By accessing Nexus AI, you agree to utilize our intelligence modules for ethical purposes. Our services are designed to augment human creativity and productivity — not replace human judgment in critical decision-making.",
      },
      {
        type: "highlight",
        icon: XCircle,
        color: "#ef4444",
        value:
          "Prohibited: Generating harmful content, automated social manipulation, or bypassing security protocols of third-party platforms.",
      },
      {
        type: "text",
        value:
          "Users maintain full ownership of their input prompts. Nexus AI retains rights to the underlying model architecture and infrastructure. Where AI-generated content is published publicly, attribution must be disclosed.",
      },
      {
        type: "highlight",
        icon: CheckCircle2,
        color: "#10b981",
        value: "Credits must be attributed where significant AI output is published commercially or publicly.",
      },
    ],
  },
  {
    id: 2,
    num: "03",
    label: "User Accounts",
    icon: User,
    color: "#f59e0b", // Amber
    badge: "Account",
    readTime: "2 min",
    progress: 60,
    title: "User Account Policy",
    content: [
      {
        type: "text",
        value:
          "You are responsible for maintaining the confidentiality of your credentials. Each account is for single-user use unless you are on a Team or Enterprise plan with explicit multi-seat access.",
      },
      {
        type: "highlight",
        icon: Lock,
        color: "#8b5cf6",
        value: "Never share API keys publicly. Rotate keys immediately if you suspect any compromise.",
      },
      {
        type: "text",
        value:
          "Nexus AI reserves the right to suspend or terminate accounts that violate these Terms, engage in fraudulent activity, or are found to be used for unauthorized automation at scale.",
      },
    ],
  },
  {
    id: 3,
    num: "04",
    label: "Data Policy",
    icon: Database,
    color: "#10b981", // Emerald
    badge: "Privacy",
    readTime: "3 min",
    progress: 75,
    title: "Data & Privacy Policy",
    content: [
      {
        type: "text",
        value:
          "Your data is encrypted in transit (TLS 1.3) and at rest (AES-256). We adhere to GDPR and CCPA compliance standards. You can request a full export or deletion of your data at any time from the Privacy Settings panel.",
      },
      {
        type: "highlight",
        icon: CheckCircle2,
        color: "#10b981",
        value: "By default, your prompts and outputs are NOT used to train our models.",
      },
      {
        type: "text",
        value:
          "Anonymous, aggregated usage metrics may be collected to improve service quality. No personally identifiable information (PII) is included in these analytics pipelines.",
      },
      {
        type: "highlight",
        icon: Eye,
        color: "#06b6d4",
        value: "You can review and modify your data preferences at any time under Settings → Privacy.",
      },
    ],
  },
  {
    id: 4,
    num: "05",
    label: "Termination",
    icon: XCircle,
    color: "#ef4444", // Red
    badge: "Legal",
    readTime: "2 min",
    progress: 55,
    title: "Account Termination",
    content: [
      {
        type: "text",
        value:
          "Either party may terminate the agreement at any time. You may close your account from Settings → Account → Delete Account. All associated data will be permanently deleted within 30 days.",
      },
      {
        type: "highlight",
        icon: AlertTriangle,
        color: "#f59e0b",
        value: "Unused credits are non-refundable upon voluntary account termination.",
      },
      {
        type: "text",
        value:
          "Nexus AI may terminate or suspend access without notice if a user is found to be in material breach of these Terms. Appeals may be submitted via legal@nexusai.io within 10 business days.",
      },
    ],
  },
];

export default function TermsAndConditions() {
  const [active, setActive] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleSelect = (id: number) => {
    setActive(id);
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const current = sections[active];

  return (
    <div className="relative min-h-screen p-4 md:p-8 overflow-hidden bg-[#050505] text-slate-200">
      
      {/* 🌌 IMMERSIVE BACKGROUND ORBS */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-600/20 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[30vw] h-[30vw] rounded-full bg-blue-600/10 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <section className="relative z-10 flex flex-col w-full max-w-5xl gap-8 pt-12 mx-auto md:pt-16">

        {/* ── Header ── */}
        <div className="flex flex-col items-center text-center duration-700 animate-in fade-in slide-in-from-bottom-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 text-xs font-bold tracking-widest uppercase rounded-full bg-white/5 border border-white/10 text-slate-300 mb-6 backdrop-blur-md">
            <Shield size={14} className="text-purple-400" />
            Legal & Guidelines
            <span className="ml-2 px-1.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[9px] animate-pulse">DRAFT v2.4</span>
          </div>
          <h1 className="mb-4 text-4xl font-black tracking-tight text-transparent md:text-5xl bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500">
            Terms & Conditions
          </h1>
          <p className="max-w-lg mx-auto text-sm text-slate-400">
            Please read these terms carefully. By using our services, you agree to these guidelines.
          </p>
        </div>

        {/* ── Layout Grid ── */}
        <div className="grid lg:grid-cols-[260px_1fr] gap-6 lg:gap-8 h-full min-h-[600px] animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200">

          {/* ── Sidebar Navigation ── */}
          <nav className="flex flex-col gap-3">
            {sections.map((s) => {
              const Icon = s.icon;
              const isActive = s.id === active;
              
              return (
                <button
                  key={s.id}
                  onClick={() => handleSelect(s.id)}
                  className={`group relative flex items-center gap-4 px-4 py-4 rounded-2xl text-left w-full cursor-pointer transition-all duration-300 overflow-hidden
                    ${isActive 
                      ? "bg-white/[0.04] shadow-lg shadow-black/50" 
                      : "bg-transparent hover:bg-white/[0.02]"
                    }`}
                  style={{
                    borderColor: isActive ? `${s.color}40` : 'transparent',
                    borderWidth: '1px'
                  }}
                >
                  {/* Glowing background for active state */}
                  {isActive && (
                    <div 
                      className="absolute inset-0 opacity-20 blur-md" 
                      style={{ background: `linear-gradient(90deg, ${s.color}, transparent)` }}
                    />
                  )}

                  <div
                    className={`relative z-10 flex items-center justify-center rounded-xl w-10 h-10 shrink-0 transition-all duration-300
                      ${isActive ? "scale-110 shadow-lg" : "group-hover:scale-105"}`}
                    style={{
                      background: isActive ? `${s.color}20` : "rgba(255,255,255,0.05)",
                      border: `1px solid ${isActive ? s.color + "50" : "rgba(255,255,255,0.1)"}`,
                    }}
                  >
                    <Icon size={18} style={{ color: isActive ? s.color : "#94a3b8" }} />
                  </div>
                  
                  <div className="relative z-10 flex flex-col min-w-0">
                    <span className={`text-sm font-bold truncate transition-colors ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"}`}>
                      {s.label}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium tracking-wide mt-0.5 flex items-center gap-1">
                      <Clock size={10} /> {s.readTime}
                    </span>
                  </div>

                  {isActive && (
                    <ChevronRight size={16} className="relative z-10 ml-auto shrink-0" style={{ color: s.color }} />
                  )}
                </button>
              );
            })}
          </nav>

          {/* ── Main Content Panel ── */}
          <div className="relative flex flex-col overflow-hidden border shadow-2xl bg-black/40 border-white/10 rounded-3xl backdrop-blur-2xl">
            
            {/* Animated Top Border Line */}
            <div 
              className="absolute top-0 left-0 h-[2px] transition-all duration-500 ease-out" 
              style={{ width: '100%', background: `linear-gradient(90deg, transparent, ${current.color}, transparent)` }}
            />

            {/* Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div
                  className="flex items-center justify-center w-10 h-10 shadow-lg rounded-xl"
                  style={{ background: `${current.color}20`, border: `1px solid ${current.color}40` }}
                >
                  {(() => { const Icon = current.icon; return <Icon size={20} style={{ color: current.color }} />; })()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold tracking-wider text-white uppercase">Section {current.num}</span>
                    <span
                      className="text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest"
                      style={{ color: current.color, backgroundColor: `${current.color}15`, border: `1px solid ${current.color}30` }}
                    >
                      {current.badge}
                    </span>
                  </div>
                  <h2 className="mt-1 text-xl font-bold text-slate-200">
                    {current.title}
                  </h2>
                </div>
              </div>
            </div>

            {/* Scrollable content area */}
            <div ref={contentRef} className="flex-1 p-6 space-y-6 overflow-y-auto md:p-8 custom-scrollbar">
              {current.content.map((block, i) => {
                if (block.type === "text") {
                  return (
                    <p key={i} className="text-[15px] leading-relaxed text-slate-400">
                      {block.value}
                    </p>
                  );
                }
                if (block.type === "highlight") {
                  const HIcon = block.icon as React.ElementType;
                  return (
                    <div
                      key={i}
                      className="flex items-start gap-4 p-5 transition-transform duration-300 border-l-4 rounded-2xl backdrop-blur-sm hover:-translate-y-1"
                      style={{
                        background: `linear-gradient(90deg, ${block.color}10, transparent)`,
                        borderColor: block.color,
                      }}
                    >
                      <div className="p-2 rounded-full" style={{ backgroundColor: `${block.color}20` }}>
                        <HIcon size={18} style={{ color: block.color }} />
                      </div>
                      <p className="text-[14px] leading-relaxed font-medium" style={{ color: block.color }}>
                        {block.value}
                      </p>
                    </div>
                  );
                }
                return null;
              })}
            </div>

            {/* Bottom Action Bar */}
            <div className="px-6 py-4 border-t border-white/5 bg-white/[0.02] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <Sparkles size={14} style={{ color: current.color }} />
                Last Updated: Oct 12, 2023
              </div>
              <div className="flex items-center gap-3">
                {active < sections.length - 1 && (
                  <button
                    onClick={() => handleSelect(active + 1)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white transition-all bg-white/5 hover:bg-white/10 rounded-xl"
                  >
                    Next Section
                    <ChevronRight size={14} />
                  </button>
                )}
                <button 
                  className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white transition-all rounded-xl hover:shadow-lg hover:-translate-y-0.5"
                  style={{ background: `linear-gradient(135deg, ${current.color}dd, ${current.color}88)` }}
                >
                  <Download size={14} />
                  Save PDF
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </section>
      
      {/* Scrollbar Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
      `}} />
    </div>
  );
}