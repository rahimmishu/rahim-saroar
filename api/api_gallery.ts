// ============================================================
// api/gallery.ts
// GET  /api/gallery        → public photo list from Redis
// POST /api/gallery        → admin: add photo metadata to Redis
// ============================================================

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ADMIN_EMAIL   = process.env.GALLERY_ADMIN_EMAIL!;   // your admin email
const FIREBASE_KEY  = process.env.FIREBASE_WEB_API_KEY!;  // Firebase web API key
const GALLERY_KEY   = 'gallery:photos';

// ── Verify Firebase ID Token via REST (no Admin SDK needed) ──
async function verifyAdmin(authHeader?: string): Promise<boolean> {
  if (!authHeader?.startsWith('Bearer ')) return false;
  const token = authHeader.slice(7);
  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: token }),
      }
    );
    if (!res.ok) return false;
    const data = await res.json();
    return data.users?.[0]?.email === ADMIN_EMAIL;
  } catch {
    return false;
  }
}

// ── Helper: get photos from Redis ────────────────────────────
async function getPhotos(): Promise<any[]> {
  const raw = await redis.get<any>(GALLERY_KEY);
  if (!raw) return [];
  return typeof raw === 'string' ? JSON.parse(raw) : raw;
}

// ── Handler ──────────────────────────────────────────────────
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // ── GET: public, no auth needed ──────────────────────────
  if (req.method === 'GET') {
    const photos = await getPhotos();
    return res.status(200).json({ photos });
  }

  // ── POST: admin only ─────────────────────────────────────
  if (req.method === 'POST') {
    const isAdmin = await verifyAdmin(req.headers.authorization);
    if (!isAdmin) return res.status(403).json({ error: 'Forbidden — admin only.' });

    const { src, caption, alt, publicId } = req.body ?? {};
    if (!src || !caption) {
      return res.status(400).json({ error: '`src` and `caption` are required.' });
    }

    const newPhoto = {
      id: `ph_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      src,
      caption: String(caption).trim(),
      alt: String(alt || caption).trim(),
      ...(publicId ? { publicId } : {}),
      createdAt: Date.now(),
    };

    const photos = await getPhotos();
    photos.unshift(newPhoto); // newest first
    await redis.set(GALLERY_KEY, JSON.stringify(photos));

    return res.status(201).json({ photo: newPhoto });
  }

  return res.status(405).json({ error: 'Method not allowed.' });
}
