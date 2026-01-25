import React from 'react';
import { Camera, X, Instagram } from 'lucide-react';

interface PhotoGalleryProps {
  isOpen: boolean;
  onClose: () => void;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null; // গ্যালারি বন্ধ থাকলে কিছুই দেখাবে না

  // 🔴 টিপস: আপনার public ফোল্ডারের ছবির নামের সাথে এই নামগুলো হুবহু মিলতে হবে
  const photos = [
    { id: 1, src: "/rahim-saroar-mishu-profile.jpg", caption: "Profile" },
    { id: 2, src: "/rahim-saroar-mishu-content-creator.jpg", caption: "Content Creation" },
    { id: 3, src: "/rahim-saroar-mishu-web-developer.jpg", caption: "College" },
    { id: 4, src: "/rahim-saroar-mishu-speaker.jpg", caption: "Public Speaking" },
    { id: 5, src: "/rahim-saroar-mishu-lifestyle.jpg", caption: "Lifestyle" },
    { id: 6, src: "/rahim-saroar-mishu-coding.jpg", caption: "Workspace" },
    { id: 7, src: "/rahim-saroar-mishu-sugarmill.jpg", caption: "Travel" },
    { id: 8, src: "/rahim-saroar-mishu-school.jpg", caption: "School" },
    { id: 9, src: "/rahim-saroar-mishu-J.jpg", caption: "Workspace" },
    { id: 10, src: "/rahim-saroar-mishu-fuad.jpg", caption: "Friend" },
    { id: 11, src: "/rahim-saroar-mishu-coffee.jpg", caption: "Workspace" },
    { id: 12, src: "/rahim-saroar-mishu-c.jpg", caption: "Workspace" },
    { id: 13, src: "/rahim-saroar-mishu-biya.jpg", caption: "Travel" }
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
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex items-center gap-3 text-2xl md:text-4xl font-bold text-slate-900 dark:text-white font-signature">
            <Camera className="text-purple-500" />
            <span>Life in <span className="text-purple-500">Frames</span></span>
          </div>
          <p className="text-slate-500 mt-2">A glimpse into my world</p>
        </div>

        {/* Gallery Grid (Compact Sized) */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="group relative rounded-xl overflow-hidden aspect-square cursor-pointer shadow-md hover:shadow-xl transition-all">
              <img 
                src={photo.src} 
                alt="Rahim Saroar Mishu" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white font-medium px-4 py-1 border border-white/30 rounded-full bg-black/30 backdrop-blur-sm">
                  {photo.caption}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Social Link */}
        <div className="text-center mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
             <a href="https://www.facebook.com/rahimsaroar" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline flex items-center justify-center gap-2">
                <Instagram size={18} /> See more on Facebook
             </a>
        </div>

      </div>
    </div>
  );
};

export default PhotoGallery;