// ============================================================
// api/gallery/[id].ts
// DELETE /api/gallery/:id  → admin: remove from Redis + Cloudinary
// ============================================================

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';
import { v2 as cloudinary } from 'cloudinary';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

cloudinary.config({
  cloud_name : process.env.CLOUDINARY_CLOUD_NAME!,
  api_key    : process.env.CLOUDINARY_API_KEY!,
  api_secret : process.env.CLOUDINARY_API_SECRET!,
  secure     : true,
});

const ADMIN_EMAIL  = process.env.GALLERY_ADMIN_EMAIL!;
const FIREBASE_KEY = process.env.FIREBASE_WEB_API_KEY!;
const GALLERY_KEY  = 'gallery:photos';

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const isAdmin = await verifyAdmin(req.headers.authorization);
  if (!isAdmin) return res.status(403).json({ error: 'Forbidden — admin only.' });

  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing photo id.' });
  }

  // Read → filter → write back
  const raw = await redis.get<any>(GALLERY_KEY);
  const photos: any[] = raw
    ? typeof raw === 'string' ? JSON.parse(raw) : raw
    : [];

  const target  = photos.find((p) => p.id === id);
  const updated = photos.filter((p) => p.id !== id);

  await redis.set(GALLERY_KEY, JSON.stringify(updated));

  // Remove from Cloudinary (best-effort, won't fail the request)
  if (target?.publicId) {
    await cloudinary.uploader.destroy(target.publicId).catch(() => {});
  }

  return res.status(200).json({ success: true, deleted: id });
}
