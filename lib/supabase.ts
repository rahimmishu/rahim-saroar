import { createClient } from '@supabase/supabase-js';

// .env ফাইল থেকে সিকিউরভাবে URL এবং Key টেনে আনা হচ্ছে
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);