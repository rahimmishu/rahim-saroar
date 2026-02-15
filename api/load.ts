import { Redis } from '@upstash/redis';

// ✅ Edge Runtime — @vercel/node দরকার নেই, line 1 error নেই
export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== 'GET') {
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

    const { searchParams } = new URL(req.url);
    const key = searchParams.get('key');

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

    const raw = await redis.get(key);

    if (raw === null || raw === undefined) {
      return new Response(JSON.stringify({ value: null }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // @upstash/redis sometimes auto-parses JSON, so handle both cases
    const value = typeof raw === 'string' ? JSON.parse(raw) : raw;

    return new Response(JSON.stringify({ value }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    console.error('Redis load error:', error);
    return new Response(JSON.stringify({ value: null, error: 'Failed to load' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}