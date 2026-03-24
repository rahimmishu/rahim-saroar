import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Tools from '../components/tools/Tools';

const ToolsPage: React.FC = () => {
  const navigate = useNavigate();

  // Update page title
  useEffect(() => {
    document.title = 'Playground — Tools & Games';
    return () => { document.title = 'Rahim Saroar Mishu'; };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050507]">
      {/* ── Back Button ── */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-6 left-6 z-[200] flex items-center gap-2 px-4 py-2.5 rounded-full
          bg-white/5 border border-white/10 text-white/50 text-sm font-medium
          hover:bg-white/10 hover:text-white hover:border-white/20
          transition-all duration-300 backdrop-blur-md"
        aria-label="Back to Home"
      >
        <ArrowLeft size={16} />
        <span className="hidden sm:inline">Back to Home</span>
      </button>

      {/* ── Tools Component ── */}
      <Tools />
    </div>
  );
};

export default ToolsPage;
