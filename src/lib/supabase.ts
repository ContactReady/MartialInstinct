import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? 'https://zihkwsjvpucgvmaxevxw.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppaGt3c2p2cHVjZ3ZtYXhldnh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNDMxMzksImV4cCI6MjA5MTkxOTEzOX0.nvGc2jPq4VZ0RKK45yPAK42lleuaWmrXR2Vd4Uo9CXc';

export const supabase = createClient(supabaseUrl, supabaseKey);
