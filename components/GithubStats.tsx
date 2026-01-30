import React from 'react';

const GithubStats: React.FC = () => {
  const username = "rahimmishu"; // আপনার সঠিক GitHub ইউজারনেম

  return (
    <section className="px-4 py-20">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="mb-8 font-sans text-3xl font-bold">GitHub Contributions</h2>
        
        <div className="p-6 overflow-hidden border shadow-xl bg-slate-50 dark:bg-slate-800/50 rounded-3xl border-slate-200 dark:border-slate-700">
          {/* GitHub Heatmap API */}
          <img 
            src={`https://ghchart.rshah.org/2563EB/${username}`} 
            alt="Rahim's Github Chart" 
            className="w-full h-auto filter dark:invert-[0.1] contrast-[1.1]"
          />
          
          <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm font-medium opacity-70">
            <span>🐍 Python Enthusiast</span>
            <span>•</span>
            <span>⚛️ React Developer</span>
            <span>•</span>
            <span>🤖 AI Integrator</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GithubStats;