const { createClient } = require("@supabase/supabase-js");

// Minimal Supabase client. Expects SUPABASE_URL and SUPABASE_KEY in env.
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  // Fail fast with a clear message for developer.
  throw new Error("Missing SUPABASE_URL or SUPABASE_KEY environment variables");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

module.exports = supabase;
