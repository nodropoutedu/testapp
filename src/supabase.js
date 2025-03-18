import { createClient } from '@supabase/supabase-js';

// Replace with your Supabase URL and Anon Key from your Supabase Dashboard (Settings > API)
const supabaseUrl = 'https://phbdukavxjhceigjmnmx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoYmR1a2F2eGpoY2VpZ2ptbm14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyNDMxNTgsImV4cCI6MjA1NzgxOTE1OH0.4gpbR6Tj7m835OuQrey88I2yBUl3i55KA80zZEprW8Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);