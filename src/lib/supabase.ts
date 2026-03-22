import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ujrbmxwobrpkpsyktpqi.supabase.co';
const supabaseKey = 'sb_publishable_aNUcwK5iLhiT350jgvZNvw_ArVPUlq8';

export const supabase = createClient(supabaseUrl, supabaseKey);
