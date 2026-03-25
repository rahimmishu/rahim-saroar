import { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { uid, action, amount } = req.method === 'POST' ? JSON.parse(req.body) : req.query;
    
    if (!uid) return res.status(400).json({ error: 'User ID is required' });
    const BALANCE_KEY = `balance_${uid}`;

    // 1. Get Balance
    if (req.method === 'GET') {
      const balance = await redis.get(BALANCE_KEY);
      return res.status(200).json({ balance: parseFloat((balance as string) || '0') });
    }

    // 2. Modify Balance (Add or Deduct)
    if (req.method === 'POST') {
      const value = parseFloat(amount);
      if (isNaN(value) || value <= 0) return res.status(400).json({ error: 'Invalid amount' });

      if (action === 'add') {
        const newBalance = await redis.incrbyfloat(BALANCE_KEY, value);
        return res.status(200).json({ balance: newBalance });
      } 
      
      if (action === 'deduct') {
        const currentBalance = parseFloat((await redis.get(BALANCE_KEY) as string) || '0');
        if (currentBalance < value) return res.status(400).json({ error: 'Insufficient balance' });
        
        const newBalance = await redis.incrbyfloat(BALANCE_KEY, -value);
        return res.status(200).json({ balance: newBalance });
      }
    }
  } catch (error) {
    console.error('Balance API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}