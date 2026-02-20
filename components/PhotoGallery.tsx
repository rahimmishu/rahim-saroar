import React from 'react';
import { Camera, X, Instagram } from 'lucide-react';
import { photos, PERSON_NAME, EAGER_LOAD_COUNT, toAbsoluteUrl } from '../pages/photos.config';

interface PhotoGalleryProps {
  isOpen: boolean;
  onClose: () => void;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300"
      role="dialog"
      aria-modal="true"
      aria-label={`${PERSON_NAME} Photo Gallery`}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-red-600 text-white rounded-full transition-all hover:rotate-90 z-[110]"
        aria-label="Close photo gallery"
      >
        <X size={32} />
      </button>

      {/* Main Content */}
      <div
        className="bg-white dark:bg-black border dark:border-neutral-800 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-6 md:p-10 relative"
        // Modal এর ভেতরেও ImageGallery schema — Google Discover এ ধরে
        itemScope
        itemType="https://schema.org/ImageGallery"
      >
        {/* Hidden microdata */}
        <meta itemProp="name"   content={`${PERSON_NAME} Photo Gallery`} />
        <meta itemProp="author" content={PERSON_NAME} />

        {/* Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="flex items-center gap-3 text-2xl font-bold md:text-4xl text-slate-900 dark:text-white font-signature">
            <Camera className="text-purple-500" aria-hidden="true" />
            <h2>Life in <span className="text-purple-500">Frames</span></h2>
          </div>
          <p className="mt-2 text-slate-500 dark:text-neutral-400">
            A glimpse into my world
          </p>
        </div>

        {/* Gallery Grid */}
        <div
          className="grid grid-cols-2 gap-4 md:grid-cols-3"
          role="list"
          aria-label={`Photos of ${PERSON_NAME}`}
        >
          {photos.map((photo, index) => {
            const isEager = index < EAGER_LOAD_COUNT;

            return (
              <figure
                key={photo.id}
                role="listitem"
                className="relative overflow-hidden transition-all shadow-md cursor-pointer group rounded-xl aspect-square hover:shadow-xl transform-gpu bg-slate-100 dark:bg-neutral-900"
                // ImageObject microdata প্রতিটা ছবিতে
                itemScope
                itemType="https://schema.org/ImageObject"
              >
                <link itemProp="contentUrl" href={toAbsoluteUrl(photo.src)} />
                <meta itemProp="name"        content={photo.title} />
                <meta itemProp="description" content={photo.alt} />
                <meta itemProp="author"      content={PERSON_NAME} />
                {photo.category && <meta itemProp="genre" content={photo.category} />}

                <img
                  src={photo.src}
                  alt={photo.alt}
                  title={photo.title}
                  loading={isEager ? 'eager' : 'lazy'}
                  decoding={isEager ? 'sync' : 'async'}
                  fetchPriority={isEager ? 'high' : 'low'}
                  itemProp="thumbnail"
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110 will-change-transform"
                  width={600}
                  height={600}
                />

                <figcaption className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 bg-black/60 group-hover:opacity-100">
                  <span
                    itemProp="caption"
                    className="px-4 py-1 text-sm font-medium text-white border rounded-full border-white/30 bg-black/30 backdrop-blur-sm"
                  >
                    {photo.caption}
                  </span>
                </figcaption>
              </figure>
            );
          })}
        </div>

        {/* Social Link */}
        <div className="pt-6 mt-8 text-center border-t border-slate-200 dark:border-neutral-800">
          <a
            href="https://www.facebook.com/rahimsaroar"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 text-blue-500 hover:underline"
            aria-label={`${PERSON_NAME} on Facebook — more photos`}
          >
            <Instagram size={18} aria-hidden="true" />
            See more on Facebook
          </a>
        </div>
      </div>
    </div>
  );
};

export default PhotoGallery;