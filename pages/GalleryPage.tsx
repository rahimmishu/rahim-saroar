import React, { useEffect } from 'react';
import PhotoGallery from '../components/PhotoGallery';

// ── Site config ───────────────────────────────────────────────────────────────
const SITE_URL    = 'https://rahim-saroar.vercel.app';
const PAGE_URL    = `${SITE_URL}/gallery`;
const PERSON_NAME = 'Rahim Saroar Mishu';
const DESCRIPTION =
  'Official photo gallery of Rahim Saroar Mishu — AI enthusiast, web developer, content creator & public speaker from Bangladesh. Browse life moments, workspace setups, travel, college life and more.';

// ── JSON-LD Structured Data ───────────────────────────────────────────────────
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
});

// ── Component ─────────────────────────────────────────────────────────────────
const GalleryPage: React.FC = () => {

  // ── Dynamic <head> tags ───────────────────────────────────────────────────
  useEffect(() => {
    const prevTitle = document.title;
    document.title = `Photo Gallery – ${PERSON_NAME} | AI Developer Bangladesh`;

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
      let el = document.querySelector<HTMLLinkElement>(`link[rel="${attrs.rel}"]`);
      if (!el) { el = document.createElement('link'); el.rel = attrs.rel; document.head.appendChild(el); }
      Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
      return el;
    };

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

    const metas = [
      setMeta({ name: 'description',        content: DESCRIPTION }),
      setMeta({ name: 'keywords',            content: 'Rahim Saroar Mishu, Rahim Mishu, Rahim Saroar, রাহিম সরোয়ার মিশু, AI Developer Bangladesh, Web Developer Bangladesh, Content Creator Bangladesh, Photo Gallery, Portfolio' }),
      setMeta({ name: 'author',              content: PERSON_NAME }),
      setMeta({ name: 'robots',              content: 'index, follow, max-image-preview:large' }),
      setMeta({ name: 'googlebot',           content: 'index, follow, max-image-preview:large' }),
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
      setMeta({ name: 'twitter:card',        content: 'summary_large_image' }),
      setMeta({ name: 'twitter:title',       content: `Photo Gallery – ${PERSON_NAME}` }),
      setMeta({ name: 'twitter:description', content: DESCRIPTION }),
      setMeta({ name: 'twitter:image',       content: `${SITE_URL}/rahim-saroar-mishu-profile.jpg` }),
      setMeta({ name: 'twitter:image:alt',   content: `${PERSON_NAME} Profile Photo` }),
    ];

    const canonical = setLink({ rel: 'canonical', href: PAGE_URL });
    const jsonLd    = setJsonLd('gallery-jsonld', buildJsonLd());

    return () => {
      document.title = prevTitle;
      metas.forEach((el) => el?.remove());
      canonical?.remove();
      jsonLd?.remove();
    };
  }, []);

  return (
    <div
      itemScope
      itemType="https://schema.org/ImageGallery"
      className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-white"
    >
      {/* Hidden SEO microdata */}
      <span className="sr-only" itemProp="name">
        {PERSON_NAME} Official Photo Gallery – AI Developer, Web Developer & Content Creator Bangladesh
      </span>
      <span className="sr-only" itemProp="description">{DESCRIPTION}</span>
      <link itemProp="url" href={PAGE_URL} />

      {/* ✅ Dynamic PhotoGallery — Firebase auth + Cloudinary upload + Redis storage */}
      <PhotoGallery />

      {/* Hidden SEO keyword block */}
      <div className="sr-only" aria-hidden="true">
        <p>
          Rahim Saroar Mishu photo gallery. Rahim Mishu Bangladesh. রাহিম সরোয়ার মিশু ছবি।
          AI enthusiast Bangladesh. Web developer portfolio photos. Content creator Bangladesh.
          Rahim Saroar Mishu images. Rahim Saroar pictures. Young developer Bangladesh.
          Rhythm of Peace YouTube. Mangalbari Sirajia. Rahim Saroar Mishu workspace.
          Rahim Mishu coding setup. Rahim Saroar Mishu speaker. Tech event Bangladesh.
        </p>
      </div>
    </div>
  );
};

export default GalleryPage;