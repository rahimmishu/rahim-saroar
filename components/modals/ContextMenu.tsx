import React, { useEffect, useState, useRef } from 'react';
import { Mail, RefreshCw, Share2, Code, ExternalLink } from 'lucide-react';

const ContextMenu: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      // 🔥 নতুন লজিক: যদি Ctrl বা Shift চেপে ধরা থাকে, তাহলে আমাদের মেনু দেখাবে না (ডিফল্ট মেনু আসবে)
      if (e.ctrlKey || e.shiftKey) {
        return; 
      }

      e.preventDefault(); // সাধারণ অবস্থায় ডিফল্ট মেনু বন্ধ থাকবে
      
      let x = e.pageX;
      let y = e.pageY;
      
      if (x + 220 > window.innerWidth) x = window.innerWidth - 230;
      if (y + 260 > window.innerHeight) y = window.innerHeight - 270;

      setPosition({ x, y });
      setVisible(true);
    };

    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setVisible(false);
      }
    };

    const handleScroll = () => setVisible(false);

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleClick);
    document.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleRefresh = () => window.location.reload();
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setVisible(false);
    alert('Link Copied!');
  };

  const handleSourceCode = () => {
    window.open('https://github.com/rahimsaroar', '_blank'); // আপনার গিটহাব লিংক
    setVisible(false);
  };

  const handleEmail = () => {
    window.location.href = 'mailto:your-email@gmail.com'; 
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div 
      ref={menuRef}
      style={{ top: position.y, left: position.x }}
      className="fixed z-[99999] w-60 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-200 overflow-hidden ring-1 ring-white/5"
    >
      <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 mb-2 select-none">
        Quick Actions
      </div>

      <div className="flex flex-col gap-1">
        <button onClick={handleRefresh} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-all group">
          <RefreshCw size={16} className="transition-colors text-slate-400 group-hover:text-pink-500" />
          <span>Refresh System</span>
        </button>

        <button onClick={handleCopyLink} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-all group">
          <Share2 size={16} className="transition-colors text-slate-400 group-hover:text-pink-500" />
          <span>Share Portfolio</span>
        </button>

        <button onClick={handleEmail} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-all group">
          <Mail size={16} className="transition-colors text-slate-400 group-hover:text-pink-500" />
          <span>Contact Me</span>
        </button>

        <div className="h-[1px] bg-white/10 my-1 mx-2"></div>

        <button onClick={handleSourceCode} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-all group">
          <Code size={16} className="transition-colors text-slate-400 group-hover:text-pink-500" />
          <span className="flex-1 text-left">Source Code</span>
          <ExternalLink size={14} className="transition-opacity opacity-50 group-hover:opacity-100" />
        </button>
      </div>
    </div>
  );
};

export default ContextMenu;