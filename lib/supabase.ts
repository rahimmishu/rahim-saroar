import { createClient } from '@supabase/supabase-js';

// Ei link and key amra Supabase dashboard theke anbo
const supabaseUrl = 'https://duerelakjyhqccsnijfd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1ZXJlbGFranlocWNjc25pamZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNTEyNDMsImV4cCI6MjA5MTcyNzI0M30.D1KyhcRaZ5leqrAFBNSERrzOnaXex7p2GGkjWqaK1KY';

export const supabase = createClient(supabaseUrl, supabaseKey);