// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 📸 GALLERY CONFIG — নতুন ছবি যোগ করতে শুধু এই ফাইলটা এডিট করো
//
// নতুন ছবি যোগ করার নিয়ম:
//   1. public ফোল্ডারে ছবিটা রাখো
//   2. নিচে একটা নতুন object যোগ করো (last entry-র পরে)
//   3. id: আগেরটার চেয়ে ১ বেশি দাও
//   4. বাকি ফাইলে আর কিছু ছুঁতে হবে না ✅
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ── Site-wide constants ───────────────────────────────────────────────────────
export const SITE_URL       = 'https://rahim-saroar.vercel.app';
export const PAGE_URL       = `${SITE_URL}/gallery`;
export const PERSON_NAME    = 'Rahim Saroar Mishu';
export const PERSON_NAME_BN = 'রাহিম সরোয়ার মিশু';

export const GALLERY_TITLE       = `Photo Gallery – ${PERSON_NAME} | AI Developer Bangladesh`;
export const GALLERY_TITLE_SHORT = `Photo Gallery – ${PERSON_NAME}`;

export const GALLERY_DESCRIPTION =
  'Official photo gallery of Rahim Saroar Mishu — AI enthusiast, web developer, content creator & public speaker from Bangladesh. Browse life moments, workspace setups, travel, college life and more.';

// Google Search Console এ এই keywords দিয়ে rank করাতে চাও
export const GALLERY_KEYWORDS =
  'Rahim Saroar Mishu, Rahim Mishu, Rahim Saroar, রাহিম সরোয়ার মিশু, ' +
  'AI Developer Bangladesh, Web Developer Bangladesh, Content Creator Bangladesh, ' +
  'Rahim Saroar Mishu photo gallery, Rahim Saroar Mishu images, ' +
  'Rahim Saroar Mishu pictures, Rahim Mishu Bangladesh, Young Developer Bangladesh, ' +
  'Rhythm of Peace YouTube, Mangalbari Sirajia, Tech Speaker Bangladesh, Portfolio';

// ── Photo type ────────────────────────────────────────────────────────────────
export interface Photo {
  id: number;
  /** public ফোল্ডারের ফাইল নাম — যেমন: '/rahim-saroar-mishu-profile.jpg' */
  src: string;
  /** Hover এ যা দেখাবে */
  caption: string;
  /** Screen reader + Google Image Search alt text — descriptive রাখো */
  alt: string;
  /** Google Images title ও schema name — 5–10 word রাখো */
  title: string;
  /** Schema.org category — Google Image Search filter এ কাজে লাগে */
  category?: string;
}

