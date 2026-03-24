import React from 'react';
import { Award } from 'lucide-react';

const Certifications: React.FC = () => {
  return (
    <section id="certifications" className="py-20 bg-primary relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          
          <div className="text-white space-y-3">
            <div className="flex items-center justify-center md:justify-start gap-2 text-blue-200 font-bold uppercase tracking-wider text-sm">
              <Award size={18} />
              <span>Certified Expert</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
              Google Certified Educator (Level 1 & 2) <br className="hidden md:block"/>
              & Gemini Certified
            </h2>
            <p className="text-blue-100 text-lg font-medium">
              Validating my expertise in Google tools and AI technologies.
            </p>
          </div>

          <div className="flex-shrink-0">
            {/* বাটনটিকে লিংকে পরিবর্তন করা হয়েছে */}
            <a 
              href="https://edu.google.accredible.com/profile/rahimsaroar889208/wallet"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-white text-primary rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-2xl shadow-black/20 text-lg whitespace-nowrap transform hover:-translate-y-1"
            >
              Verify Credentials
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Certifications;