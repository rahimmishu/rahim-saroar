import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, ArrowLeft, Instagram } from 'lucide-react';
import {
  photos,
  PERSON_NAME,
  PERSON_NAME_BN,
  PAGE_URL,
  SITE_URL,
  GALLERY_TITLE,
  GALLERY_TITLE_SHORT,
  GALLERY_DESCRIPTION,
  GALLERY_KEYWORDS,
  EAGER_LOAD_COUNT,
  toAbsoluteUrl,
  buildGalleryJsonLd,
  buildBreadcrumbJsonLd,
  buildWebPageJsonLd,
} from './photos.config';

// ── GalleryPage Component ─────────────────────────────────────────────────────
const GalleryPage: React.FC = () => {
  const navigate  = useNavigate();
  const profileImg = toAbsoluteUrl(photos[0].src);

  // ── Dynamic <head> injection ───────────────────────────────────────────────
  useEffect(() => {
    const prevTitle = document.title;
    document.title  = GALLERY_TITLE;

    // ── helpers ──────────────────────────────────────────────────────────────
    const setMeta = (attrs: Record<string, string>) => {
      const selector = Object.entries(attrs)
        .filter(([k]) => k !== 'content')
        .map(([k, v]) => `[${k}="${v}"]`)
        .join('');
      let el = document.querySelector<HTMLMetaElement>(`meta${selector}`);
      if (!el) {
        el = document.createElement('meta');
        Object.entries(attrs).filter(([k]) => k !== 'content').forEach(([k, v]) => el!.setAttribute(k, v));
        document.head.appendChild(el);
      }
      el.setAttribute('content', attrs.content);
      return el;
    };

    const setLink = (attrs: Record<string, string>) => {
      const rel      = attrs.rel;
      const existing = attrs.href ?? attrs.hreflang ?? '';
      let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"][href="${existing}"]`);
      if (!el) {
        el = document.createElement('link');
        document.head.appendChild(el);
      }
      Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
      return el;
    };

    const setJsonLd = (id: string, data: object) => {
      let el = document.getElementById(id) as HTMLScriptElement | null;
      if (!el) {
        el = document.createElement('script');
        el.id   = id;
        el.type = 'application/ld+json';
        document.head.appendChild(el);
      }
      el.textContent = JSON.stringify(data, null, 2);
      return el;
    };

    // ── Standard meta ─────────────────────────────────────────────────────────
    const metas = [
      // Core
      setMeta({ name: 'description',    content: GALLERY_DESCRIPTION }),
      setMeta({ name: 'keywords',        content: GALLERY_KEYWORDS }),
      setMeta({ name: 'author',          content: PERSON_NAME }),
      setMeta({ name: 'robots',          content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' }),
      setMeta({ name: 'googlebot',       content: 'index, follow, max-image-preview:large' }),
      setMeta({ name: 'bingbot',         content: 'index, follow' }),

      // Geographic — Bangladesh targeting
      setMeta({ name: 'geo.region',      content: 'BD' }),
      setMeta({ name: 'geo.placename',   content: 'Bangladesh' }),
      setMeta({ name: 'language',        content: 'English' }),

      // Open Graph
      setMeta({ property: 'og:type',         content: 'profile' }),
      setMeta({ property: 'og:title',        content: GALLERY_TITLE_SHORT }),
      setMeta({ property: 'og:description',  content: GALLERY_DESCRIPTION }),
      setMeta({ property: 'og:url',          content: PAGE_URL }),
      setMeta({ property: 'og:image',        content: profileImg }),
      setMeta({ property: 'og:image:secure_url', content: profileImg }),
      setMeta({ property: 'og:image:alt',    content: `${PERSON_NAME} – AI Developer Bangladesh` }),
      setMeta({ property: 'og:image:width',  content: '1200' }),
      setMeta({ property: 'og:image:height', content: '630' }),
      setMeta({ property: 'og:image:type',   content: 'image/jpeg' }),
      setMeta({ property: 'og:site_name',    content: `${PERSON_NAME} – Portfolio` }),
      setMeta({ property: 'og:locale',       content: 'en_US' }),
      setMeta({ property: 'profile:username', content: 'rahimsaroar' }),

      // Twitter Card
      setMeta({ name: 'twitter:card',        content: 'summary_large_image' }),
      setMeta({ name: 'twitter:site',        content: '@rahimsaroar' }),
      setMeta({ name: 'twitter:creator',     content: '@rahimsaroar' }),
      setMeta({ name: 'twitter:title',       content: GALLERY_TITLE_SHORT }),
      setMeta({ name: 'twitter:description', content: GALLERY_DESCRIPTION }),
      setMeta({ name: 'twitter:image',       content: profileImg }),
      setMeta({ name: 'twitter:image:alt',   content: `${PERSON_NAME} Profile Photo` }),
    ];

    // ── Link tags ─────────────────────────────────────────────────────────────
    const canonical   = setLink({ rel: 'canonical', href: PAGE_URL });
    // Preload প্রথম ছবিটা — LCP সবচেয়ে fast হয়
    const preload     = setLink({ rel: 'preload', href: photos[0].src, as: 'image', fetchpriority: 'high' });
    // Alternate language — বাংলা ভার্সন থাকলে আলাদা link দাও
    const altLang     = setLink({ rel: 'alternate', hreflang: 'x-default', href: PAGE_URL });

    // ── JSON-LD (multiple schemas) ────────────────────────────────────────────
    const jsonLdGallery   = setJsonLd('ld-gallery',    buildGalleryJsonLd());
    const jsonLdWebPage   = setJsonLd('ld-webpage',    buildWebPageJsonLd());
    const jsonLdBreadcrumb = setJsonLd('ld-breadcrumb', buildBreadcrumbJsonLd());

    // ── Cleanup on unmount ────────────────────────────────────────────────────
    return () => {
      document.title = prevTitle;
      metas.forEach((el) => el?.remove());
      [canonical, preload, altLang, jsonLdGallery, jsonLdWebPage, jsonLdBreadcrumb]
        .forEach((el) => el?.remove());
    };
  }, []);

  return (
    <div
      className="min-h-screen transition-colors duration-300 bg-white dark:bg-black text-slate-900 dark:text-white"
      itemScope
      itemType="https://schema.org/ImageGallery"
    >
      {/* ── Hidden Microdata (crawlers পড়বে, ইউজার দেখবে না) ── */}
      <meta itemProp="name"        content={`${PERSON_NAME} Official Photo Gallery`} />
      <meta itemProp="description" content={GALLERY_DESCRIPTION} />
      <link itemProp="url"         href={PAGE_URL} />
      <link itemProp="image"       href={profileImg} />

      {/* ── SEO: Breadcrumb (screen reader + Google) ── */}
      <nav aria-label="Breadcrumb" className="sr-only">
        <ol itemScope itemType="https://schema.org/BreadcrumbList">
          <li itemScope itemType="https://schema.org/ListItem">
            <a itemProp="item" href={SITE_URL}><span itemProp="name">Home</span></a>
            <meta itemProp="position" content="1" />
          </li>
          <li itemScope itemType="https://schema.org/ListItem">
            <a itemProp="item" href={PAGE_URL}><span itemProp="name">Photo Gallery</span></a>
            <meta itemProp="position" content="2" />
          </li>
        </ol>
      </nav>

      {/* ── Sticky Header ── */}
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-neutral-800 bg-white/80 dark:bg-black/80 backdrop-blur-md">
        <div className="flex items-center justify-between max-w-5xl px-4 py-4 mx-auto">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm font-medium transition-colors text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white active:scale-95"
            aria-label="Back to Home"
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>

          {/* H1 — page এর সবচেয়ে important SEO element */}
          <h1 className="flex items-center gap-2 text-xl font-bold font-signature text-slate-900 dark:text-white">
            <Camera className="text-purple-500" size={22} aria-hidden="true" />
            <span>Life in <span className="text-purple-500">Frames</span></span>
          </h1>

          <div className="w-24" aria-hidden="true" />
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="max-w-5xl px-4 py-10 mx-auto">

        {/* H2 — secondary keyword targeting */}
        <h2 className="sr-only">
          {PERSON_NAME} ({PERSON_NAME_BN}) — Official Photo Gallery | AI Developer, Web Developer & Content Creator Bangladesh
        </h2>

        <p className="mb-2 text-center text-slate-500 dark:text-neutral-400">
          A glimpse into my world
        </p>
        <p className="mb-8 text-xs text-center text-slate-400 dark:text-neutral-600">
          Photos of {PERSON_NAME} — AI Developer & Content Creator, Bangladesh
        </p>

        {/* ── Gallery Grid ── */}
        <div
          className="grid grid-cols-2 gap-4 md:grid-cols-3"
          role="list"
          aria-label={`Photo gallery of ${PERSON_NAME}`}
        >
          {photos.map((photo, index) => {
            const isEager = index < EAGER_LOAD_COUNT;

            return (
              <figure
                key={photo.id}
                role="listitem"
                className="relative overflow-hidden transition-all shadow-md cursor-pointer group rounded-xl aspect-square hover:shadow-xl transform-gpu bg-slate-100 dark:bg-neutral-900"
                itemScope
                itemType="https://schema.org/ImageObject"
              >
                {/* ImageObject Microdata */}
                <link  itemProp="contentUrl" href={toAbsoluteUrl(photo.src)} />
                <link  itemProp="url"        href={toAbsoluteUrl(photo.src)} />
                <meta  itemProp="name"        content={photo.title} />
                <meta  itemProp="description" content={photo.alt} />
                <meta  itemProp="author"      content={PERSON_NAME} />
                <meta  itemProp="creator"     content={PERSON_NAME} />
                <meta  itemProp="copyrightHolder" content={PERSON_NAME} />
                {photo.category && <meta itemProp="genre" content={photo.category} />}

                <img
                  src={photo.src}
                  alt={photo.alt}
                  title={photo.title}
                  // Core Web Vitals: প্রথম ৪টা eager, বাকিগুলো lazy
                  loading={isEager ? 'eager' : 'lazy'}
                  decoding={isEager ? 'sync' : 'async'}
                  fetchPriority={isEager ? 'high' : 'low'}
                  itemProp="thumbnail"
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110 will-change-transform"
                  // width/height দিলে CLS score ভালো থাকে
                  width={600}
                  height={600}
                />

                {/* Caption overlay */}
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

        {/* ── Social Link ── */}
        <div className="pt-8 mt-10 text-center border-t border-slate-200 dark:border-neutral-800">
          <p className="mb-3 text-sm text-slate-500 dark:text-neutral-400">
            More photos of {PERSON_NAME}
          </p>
          <a
            href="https://www.facebook.com/rahimsaroar"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-500 hover:underline"
            aria-label={`${PERSON_NAME} on Facebook`}
          >
            <Instagram size={16} aria-hidden="true" />
            See more on Facebook
          </a>
        </div>

        {/* ── Hidden SEO paragraph (Google crawl করবে, user দেখবে না) ── */}
        <div className="sr-only" aria-hidden="true">
          <p>
            {PERSON_NAME} ({PERSON_NAME_BN}) is an AI enthusiast, web developer, content creator and public speaker
            from Bangladesh. This is the official photo gallery of {PERSON_NAME} featuring his life moments,
            workspace setups, travel photos, college life, school memories, and professional events.
            Rahim Saroar Mishu runs the Rhythm of Peace YouTube channel and is known for his work in
            AI, Python, and web development. He studied at Mangalbari Sirajia. This gallery showcases
            {photos.length} photos across categories including{' '}
            {[...new Set(photos.map((p) => p.category).filter(Boolean))].join(', ')}.
          </p>
        </div>
      </main>
    </div>
  );
};

export default GalleryPage;