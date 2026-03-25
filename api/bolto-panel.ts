import { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

// Upstash ডাটাবেসের সাথে কানেক্ট করা হচ্ছে (আপনার ক্যাশবক্স)
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS পলিসি ঠিক রাখা (যাতে শুধু আপনার ওয়েবসাইট থেকেই রিকোয়েস্ট আসে)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const CACHE_KEY = 'bolto_panel_services';

    // ১. প্রথমে চেক করব Upstash-এ ডেটা সেভ করা আছে কি না
    const cachedServices = await redis.get(CACHE_KEY);
    if (cachedServices) {
      // যদি ক্যাশ থাকে, সরাসরি ওয়েবসাইটকে ডেটা দিয়ে দেব (খুবই ফাস্ট হবে)
      return res.status(200).json({ source: 'upstash-cache', data: cachedServices });
    }

    // ২. যদি Upstash-এ ডেটা না থাকে, তখন SAFollow (রান্নাঘর) থেকে ডেটা আনব
    const apiUrl = 'https://www.safollow.com/api/v2';
    const apiKey = process.env.SAFOLLOW_API_KEY!;

    // SMM প্যানেলগুলো Form Data আকারে রিকোয়েস্ট নিতে পছন্দ করে
    const formData = new URLSearchParams();
    formData.append('key', apiKey);
    formData.append('action', 'services');

    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    // ৩. নতুন ডেটা Upstash-এ সেভ করে রাখব (পরবর্তী ২ ঘণ্টার জন্য = 7200 সেকেন্ড)
    // এতে বারবার SAFollow-কে রিকোয়েস্ট পাঠাতে হবে না
    await redis.set(CACHE_KEY, JSON.stringify(data), { ex: 7200 });

    // ৪. আপনার ওয়েবসাইটে ফাইনাল ডেটা পাঠিয়ে দেব
    return res.status(200).json({ source: 'safollow-api', data: data });

  } catch (error) {
    console.error('Bolto Panel API Error:', error);
    return res.status(500).json({ error: 'সার্ভারে কোনো সমস্যা হয়েছে, একটু পর আবার চেষ্টা করুন।' });
  }
}