// ── Photo list ────────────────────────────────────────────────────────────────
// ✏️  এখানে শুধু যোগ করো / মুছো — বাকি সব automatically আপডেট হবে
export const photos: Photo[] = [
  {
    id: 1,
    src: '/rahim-saroar-mishu-profile.jpg',
    caption: 'Profile',
    alt: 'Rahim Saroar Mishu AI enthusiast and web developer from Bangladesh, official profile portrait',
    title: 'Rahim Saroar Mishu – Official Profile Photo',
    category: 'Portrait',
  },
  {
    id: 2,
    src: '/rahim-saroar-mishu-content-creator.jpg',
    caption: 'Content Creation',
    alt: 'Rahim Saroar Mishu creating video content for Rhythm of Peace YouTube channel, Bangladesh content creator',
    title: 'Rahim Saroar Mishu – YouTube Content Creator Bangladesh',
    category: 'Content Creation',
  },
  {
    id: 3,
    src: '/rahim-saroar-mishu-web-developer.jpg',
    caption: 'College',
    alt: 'Rahim Saroar Mishu at college campus, web developer and student life in Bangladesh',
    title: 'Rahim Saroar Mishu – College Student Life Bangladesh',
    category: 'Education',
  },
  {
    id: 4,
    src: '/rahim-saroar-mishu-speaker.jpg',
    caption: 'Public Speaking',
    alt: 'Rahim Saroar Mishu speaking at a tech event in Bangladesh, public speaker and AI enthusiast on stage',
    title: 'Rahim Saroar Mishu – Public Speaker at Tech Event Bangladesh',
    category: 'Public Speaking',
  },
  {
    id: 5,
    src: '/rahim-saroar-mishu-lifestyle.jpg',
    caption: 'Lifestyle',
    alt: 'Rahim Saroar Mishu lifestyle portrait, young AI developer and content creator from Bangladesh',
    title: 'Rahim Saroar Mishu – Lifestyle Portrait Bangladesh',
    category: 'Lifestyle',
  },
  {
    id: 6,
    src: '/rahim-saroar-mishu-coding.jpg',
    caption: 'Workspace',
    alt: 'Rahim Saroar Mishu coding at his developer workspace with Python, programmer desk setup Bangladesh',
    title: 'Rahim Saroar Mishu – Developer Coding Workspace Setup',
    category: 'Workspace',
  },
  {
    id: 7,
    src: '/rahim-saroar-mishu-sugarmill.jpg',
    caption: 'Travel',
    alt: 'Rahim Saroar Mishu at Sugarmill Bangladesh during travel vlog shoot, travel and lifestyle photography',
    title: 'Rahim Saroar Mishu – Travel at Sugarmill Bangladesh',
    category: 'Travel',
  },
  {
    id: 8,
    src: '/rahim-saroar-mishu-school.jpg',
    caption: 'School',
    alt: 'Rahim Saroar Mishu school life memories at Mangalbari Sirajia, early education and childhood Bangladesh',
    title: 'Rahim Saroar Mishu – School Memories Mangalbari Sirajia',
    category: 'Education',
  },
  {
    id: 9,
    src: '/rahim-saroar-mishu-J.jpg',
    caption: 'Workspace',
    alt: 'Rahim Saroar Mishu tech desk setup and workspace tour, developer environment and gear Bangladesh',
    title: 'Rahim Saroar Mishu – Tech Desk Setup Tour',
    category: 'Workspace',
  },
  {
    id: 10,
    src: '/rahim-saroar-mishu-fuad.jpg',
    caption: 'Friend',
    alt: 'Rahim Saroar Mishu hanging out with friends, social life of a young developer in Bangladesh',
    title: 'Rahim Saroar Mishu – Hangout with Friends Bangladesh',
    category: 'Social',
  },
  {
    id: 11,
    src: '/rahim-saroar-mishu-coffee.jpg',
    caption: 'Workspace',
    alt: 'Rahim Saroar Mishu coding late night with coffee cup, developer productivity lifestyle Bangladesh',
    title: 'Rahim Saroar Mishu – Late Night Coding with Coffee',
    category: 'Workspace',
  },
  {
    id: 12,
    src: '/rahim-saroar-mishu-c.jpg',
    caption: 'Workspace',
    alt: 'Rahim Saroar Mishu modern minimalist desk setup, clean and aesthetic developer workspace Bangladesh',
    title: 'Rahim Saroar Mishu – Minimalist Developer Desk Setup',
    category: 'Workspace',
  },
  {
    id: 13,
    src: '/rahim-saroar-mishu-biya.jpg',
    caption: 'Event',
    alt: 'Rahim Saroar Mishu at a wedding event wearing traditional Panjabi attire, cultural fashion Bangladesh',
    title: 'Rahim Saroar Mishu – Traditional Panjabi Style at Wedding',
    category: 'Event',
  },
   {
    id: 14,
    src: '/mishu.png',
    caption: 'Exam',
    alt: 'Rahim Saroar Mishu at a college exam, student life and academic activities Bangladesh',
    title: 'Rahim Saroar Mishu – College Exam Participation',
    category: 'Exam',
  },
  {
    id: 15,
    src: '/rahim-saroar-mishu.png',
    caption: 'Exam',
    alt: 'Rahim Saroar Mishu at a college exam, student life and academic activities Bangladesh',
    title: 'Rahim Saroar Mishu – College Exam Participation',
    category: 'Exam',
  },
  {
    id: 16,
    src: '/rahim-saroar.jpg',
    caption: 'Exam',
    alt: 'Rahim Saroar Mishu at a college exam, student life and academic activities Bangladesh',
    title: 'Rahim Saroar Mishu – College Exam Participation',
    category: 'Exam',
  },
  {
    id: 17,
    src: '/rahim-saroar.png',
    caption: 'Event',
    alt: 'Rahim Saroar Mishu at Eid event wearing traditional Panjabi attire, cultural fashion Bangladesh',
    title: 'Rahim Saroar Mishu – Traditional Panjabi Style at Eid',
    category: 'Event',
  },
    // ── 👇 নতুন ছবি এখানে যোগ করো ──────────────────────────────────────────
];

