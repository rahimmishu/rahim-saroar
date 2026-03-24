import React from 'react';
import { ACHIEVEMENTS } from '../constants';
import { Award, BookOpen, Video, Quote } from 'lucide-react';

const Achievements: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'award': return <Award className="text-yellow-500" size={32} />;
      case 'book': return <BookOpen className="text-blue-500" size={32} />;
      case 'video': return <Video className="text-red-500" size={32} />;
      default: return <Award size={32} />;
    }
  };

  return (
    <section id="skills" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Achievements & Goals</h2>
          <p className="text-slate-600">Milestones that define my journey.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ACHIEVEMENTS.map((item) => (
            <div 
              key={item.id} 
              className="bg-slate-50 p-8 rounded-2xl border border-slate-100 relative hover:shadow-lg transition-shadow"
            >
              <div className="absolute top-6 right-6 text-slate-200">
                <Quote size={40} />
              </div>
              
              <div className="mb-6 p-4 bg-white rounded-xl inline-block shadow-sm">
                {getIcon(item.icon)}
              </div>
              
              <p className="text-slate-700 text-lg font-medium leading-relaxed">
                "{item.text}"
              </p>
              
              <div className="mt-6 pt-4 border-t border-slate-200">
                 <div className="h-1 w-12 bg-primary rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;