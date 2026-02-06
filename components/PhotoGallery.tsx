import React from 'react';
import { Camera, X, Instagram } from 'lucide-react';

interface PhotoGalleryProps {
  isOpen: boolean;
  onClose: () => void;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // 🔥 UPDATE: Added descriptive 'alt' tags for SEO
  const photos = [
    { 
      id: 1, 
      src: "/rahim-saroar-mishu-profile.jpg", 
      caption: "Profile", 
      alt: "Rahim Saroar Mishu Profile Picture AI Enthusiast Bangladesh" 
    },
    { 
      id: 2, 
      src: "/rahim-saroar-mishu-content-creator.jpg", 
      caption: "Content Creation", 
      alt: "Rahim Saroar Mishu Video Content Creator Rhythm of Peace" 
    },
    { 
      id: 3, 
      src: "/rahim-saroar-mishu-web-developer.jpg", 
      caption: "College", 
      alt: "Rahim Saroar Mishu Web Developer College Student Life" 
    },
    { 
      id: 4, 
      src: "/rahim-saroar-mishu-speaker.jpg", 
      caption: "Public Speaking", 
      alt: "Rahim Saroar Mishu Public Speaker Tech Event Bangladesh" 
    },
    { 
      id: 5, 
      src: "/rahim-saroar-mishu-lifestyle.jpg", 
      caption: "Lifestyle", 
      alt: "Rahim Saroar Mishu Lifestyle Photography Portrait" 
    },
    { 
      id: 6, 
      src: "/rahim-saroar-mishu-coding.jpg", 
      caption: "Workspace", 
      alt: "Rahim Saroar Mishu Coding Workspace Setup Python Developer" 
    },
    { 
      id: 7, 
      src: "/rahim-saroar-mishu-sugarmill.jpg", 
      caption: "Travel", 
      alt: "Rahim Saroar Mishu Travel Vlog Sugarmill Bangladesh" 
    },
    { 
      id: 8, 
      src: "/rahim-saroar-mishu-school.jpg", 
      caption: "School", 
      alt: "Rahim Saroar Mishu School Life Memories Mangalbari Sirajia" 
    },
    { 
      id: 9, 
      src: "/rahim-saroar-mishu-J.jpg", 
      caption: "Workspace", 
      alt: "Rahim Saroar Mishu Tech Setup Desk Tour" 
    },
    { 
      id: 10, 
      src: "/rahim-saroar-mishu-fuad.jpg", 
      caption: "Friend", 
      alt: "Rahim Saroar Mishu with Friends Hangout" 
    },
    { 
      id: 11, 
      src: "/rahim-saroar-mishu-coffee.jpg", 
      caption: "Workspace", 
      alt: "Rahim Saroar Mishu Coding with Coffee Late Night Work" 
    },
    { 
      id: 12, 
      src: "/rahim-saroar-mishu-c.jpg", 
      caption: "Workspace", 
      alt: "Rahim Saroar Mishu Modern Desk Setup Minimalist" 
    },
    { 
      id: 13, 
      src: "/rahim-saroar-mishu-biya.jpg", 
      caption: "Travel", 
      alt: "Rahim Saroar Mishu Wedding Guest Style Panjabi" 
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      
      {/* Close Button */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-red-600 text-white rounded-full transition-all hover:rotate-90 z-[110]"
      >
        <X size={32} />
      </button>

      {/* Main Content Scrollable */}
      <div className="bg-white dark:bg-slate-800 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-6 md:p-10 relative">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="flex items-center gap-3 text-2xl font-bold md:text-4xl text-slate-900 dark:text-white font-signature">
            <Camera className="text-purple-500" />
            <span>Life in <span className="text-purple-500">Frames</span></span>
          </div>
          <p className="mt-2 text-slate-500">A glimpse into my world</p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {photos.map((photo) => (
            <div 
              key={photo.id} 
              // 🔥 GPU Acceleration & Optimization
              className="relative overflow-hidden transition-all shadow-md cursor-pointer group rounded-xl aspect-square hover:shadow-xl transform-gpu bg-slate-100 dark:bg-slate-700"
            >
              <img 
                src={photo.src} 
                alt={photo.alt} // ✅ এখানে এখন ইউনিক এবং শক্তিশালী কীওয়ার্ড ব্যবহার হচ্ছে
                loading="lazy"
                decoding="async"
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110 will-change-transform"
              />
              <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 bg-black/60 group-hover:opacity-100">
                <span className="px-4 py-1 text-sm font-medium text-white border rounded-full border-white/30 bg-black/30 backdrop-blur-sm">
                  {photo.caption}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Social Link */}
        <div className="pt-6 mt-8 text-center border-t border-slate-200 dark:border-slate-700">
             <a href="https://www.facebook.com/rahimsaroar" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 text-blue-500 hover:underline">
                <Instagram size={18} /> See more on Facebook
             </a>
        </div>

      </div>
    </div>
  );
};

export default PhotoGallery;