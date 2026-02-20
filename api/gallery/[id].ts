// api/gallery/[id].ts
// DELETE /api/gallery/:id → admin remove photo

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

const ADMIN_SECRET = process.env.GALLERY_ADMIN_SECRET!;
const GALLERY_KEY  = 'gallery:photos';

function isAdmin(req: VercelRequest): boolean {
  const secret = req.headers['x-admin-secret'];
  return typeof secret === 'string' && secret === ADMIN_SECRET;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-secret');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  if (!isAdmin(req)) {
    return res.status(403).json({ error: 'Forbidden — invalid admin secret.' });
  }

  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing photo id.' });
  }

  const raw = await redis.get<any>(GALLERY_KEY);
  const photos: any[] = raw
    ? (typeof raw === 'string' ? JSON.parse(raw) : raw)
    : [];

  const target  = photos.find((p) => p.id === id);
  const updated = photos.filter((p) => p.id !== id);

  await redis.set(GALLERY_KEY, JSON.stringify(updated));

  if (target?.publicId) {
    await cloudinary.uploader.destroy(target.publicId).catch(() => {});
  }

  return res.status(200).json({ success: true, deleted: id });
}