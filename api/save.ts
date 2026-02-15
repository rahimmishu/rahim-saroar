import { Redis } from '@upstash/redis';

// ✅ Edge Runtime — @vercel/node দরকার নেই, line 1 error নেই
export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });

    const { key, value } = await req.json();

    if (!key || typeof key !== 'string') {
      return new Response(JSON.stringify({ error: 'Valid key required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Security — শুধু user_ prefix এর key allow করা হবে
    if (!key.startsWith('user_')) {
      return new Response(JSON.stringify({ error: 'Invalid key format' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // 30 দিন পর auto-delete — inactive user data clean হবে
    const THIRTY_DAYS = 60 * 60 * 24 * 30;
    await redis.set(key, JSON.stringify(value), { ex: THIRTY_DAYS });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    console.error('Redis save error:', error);
    return new Response(JSON.stringify({ error: 'Failed to save' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}