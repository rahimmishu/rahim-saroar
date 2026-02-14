import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, ArrowLeft, Instagram } from 'lucide-react';

// ── Photos Data ──────────────────────────────────────────────────────────────
const photos = [
  { id: 1,  src: '/rahim-saroar-mishu-profile.jpg',        caption: 'Profile',        alt: 'Rahim Saroar Mishu Profile Picture AI Enthusiast Bangladesh' },
  { id: 2,  src: '/rahim-saroar-mishu-content-creator.jpg', caption: 'Content Creation', alt: 'Rahim Saroar Mishu Video Content Creator Rhythm of Peace' },
  { id: 3,  src: '/rahim-saroar-mishu-web-developer.jpg',   caption: 'College',        alt: 'Rahim Saroar Mishu Web Developer College Student Life' },
  { id: 4,  src: '/rahim-saroar-mishu-speaker.jpg',         caption: 'Public Speaking', alt: 'Rahim Saroar Mishu Public Speaker Tech Event Bangladesh' },
  { id: 5,  src: '/rahim-saroar-mishu-lifestyle.jpg',       caption: 'Lifestyle',      alt: 'Rahim Saroar Mishu Lifestyle Photography Portrait' },
  { id: 6,  src: '/rahim-saroar-mishu-coding.jpg',          caption: 'Workspace',      alt: 'Rahim Saroar Mishu Coding Workspace Setup Python Developer' },
  { id: 7,  src: '/rahim-saroar-mishu-sugarmill.jpg',       caption: 'Travel',         alt: 'Rahim Saroar Mishu Travel Vlog Sugarmill Bangladesh' },
  { id: 8,  src: '/rahim-saroar-mishu-school.jpg',          caption: 'School',         alt: 'Rahim Saroar Mishu School Life Memories Mangalbari Sirajia' },
  { id: 9,  src: '/rahim-saroar-mishu-J.jpg',               caption: 'Workspace',      alt: 'Rahim Saroar Mishu Tech Setup Desk Tour' },
  { id: 10, src: '/rahim-saroar-mishu-fuad.jpg',            caption: 'Friend',         alt: 'Rahim Saroar Mishu with Friends Hangout' },
  { id: 11, src: '/rahim-saroar-mishu-coffee.jpg',          caption: 'Workspace',      alt: 'Rahim Saroar Mishu Coding with Coffee Late Night Work' },
  { id: 12, src: '/rahim-saroar-mishu-c.jpg',               caption: 'Workspace',      alt: 'Rahim Saroar Mishu Modern Desk Setup Minimalist' },
  { id: 13, src: '/rahim-saroar-mishu-biya.jpg',            caption: 'Travel',         alt: 'Rahim Saroar Mishu Wedding Guest Style Panjabi' },
];

const GalleryPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white transition-colors duration-300">

      {/* ── Sticky Header ── */}
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-neutral-800 bg-white/80 dark:bg-black/80 backdrop-blur-md">
        <div className="flex items-center justify-between max-w-5xl px-4 py-4 mx-auto">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            aria-label="Back to Home"
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>

          <div className="flex items-center gap-2 text-xl font-bold font-signature text-slate-900 dark:text-white">
            <Camera className="text-purple-500" size={22} />
            <span>Life in <span className="text-purple-500">Frames</span></span>
          </div>

          {/* spacer to keep title centred */}
          <div className="w-24" />
        </div>
      </header>

      {/* ── Page Content ── */}
      <main className="max-w-5xl px-4 py-10 mx-auto">

        {/* Sub-heading */}
        <p className="mb-8 text-center text-slate-500 dark:text-neutral-400">
          A glimpse into my world
        </p>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative overflow-hidden transition-all shadow-md cursor-pointer group rounded-xl aspect-square hover:shadow-xl transform-gpu bg-slate-100 dark:bg-neutral-900"
            >
              <img
                src={photo.src}
                alt={photo.alt}
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
        <div className="pt-8 mt-10 text-center border-t border-slate-200 dark:border-neutral-800">
          <a
            href="https://www.facebook.com/rahimsaroar"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-blue-500 hover:underline text-sm"
          >
            <Instagram size={16} />
            See more on Facebook
          </a>
        </div>
      </main>
    </div>
  );
};

export default GalleryPage;
