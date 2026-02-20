// api/gallery.ts
// GET  /api/gallery  → public photo list
// POST /api/gallery  → admin add photo (via x-admin-secret header)

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ADMIN_SECRET = process.env.GALLERY_ADMIN_SECRET!;
const GALLERY_KEY  = 'gallery:photos';

function isAdmin(req: VercelRequest): boolean {
  const secret = req.headers['x-admin-secret'];
  return typeof secret === 'string' && secret === ADMIN_SECRET;
}

async function getPhotos(): Promise<any[]> {
  const raw = await redis.get<any>(GALLERY_KEY);
  if (!raw) return [];
  return typeof raw === 'string' ? JSON.parse(raw) : raw;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-secret');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // ── GET: public ──────────────────────────────────────────
  if (req.method === 'GET') {
    try {
      const photos = await getPhotos();
      return res.status(200).json({ photos });
    } catch (e: any) {
      return res.status(500).json({ error: e.message });
    }
  }

  // ── POST: admin only ─────────────────────────────────────
  if (req.method === 'POST') {
    if (!isAdmin(req)) {
      return res.status(403).json({ error: 'Forbidden — invalid admin secret.' });
    }

    const { src, caption, alt, publicId } = req.body ?? {};
    if (!src || !caption) {
      return res.status(400).json({ error: '`src` and `caption` are required.' });
    }

    const newPhoto = {
      id: `ph_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      src: String(src),
      caption: String(caption).trim(),
      alt: String(alt || caption).trim(),
      ...(publicId ? { publicId: String(publicId) } : {}),
      createdAt: Date.now(),
    };

    const photos = await getPhotos();
    photos.unshift(newPhoto);
    await redis.set(GALLERY_KEY, JSON.stringify(photos));

    return res.status(201).json({ photo: newPhoto });
  }

  return res.status(405).json({ error: 'Method not allowed.' });
}