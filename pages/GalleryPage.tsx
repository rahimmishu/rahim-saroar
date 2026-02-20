import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, ArrowLeft, Instagram } from 'lucide-react';

// ── Site config ───────────────────────────────────────────────────────────────
const SITE_URL   = 'https://rahim-saroar.vercel.app';
const PAGE_URL   = `${SITE_URL}/gallery`;
const PERSON_NAME = 'Rahim Saroar Mishu';
const DESCRIPTION =
  'Official photo gallery of Rahim Saroar Mishu — AI enthusiast, web developer, content creator & public speaker from Bangladesh. Browse life moments, workspace setups, travel, college life and more.';

// ── Photos Data ───────────────────────────────────────────────────────────────
// 🔑 প্রতিটা photo তে: src, caption, alt, title (Google Images এ দেখাবে)
const photos = [
  {
    id: 1,
    src: `${SITE_URL}/rahim-saroar-mishu-profile.jpg`,
    caption: 'Profile',
    alt: 'Rahim Saroar Mishu – AI Enthusiast & Developer from Bangladesh',
    title: 'Rahim Saroar Mishu Profile Photo',
  },
  {
    id: 2,
    src: `${SITE_URL}/rahim-saroar-mishu-content-creator.jpg`,
    caption: 'Content Creation',
    alt: 'Rahim Saroar Mishu – Video Content Creator, Rhythm of Peace YouTube Channel',
    title: 'Rahim Saroar Mishu Content Creator',
  },
  {
    id: 3,
    src: `${SITE_URL}/rahim-saroar-mishu-web-developer.jpg`,
    caption: 'College',
    alt: 'Rahim Saroar Mishu – Web Developer, College Student Life Bangladesh',
    title: 'Rahim Saroar Mishu College Life',
  },
  {
    id: 4,
    src: `${SITE_URL}/rahim-saroar-mishu-speaker.jpg`,
    caption: 'Public Speaking',
    alt: 'Rahim Saroar Mishu – Public Speaker at Tech Event Bangladesh',
    title: 'Rahim Saroar Mishu Public Speaker',
  },
  {
    id: 5,
    src: `${SITE_URL}/rahim-saroar-mishu-lifestyle.jpg`,
    caption: 'Lifestyle',
    alt: 'Rahim Saroar Mishu – Lifestyle Photography Portrait Bangladesh',
    title: 'Rahim Saroar Mishu Lifestyle',
  },
  {
    id: 6,
    src: `${SITE_URL}/rahim-saroar-mishu-coding.jpg`,
    caption: 'Workspace',
    alt: 'Rahim Saroar Mishu – Coding Workspace Setup, Python Developer Desk',
    title: 'Rahim Saroar Mishu Coding Setup',
  },
  {
    id: 7,
    src: `${SITE_URL}/rahim-saroar-mishu-sugarmill.jpg`,
    caption: 'Travel',
    alt: 'Rahim Saroar Mishu – Travel Vlog at Sugarmill Bangladesh',
    title: 'Rahim Saroar Mishu Travel Bangladesh',
  },
  {
    id: 8,
    src: `${SITE_URL}/rahim-saroar-mishu-school.jpg`,
    caption: 'School',
    alt: 'Rahim Saroar Mishu – School Life Memories, Mangalbari Sirajia',
    title: 'Rahim Saroar Mishu School Memories',
  },
  {
    id: 9,
    src: `${SITE_URL}/rahim-saroar-mishu-J.jpg`,
    caption: 'Workspace',
    alt: 'Rahim Saroar Mishu – Tech Setup and Desk Tour',
    title: 'Rahim Saroar Mishu Desk Tour',
  },
  {
    id: 10,
    src: `${SITE_URL}/rahim-saroar-mishu-fuad.jpg`,
    caption: 'Friend',
    alt: 'Rahim Saroar Mishu – Hangout with Friends',
    title: 'Rahim Saroar Mishu with Friends',
  },
  {
    id: 11,
    src: `${SITE_URL}/rahim-saroar-mishu-coffee.jpg`,
    caption: 'Workspace',
    alt: 'Rahim Saroar Mishu – Late Night Coding with Coffee',
    title: 'Rahim Saroar Mishu Coding Night',
  },
  {
    id: 12,
    src: `${SITE_URL}/rahim-saroar-mishu-c.jpg`,
    caption: 'Workspace',
    alt: 'Rahim Saroar Mishu – Modern Minimalist Desk Setup',
    title: 'Rahim Saroar Mishu Minimalist Setup',
  },
  {
    id: 13,
    src: `${SITE_URL}/rahim-saroar-mishu-biya.jpg`,
    caption: 'Travel',
    alt: 'Rahim Saroar Mishu – Wedding Guest, Traditional Panjabi Style',
    title: 'Rahim Saroar Mishu Wedding Style',
  },
];