// ── Helper: relative → absolute URL ──────────────────────────────────────────
// SEO meta tags এ always full URL দরকার, Google partial URL পড়তে পারে না
export const toAbsoluteUrl = (src: string): string =>
  src.startsWith('http') ? src : `${SITE_URL}${src}`;

// ── প্রথম কয়টা ছবি eager load হবে (Core Web Vitals LCP) ─────────────────────
export const EAGER_LOAD_COUNT = 4;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// JSON-LD Structured Data builders
// Google এগুলো parse করে — rich results ও Google Images এ সাহায্য করে
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** ImageGallery + embedded ImageObject list */
export const buildGalleryJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'ImageGallery',
  '@id': `${PAGE_URL}#gallery`,
  name: `${PERSON_NAME} – Official Photo Gallery`,
  description: GALLERY_DESCRIPTION,
  url: PAGE_URL,
  inLanguage: 'en-US',
  author: {
    '@type': 'Person',
    '@id': `${SITE_URL}#person`,
    name: PERSON_NAME,
    alternateName: [PERSON_NAME_BN, 'Rahim Mishu', 'Rahim Saroar'],
    url: SITE_URL,
    image: toAbsoluteUrl('/rahim-saroar-mishu-profile.jpg'),
    sameAs: [
      'https://www.facebook.com/rahimsaroar',
      'https://github.com/rahimmishu',
    ],
    jobTitle: 'AI Enthusiast, Web Developer & Content Creator',
    address: { '@type': 'PostalAddress', addressCountry: 'BD' },
  },
  image: photos.map((p) => ({
    '@type': 'ImageObject',
    '@id': `${toAbsoluteUrl(p.src)}#image`,
    contentUrl: toAbsoluteUrl(p.src),
    url: toAbsoluteUrl(p.src),
    name: p.title,
    description: p.alt,
    caption: p.caption,
    encodingFormat: 'image/jpeg',
    representativeOfPage: p.id === 1, // প্রথম ছবি page-এর representative
    about: { '@type': 'Person', name: PERSON_NAME },
    author: { '@type': 'Person', name: PERSON_NAME },
    creator: { '@type': 'Person', name: PERSON_NAME },
    copyrightHolder: { '@type': 'Person', name: PERSON_NAME },
    copyrightYear: new Date().getFullYear(),
    license: SITE_URL,
    acquireLicensePage: PAGE_URL,
    ...(p.category && { genre: p.category }),
  })),
});

/** BreadcrumbList — Google Search এ path দেখায়: Home › Gallery */
export const buildBreadcrumbJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Photo Gallery', item: PAGE_URL },
  ],
});

/** ProfilePage schema — Google এই page কে personal profile হিসেবে চেনে */
export const buildWebPageJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  '@id': `${PAGE_URL}#webpage`,
  url: PAGE_URL,
  name: GALLERY_TITLE,
  description: GALLERY_DESCRIPTION,
  inLanguage: 'en-US',
  isPartOf: {
    '@type': 'WebSite',
    '@id': `${SITE_URL}#website`,
    name: `${PERSON_NAME} – Portfolio`,
    url: SITE_URL,
  },
  about: {
    '@type': 'Person',
    '@id': `${SITE_URL}#person`,
    name: PERSON_NAME,
  },
  mainEntity: { '@id': `${PAGE_URL}#gallery` },
  breadcrumb: buildBreadcrumbJsonLd(),
  dateModified: new Date().toISOString(),
});