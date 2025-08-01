// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://nwigmdhvjamvrguoelgh.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53aWdtZGh2amFtdnJndW9lbGdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NzEwMjgsImV4cCI6MjA2OTA0NzAyOH0.tyFgxezuAD8LxgQ95jk65Z3mJmqVwCSX4Nu9l4PvfBY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});