// ── JSON-LD Structured Data ───────────────────────────────────────────────────
// Google এটা পড়ে Image Search এ দেখায়
const buildJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'ImageGallery',
  name: `${PERSON_NAME} – Official Photo Gallery`,
  description: DESCRIPTION,
  url: PAGE_URL,
  author: {
    '@type': 'Person',
    name: PERSON_NAME,
    url: SITE_URL,
    sameAs: [
      'https://www.facebook.com/rahimsaroar',
      'https://github.com/rahimmishu',
    ],
    jobTitle: 'AI Enthusiast, Web Developer & Content Creator',
    nationality: 'Bangladeshi',
  },
  image: photos.map((p) => ({
    '@type': 'ImageObject',
    contentUrl: p.src,
    name: p.title,
    description: p.alt,
    caption: p.caption,
    author: { '@type': 'Person', name: PERSON_NAME },
    copyrightHolder: { '@type': 'Person', name: PERSON_NAME },
    license: SITE_URL,
    acquireLicensePage: PAGE_URL,
  })),
});

// ── Component ─────────────────────────────────────────────────────────────────
const GalleryPage: React.FC = () => {
  const navigate = useNavigate();

  // ── Dynamic <head> tags (react-helmet ছাড়া) ────────────────────────────────
  useEffect(() => {
    // ── Title ──
    const prevTitle = document.title;
    document.title = `Photo Gallery – ${PERSON_NAME} | AI Developer Bangladesh`;

    // helper: meta tag upsert
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

    // helper: link tag upsert
    const setLink = (attrs: Record<string, string>) => {
      let el = document.querySelector<HTMLLinkElement>(`link[rel="${attrs.rel}"]`);
      if (!el) { el = document.createElement('link'); el.rel = attrs.rel; document.head.appendChild(el); }
      Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
      return el;
    };

    // helper: JSON-LD script upsert
    const setJsonLd = (id: string, data: object) => {
      let el = document.getElementById(id) as HTMLScriptElement | null;
      if (!el) {
        el = document.createElement('script');
        el.id = id;
        el.type = 'application/ld+json';
        document.head.appendChild(el);
      }
      el.textContent = JSON.stringify(data, null, 2);
      return el;
    };

    // ── Standard meta ──
    const metas = [
      setMeta({ name: 'description',        content: DESCRIPTION }),
      setMeta({ name: 'keywords',            content: 'Rahim Saroar Mishu, Rahim Mishu, Rahim Saroar, রাহিম সরোয়ার মিশু, AI Developer Bangladesh, Web Developer Bangladesh, Content Creator Bangladesh, Photo Gallery, Portfolio' }),
      setMeta({ name: 'author',              content: PERSON_NAME }),
      setMeta({ name: 'robots',              content: 'index, follow, max-image-preview:large' }),
      setMeta({ name: 'googlebot',           content: 'index, follow, max-image-preview:large' }),

      // ── Open Graph ──
      setMeta({ property: 'og:type',         content: 'website' }),
      setMeta({ property: 'og:title',        content: `Photo Gallery – ${PERSON_NAME}` }),
      setMeta({ property: 'og:description',  content: DESCRIPTION }),
      setMeta({ property: 'og:url',          content: PAGE_URL }),
      setMeta({ property: 'og:image',        content: `${SITE_URL}/rahim-saroar-mishu-profile.jpg` }),
      setMeta({ property: 'og:image:alt',    content: `${PERSON_NAME} Profile Photo` }),
      setMeta({ property: 'og:image:width',  content: '1200' }),
      setMeta({ property: 'og:image:height', content: '630' }),
      setMeta({ property: 'og:site_name',    content: `${PERSON_NAME} Portfolio` }),
      setMeta({ property: 'og:locale',       content: 'en_US' }),

      // ── Twitter Card ──
      setMeta({ name: 'twitter:card',        content: 'summary_large_image' }),
      setMeta({ name: 'twitter:title',       content: `Photo Gallery – ${PERSON_NAME}` }),
      setMeta({ name: 'twitter:description', content: DESCRIPTION }),
      setMeta({ name: 'twitter:image',       content: `${SITE_URL}/rahim-saroar-mishu-profile.jpg` }),
      setMeta({ name: 'twitter:image:alt',   content: `${PERSON_NAME} Profile Photo` }),
    ];

    // ── Canonical URL ──
    const canonical = setLink({ rel: 'canonical', href: PAGE_URL });

    // ── JSON-LD Structured Data ──
    const jsonLd = setJsonLd('gallery-jsonld', buildJsonLd());

    // ── Cleanup on unmount ──
    return () => {
      document.title = prevTitle;
      metas.forEach((el) => el?.remove());
      canonical?.remove();
      jsonLd?.remove();
    };
  }, []);

  return (
    // itemscope + itemtype = Google Microdata (Schema.org)
    <div
      className="min-h-screen transition-colors duration-300 bg-white dark:bg-black text-slate-900 dark:text-white"
      itemScope
      itemType="https://schema.org/ImageGallery"
    >
      {/* ── Hidden SEO text (screen reader + Google) ── */}
      <span className="sr-only" itemProp="name">
        {PERSON_NAME} Official Photo Gallery – AI Developer, Web Developer & Content Creator Bangladesh
      </span>
      <span className="sr-only" itemProp="description">{DESCRIPTION}</span>
      <link itemProp="url" href={PAGE_URL} />

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

          {/* ── Page Title (H1 — SEO এর জন্য গুরুত্বপূর্ণ) ── */}
          <h1 className="flex items-center gap-2 text-xl font-bold font-signature text-slate-900 dark:text-white">
            <Camera className="text-purple-500" size={22} aria-hidden="true" />
            <span>Life in <span className="text-purple-500">Frames</span></span>
          </h1>

          {/* spacer */}
          <div className="w-24" aria-hidden="true" />
        </div>
      </header>

      {/* ── Page Content ── */}
      <main className="max-w-5xl px-4 py-10 mx-auto">

        {/* Sub-heading */}
        <p className="mb-2 text-center text-slate-500 dark:text-neutral-400">
          A glimpse into my world
        </p>
        {/* SEO breadcrumb hint */}
        <p className="mb-8 text-xs text-center text-slate-400 dark:text-neutral-600">
          Photos of {PERSON_NAME} — AI Developer & Content Creator, Bangladesh
        </p>

        {/* ── Gallery Grid ── */}
        {/* itemScope ImageGallery এর ভেতরে প্রতিটা photo ImageObject হিসেবে mark */}
        <div
          className="grid grid-cols-2 gap-4 md:grid-cols-3"
          role="list"
          aria-label={`Photo gallery of ${PERSON_NAME}`}
        >
          {photos.map((photo) => (
            <figure
              key={photo.id}
              role="listitem"
              className="relative overflow-hidden transition-all shadow-md cursor-pointer group rounded-xl aspect-square hover:shadow-xl transform-gpu bg-slate-100 dark:bg-neutral-900"
              itemScope
              itemType="https://schema.org/ImageObject"
            >
              {/* ── Schema.org microdata ── */}
              <link itemProp="contentUrl" href={photo.src} />
              <meta itemProp="name"        content={photo.title} />
              <meta itemProp="description" content={photo.alt} />
              <meta itemProp="author"      content={PERSON_NAME} />

              <img
                src={photo.src}
                alt={photo.alt}
                title={photo.title}
                loading="lazy"
                decoding="async"
                itemProp="thumbnail"
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110 will-change-transform"
                // width/height দিলে CLS কমে, Google Lighthouse খুশি হয়
                width={600}
                height={600}
              />

              {/* Caption overlay — hover এ দেখায় */}
              <figcaption className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 bg-black/60 group-hover:opacity-100">
                <span
                  itemProp="caption"
                  className="px-4 py-1 text-sm font-medium text-white border rounded-full border-white/30 bg-black/30 backdrop-blur-sm"
                >
                  {photo.caption}
                </span>
              </figcaption>
            </figure>
          ))}
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

        {/* ── Hidden SEO keyword block (crawlers পড়বে, ইউজার দেখবে না) ── */}
        <div className="sr-only" aria-hidden="true">
          <p>
            Rahim Saroar Mishu photo gallery. Rahim Mishu Bangladesh. রাহিম সরোয়ার মিশু ছবি।
            AI enthusiast Bangladesh. Web developer portfolio photos. Content creator Bangladesh.
            Rahim Saroar Mishu images. Rahim Saroar pictures. Young developer Bangladesh.
            Rhythm of Peace YouTube. Mangalbari Sirajia. Rahim Saroar Mishu workspace.
            Rahim Mishu coding setup. Rahim Saroar Mishu speaker. Tech event Bangladesh.
          </p>
        </div>
      </main>
    </div>
  );
};

export default GalleryPage;